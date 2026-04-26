// specs/step2.js
// Step 2: Track Popularity — Single-Genre vs Multi-Genre
// Data pre-computed in JS, Vega-Lite only renders
//
// INSTRUCTION: Replace the 6 HARDCODED values below after running your Colab:
//   single = track_level[(track_level['genre_group']=='single-genre') & (track_level['track_popularity']>=5)]['track_popularity']
//   multi  = track_level[(track_level['genre_group']=='multi-genre')  & (track_level['track_popularity']>=5)]['track_popularity']
//   print(f"single_mean: {single.mean():.4f}, single_std: {single.std(ddof=0):.4f}, single_count: {len(single)}")
//   print(f"multi_mean:  {multi.mean():.4f}, multi_std:  {multi.std(ddof=0):.4f}, multi_count:  {len(multi)}")

// ═══════════════════════════════════════════════════════════════
// 1. HARDCODED GAUSSIAN PARAMETERS — REPLACE THESE 6 LINES
// ═══════════════════════════════════════════════════════════════
const SINGLE_MEAN   = 42.5000;
const SINGLE_STD    = 24.5000;
const SINGLE_COUNT  = 29000;
const MULTI_MEAN    = 45.0000;
const MULTI_STD     = 23.0000;
const MULTI_COUNT   = 1500;

// ═══════════════════════════════════════════════════════════════
// 2. PRE-COMPUTE ALL DATA IN JS (no Vega-Lite transforms)
// ═══════════════════════════════════════════════════════════════

// Bin config
const BIN_STEP = 5;
const BIN_EDGES = [];
for (let i = 0; i <= 100; i += BIN_STEP) BIN_EDGES.push(i);

// Gaussian PDF
function gaussianPDF(x, mean, std) {
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * std * std));
}

// Generate Gaussian curve points
function makeCurve(mean, std, count) {
  const pts = [];
  for (let x = 5; x <= 100; x += 1) {
    const d = gaussianPDF(x, mean, std);
    pts.push({ x: x, y_density: d, y_count: d * count });
  }
  return pts;
}

// Generate histogram bins (will be filled after CSV load)
function makeBins() {
  const bins = [];
  for (let i = 0; i < BIN_EDGES.length - 1; i++) {
    bins.push({
      bin_start: BIN_EDGES[i],
      bin_end: BIN_EDGES[i + 1],
      bin_center: (BIN_EDGES[i] + BIN_EDGES[i + 1]) / 2,
      single_count: 0,
      multi_count: 0
    });
  }
  return bins;
}

// Pre-computed curve data
const singleCurve = makeCurve(SINGLE_MEAN, SINGLE_STD, SINGLE_COUNT);
const multiCurve  = makeCurve(MULTI_MEAN,  MULTI_STD,  MULTI_COUNT);

// Peak values
const singlePeakDensity = gaussianPDF(SINGLE_MEAN, SINGLE_MEAN, SINGLE_STD);
const singlePeakCount   = singlePeakDensity * SINGLE_COUNT;
const multiPeakDensity  = gaussianPDF(MULTI_MEAN, MULTI_MEAN, MULTI_STD);
const multiPeakCount    = multiPeakDensity * MULTI_COUNT;

// ═══════════════════════════════════════════════════════════════
// 3. ASYNC CSV LOADING + BINNING (runs before export)
// ═══════════════════════════════════════════════════════════════
// NOTE: Vega-Lite can't do async data transforms, so we use a trick:
// The spec will be built AFTER data is fetched. In practice, for a
// static site, you should run this once and save the output.
//
// For immediate use, here's the spec with INLINE pre-computed data.
// To regenerate, uncomment the fetch block below and run in browser console.
// ═══════════════════════════════════════════════════════════════

// Pre-computed bin counts (placeholder — replace with actual values from your data)
// Run this in your Colab to get real counts, then paste below:
/*
import pandas as pd, numpy as np
url = ".../spotify_songs.csv"
df = pd.read_csv(url)
# ... (year parse + dedup + genre_group) ...
single_counts = track_level[track_level['genre_group']=='single-genre']['track_popularity'].value_counts(bins=range(0,101,5), sort=False)
multi_counts  = track_level[track_level['genre_group']=='multi-genre']['track_popularity'].value_counts(bins=range(0,101,5), sort=False)
for i in range(20):
    print(f"  {{bin_start: {i*5}, bin_end: {i*5+5}, single_count: {int(single_counts.iloc[i])}, multi_count: {int(multi_counts.iloc[i])}}},")
*/

// ═══════════════════════════════════════════════════════════════
// 4. INLINE PRE-COMPUTED HISTOGRAM DATA (replace with real values)
// ═══════════════════════════════════════════════════════════════
const histData = [
  {bin_start: 0,  bin_end: 5,  single_count: 3500, multi_count: 80},
  {bin_start: 5,  bin_end: 10, single_count: 1800, multi_count: 45},
  {bin_start: 10, bin_end: 15, single_count: 1200, multi_count: 38},
  {bin_start: 15, bin_end: 20, single_count: 950,  multi_count: 32},
  {bin_start: 20, bin_end: 25, single_count: 780,  multi_count: 28},
  {bin_start: 25, bin_end: 30, single_count: 650,  multi_count: 25},
  {bin_start: 30, bin_end: 35, single_count: 580,  multi_count: 22},
  {bin_start: 35, bin_end: 40, single_count: 520,  multi_count: 20},
  {bin_start: 40, bin_end: 45, single_count: 480,  multi_count: 18},
  {bin_start: 45, bin_end: 50, single_count: 450,  multi_count: 17},
  {bin_start: 50, bin_end: 55, single_count: 420,  multi_count: 16},
  {bin_start: 55, bin_end: 60, single_count: 390,  multi_count: 15},
  {bin_start: 60, bin_end: 65, single_count: 360,  multi_count: 14},
  {bin_start: 65, bin_end: 70, single_count: 330,  multi_count: 13},
  {bin_start: 70, bin_end: 75, single_count: 300,  multi_count: 12},
  {bin_start: 75, bin_end: 80, single_count: 270,  multi_count: 11},
  {bin_start: 80, bin_end: 85, single_count: 240,  multi_count: 10},
  {bin_start: 85, bin_end: 90, single_count: 210,  multi_count: 9},
  {bin_start: 90, bin_end: 95, single_count: 180,  multi_count: 8},
  {bin_start: 95, bin_end: 100,single_count: 150,  multi_count: 7}
];

// Compute totals and densities
const singleTotal = histData.reduce((s, d) => s + d.single_count, 0);
const multiTotal  = histData.reduce((s, d) => s + d.multi_count, 0);
histData.forEach(d => {
  d.single_density = d.single_count / singleTotal;
  d.multi_density  = d.multi_count / multiTotal;
});

// Flatten for Vega-Lite (long format)
const histLong = [];
histData.forEach(d => {
  histLong.push({
    bin_start: d.bin_start, bin_end: d.bin_end, bin_center: (d.bin_start + d.bin_end) / 2,
    group: 'single-genre', count: d.single_count, density: d.single_density
  });
  histLong.push({
    bin_start: d.bin_start, bin_end: d.bin_end, bin_center: (d.bin_start + d.bin_end) / 2,
    group: 'multi-genre',  count: d.multi_count,  density: d.multi_density
  });
});

// ═══════════════════════════════════════════════════════════════
// 5. VEGA-LITE SPEC (pure rendering, no transforms)
// ═══════════════════════════════════════════════════════════════
export const spec2 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": {
    "text": "Track Popularity: Single-Genre vs Multi-Genre",
    "subtitle": "Multi-genre tracks skew higher but are only ~5% of total | Gaussian fit excludes 0–5 bin",
    "fontSize": 17, "fontWeight": "bold", "subtitleFontSize": 11,
    "subtitleColor": "#888", "anchor": "start", "offset": 15
  },
  "width": 720, "height": 460,
  "padding": {"top": 10, "left": 10, "right": 10, "bottom": 10},

  "params": [{
    "name": "showDensity", "value": true,
    "bind": {"input": "radio", "options": [true, false],
      "labels": ["Density", "Raw Count"], "name": "View Mode"}
  }],

  "layer": [
    // ── Histogram bars ──
    {
      "data": {"values": histLong},
      "mark": {"type": "bar", "opacity": 0.5},
      "encoding": {
        "x": {
          "field": "bin_start", "type": "quantitative",
          "bin": {"binned": true}, "scale": {"domain": [0, 100]},
          "title": "Track Popularity"
        },
        "x2": {"field": "bin_end"},
        "y": {
          "field": {"signal": "showDensity ? 'density' : 'count'"},
          "type": "quantitative",
          "title": {"signal": "showDensity ? 'Density' : 'Number of Tracks'"}
        },
        "color": {
          "field": "group", "type": "nominal",
          "scale": {"domain": ["single-genre", "multi-genre"], "range": ["#1f77b4", "#ff7f0e"]},
          "legend": {"title": null, "orient": "top-right"}
        }
      }
    },

    // ── Single Gaussian curve ──
    {
      "data": {"values": singleCurve},
      "mark": {"type": "line", "color": "#1f77b4", "strokeWidth": 2.5, "opacity": 0.9, "interpolate": "monotone"},
      "encoding": {
        "x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 100]}},
        "y": {"field": {"signal": "showDensity ? 'y_density' : 'y_count'"}, "type": "quantitative"}
      }
    },

    // ── Multi Gaussian curve ──
    {
      "data": {"values": multiCurve},
      "mark": {"type": "line", "color": "#ff7f0e", "strokeWidth": 2.5, "opacity": 0.9, "interpolate": "monotone"},
      "encoding": {
        "x": {"field": "x", "type": "quantitative", "scale": {"domain": [0, 100]}},
        "y": {"field": {"signal": "showDensity ? 'y_density' : 'y_count'"}, "type": "quantitative"}
      }
    },

    // ── Single peak label ──
    {
      "data": {"values": [{
        "x": SINGLE_MEAN,
        "y_density": singlePeakDensity,
        "y_count": singlePeakCount,
        "label": "single-genre",
        "mean": SINGLE_MEAN, "std": SINGLE_STD, "count": SINGLE_COUNT
      }]},
      "mark": {"type": "text", "align": "center", "baseline": "bottom", "dy": -10,
        "fontSize": 11, "fontWeight": "bold", "color": "#1f77b4"},
      "encoding": {
        "x": {"field": "x", "type": "quantitative"},
        "y": {"field": {"signal": "showDensity ? 'y_density' : 'y_count'"}, "type": "quantitative"},
        "text": {"field": "label"},
        "tooltip": [
          {"field": "mean", "type": "quantitative", "title": "Mean (μ)", "format": ".2f"},
          {"field": "std", "type": "quantitative", "title": "Std Dev (σ)", "format": ".2f"},
          {"field": "count", "type": "quantitative", "title": "Sample Size (n)", "format": ","},
          {"value": "Gaussian fit (popularity ≥ 5)", "title": "Method"}
        ]
      }
    },

    // ── Multi peak label ──
    {
      "data": {"values": [{
        "x": MULTI_MEAN,
        "y_density": multiPeakDensity,
        "y_count": multiPeakCount,
        "label": "multi-genre",
        "mean": MULTI_MEAN, "std": MULTI_STD, "count": MULTI_COUNT
      }]},
      "mark": {"type": "text", "align": "center", "baseline": "bottom", "dy": -10,
        "fontSize": 11, "fontWeight": "bold", "color": "#ff7f0e"},
      "encoding": {
        "x": {"field": "x", "type": "quantitative"},
        "y": {"field": {"signal": "showDensity ? 'y_density' : 'y_count'"}, "type": "quantitative"},
        "text": {"field": "label"},
        "tooltip": [
          {"field": "mean", "type": "quantitative", "title": "Mean (μ)", "format": ".2f"},
          {"field": "std", "type": "quantitative", "title": "Std Dev (σ)", "format": ".2f"},
          {"field": "count", "type": "quantitative", "title": "Sample Size (n)", "format": ","},
          {"value": "Gaussian fit (popularity ≥ 5)", "title": "Method"}
        ]
      }
    }
  ],

  "config": {
    "view": {"stroke": "transparent"},
    "font": "Inter, system-ui, sans-serif",
    "axis": {"gridColor": "#f0f0f0", "labelFontSize": 12, "titleFontSize": 14}
  }
};
