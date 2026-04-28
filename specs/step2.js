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

const SINGLE_DENSITY_SCALE = 4.5 * 100;
const MULTI_DENSITY_SCALE  = 5.5 * 100;
const SINGLE_COUNT_SCALE   = 4.5;
const MULTI_COUNT_SCALE    = 5.5;

const LABEL_BG_PADDING        = 6;
const LABEL_BG_CORNER_RADIUS  = 4;
const LABEL_BG_SINGLE         = COLOR_SINGLE_BG;
const LABEL_BG_MULTI          = COLOR_MULTI_BG;
const LABEL_BG_BORDER_SINGLE  = COLOR_SINGLE_PRIMARY;
const LABEL_BG_BORDER_MULTI   = COLOR_MULTI_PRIMARY;
const LABEL_BG_BORDER_WIDTH   = 1.5;
const LABEL_FONT_SIZE         = 13;
const LABEL_FONT_WEIGHT       = "bold";

// ═══════════════════════════════════════════════════════════════
// 4 INDEPENDENT LABEL OFFSET RATIOS
// ═══════════════════════════════════════════════════════════════

const SINGLE_DENSITY_OFFSET = 1.07;
const SINGLE_COUNT_OFFSET   = 1.07;
const MULTI_DENSITY_OFFSET  = 1.13;
const MULTI_COUNT_OFFSET    = 3.00;

const LABEL_DX_SINGLE = -20;
const LABEL_DX_MULTI  = -10;

// ═══════════════════════════════════════════════════════════════
// HARDCODED DATA
// ═══════════════════════════════════════════════════════════════

const histData = [
  {bin_start:  0, bin_end:  5, single_count:  4007, multi_count:   29},
  {bin_start:  5, bin_end: 10, single_count:   905, multi_count:   37},
  {bin_start: 10, bin_end: 15, single_count:   785, multi_count:   35},
  {bin_start: 15, bin_end: 20, single_count:   924, multi_count:   35},
  {bin_start: 20, bin_end: 25, single_count:  1002, multi_count:   29},
  {bin_start: 25, bin_end: 30, single_count:  1231, multi_count:   32},
  {bin_start: 30, bin_end: 35, single_count:  1698, multi_count:   21},
  {bin_start: 35, bin_end: 40, single_count:  2092, multi_count:   44},
  {bin_start: 40, bin_end: 45, single_count:  2097, multi_count:   59},
  {bin_start: 45, bin_end: 50, single_count:  2168, multi_count:   72},
  {bin_start: 50, bin_end: 55, single_count:  2257, multi_count:   62},
  {bin_start: 55, bin_end: 60, single_count:  2127, multi_count:   99},
  {bin_start: 60, bin_end: 65, single_count:  1873, multi_count:  142},
  {bin_start: 65, bin_end: 70, single_count:  1518, multi_count:  213},
  {bin_start: 70, bin_end: 75, single_count:  1040, multi_count:  228},
  {bin_start: 75, bin_end: 80, single_count:   581, multi_count:  249},
  {bin_start: 80, bin_end: 85, single_count:   169, multi_count:  159},
  {bin_start: 85, bin_end: 90, single_count:    40, multi_count:   83},
  {bin_start: 90, bin_end: 95, single_count:     4, multi_count:   39},
  {bin_start: 95, bin_end: 100, single_count:     0, multi_count:   12},
];

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
    group: 'single-genre',
    y_density: singleDensity,
    y_count: singleCount,
    y0_density: 0,
    y1_density: singleDensity,
    y0_count: 0,
    y1_count: singleCount
  });
  histStacked.push({
    bin_start: d.bin_start,
    bin_end: d.bin_end,
    group: 'multi-genre',
    y_density: multiDensity,
    y_count: multiCount,
    y0_density: singleDensity,
    y1_density: singleDensity + multiDensity,
    y0_count: singleCount,
    y1_count: singleCount + multiCount
  });
});

// ── State 3: Unstacked (each group as proportion of its own total) ──
const histLong = [];
histData.forEach(d => {
  histLong.push({
    bin_start: d.bin_start,
    bin_end: d.bin_end,
    group: 'single-genre',
    y_density: d.single_count / singleTotal * 100,
    y_count: d.single_count
  });
  histLong.push({
    bin_start: d.bin_start,
    bin_end: d.bin_end,
    group: 'multi-genre',
    y_density: d.multi_count / multiTotal * 100,
    y_count: d.multi_count
  });
});

const SINGLE_MEAN = 44.4973;
const SINGLE_STD  = 18.3802;
const SINGLE_COUNT = 22511;

const MULTI_MEAN  = 62.7044;
const MULTI_STD   = 20.5955;
const MULTI_COUNT = 1651;

function gaussianPDF(x, m, s) {
  return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - m, 2) / (2 * s * s));
}

function makeCurve(m, s, c) {
  const p = [];
  for (let x = 5; x <= 100; x++) {
    const d = gaussianPDF(x, m, s);
    p.push({
      x: x,
      y_density: d * c.densityScale,
      y_count:   d * c.countScale
    });
  }
  return p;
}

let singleCurve = makeCurve(SINGLE_MEAN, SINGLE_STD, {
  densityScale: SINGLE_DENSITY_SCALE,
  countScale:   SINGLE_COUNT * SINGLE_COUNT_SCALE
});

let multiCurve = makeCurve(MULTI_MEAN, MULTI_STD, {
  densityScale: MULTI_DENSITY_SCALE,
  countScale:   MULTI_COUNT * MULTI_COUNT_SCALE
});

let singlePeakDensity = gaussianPDF(SINGLE_MEAN, SINGLE_MEAN, SINGLE_STD) * SINGLE_DENSITY_SCALE;
let singlePeakCount   = gaussianPDF(SINGLE_MEAN, SINGLE_MEAN, SINGLE_STD) * SINGLE_COUNT * SINGLE_COUNT_SCALE;
let multiPeakDensity  = gaussianPDF(MULTI_MEAN,  MULTI_MEAN,  MULTI_STD)  * MULTI_DENSITY_SCALE;
let multiPeakCount    = gaussianPDF(MULTI_MEAN,  MULTI_MEAN,  MULTI_STD)  * MULTI_COUNT  * MULTI_COUNT_SCALE;

let singlePeak = {
  x: SINGLE_MEAN + LABEL_DX_SINGLE,
  y_density: singlePeakDensity * SINGLE_DENSITY_OFFSET,
  y_count:   singlePeakCount   * SINGLE_COUNT_OFFSET,
  label: 'single-genre (=1)',
  mean: SINGLE_MEAN,
  std: SINGLE_STD,
  count: SINGLE_COUNT
};

let multiPeak = {
  x: MULTI_MEAN + LABEL_DX_MULTI,
  y_density: multiPeakDensity * MULTI_DENSITY_OFFSET,
  y_count:   multiPeakCount   * MULTI_COUNT_OFFSET,
  label: 'multi-genre (>1)',
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
  "padding": {"top": 70, "left": 80, "right": 40, "bottom": 50},
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
          "axis": {"tickMinStep": 5},
          "title": "Track Popularity"
        },
        "x2": {"field": "bin_end", "type": "quantitative"},
        "y": {
          "field": "y_val",
          "type": "quantitative",
          "axis": {
            "minExtent": 40,
            "maxExtent": 40,
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
  "padding": {"top": 70, "left": 80, "right": 40, "bottom": 50},
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
          "axis": {"tickMinStep": 5},
          "title": "Track Popularity"
        },
        "x2": {"field": "bin_end", "type": "quantitative"},
        "y": {
          "field": "y1_val",
          "type": "quantitative",
          "axis": {
            "minExtent": 40,
            "maxExtent": 40,
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
  "padding": {"top": 70, "left": 80, "right": 40, "bottom": 50},
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
          "axis": {
            "minExtent": 40,
            "maxExtent": 40,
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
    // ── Layer 2: Single-genre Gaussian curve ──
    {
      "data": {"values": singleCurve},
      "transform": [
        {
          "calculate": "mode == 'density' ? datum.y_density : datum.y_count",
          "as": "y_val"
        }
      ],
      "mark": {
        "type": "line",
        "color": COLOR_SINGLE_CURVE,
        "strokeWidth": 2.5,
        "opacity": 0.9,
        "interpolate": "monotone"
      },
      "encoding": {
        "x": {
          "field": "x",
          "type": "quantitative",
          "scale": {"domain": [0, 100]}
        },
        "y": {
          "field": "y_val",
          "type": "quantitative"
        }
      }
    },
    // ── Layer 3: Multi-genre Gaussian curve ──
    {
      "data": {"values": multiCurve},
      "transform": [
        {
          "calculate": "mode == 'density' ? datum.y_density : datum.y_count",
          "as": "y_val"
        }
      ],
      "mark": {
        "type": "line",
        "color": COLOR_MULTI_CURVE,
        "strokeWidth": 2.5,
        "opacity": 0.9,
        "interpolate": "monotone"
      },
      "encoding": {
        "x": {
          "field": "x",
          "type": "quantitative",
          "scale": {"domain": [0, 100]}
        },
        "y": {
          "field": "y_val",
          "type": "quantitative"
        }
      }
    },
    // ── Layer 4: Single peak label BACKGROUND ──
    {
      "data": {"values": [singlePeak]},
      "transform": [
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
        "width": 120,
        "height": 26,
        "opacity": 0.9
      },
      "encoding": {
        "x": {
          "field": "x",
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
        "x": {"field": "x", "type": "quantitative"},
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
        "width": 110,
        "height": 26,
        "opacity": 0.9
      },
      "encoding": {
        "x": {
          "field": "x",
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
        "x": {"field": "x", "type": "quantitative"},
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
export const spec2 = spec2c;
