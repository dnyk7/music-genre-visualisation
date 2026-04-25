// specs/step2.js
// Step 2: Track Popularity — Single-Genre vs Multi-Genre (Overlapping Histograms)

export const spec2 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": {
    "text": "Track Popularity: Single-Genre vs Multi-Genre",
    "subtitle": "Density comparison at track level",
    "fontSize": 18,
    "fontWeight": "bold",
    "subtitleFontSize": 13,
    "subtitleColor": "#666",
    "anchor": "start",
    "color": "#333"
  },
  "width": 700,
  "height": 400,
  "data": {
    "url": "spotify_songs.csv",
    "format": {"type": "csv"}
  },
  "transform": [
    {
      "calculate": "isValid(datum.track_album_release_date) ? (test(/^[0-9]{4}$/, datum.track_album_release_date) ? toNumber(datum.track_album_release_date) : year(toDate(datum.track_album_release_date))) : null",
      "as": "release_year"
    },
    {"filter": "datum.release_year >= 1970"},
    {"filter": "isValid(datum.track_popularity)"},
    {
      "aggregate": [{"op": "distinct", "field": "playlist_genre", "as": "genre_count"}],
      "groupby": ["track_id", "track_popularity", "track_name", "track_artist"]
    },
    {
      "calculate": "datum.genre_count > 1 ? 'multi-genre (>1)' : 'single-genre (=1)'",
      "as": "genre_group"
    }
  ],
  "layer": [
    {
      "mark": {
        "type": "bar",
        "opacity": 0.45,
        "color": "#1f77b4"
      },
      "transform": [
        {"filter": "datum.genre_group == 'single-genre (=1)'"}
      ],
      "encoding": {
        "x": {
          "field": "track_popularity",
          "type": "quantitative",
          "bin": {"step": 5, "extent": [0, 100]},
          "title": "Track Popularity",
          "axis": {"grid": false, "labelFontSize": 12, "titleFontSize": 14}
        },
        "y": {
          "aggregate": "count",
          "type": "quantitative",
          "stack": null,
          "title": "Density",
          "axis": {"grid": true, "gridColor": "#eee", "labelFontSize": 12, "titleFontSize": 14}
        }
      }
    },
    {
      "mark": {
        "type": "bar",
        "opacity": 0.55,
        "color": "#ff7f0e"
      },
      "transform": [
        {"filter": "datum.genre_group == 'multi-genre (>1)'"}
      ],
      "encoding": {
        "x": {
          "field": "track_popularity",
          "type": "quantitative",
          "bin": {"step": 5, "extent": [0, 100]},
          "title": "Track Popularity"
        },
        "y": {
          "aggregate": "count",
          "type": "quantitative",
          "stack": null,
          "title": "Density"
        }
      }
    }
  ],
  "config": {
    "view": {"stroke": "transparent"},
    "font": "Inter, system-ui, sans-serif"
  }
};
