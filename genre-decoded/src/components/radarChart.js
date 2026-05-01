import * as d3 from "d3"
import { state } from "../main"

// Experiment with the order of features to see if it improves readability. 
// Valence first might help set the emotional tone, followed by Danceability and Energy which are often key genre differentiators. 
// Acousticness and Speechiness last since they may be less immediately intuitive to all users.
const FEATURES = ["Danceability", "Speechiness", "Valence", "Acousticness", "Energy"] // no Tempo
// const FEATURES = ["Energy", "Speechiness", "Valence", "Danceability", "Acousticness"]

let svg = null
let width = 550, height = 500
let margin = { top: 20, right: 20, bottom: 20, left: 20 }
let cx, cy, R, angles

function initGeometry() {
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom
  cx = margin.left + innerW / 2
  cy = margin.top + innerH / 2
  R = Math.min(innerW, innerH) * 0.35
  angles = FEATURES.map((_, i) => (i * 2 * Math.PI / FEATURES.length) - Math.PI/2)
}

function pointOnAxis(i, value) {
  const a = angles[i]
  return [cx + value * R * Math.cos(a), cy + value * R * Math.sin(a)]
}

export function resetChart() {
  svg = null
}

export function renderRadar() {
  if (!svg) {
    const container = document.createElement("div")
    svg = d3.create("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "radar-svg")
    initGeometry()
    drawAxesAndLabels()
    container.appendChild(svg.node())
    updateRadar()
    return container
  }
  updateRadar()
  return document.querySelector(".radar-svg")?.parentNode || document.createElement("div")
}

function drawAxesAndLabels() {
  const g = svg.append("g").attr("class", "radar-axes")
  // axes lines
  FEATURES.forEach((_, i) => {
    const [x2, y2] = pointOnAxis(i, 1)
    g.append("line")
      .attr("x1", cx).attr("y1", cy)
      .attr("x2", x2).attr("y2", y2)
      .attr("stroke", "#aaa").attr("stroke-width", 1)
  })
  // labels
  // You may also want to increase the distance of labels from the centre by 
  // changing the multiplier 1.1 to 1.15 or 1.2 to avoid overlap with the polygon edges.
  FEATURES.forEach((feat, i) => {
    const [x, y] = pointOnAxis(i, 1.1)
    g.append("text")
      .attr("x", x).attr("y", y)
      .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
      .attr("fill", "black")           // black color
      .attr("font-size", "16px")       // larger font
      .attr("font-weight", "500")      // optionally semi-bold
      .text(feat)
  })
}

export function updateRadar() {
  if (!svg || !state.data) return

  const activeGenresSet = state.activeGenres

  // Bind polygons
  const paths = svg.selectAll(".genre-path").data(state.data, d => d.genre)
  paths.exit().remove()

  const pathsEnter = paths.enter().append("polygon")
    .attr("class", "genre-path")
    .attr("stroke-width", 1.5)
    .attr("fill", d => d.color)
    .attr("stroke", d => d.color)

  // Merge and update
  pathsEnter.merge(paths)
    .transition().duration(400)
    .attr("points", d => {
      return FEATURES.map((f, i) => pointOnAxis(i, d.features[f] ?? 0)).join(" ")
    })
    .attr("fill-opacity", d => activeGenresSet.has(d.genre) ? 0.25 : 0.02)
    .attr("stroke-opacity", d => activeGenresSet.has(d.genre) ? 1 : 0.05)

  // ---- SMART TOOLTIP ----
  // Remove any existing mousemove listener (avoid duplicates)
  svg.on("mousemove", null)
  svg.on("mouseleave", null)

  svg.on("mousemove", function(event) {
    // Get mouse position relative to the SVG
    const [mouseX, mouseY] = d3.pointer(event)
    // Compute angle from centre (cx, cy)
    let dx = mouseX - cx
    let dy = mouseY - cy
    let angle = Math.atan2(dy, dx)
    // Normalise to 0..2pi
    if (angle < 0) angle += 2 * Math.PI
    // Find which axis (feature) is closest to this angle
    let minDiff = Infinity
    let closestFeature = null
    let closestIndex = -1
    angles.forEach((a, i) => {
      let diff = Math.abs(angle - a)
      diff = Math.min(diff, 2*Math.PI - diff)
      if (diff < minDiff) {
        minDiff = diff
        closestFeature = FEATURES[i]
        closestIndex = i
      }
    })
    // Now find which genre polygon is under the mouse
    // D3 doesn't give direct hit test, but we can check which polygon contains the point?
    // Simpler: iterate through state.data and compute distance from centre? Not accurate.
    // Better: use D3's `d3.polygonContains` on each polygon.
    let hoveredGenre = null
    for (let genreData of state.data) {
      const points = FEATURES.map((f, i) => pointOnAxis(i, genreData.features[f] ?? 0))
      if (d3.polygonContains(points, [mouseX, mouseY])) {
        hoveredGenre = genreData
        break
      }
    }
    if (hoveredGenre && closestFeature) {
      const tooltip = document.querySelector(".chart-tooltip")
      const val = hoveredGenre.features[closestFeature] ?? 0
      tooltip.innerHTML = `<strong style="color:${hoveredGenre.color}">${hoveredGenre.genre}</strong><br>${closestFeature}: ${val.toFixed(3)}`
      tooltip.classList.add("visible")
      tooltip.style.left = (event.clientX + 12) + "px"
      tooltip.style.top = (event.clientY - 20) + "px"
    } else {
      document.querySelector(".chart-tooltip")?.classList.remove("visible")
    }
  })

  svg.on("mouseleave", () => {
    document.querySelector(".chart-tooltip")?.classList.remove("visible")
  })
}