export const spec4 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "title": {
    "text": "Genre Diversification & Popularity Convergence Over Time",
    "fontSize": 18,
    "fontWeight": "bold"
  },
  "description": "Line chart showing number of genres and popularity gap by decade",
  "data": {
    "url": "/spotify_songs.csv",
    "format": {"type": "csv"}
  },
  "transform": [
    {
      "calculate": "floor(datum.year / 10) * 10",
      "as": "decade"
    }
  ],
  "layer": [
    {
      "mark": {"type": "line", "strokeWidth": 3, "color": "#2d6a4f"},
      "encoding": {
        "x": {"field": "decade", "type": "ordinal", "title": "Decade"},
        "y": {
          "field": "genre_count",
          "type": "quantitative",
          "title": "Number of Genres",
          "aggregate": "distinct",
          "axis": {"titleColor": "#2d6a4f", "grid": true}
        }
      }
    },
    {
      "mark": {"type": "line", "strokeWidth": 3, "strokeDash": [6, 4], "color": "#d00000"},
      "encoding": {
        "x": {"field": "decade", "type": "ordinal"},
        "y": {
          "field": "popularity_gap",
          "type": "quantitative",
          "title": "Popularity Gap (Max - Min)",
          "aggregate": "ci0",
          "axis": {"titleColor": "#d00000", "format": ".1f"}
        }
      }
    }
  ],
  "resolve": {"scale": {"y": "independent"}},
  "config": {
    "view": {"stroke": null},
    "background": "transparent",
    "axisLeft": {"titleFontSize": 12, "labelColor": "#2d6a4f"},
    "axisRight": {"titleFontSize": 12, "labelColor": "#d00000"}
  }
};