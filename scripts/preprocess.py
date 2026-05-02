"""
preprocess.py
─────────────
Cleans the Spotify dataset and exports compact JSON files for the website.
Run this script locally or via GitHub Actions before rendering the Quarto site.

Outputs (all in data/processed/):
  genre_profiles.json   → median audio features per genre (radar + bar chart)
  top_songs.json        → top 3 songs per genre, for preview cards
  genre_yearly.json     → yearly median per genre, for time trend chart (future)
"""

import json
import pathlib
import pandas as pd
import numpy as np

# ── Paths ──────────────────────────────────────────────────────────────────────
ROOT       = pathlib.Path(__file__).parent.parent
RAW_PATH   = ROOT / "data" / "raw" / "spotify_songs.csv"
OUT_DIR    = ROOT / "data" / "processed"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# If the raw CSV is not local, fall back to the GitHub mirror
GITHUB_URL = (
    "https://raw.githubusercontent.com/rfordatascience/tidytuesday"
    "/refs/heads/main/data/2020/2020-01-21/spotify_songs.csv"
)

# ── Feature config ─────────────────────────────────────────────────────────────
# Only the features shown on the website — ordered for the radar chart
RADAR_FEATURES = [
    "danceability",
    "energy",
    "valence",
    "acousticness",
    "tempo_norm",   # tempo normalised to [0,1] so all axes share the same scale
    "speechiness",
]

DISPLAY_NAMES = {
    "danceability": "Danceability",
    "energy":       "Energy",
    "valence":      "Valence",
    "acousticness": "Acousticness",
    "tempo_norm":   "Tempo",
    "speechiness":  "Speechiness",
}

GENRE_COLORS = {
    "edm":   "#1DB954",
    "latin": "#F72585",
    "pop":   "#4CC9F0",
    "r&b":   "#7B2D8B",
    "rap":   "#F77F00",
    "rock":  "#D62828",
}

# ── Load ───────────────────────────────────────────────────────────────────────
print("Loading data...")
try:
    df = pd.read_csv(RAW_PATH)
    print(f"  Loaded from local file: {RAW_PATH}")
except FileNotFoundError:
    print(f"  Local file not found. Downloading from GitHub...")
    df = pd.read_csv(GITHUB_URL)
    print(f"  Downloaded {len(df):,} rows.")

# ── Clean ──────────────────────────────────────────────────────────────────────
print("Cleaning...")

# 1. Drop rows missing audio metadata
df = df.dropna()
print(f"  After dropna: {len(df):,} rows")

# 2. Parse release year (handles both 'YYYY' and 'YYYY-MM-DD')
s = df["track_album_release_date"].astype(str).str.strip()
year_only = s.str.fullmatch(r"\d{4}")
df["release_year"] = pd.Series(pd.NA, index=df.index, dtype="Int64")
df.loc[year_only, "release_year"] = s[year_only].astype(int)
df.loc[~year_only, "release_year"] = pd.to_datetime(
    s[~year_only], dayfirst=False, errors="coerce"
).dt.year
print(f"  Unparseable dates: {df['release_year'].isna().sum()}")

# 3. Drop pre-1970 tracks (sparse, skews trends)
df = df[df["release_year"] >= 1970].copy()
print(f"  After year >= 1970 filter: {len(df):,} rows")

# 4. Duration in minutes
df["duration_min"] = df["duration_ms"] / 60_000

# 5. Normalise tempo to [0, 1] so it sits on the same radar axis scale
t_min, t_max = df["tempo"].min(), df["tempo"].max()
df["tempo_norm"] = (df["tempo"] - t_min) / (t_max - t_min)

# 6. Tag multi-genre tracks
track_genre_count = df.groupby("track_id")["playlist_genre"].nunique()
df["genre_count"] = df["track_id"].map(track_genre_count)
df["genre_group"] = np.where(df["genre_count"] > 1, "multi-genre", "single-genre")

# ── Two versions of the dataset ────────────────────────────────────────────────
# analysis_df  → all rows, multi-genre tracks included (use for genre-level EDA)
# single_df    → multi-genre tracks removed (use for radar / bar charts on website)
#                so each song only contributes to one genre

analysis_df = df.copy()

single_df = df[df["genre_group"] == "single-genre"].copy()
print(f"  analysis_df (all):    {len(analysis_df):,} rows")
print(f"  single_df (no multi): {len(single_df):,} rows")

# Track-level view: one row per unique song
track_level = (
    single_df.sort_values("track_id")
    .drop_duplicates(subset="track_id")
    .copy()
)
print(f"  track_level (unique): {len(track_level):,} rows")

# ── Export 1: genre_profiles.json ─────────────────────────────────────────────
# Median audio features per genre — powers the radar and bar charts
print("\nExporting genre_profiles.json ...")

genre_medians = (
    single_df
    .groupby("playlist_genre")[RADAR_FEATURES]
    .median()
    .round(4)
)

genre_profiles = []
for genre in genre_medians.index:
    row = genre_medians.loc[genre]
    genre_profiles.append({
        "genre":  genre,
        "color":  GENRE_COLORS.get(genre, "#999999"),
        "features": {
            DISPLAY_NAMES[feat]: float(row[feat])
            for feat in RADAR_FEATURES
        },
    })

out_path = OUT_DIR / "genre_profiles.json"
with open(out_path, "w") as f:
    json.dump(genre_profiles, f, indent=2)
print(f"  Written: {out_path}")
print(f"  Genres: {[p['genre'] for p in genre_profiles]}")

# ── Export 2: top_songs.json ───────────────────────────────────────────────────
# Top 3 most popular songs per genre — powers the song preview cards
print("\nExporting top_songs.json ...")

top_songs_list = []
for genre in single_df["playlist_genre"].unique():
    genre_tracks = (
        single_df[single_df["playlist_genre"] == genre]
        .drop_duplicates(subset="track_id")
        .sort_values("track_popularity", ascending=False)
        .head(3)
    )
    for _, row in genre_tracks.iterrows():
        top_songs_list.append({
            "genre":        genre,
            "track_name":   row["track_name"],
            "track_artist": row["track_artist"],
            "popularity":   int(row["track_popularity"]),
            "danceability": round(float(row["danceability"]), 3),
            "energy":       round(float(row["energy"]), 3),
            "valence":      round(float(row["valence"]), 3),
            "tempo":        round(float(row["tempo"]), 1),
            "speechiness":  round(float(row["speechiness"]), 3),
            "acousticness": round(float(row["acousticness"]), 3),
        })

out_path = OUT_DIR / "top_songs.json"
with open(out_path, "w") as f:
    json.dump(top_songs_list, f, indent=2)
print(f"  Written: {out_path}")
print(f"  Total song entries: {len(top_songs_list)}")

# ── Export 3: genre_yearly.json ───────────────────────────────────────────────
# Yearly median per genre for 4 features — powers the time trend line chart
print("\nExporting genre_yearly.json ...")

TREND_FEATURES = ["danceability", "energy", "valence", "speechiness"]

yearly_rows = []
for genre in single_df["playlist_genre"].unique():
    sub = single_df[single_df["playlist_genre"] == genre]
    yearly = (
        sub.groupby("release_year")[TREND_FEATURES]
        .median()
        .round(4)
        .reset_index()
    )
    for _, row in yearly.iterrows():
        entry = {"genre": genre, "year": int(row["release_year"])}
        for feat in TREND_FEATURES:
            entry[feat] = float(row[feat])
        yearly_rows.append(entry)

out_path = OUT_DIR / "genre_yearly.json"
with open(out_path, "w") as f:
    json.dump(yearly_rows, f, indent=2)
print(f"  Written: {out_path}")

# ── Summary ────────────────────────────────────────────────────────────────────
print("\n" + "=" * 55)
print("  PREPROCESSING COMPLETE")
print("=" * 55)
print(f"  analysis_df (all tracks, multi-genre kept)  : {len(analysis_df):,}")
print(f"  single_df   (multi-genre tracks removed)    : {len(single_df):,}")
print(f"  track_level (one row per unique song)       : {len(track_level):,}")
print(f"  Output files in: {OUT_DIR}")
print("=" * 55)
