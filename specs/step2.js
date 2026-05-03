// specs/step2.js
// Step 2: Track Popularity — Three states for sticky scrollytelling

// ═══════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════

const COLOR_SINGLE_PRIMARY    = "#5A9FD4";
const COLOR_SINGLE_BG         = "rgba(216, 236, 250, 0.52)";
const COLOR_SINGLE_CURVE      = "#4e8ab9";

const COLOR_MULTI_PRIMARY     = "#ff7f0e";
const COLOR_MULTI_BG          = "rgba(255, 232, 212, 0.82)";
const COLOR_MULTI_CURVE       = "#e07619";

const COLOR_BAR_STROKE        = "#000000";
const COLOR_GRID              = "#f0f0f0";
const COLOR_SUBTITLE          = "#888";

const COLOR_TEST_1 = "#1F77B4";
const COLOR_TEST_2 = "#5A9FD4";
const COLOR_TEST_3 = "#FF7F0E";

// ═══════════════════════════════════════════════════════════════
// STYLE VARIABLES
// ═══════════════════════════════════════════════════════════════

const BAR_STROKE_WIDTH = 1.5;
const BAR_STROKE_COLOR = COLOR_BAR_STROKE;
const CHART1_BAR_OPACITY = 0.7;
const CHART2_BAR_OPACITY = 0.7;

const CHART_PADDING_LEFT   = 80;
const CHART_PADDING_RIGHT  = 40;
const CHART_PADDING_TOP    = 70;
const CHART_PADDING_BOTTOM = 50;

const LABEL_BG_CORNER_RADIUS  = 4;
const LABEL_BG_SINGLE         = COLOR_SINGLE_BG;
const LABEL_BG_MULTI          = COLOR_MULTI_BG;
const LABEL_BG_BORDER_SINGLE  = COLOR_SINGLE_PRIMARY;
const LABEL_BG_BORDER_MULTI   = COLOR_MULTI_PRIMARY;
const LABEL_BG_BORDER_WIDTH   = 1.5;
const LABEL_FONT_SIZE         = 13;
const LABEL_FONT_WEIGHT       = "bold";

// ═══════════════════════════════════════════════════════════════
// OFFSET & SCALE CONST
// ═══════════════════════════════════════════════════════════════

const COMMON_Y_MAX_DENSITY = 15;
const COMMON_Y_MAX_COUNT = 5000;

const SINGLE_LABEL_X_DENSITY = 27;
const SINGLE_LABEL_Y_DENSITY = 9;
const SINGLE_LABEL_X_COUNT = 27;
const SINGLE_LABEL_Y_COUNT = 2936;
const SINGLE_LABEL_X = SINGLE_LABEL_X_DENSITY;

const MULTI_LABEL_X_DENSITY = 53.5;
const MULTI_LABEL_Y_DENSITY = 10;
const MULTI_LABEL_X_COUNT = 53.5;
const MULTI_LABEL_Y_COUNT = 1000;
const MULTI_LABEL_X = MULTI_LABEL_X_DENSITY;

// ═══════════════════════════════════════════════════════════════
// HARDCODED DATA
// ═══════════════════════════════════════════════════════════════

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function countGenres(playlistGenreRaw) {
  if (!playlistGenreRaw) return 0;
  const parts = String(playlistGenreRaw)
    .split(/[|;,]/)
    .map(s => s.trim())
    .filter(Boolean);
  return new Set(parts).size;
}

async function loadHistData() {
  const bins = Array.from({ length: 20 }, (_, i) => ({
    bin_start: i * 5,
    bin_end: (i + 1) * 5,
    single_count: 0,
    multi_count: 0
  }));

  const res = await fetch("./DataCleaning/cleaned_spotify.csv");
  if (!res.ok) throw new Error(`Failed to load CSV: ${res.status}`);
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return bins;

  const headers = parseCsvLine(lines[0]);
  const popularityIdx = headers.indexOf("track_popularity");
  const genreIdx = headers.indexOf("playlist_genre");
  const trackIdIdx = headers.indexOf("track_id");
  if (popularityIdx === -1 || genreIdx === -1 || trackIdIdx === -1) return bins;

  // Equivalent to:
  // track_genre_count = analysis_df.groupby('track_id')['playlist_genre'].nunique()
  const trackGenreSetMap = new Map();
  const parsedRows = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    const trackId = (row[trackIdIdx] ?? "").trim();
    const genre = (row[genreIdx] ?? "").trim();
    parsedRows.push(row);
    if (!trackId || !genre) continue;
    if (!trackGenreSetMap.has(trackId)) trackGenreSetMap.set(trackId, new Set());
    trackGenreSetMap.get(trackId).add(genre);
  }

  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    const pop = Number(row[popularityIdx]);
    if (!Number.isFinite(pop)) continue;
    if (pop < 0 || pop > 100) continue;

    const binIdx = Math.min(19, Math.floor(pop / 5));
    const trackId = (row[trackIdIdx] ?? "").trim();
    const gCount = trackGenreSetMap.has(trackId) ? trackGenreSetMap.get(trackId).size : 0;
    if (gCount > 1) bins[binIdx].multi_count += 1;
    else bins[binIdx].single_count += 1;
  }
  return bins;
}

const histData = await loadHistData();

const singleTotal = histData.reduce((s, d) => s + d.single_count, 0);
const multiTotal  = histData.reduce((s, d) => s + d.multi_count, 0);
const totalAll    = singleTotal + multiTotal;

// ── State 1: Overall (merged counts) ──
// Using the EXACT same structure as the working uploaded spec
const overallData = [];
histData.forEach(d => {
  overallData.push({
    bin_start: d.bin_start,
    bin_end: d.bin_end,
    y_density: (d.single_count + d.multi_count) / totalAll * 100,
    y_count: d.single_count + d.multi_count
  });
});


// ── State 2: Stacked (each group as proportion of total) ──
const histStacked = [];
histData.forEach(d => {
  const singleDensity = d.single_count / totalAll * 100;
  const multiDensity = d.multi_count / totalAll * 100;
  const singleCount = d.single_count;
  const multiCount = d.multi_count;

  histStacked.push({
    bin_start: d.bin_start,
    bin_end: d.bin_end,
    group: 'multi-genre',
    y_density: multiDensity,
    y_count: multiCount,
    y0_density: 0,
    y1_density: multiDensity,
    y0_count: 0,
    y1_count: multiCount
  });
  histStacked.push({
    bin_start: d.bin_start,
    bin_end: d.bin_end,
    group: 'single-genre',
    y_density: singleDensity,
    y_count: singleCount,
    y0_density: multiDensity,
    y1_density: multiDensity + singleDensity,
    y0_count: multiCount,
    y1_count: multiCount + singleCount
  });
});

// ── State 3: Unstacked (each group as proportion of its own total) ──
const histLong = [];
histData.forEach(d => {
  histLong.push({
    bin_start: d.bin_start,
    bin_end: d.bin_end,
    group: 'single-genre',
    y_density: singleTotal > 0 ? (d.single_count / singleTotal * 100) : 0,
    y_count: d.single_count
  });
  histLong.push({
    bin_start: d.bin_start,
    bin_end: d.bin_end,
    group: 'multi-genre',
    y_density: multiTotal > 0 ? (d.multi_count / multiTotal * 100) : 0,
    y_count: d.multi_count
  });
});

const singleValues = [];
const multiValues = [];
histData.forEach(d => {
  const mid = (d.bin_start + d.bin_end) / 2;
  for (let i = 0; i < d.single_count; i++) singleValues.push(mid);
  for (let i = 0; i < d.multi_count; i++) multiValues.push(mid);
});

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function std(arr, m) {
  if (!arr.length) return 0;
  const variance = arr.reduce((s, v) => s + Math.pow(v - m, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

const SINGLE_COUNT = singleValues.length;
const MULTI_COUNT = multiValues.length;
const SINGLE_MEAN = mean(singleValues);
const MULTI_MEAN = mean(multiValues);
const SINGLE_STD = std(singleValues, SINGLE_MEAN);
const MULTI_STD = std(multiValues, MULTI_MEAN);

const singlePeak = {
  x_density: SINGLE_LABEL_X_DENSITY,
  x_count: SINGLE_LABEL_X_COUNT,
  y_density: SINGLE_LABEL_Y_DENSITY,
  y_count: SINGLE_LABEL_Y_COUNT,
  label: 'mean of single-genre',
  mean: SINGLE_MEAN,
  std: SINGLE_STD,
  count: SINGLE_COUNT
};

const multiPeak = {
  x_density: MULTI_LABEL_X_DENSITY,
  x_count: MULTI_LABEL_X_COUNT,
  y_density: MULTI_LABEL_Y_DENSITY,
  y_count: MULTI_LABEL_Y_COUNT,
  label: 'mean of multi-genre',
  mean: MULTI_MEAN,
  std: MULTI_STD,
  count: MULTI_COUNT
};

// ═══════════════════════════════════════════════════════════════
// SPEC 2A — OVERALL (single color, merged data)
// ═══════════════════════════════════════════════════════════════
// Based on the user's uploaded working spec

export const spec2a = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 720,
  "height": 460,
  "padding": {"top": 40, "left": 0, "right": 40, "bottom": 0},
  "autosize": {"type": "fit", "contains": "padding"},
  "params": [
    {
      "name": "mode",
      "value": "density",
      "bind": {
        "input": "radio",
        "options": ["density", "count"],
        "labels": ["Density (%)", "Raw Count"],
        "name": "View Mode"
      }
    }
  ],
  "layer": [
    {
      "data": {"values": overallData},
      "transform": [
        {
          "calculate": "mode == 'density' ? datum.y_density : datum.y_count",
          "as": "y_val"
        },
        {
          "calculate": "0",
          "as": "y0_val"
        }
      ],
      "mark": {
        "type": "rect",
        "color": COLOR_TEST_1,
        "opacity": CHART1_BAR_OPACITY,
        "strokeWidth": BAR_STROKE_WIDTH,
        "stroke": BAR_STROKE_COLOR
      },
      "encoding": {
        "x": {
          "field": "bin_start",
          "type": "quantitative",
          "scale": {"domain": [0, 100]},
          "axis": {"tickMinStep": 5, "grid": false},
          "title": "Track Popularity"
        },
        "x2": {"field": "bin_end", "type": "quantitative"},
        "y": {
          "field": "y_val",
          "type": "quantitative",
          "scale": {"domainMin": 0, "domainMax": {"signal": `mode == 'density' ? ${COMMON_Y_MAX_DENSITY} : ${COMMON_Y_MAX_COUNT}`}, "nice": false},
          "axis": {
            "minExtent": 40,
            "maxExtent": 40,
            "values": {"signal": `mode == 'density' ? [2.5, 5, 7.5, 10, 12.5, 15] : null`},
            "labelExpr": "mode === 'count' ? format(datum.value, '~s') : format(datum.value, '.1f')"
          },
          "title": {
            "signal": "mode == 'density' ? 'Percentage' : 'Number of Tracks'"
          }
        },
        "y2": {"field": "y0_val"},
        "tooltip": [
          {"field": "y_count",   "type": "quantitative", "title": "Count", "format": ","},
          {"field": "y_density", "type": "quantitative", "title": "Percentage", "format": ".2f"}
        ]
      }
    }
  ],
  "config": {
    "view": {"stroke": "transparent"},
    "font": "Inter, system-ui, sans-serif",
    "axis": {"gridColor": COLOR_GRID, "labelFontSize": 12, "titleFontSize": 14},
    "bar": {"cornerRadiusEnd": 2, "continuousBandSize": 24}
  }
};

// ═══════════════════════════════════════════════════════════════
// SPEC 2B — STACKED (two colors)
// ═══════════════════════════════════════════════════════════════
// Based on the user's uploaded working spec

export const spec2b = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 720,
  "height": 460,
  "padding": {"top": 40, "left": 0, "right": 40, "bottom": 0},
  "autosize": {"type": "fit", "contains": "padding"},
  "params": [
    {
      "name": "mode",
      "value": "density",
      "bind": {
        "input": "radio",
        "options": ["density", "count"],
        "labels": ["Density (%)", "Raw Count"],
        "name": "View Mode"
      }
    }
  ],
  "layer": [
    {
      "data": {"values": histStacked},
      "transform": [
        {
          "calculate": "mode == 'density' ? datum.y_density : datum.y_count",
          "as": "y_val"
        },
        {
          "calculate": "mode == 'density' ? datum.y0_density : datum.y0_count",
          "as": "y0_val"
        },
        {
          "calculate": "mode == 'density' ? datum.y1_density : datum.y1_count",
          "as": "y1_val"
        }
      ],
      "mark": {
        "type": "rect",
        "opacity": CHART2_BAR_OPACITY,
        "strokeWidth": BAR_STROKE_WIDTH,
        "stroke": BAR_STROKE_COLOR
      },
      "encoding": {
        "x": {
          "field": "bin_start",
          "type": "quantitative",
          "scale": {"domain": [0, 100]},
          "axis": {"tickMinStep": 5, "grid": false},
          "title": "Track Popularity"
        },
        "x2": {"field": "bin_end", "type": "quantitative"},
        "y": {
          "field": "y1_val",
          "type": "quantitative",
          "scale": {"domainMin": 0, "domainMax": {"signal": `mode == 'density' ? ${COMMON_Y_MAX_DENSITY} : ${COMMON_Y_MAX_COUNT}`}, "nice": false},
          "axis": {
            "minExtent": 40,
            "maxExtent": 40,
            "values": {"signal": `mode == 'density' ? [2.5, 5, 7.5, 10, 12.5, 15] : null`},
            "labelExpr": "mode === 'count' ? format(datum.value, '~s') : format(datum.value, '.1f')"
          },
          "title": {
            "signal": "mode == 'density' ? 'Percentage' : 'Number of Tracks'"
          }
        },
        "y2": {"field": "y0_val"},
        "color": {
          "field": "group",
          "type": "nominal",
          "scale": {
            "domain": ["single-genre", "multi-genre"],
            "range": [COLOR_TEST_2, COLOR_TEST_3]
          },
          "legend": null
        },
        "tooltip": [
          {"field": "y_count",   "type": "quantitative", "title": "Count", "format": ","},
          {"field": "y_density", "type": "quantitative", "title": "Percentage", "format": ".2f"},
          {"field": "group",     "type": "nominal",      "title": "Group"}
        ]
      }
    }
  ],
  "config": {
    "view": {"stroke": "transparent"},
    "font": "Inter, system-ui, sans-serif",
    "axis": {"gridColor": COLOR_GRID, "labelFontSize": 12, "titleFontSize": 14},
    "bar": {"cornerRadiusEnd": 2, "continuousBandSize": 24}
  }
};

// ═══════════════════════════════════════════════════════════════
// SPEC 2C — UNSTACKED + GAUSSIAN FIT
// ═══════════════════════════════════════════════════════════════

export const spec2c = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 720,
  "height": 460,
  "padding": {"top": 40, "left": 0, "right": 40, "bottom": 0},
  "autosize": {"type": "fit", "contains": "padding"},
  "params": [
    {
      "name": "mode",
      "value": "density",
      "bind": {
        "input": "radio",
        "options": ["density", "count"],
        "labels": ["Density (%)", "Raw Count"],
        "name": "View Mode"
      }
    }
  ],
  "layer": [
    // ── Layer 1: Histogram bars (unstacked) ──
    {
      "data": {"values": histLong},
      "transform": [
        {
          "calculate": "mode == 'density' ? datum.y_density : datum.y_count",
          "as": "y_val"
        }
      ],
      "mark": {
        "type": "bar",
        "opacity": 0.55,
        "strokeWidth": BAR_STROKE_WIDTH,
        "stroke": BAR_STROKE_COLOR
      },
      "encoding": {
        "x": {
          "field": "bin_start",
          "type": "quantitative",
          "bin": {"binned": true, "step": 5},
          "scale": {"domain": [0, 100]},
          "title": "Track Popularity"
        },
        "x2": {"field": "bin_end"},
        "y": {
          "field": "y_val",
          "type": "quantitative",
          "stack": null,
          "scale": {"domainMin": 0, "domainMax": {"signal": `mode == 'density' ? ${COMMON_Y_MAX_DENSITY} : ${COMMON_Y_MAX_COUNT}`}, "nice": false},
          "axis": {
            "minExtent": 40,
            "maxExtent": 40,
            "values": {"signal": `mode == 'density' ? [2.5, 5, 7.5, 10, 12.5, 15] : null`},
            "labelExpr": "mode === 'count' ? format(datum.value, '~s') : format(datum.value, '.1f')"
          },
          "title": {
            "signal": "mode == 'density' ? 'Percentage' : 'Number of Tracks'"
          }
        },
        "color": {
          "field": "group",
          "type": "nominal",
          "scale": {
            "domain": ["single-genre", "multi-genre"],
            "range": [COLOR_SINGLE_PRIMARY, COLOR_MULTI_PRIMARY]
          },
          "legend": null
        },
        "tooltip": [
          {"field": "y_count",   "type": "quantitative", "title": "Count", "format": ","},
          {"field": "y_density", "type": "quantitative", "title": "Percentage", "format": ".2f"},
          {"field": "group",     "type": "nominal",      "title": "Group"}
        ]
      }
    },

    // ── Layer 2: Single-genre mean vertical line ──
    {
      "data": {"values": [{"x": SINGLE_MEAN}]},
      "transform": [
        {"calculate": "0", "as": "y0_val"},
        {"calculate": `mode == 'density' ? ${COMMON_Y_MAX_DENSITY} : ${COMMON_Y_MAX_COUNT}`, "as": "y1_val"}
      ],
      "mark": {
        "type": "rule",
        "color": COLOR_SINGLE_CURVE,
        "strokeWidth": 2.5,
        "opacity": 0.95
      },
      "encoding": {
        "x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 100]}},
        "y": {"field": "y1_val", "type": "quantitative"},
        "y2": {"field": "y0_val"}
      }
    },
    // ── Layer 3: Multi-genre mean vertical line ──
    {
      "data": {"values": [{"x": MULTI_MEAN}]},
      "transform": [
        {"calculate": "0", "as": "y0_val"},
        {"calculate": `mode == 'density' ? ${COMMON_Y_MAX_DENSITY} : ${COMMON_Y_MAX_COUNT}`, "as": "y1_val"}
      ],
      "mark": {
        "type": "rule",
        "color": COLOR_MULTI_CURVE,
        "strokeWidth": 2.5,
        "opacity": 0.95
      },
      "encoding": {
        "x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 100]}},
        "y": {"field": "y1_val", "type": "quantitative"},
        "y2": {"field": "y0_val"}
      }
    },
    // ── Layer 4: Single peak label BACKGROUND ──
    {
      "data": {"values": [singlePeak]},
      "transform": [
        {
          "calculate": "mode == 'density' ? datum.x_density : datum.x_count",
          "as": "x_val"
        },
        {
          "calculate": "mode == 'density' ? datum.y_density : datum.y_count",
          "as": "y_val"
        }
      ],
      "mark": {
        "type": "rect",
        "fill": LABEL_BG_SINGLE,
        "stroke": LABEL_BG_BORDER_SINGLE,
        "strokeWidth": LABEL_BG_BORDER_WIDTH,
        "cornerRadius": LABEL_BG_CORNER_RADIUS,
        "width": 145,
        "height": 26,
        "opacity": 0.9
      },
      "encoding": {
        "x": {
          "field": "x_val",
          "type": "quantitative",
          "scale": {"domain": [0, 100]}
        },
        "y": {
          "field": "y_val",
          "type": "quantitative"
        }
      }
    },
    // ── Layer 5: Single peak label TEXT ──
    {
      "data": {"values": [singlePeak]},
      "transform": [
        {
          "calculate": "mode == 'density' ? datum.x_density : datum.x_count",
          "as": "x_val"
        },
        {
          "calculate": "mode == 'density' ? datum.y_density : datum.y_count",
          "as": "y_val"
        }
      ],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "middle",
        "fontSize": LABEL_FONT_SIZE,
        "fontWeight": LABEL_FONT_WEIGHT,
        "color": COLOR_SINGLE_PRIMARY
      },
      "encoding": {
        "x": {"field": "x_val", "type": "quantitative"},
        "y": {"field": "y_val", "type": "quantitative"},
        "text": {"field": "label"},
        "tooltip": [
          {"field": "mean",  "title": "Mean (μ)",    "format": ".2f"},
          {"field": "std",   "title": "Std Dev (σ)", "format": ".2f"},
          {"field": "count", "title": "n",           "format": ","}
        ]
      }
    },
    // ── Layer 6: Multi peak label BACKGROUND ──
    {
      "data": {"values": [multiPeak]},
      "transform": [
        {
          "calculate": "mode == 'density' ? datum.x_density : datum.x_count",
          "as": "x_val"
        },
        {
          "calculate": "mode == 'density' ? datum.y_density : datum.y_count",
          "as": "y_val"
        }
      ],
      "mark": {
        "type": "rect",
        "fill": LABEL_BG_MULTI,
        "stroke": LABEL_BG_BORDER_MULTI,
        "strokeWidth": LABEL_BG_BORDER_WIDTH,
        "cornerRadius": LABEL_BG_CORNER_RADIUS,
        "width": 140,
        "height": 26,
        "opacity": 0.9
      },
      "encoding": {
        "x": {
          "field": "x_val",
          "type": "quantitative",
          "scale": {"domain": [0, 100]}
        },
        "y": {
          "field": "y_val",
          "type": "quantitative"
        }
      }
    },
    // ── Layer 7: Multi peak label TEXT ──
    {
      "data": {"values": [multiPeak]},
      "transform": [
        {
          "calculate": "mode == 'density' ? datum.x_density : datum.x_count",
          "as": "x_val"
        },
        {
          "calculate": "mode == 'density' ? datum.y_density : datum.y_count",
          "as": "y_val"
        }
      ],
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "middle",
        "fontSize": LABEL_FONT_SIZE,
        "fontWeight": LABEL_FONT_WEIGHT,
        "color": COLOR_MULTI_PRIMARY
      },
      "encoding": {
        "x": {"field": "x_val", "type": "quantitative"},
        "y": {"field": "y_val", "type": "quantitative"},
        "text": {"field": "label"},
        "tooltip": [
          {"field": "mean",  "title": "Mean (μ)",    "format": ".2f"},
          {"field": "std",   "title": "Std Dev (σ)", "format": ".2f"},
          {"field": "count", "title": "n",           "format": ","}
        ]
      }
    }
  ],
  "config": {
    "view": {"stroke": "transparent"},
    "font": "Inter, system-ui, sans-serif",
    "axis": {"gridColor": COLOR_GRID, "labelFontSize": 12, "titleFontSize": 14},
    "bar": {"cornerRadiusEnd": 2, "continuousBandSize": 24}
  }
};

// Backward compatibility
// export const spec2 = spec2c;
