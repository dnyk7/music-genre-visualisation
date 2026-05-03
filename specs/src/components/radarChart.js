import { state } from "./main.js"

// d3 is loaded globally via CDN in index.html
const FEATURES = ["Danceability", "Speechiness", "Valence", "Acousticness", "Energy"]

let svg = null
let width = 450, height = 450
let margin = { top: 20, right: 20, bottom: 20, left: 20 }
// let width = 580, height = 520;
// let margin = { top: 50, right: 50, bottom: 50, left: 50 };
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
      .attr("width", width)
      .attr("height", height)
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
  FEATURES.forEach((_, i) => {
    const [x2, y2] = pointOnAxis(i, 1)
    g.append("line")
      .attr("x1", cx).attr("y1", cy)
      .attr("x2", x2).attr("y2", y2)
      .attr("stroke", "#aaa").attr("stroke-width", 1)
  })
  FEATURES.forEach((feat, i) => {
    const [x, y] = pointOnAxis(i, 1.1)
    g.append("text")
      .attr("x", x).attr("y", y)
      .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
      .attr("fill", "black")
      .attr("font-size", "16px")
      .attr("font-weight", "500")
      .text(feat)
  })
}

export function updateRadar() {
  if (!svg || !state.data) return

  const activeGenresSet = state.activeGenres

  const paths = svg.selectAll(".genre-path").data(state.data, d => d.genre)
  paths.exit().remove()

  const pathsEnter = paths.enter().append("polygon")
    .attr("class", "genre-path")
    .attr("stroke-width", 1.5)
    .attr("fill", d => d.color)
    .attr("stroke", d => d.color)

  pathsEnter.merge(paths)
    .transition().duration(400)
    .attr("points", d => {
      return FEATURES.map((f, i) => pointOnAxis(i, d.features[f] ?? 0)).join(" ")
    })
    .attr("fill-opacity", d => activeGenresSet.has(d.genre) ? 0.25 : 0.02)
    .attr("stroke-opacity", d => activeGenresSet.has(d.genre) ? 1 : 0.05)

  svg.on("mousemove", null)
  svg.on("mouseleave", null)

  svg.on("mousemove", function(event) {
    const [mouseX, mouseY] = d3.pointer(event)
    let dx = mouseX - cx
    let dy = mouseY - cy
    let angle = Math.atan2(dy, dx)
    if (angle < 0) angle += 2 * Math.PI
    
    let minDiff = Infinity
    let closestFeature = null
    angles.forEach((a, i) => {
      let diff = Math.abs(angle - a)
      diff = Math.min(diff, 2*Math.PI - diff)
      if (diff < minDiff) {
        minDiff = diff
        closestFeature = FEATURES[i]
      }
    })
    
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
