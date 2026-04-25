export const spec2 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "title": {
    "text": "Single-Genre vs Multi-Genre Popularity",
    "fontSize": 18,
    "fontWeight": "bold"
  },
  "description": "Comparing average popularity between single-genre and multi-genre tracks",
  "data": {
    "url": "/spotify_songs.csv",
    "format": {"type": "csv"}
  },
  "transform": [
    {
      "calculate": "if(datum.track_genres && split(datum.track_genres, ';').length > 1, 'Multi-Genre', 'Single-Genre')",
      "as": "genre_type"
    }
  ],
  "mark": {
    "type": "bar",
    "tooltip": true,
    "cornerRadiusEnd": 4
  },
  "encoding": {
    "x": {
      "field": "genre_type",
      "type": "nominal",
      "title": "Track Type",
      "axis": {"labelFontSize": 13}
    },
    "y": {
      "field": "popularity",
      "type": "quantitative",
      "title": "Average Popularity",
      "aggregate": "mean",
      "axis": {"grid": true}
    },
    "color": {
      "field": "genre_type",
      "type": "nominal",
      "scale": {"range": ["#74c69d", "#1DB954"]},
      "legend": {"title": "Type"}
    },
    "label": {
      "field": "popularity",
      "type": "quantitative",
      "aggregate": "mean",
      "format": ".1f"
    },
    "tooltip": [
      {"field": "genre_type", "title": "Type"},
      {"field": "popularity", "aggregate": "mean", "title": "Avg Popularity", "format": ".1f"}
    ]
  },
  "config": {
    "view": {"stroke": null},
    "background": "transparent"
  }
};