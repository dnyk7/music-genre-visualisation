// specs/step2.js
// Step 2: Track Popularity — Single-Genre vs Multi-Genre

const BAR_STROKE_WIDTH = 1.5;
const BAR_STROKE_COLOR = "#000000";
const CHART_PADDING_LEFT = 80, CHART_PADDING_RIGHT = 40;
const CHART_PADDING_TOP = 70, CHART_PADDING_BOTTOM = 50;
const SINGLE_DENSITY_SCALE = 4, MULTI_DENSITY_SCALE = 5.5;
const SINGLE_COUNT_SCALE = 4.5, MULTI_COUNT_SCALE = 5.5;
const LABEL_BG_PADDING = 6, LABEL_BG_CORNER_RADIUS = 4;
const LABEL_BG_SINGLE = "rgba(198, 215, 227, 0.52)";
const LABEL_BG_MULTI = "rgba(255, 212, 175, 0.82)";
const LABEL_BG_BORDER_SINGLE = "#1f77b4";
const LABEL_BG_BORDER_MULTI = "#ff7f0e";
const LABEL_BG_BORDER_WIDTH = 1.5;
const LABEL_FONT_SIZE = 13, LABEL_FONT_WEIGHT = "bold";

// ═══════════════════════════════════════════════════════════════
// 4 INDEPENDENT LABEL OFFSET RATIOS
// ═══════════════════════════════════════════════════════════════
// 1.20 = 20% above peak | 1.30 = 30% above | 1.15 = 15% above

const SINGLE_DENSITY_OFFSET = 1.13;   // single-genre label in density mode
const SINGLE_COUNT_OFFSET   = 1.20;   // single-genre label in count mode
const MULTI_DENSITY_OFFSET  = 1.13;   // multi-genre label in density mode
const MULTI_COUNT_OFFSET    = 3;   // multi-genre label in count mode

// Horizontal offsets (popularity-score units)
const LABEL_DX_SINGLE = -15;
const LABEL_DX_MULTI = -10;

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

const histLong = [];
histData.forEach(d => {
  histLong.push({bin_start: d.bin_start, bin_end: d.bin_end, group: 'single-genre', y_density: d.single_count / singleTotal, y_count: d.single_count});
  histLong.push({bin_start: d.bin_start, bin_end: d.bin_end, group: 'multi-genre',  y_density: d.multi_count / multiTotal,  y_count: d.multi_count});
});

const SINGLE_MEAN = 44.4973, SINGLE_STD = 18.3802, SINGLE_COUNT = 22511;
const MULTI_MEAN  = 62.7044, MULTI_STD  = 20.5955, MULTI_COUNT  = 1651;

function gaussianPDF(x, m, s) {
  return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - m, 2) / (2 * s * s));
}

function makeCurve(m, s, c) {
  const p = [];
  for (let x = 5; x <= 100; x++) {
    const d = gaussianPDF(x, m, s);
    p.push({x: x, y_density: d * c.densityScale, y_count: d * c.countScale});
  }
  return p;
}

let singleCurve = makeCurve(SINGLE_MEAN, SINGLE_STD, {densityScale: SINGLE_DENSITY_SCALE, countScale: SINGLE_COUNT * SINGLE_COUNT_SCALE});
let multiCurve  = makeCurve(MULTI_MEAN,  MULTI_STD,  {densityScale: MULTI_DENSITY_SCALE,  countScale: MULTI_COUNT  * MULTI_COUNT_SCALE});

let singlePeakDensity = gaussianPDF(SINGLE_MEAN, SINGLE_MEAN, SINGLE_STD) * SINGLE_DENSITY_SCALE;
let singlePeakCount   = gaussianPDF(SINGLE_MEAN, SINGLE_MEAN, SINGLE_STD) * SINGLE_COUNT * SINGLE_COUNT_SCALE;
let multiPeakDensity  = gaussianPDF(MULTI_MEAN,  MULTI_MEAN,  MULTI_STD)  * MULTI_DENSITY_SCALE;
let multiPeakCount    = gaussianPDF(MULTI_MEAN,  MULTI_MEAN,  MULTI_STD)  * MULTI_COUNT  * MULTI_COUNT_SCALE;

// ═══════════════════════════════════════════════════════════════
// PEAK LABEL DATA — 4 independent ratios
// ═══════════════════════════════════════════════════════════════

let singlePeak = {
  x: SINGLE_MEAN + LABEL_DX_SINGLE,
  y_density: singlePeakDensity * SINGLE_DENSITY_OFFSET,
  y_count:   singlePeakCount   * SINGLE_COUNT_OFFSET,
  label: 'single-genre (=1)',
  mean: SINGLE_MEAN, std: SINGLE_STD, count: SINGLE_COUNT
};

let multiPeak = {
  x: MULTI_MEAN + LABEL_DX_MULTI,
  y_density: multiPeakDensity * MULTI_DENSITY_OFFSET,
  y_count:   multiPeakCount   * MULTI_COUNT_OFFSET,
  label: 'multi-genre (>1)',
  mean: MULTI_MEAN, std: MULTI_STD, count: MULTI_COUNT
};

export const spec2 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": {
    "text": "Track Popularity: Single-Genre vs Multi-Genre",
    "subtitle": "Multi-genre tracks skew higher but are only ~5% of total | Gaussian fit excludes 0–5 bin",
    "fontSize": 17, "fontWeight": "bold", "subtitleFontSize": 11,
    "subtitleColor": "#888", "anchor": "start", "offset": 15
  },
  "width": 720, "height": 460,
  "padding": {"top": CHART_PADDING_TOP, "left": CHART_PADDING_LEFT, "right": CHART_PADDING_RIGHT, "bottom": CHART_PADDING_BOTTOM},
  "autosize": {"type": "fit", "contains": "padding"},
  "params": [{
    "name": "mode", "value": "density",
    "bind": {"input": "radio", "options": ["density", "count"], "labels": ["Density", "Raw Count"], "name": "View Mode"}
  }],
  "layer": [
    {
      "data": {"values": histLong},
      "transform": [{"calculate": "mode == 'density' ? datum.y_density : datum.y_count", "as": "y_val"}],
      "mark": {"type": "bar", "opacity": 0.55, "strokeWidth": BAR_STROKE_WIDTH, "stroke": BAR_STROKE_COLOR},
      "encoding": {
        "x": {"field": "bin_start", "type": "quantitative", "bin": {"binned": true}, "scale": {"domain": [0, 100]}, "title": "Track Popularity"},
        "x2": {"field": "bin_end"},
        "y": {"field": "y_val", "type": "quantitative", "stack": null, "title": {"signal": "mode == 'density' ? 'Density' : 'Number of Tracks'"}},
        "color": {"field": "group", "type": "nominal", "scale": {"domain": ["single-genre", "multi-genre"], "range": ["#1f77b4", "#ff7f0e"]}, "legend": null},
        "tooltip": [
          {"field": "bin_start", "type": "quantitative", "title": "Range"},
          {"field": "bin_end",   "type": "quantitative", "title": "to"},
          {"field": "y_count",   "type": "quantitative", "title": "Count", "format": ","},
          {"field": "y_density", "type": "quantitative", "title": "Density", "format": ".4f"},
          {"field": "group",     "type": "nominal",      "title": "Group"}
        ]
      }
    },
    {
      "data": {"values": singleCurve},
      "transform": [{"calculate": "mode == 'density' ? datum.y_density : datum.y_count", "as": "y_val"}],
      "mark": {"type": "line", "color": "#1f77b4", "strokeWidth": 2.5, "opacity": 0.9, "interpolate": "monotone"},
      "encoding": {"x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 100]}}, "y": {"field": "y_val", "type": "quantitative"}}
    },
    {
      "data": {"values": multiCurve},
      "transform": [{"calculate": "mode == 'density' ? datum.y_density : datum.y_count", "as": "y_val"}],
      "mark": {"type": "line", "color": "#ff7f0e", "strokeWidth": 2.5, "opacity": 0.9, "interpolate": "monotone"},
      "encoding": {"x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 100]}}, "y": {"field": "y_val", "type": "quantitative"}}
    },
    {
      "data": {"values": [singlePeak]},
      "transform": [{"calculate": "mode == 'density' ? datum.y_density : datum.y_count", "as": "y_val"}],
      "mark": {"type": "rect", "fill": LABEL_BG_SINGLE, "stroke": LABEL_BG_BORDER_SINGLE, "strokeWidth": LABEL_BG_BORDER_WIDTH, "cornerRadius": LABEL_BG_CORNER_RADIUS, "width": 120, "height": 26, "opacity": 0.9},
      "encoding": {"x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 100]}}, "y": {"field": "y_val", "type": "quantitative"}}
    },
    {
      "data": {"values": [singlePeak]},
      "transform": [{"calculate": "mode == 'density' ? datum.y_density : datum.y_count", "as": "y_val"}],
      "mark": {"type": "text", "align": "center", "baseline": "middle", "fontSize": LABEL_FONT_SIZE, "fontWeight": LABEL_FONT_WEIGHT, "color": "#1f77b4"},
      "encoding": {
        "x": {"field": "x", "type": "quantitative"},
        "y": {"field": "y_val", "type": "quantitative"},
        "text": {"field": "label"},
        "tooltip": [
          {"field": "mean", "title": "Mean (μ)", "format": ".2f"},
          {"field": "std", "title": "Std Dev (σ)", "format": ".2f"},
          {"field": "count", "title": "n", "format": ","},
          {"value": "Gaussian fit (≥5)", "title": "Method"}
        ]
      }
    },
    {
      "data": {"values": [multiPeak]},
      "transform": [{"calculate": "mode == 'density' ? datum.y_density : datum.y_count", "as": "y_val"}],
      "mark": {"type": "rect", "fill": LABEL_BG_MULTI, "stroke": LABEL_BG_BORDER_MULTI, "strokeWidth": LABEL_BG_BORDER_WIDTH, "cornerRadius": LABEL_BG_CORNER_RADIUS, "width": 110, "height": 26, "opacity": 0.9},
      "encoding": {"x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 100]}}, "y": {"field": "y_val", "type": "quantitative"}}
    },
    {
      "data": {"values": [multiPeak]},
      "transform": [{"calculate": "mode == 'density' ? datum.y_density : datum.y_count", "as": "y_val"}],
      "mark": {"type": "text", "align": "center", "baseline": "middle", "fontSize": LABEL_FONT_SIZE, "fontWeight": LABEL_FONT_WEIGHT, "color": "#ff7f0e"},
      "encoding": {
        "x": {"field": "x", "type": "quantitative"},
        "y": {"field": "y_val", "type": "quantitative"},
        "text": {"field": "label"},
        "tooltip": [
          {"field": "mean", "title": "Mean (μ)", "format": ".2f"},
          {"field": "std", "title": "Std Dev (σ)", "format": ".2f"},
          {"field": "count", "title": "n", "format": ","},
          {"value": "Gaussian fit (≥5)", "title": "Method"}
        ]
      }
    }
  ],
  "config": {
    "view": {"stroke": "transparent"},
    "font": "Inter, system-ui, sans-serif",
    "axis": {"gridColor": "#f0f0f0", "labelFontSize": 12, "titleFontSize": 14},
    "bar": {"cornerRadiusEnd": 2}
  }
};
