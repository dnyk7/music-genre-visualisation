// specs/step4.js
// Step 4: Average popularity timeline by genre (year-bin step chart)

export const spec4 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": {
    "text": "Average Track Popularity Over Time by Genre",
    "subtitle": "Grouped by adjustable 1-5 year bins (1970+)",
    "fontSize": 18,
    "fontWeight": "bold",
    "subtitleFontSize": 13,
    "subtitleColor": "#777",
    "anchor": "start"
  },
  "width": 700,
  "height": 400,
  "padding": {"top": 24, "left": 72, "right": 24, "bottom": 56},
  "autosize": {"type": "fit", "contains": "padding"},
  "params": [
    {
      "name": "time_bin_years",
      "value": 5,
      "bind": {
        "input": "range",
        "name": "Time bin (years)",
        "min": 1,
        "max": 5,
        "step": 1
      }
    },
    {
      "name": "genre_select",
      "select": {
        "type": "point",
        "fields": ["playlist_genre"],
        "on": "click",
        "clear": "dblclick"
      },
      "bind": "legend"
    }
  ],
  "data": {
    "url": "spotify_songs.csv",
    "format": {"type": "csv"}
  },
  "transform": [
    {
      "calculate": "isValid(datum.track_album_release_date) ? (test(/^[0-9]{4}$/, datum.track_album_release_date) ? toNumber(datum.track_album_release_date) : year(toDate(datum.track_album_release_date))) : null",
      "as": "release_year"
    },
    {"filter": "isValid(datum.release_year) && datum.release_year >= 1970"},
    {"filter": "isValid(datum.track_popularity)"},
    {"filter": "isValid(datum.playlist_genre) && datum.playlist_genre != ''"},
    {
      "calculate": "floor(datum.release_year / time_bin_years) * time_bin_years",
      "as": "year_bin"
    },
    {
      "aggregate": [
        {"op": "mean", "field": "track_popularity", "as": "avg_track_popularity"}
      ],
      "groupby": ["year_bin", "playlist_genre"]
    }
  ],
  "mark": {
    "type": "line",
    "interpolate": "step-after",
    "point": {"filled": true, "size": 45},
    "strokeWidth": 2.5
  },
  "encoding": {
    "x": {
      "field": "year_bin",
      "type": "quantitative",
      "title": "Year Interval Start",
      "axis": {"format": "d", "labelAngle": 0}
    },
    "y": {
      "field": "avg_track_popularity",
      "type": "quantitative",
      "title": "Average Track Popularity",
      "scale": {"domain": [0, 80]}
    },
    "color": {
      "field": "playlist_genre",
      "type": "nominal",
      "title": "Genre",
      "scale": {
        "domain": ["edm", "latin", "pop", "r&b", "rap", "rock"],
        "range": ["#1DB954", "#F72585", "#4CC9F0", "#7B2D8B", "#F77F00", "#D62828"]
      }
    },
    "opacity": {
      "condition": {"param": "genre_select", "value": 1},
      "value": 0.12
    },
    "tooltip": [
      {"field": "playlist_genre", "type": "nominal", "title": "Genre"},
      {"field": "year_bin", "type": "quantitative", "title": "Year Bin", "format": "d"},
      {"field": "avg_track_popularity", "type": "quantitative", "title": "Avg Popularity", "format": ".2f"}
    ]
  },
  "config": {
    "view": {"stroke": "transparent"},
    "font": "Inter, system-ui, sans-serif",
    "axis": {"gridColor": "#eee", "labelFontSize": 12, "titleFontSize": 14},
    "legend": {"titleFontSize": 12, "labelFontSize": 11}
  }
};
