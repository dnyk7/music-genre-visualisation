export const spec3 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "title": {
    "text": "Audio Features by Genre",
    "fontSize": 18,
    "fontWeight": "bold"
  },
  "description": "Comparing valence, energy, danceability across top genres",
  "data": {
    "url": "/spotify_songs.csv",
    "format": {"type": "csv"}
  },
  "transform": [
    {
      "fold": ["valence", "energy", "danceability", "acousticness", "instrumentalness"],
      "as": ["feature", "value"]
    }
  ],
  "mark": {
    "type": "bar",
    "tooltip": true,
    "opacity": 0.85
  },
  "encoding": {
    "x": {
      "field": "feature",
      "type": "nominal",
      "title": "Audio Feature",
      "axis": {"labelAngle": -30}
    },
    "y": {
      "field": "value",
      "type": "quantitative",
      "title": "Average Value",
      "aggregate": "mean",
      "scale": {"domain": [0, 1]},
      "axis": {"grid": true}
    },
    "color": {
      "field": "genre",
      "type": "nominal",
      "title": "Genre",
      "scale": {"scheme": "viridis"},
      "legend": {"columns": 2}
    },
    "tooltip": [
      {"field": "feature", "title": "Feature"},
      {"field": "genre", "title": "Genre"},
      {"field": "value", "aggregate": "mean", "title": "Value", "format": ".2f"}
    ]
  },
  "config": {
    "view": {"stroke": null},
    "background": "transparent",
    "legend": {"titleFontSize": 12, "labelFontSize": 10}
  }
};