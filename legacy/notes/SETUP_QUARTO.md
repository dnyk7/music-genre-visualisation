# Genre Decoded

A scrollytelling data visualisation about Spotify genre audio fingerprints.

**Live site:** `https://<your-username>.github.io/my-genre-story/`

## Structure

genre-story/
├── .github/workflows/          # For auto-deploying to GitHub Pages
│   └── publish.yml
├── data/
│   ├── raw/                    # Original dataset
│   └── processed/              # Cleaned data (multigenre removed, scaled)
├── scripts/
│   └── preprocess.py           # Python script for cleaning/feature scaling
├── components/
│   └── radar_logic.ojs         # (Optional) Observable JS for cross-linking
├── _quarto.yml                 # Global configuration
├── index.qmd                   # The main scrolly-telling document
├── styles.css                  # Custom styling for the sticky panels
├── pixi.toml                   # For reproducible environment management
└── README.md

---

## Local development

### 1. Install Quarto

Download from [quarto.org](https://quarto.org/docs/get-started/) and install.

### 2. Install Python dependencies

```bash
pip install pandas numpy
```

### 3. Add the raw dataset

Download `spotify_songs.csv` from the TidyTuesday dataset and place it at:

```txt
data/raw/spotify_songs.csv
```

Or the preprocessing script will download it automatically from GitHub.

### 4. Run preprocessing

```bash
python3 scripts/preprocess.py
```

This creates three JSON files in `data/processed/`:

- `genre_profiles.json` — median audio features per genre (radar + bar chart)
- `top_songs.json` — top 3 songs per genre (preview cards)
- `genre_yearly.json` — yearly median per genre (time trends)

### 5. Preview the site

```bash
quarto preview
```

---

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages → Source** and set to **GitHub Actions**
3. Push to `main` — the workflow in `.github/workflows/publish.yml` runs automatically
4. The site will be live at `https://<username>.github.io/<repo-name>/`

> **Note:** The workflow runs `preprocess.py` automatically on every push,
> so you don't need to commit the processed JSON files.
> If you prefer to commit them (faster builds), that works too.

---

## Data sources

- Spotify audio features via [TidyTuesday 2020-01-21](https://github.com/rfordatascience/tidytuesday/tree/main/data/2020/2020-01-21)

---

## Directory structure

```txt
my-genre-story/
├── .github/workflows/publish.yml   # Auto-deploy to GitHub Pages
├── data/
│   ├── raw/spotify_songs.csv       # Original dataset (gitignore if large)
│   └── processed/                  # Generated JSON — safe to gitignore or commit
├── scripts/preprocess.py           # All cleaning + JSON export
├── _quarto.yml                     # Quarto project config
├── index.qmd                       # Main scrollytelling document
├── styles.css                      # All layout + styling
└── README.md
```

---

## Tech stack

| Tool | Role |
|---|---|
| [Quarto](https://quarto.org) | Renders `.qmd` to static HTML |
| [Observable JS (OJS)](https://observablehq.com/@observablehq/observable-javascript) | Reactive charts that share state |
| [Scrollama](https://github.com/russellsamora/scrollama) | Scroll progress + step activation |
| Python + pandas | Data preprocessing → JSON |
| GitHub Actions | CI/CD: preprocess → render → deploy |
