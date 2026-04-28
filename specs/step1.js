// specs/step1.js
// Step 1: Distribution of Track Popularity (Histogram)

const COLOR_ALL_PRIMARY = "#1F77B4";   // primary color for bars

export const spec1 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": {
    "text": "Distribution of Track Popularity",
    "fontSize": 18,
    "fontWeight": "bold",
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
    {"filter": "isValid(datum.track_popularity)"}
  ],
  "mark": {
    "type": "bar",
    "color": COLOR_ALL_PRIMARY,
    "opacity": 0.9
  },
  "encoding": {
    "x": {
      "field": "track_popularity",
      "type": "quantitative",
      "bin": {"maxbins": 50},
      "title": "Track Popularity",
      "axis": {"grid": false, "labelFontSize": 12, "titleFontSize": 14}
    },
    "y": {
      "aggregate": "count",
      "type": "quantitative",
      "title": "Number of Tracks",
      "axis": {"grid": true, "gridColor": "#eee", "labelFontSize": 12, "titleFontSize": 14}
    },
    "tooltip": [
      {"field": "track_popularity", "type": "quantitative", "bin": true, "title": "Popularity Range"},
      {"aggregate": "count", "type": "quantitative", "title": "Count"}
    ]
  },
  "config": {
    "view": {"stroke": "transparent"},
    "font": "Inter, system-ui, sans-serif"
  }
};
