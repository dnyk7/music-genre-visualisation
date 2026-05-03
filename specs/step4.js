// specs/step4.js
// Step 4: Average popularity timeline by genre (year-bin step chart)

export const spec4 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": {
    "text": "Average Genre Popularity Over Time: Diversification vs. Convergence",
    "subtitle": "Grouped by 5-year bins (1970+)",
    "fontSize": 18,
    "fontWeight": "bold",
    "subtitleFontSize": 13,
    "subtitleColor": "#777",
    "anchor": "start"
  },
  "width": 650,
  "height": 460,
  "padding": {"top": 0, "left": 0, "right": 0, "bottom": 0},
  "autosize": {"type": "fit", "contains": "padding"},
  "layer": [
    {
      "data": {"values": [{"start": 1970, "end": 1980.5}]},
      "mark": {"type": "rect", "color": "#FDECEC", "tooltip": false},
      "encoding": {
        "x": {
          "field": "start",
          "type": "quantitative",
          "scale": {"domain": [1970, 2020], "zero": false, "nice": false}
        },
        "x2": {"field": "end", "type": "quantitative"},
        "y": {"datum": 0},
        "y2": {"datum": 80}
      }
    },
    {
      "data": {"values": [{"start": 1980.5, "end": 1996.5}]},
      "mark": {"type": "rect", "color": "#FFFBEA", "tooltip": false},
      "encoding": {
        "x": {
          "field": "start",
          "type": "quantitative",
          "scale": {"domain": [1970, 2020], "zero": false, "nice": false}
        },
        "x2": {"field": "end", "type": "quantitative"},
        "y": {"datum": 0},
        "y2": {"datum": 80}
      }
    },
    {
      "data": {"values": [{"start": 1996.5, "end": 2012.5}]},
      "mark": {"type": "rect", "color": "#F5EEFF", "tooltip": false},
      "encoding": {
        "x": {
          "field": "start",
          "type": "quantitative",
          "scale": {"domain": [1970, 2020], "zero": false, "nice": false}
        },
        "x2": {"field": "end", "type": "quantitative"},
        "y": {"datum": 0},
        "y2": {"datum": 80}
      }
    },
    {
      "data": {"values": [{"start": 2012.5, "end": 2020}]},
      "mark": {"type": "rect", "color": "#FFF3E8", "tooltip": false},
      "encoding": {
        "x": {
          "field": "start",
          "type": "quantitative",
          "scale": {"domain": [1970, 2020], "zero": false, "nice": false}
        },
        "x2": {"field": "end", "type": "quantitative"},
        "y": {"datum": 0},
        "y2": {"datum": 80}
      }
    },
    {
      "params": [
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
        "url": "DataCleaning/cleaned_spotify.csv",
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
          "calculate": "floor(datum.release_year / 5) * 5",
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
          "title": "Year",
          "scale": {"domain": [1970, 2020], "zero": false, "nice": false},
          "axis": {
            "format": "d",
            "labelAngle": 0,
            "values": [1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020],
            "labelExpr": "datum.value % 10 === 0 ? datum.label : ''",
            "tickSize": 4
          }
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
          {"field": "year_bin", "type": "quantitative", "title": "Year Bin Starts", "format": "d"},
          {"field": "avg_track_popularity", "type": "quantitative", "title": "Avg Popularity", "format": ".2f"}
        ]
      }
    },
    {
      "data": {
        "values": [
          {"mid": 1975, "label": "Generation X"},
          {"mid": 1988.5, "label": "Millennials/Generation Y"},
          {"mid": 2004.5, "label": "Zoomers/Generation Z"},
          {"mid": 2016.25, "label": "Generation Alpha"}
        ]
      },
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "top",
        "fontSize": 11,
        "fontWeight": "600",
        "color": "#666",
        "dy": 2,
        "tooltip": false
      },
      "encoding": {
        "x": {
          "field": "mid",
          "type": "quantitative",
          "scale": {"domain": [1970, 2020], "zero": false, "nice": false}
        },
        "y": {"datum": 79},
        "text": {"field": "label", "type": "nominal"}
      }
    }
  ],
  "config": {
    "view": {"stroke": "transparent"},
    "font": "Inter, system-ui, sans-serif",
    "axis": {"gridColor": "#eee", "labelFontSize": 12, "titleFontSize": 14},
    "legend": {"titleFontSize": 12, "labelFontSize": 11}
  }
};
