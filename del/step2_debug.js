// specs/step2.js — DEBUG VERSION
// Minimal test: just bars from CSV, no curves, no toggle

export const spec2 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 700, "height": 400,
  "data": {"url": "spotify_songs.csv", "format": {"type": "csv"}},
  "transform": [
    {"calculate": "isValid(datum.track_album_release_date) ? (test(/^[0-9]{4}$/, datum.track_album_release_date) ? toNumber(datum.track_album_release_date) : year(toDate(datum.track_album_release_date))) : null", "as": "release_year"},
    {"filter": "datum.release_year >= 1970"},
    {"aggregate": [{"op": "distinct", "field": "playlist_genre", "as": "genre_count"}], "groupby": ["track_id", "track_popularity"]},
    {"calculate": "datum.genre_count > 1 ? 'multi' : 'single'", "as": "g"},
    {"bin": {"step": 10}, "field": "track_popularity", "as": "b"},
    {"aggregate": [{"op": "count", "as": "c"}], "groupby": ["g", "b"]},
    {"calculate": "datum.b", "as": "x"}
  ],
  "mark": "bar",
  "encoding": {
    "x": {"field": "b", "type": "quantitative", "bin": {"binned": true}, "title": "Popularity"},
    "x2": {"field": "b_end"},
    "y": {"field": "c", "type": "quantitative", "title": "Count"},
    "color": {"field": "g", "type": "nominal"}
  }
};
