export const spec1 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Lightweight fake Spotify panel",
  "width": 720,
  "height": 280,
  "background": "#121212",
  "title": {
    "text": "Now Playing Preview",
    "color": "#ffffff",
    "fontSize": 14,
    "fontWeight": "normal",
    "anchor": "start"
  },
  "layer": [
    {
      "mark": {"type": "rect", "color": "#181818", "cornerRadius": 12, "stroke": "#282828", "strokeWidth": 1},
      "encoding": {"x": {"value": 10}, "x2": {"value": 710}, "y": {"value": 20}, "y2": {"value": 260}}
    },
    {
      "data": {
        "values": [
          {"song": "End Of Beginning", "artist": "Djo", "pop": 98, "y": 70, "c": "#1DB954"},
          {"song": "Die With A Smile", "artist": "Lady Gaga, Bruno Mars", "pop": 97, "y": 115, "c": "#FF7F0E"},
          {"song": "Birds Of A Feather", "artist": "Billie Eilish", "pop": 96, "y": 160, "c": "#9B59B6"}
        ]
      },
      "mark": {"type": "rect", "color": "#1f1f1f", "cornerRadius": 6},
      "encoding": {
        "x": {"value": 30},
        "x2": {"value": 690},
        "y": {"field": "y", "type": "quantitative"},
        "y2": {"field": "y", "type": "quantitative", "offset": 34}
      }
    },
    {
      "data": {
        "values": [
          {"song": "End Of Beginning", "artist": "Djo", "pop": 98, "y": 92, "c": "#1DB954"},
          {"song": "Die With A Smile", "artist": "Lady Gaga, Bruno Mars", "pop": 97, "y": 137, "c": "#FF7F0E"},
          {"song": "Birds Of A Feather", "artist": "Billie Eilish", "pop": 96, "y": 182, "c": "#9B59B6"}
        ]
      },
      "mark": {"type": "text", "align": "left", "fontSize": 12, "fontWeight": "bold", "color": "#ffffff"},
      "encoding": {
        "x": {"value": 48},
        "y": {"field": "y", "type": "quantitative"},
        "text": {"field": "song", "type": "nominal"}
      }
    },
    {
      "data": {
        "values": [
          {"artist": "Djo", "y": 92},
          {"artist": "Lady Gaga, Bruno Mars", "y": 137},
          {"artist": "Billie Eilish", "y": 182}
        ]
      },
      "mark": {"type": "text", "align": "left", "dx": 210, "fontSize": 11, "color": "#b3b3b3"},
      "encoding": {
        "x": {"value": 48},
        "y": {"field": "y", "type": "quantitative"},
        "text": {"field": "artist", "type": "nominal"}
      }
    },
    {
      "data": {
        "values": [
          {"label": "Pop 98", "y": 92, "c": "#1DB954"},
          {"label": "Pop 97", "y": 137, "c": "#FF7F0E"},
          {"label": "Pop 96", "y": 182, "c": "#9B59B6"}
        ]
      },
      "mark": {"type": "text", "align": "right", "fontSize": 11, "fontWeight": "bold"},
      "encoding": {
        "x": {"value": 675},
        "y": {"field": "y", "type": "quantitative"},
        "text": {"field": "label", "type": "nominal"},
        "color": {"field": "c", "type": "nominal", "scale": null}
      }
    },
    {
      "mark": {"type": "rect", "color": "#1e1e1e", "cornerRadius": 18, "stroke": "#282828", "strokeWidth": 1},
      "encoding": {"x": {"value": 30}, "x2": {"value": 690}, "y": {"value": 215}, "y2": {"value": 250}}
    },
    {
      "mark": {"type": "rect", "color": "#3e3e3e", "cornerRadius": 4},
      "encoding": {"x": {"value": 100}, "x2": {"value": 500}, "y": {"value": 230}, "y2": {"value": 234}}
    },
    {
      "mark": {"type": "rect", "color": "#1DB954", "cornerRadius": 4},
      "encoding": {"x": {"value": 100}, "x2": {"value": 300}, "y": {"value": 230}, "y2": {"value": 234}}
    }
  ],
  "config": {"view": {"stroke": null}}
};
