import * as d3 from "d3"
import { state } from "../main"

const FEATURES = ["Danceability", "Energy", "Valence", "Acousticness", "Speechiness"]
let svg = null
let width = 550, height = 450
let margin = { top: 50, right: 20, bottom: 30, left: 110 }  // increased top for x-axis title

export function resetChart() {
  svg = null
}

function getScales() {
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom
  const yScale = d3.scaleBand()
    .domain(FEATURES)
    .range([0, innerH])
    .padding(0.2)
  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, innerW])
  return { xScale, yScale, innerW, innerH }
}

function drawAxes() {
  const { xScale, yScale, innerW, innerH } = getScales()
  const g = svg.append("g").attr("class", "bar-axes")

  // X axis (top)
  g.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(d3.axisTop(xScale).ticks(5))
    .selectAll("text")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("font-weight", "500")      // optionally semi-bold

  // Y axis (left) – feature names
  g.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("font-weight", "500")      // optionally semi-bold

  // X-axis title
  g.append("text")
    .attr("x", margin.left + innerW / 2)
    .attr("y", margin.top - 25)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "16px")
    .attr("font-weight", "500")
    .text("Normalised value (0 → 1)")

  // Optional: make axis lines and ticks darker
  g.selectAll(".domain, .tick line")
    .attr("stroke", "#999")
}

export function renderBar() {
  const container = document.createElement("div")
  if (!svg) {
    svg = d3.select(container).append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "bar-svg")
    drawAxes()   // draw axes once with new styling
  }
  updateBar()
  return container
}

export function updateBar() {
  if (!svg || !state.data) return

  const { xScale, yScale, innerW, innerH } = getScales()
  const activeFeature = state.activeFeature
  const activeGenresSet = state.activeGenres
  const totalGenres = state.data.length
  const barHeight = yScale.bandwidth() / totalGenres

  // Bind data to groups (one per genre)
  const groups = svg.selectAll(".genre-group").data(state.data, d => d.genre)
  groups.exit().remove()
  const groupsEnter = groups.enter().append("g").attr("class", "genre-group")
  const allGroups = groupsEnter.merge(groups)

  allGroups.each(function(genreData, idx) {
    const group = d3.select(this)
    const genreIndex = idx

    // Bind features to rects
    const rects = group.selectAll("rect").data(FEATURES)
    rects.exit().remove()
    const rectsEnter = rects.enter().append("rect")
      .attr("y", margin.top)
      .attr("height", barHeight - 1)
      .attr("x", margin.left)
      .attr("width", 0)
      .attr("fill", genreData.color)

    // Merge and update with transition
    rectsEnter.merge(rects)
      .transition().duration(400)
      .attr("y", d => margin.top + yScale(d) + genreIndex * barHeight)
      .attr("height", barHeight - 1)
      .attr("x", margin.left)
      .attr("width", d => xScale(genreData.features[d] ?? 0))
      .attr("opacity", d => {
        if (!activeGenresSet.has(genreData.genre)) return 0.08
        if (activeFeature && activeFeature !== d) return 0.08
        return 0.85
      })

    // Attach tooltip events using standard DOM
    group.selectAll("rect").each(function(d) {
      const rect = this
      rect.addEventListener("mousemove", (event) => {
        const tooltip = document.querySelector(".chart-tooltip")
        const val = genreData.features[d] ?? 0
        tooltip.innerHTML = `<strong style="color:${genreData.color}">${genreData.genre}</strong><br>${d}: ${val.toFixed(3)}`
        tooltip.classList.add("visible")
        tooltip.style.left = (event.clientX + 12) + "px"
        tooltip.style.top = (event.clientY - 20) + "px"
      })
      rect.addEventListener("mouseleave", () => {
        const tooltip = document.querySelector(".chart-tooltip")
        tooltip.classList.remove("visible")
      })
    })
  })
}