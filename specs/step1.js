export const spec1 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "title": {
    "text": "Most Popular Genres",
    "fontSize": 18,
    "fontWeight": "bold"
  },
  "description": "Bar chart showing average popularity by genre",
  "data": {
    "url": "/spotify_songs.csv",
    "format": {"type": "csv"}
  },
  "mark": {
    "type": "bar",
    "tooltip": true,
    "cornerRadiusEnd": 4
  },
  "encoding": {
    "x": {
      "field": "genre",
      "type": "nominal",
      "sort": "-y",
      "title": "Music Genre",
      "axis": {"labelAngle": -45, "labelFontSize": 11}
    },
    "y": {
      "field": "popularity",
      "type": "quantitative",
      "title": "Average Popularity",
      "axis": {"grid": true}
    },
    "color": {
      "field": "genre",
      "type": "nominal",
      "legend": null,
      "scale": {"scheme": "greens"}
    },
    "tooltip": [
      {"field": "genre", "type": "nominal", "title": "Genre"},
      {"field": "popularity", "type": "quantitative", "title": "Popularity", "format": ".1f"}
    ]
  },
  "config": {
    "view": {"stroke": null},
    "background": "transparent"
  }
};