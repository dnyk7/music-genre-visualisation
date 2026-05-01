import * as d3 from "d3"
import { state } from "../main"

const FEATURES = ["Danceability", "Energy", "Valence", "Acousticness", "Speechiness"]
let svg = null
let width = 550, height = 380
let margin = { top: 30, right: 30, bottom: 30, left: 110 }

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

export function renderBar() {
  const container = document.createElement("div")
  if (!svg) {
    svg = d3.select(container).append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "bar-svg")
    // draw axes once
    const { xScale, yScale, innerW, innerH } = getScales()
    const g = svg.append("g")
    g.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(d3.axisTop(xScale).ticks(5))
      .selectAll("text").attr("font-size", 9).attr("fill", "#666")
    g.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yScale))
      .selectAll("text").attr("font-size", 10).attr("fill", "#333")
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

    // Attach tooltip events using standard DOM (avoids D3 event issues)
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

// NOTE: VERSION 1 - REFACTORED WITH D3 UPDATE PATTERN
// import * as d3 from "d3"
// import { state } from "../main"

// const FEATURES = ["Danceability","Energy","Valence","Acousticness","Tempo","Speechiness"]
// let svg = null
// export function resetChart() { svg = null }
// let width = 320, height = 220
// let margin = { top: 20, right: 20, bottom: 40, left: 35 }
// let innerW, innerH, xScale, yScale

// function initScales() {
//   innerW = width - margin.left - margin.right
//   innerH = height - margin.top - margin.bottom
//   xScale = d3.scaleBand()
//     .domain(FEATURES)
//     .range([0, innerW])
//     .padding(0.2)
//   yScale = d3.scaleLinear()
//     .domain([0, 1])
//     .range([innerH, 0])
// }

// export function renderBar() {
//   if (!svg) {
//     const container = document.createElement("div")
//     svg = d3.create("svg")
//       .attr("viewBox", `0 0 ${width} ${height}`)
//       .attr("class", "bar-svg")
//     initScales()
//     drawAxes()
//     container.appendChild(svg.node())
//     // ✅ Draw bars immediately
//     updateBar()
//     return container
//   }
//   updateBar()
//   return document.querySelector(".bar-svg")?.parentNode || document.createElement("div")
// }

// function drawAxes() {
//   const g = svg.append("g").attr("class", "bar-axes")
//   // x axis
//   g.append("g")
//     .attr("transform", `translate(${margin.left},${margin.top + innerH})`)
//     .call(d3.axisBottom(xScale).tickSize(0))
//     .selectAll("text").attr("font-size", 8).attr("fill", "#aaa")
//   // y axis
//   g.append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`)
//     .call(d3.axisLeft(yScale).ticks(4))
//     .selectAll("text").attr("font-size", 8).attr("fill", "#aaa")
// }

// export function updateBar() {
//   if (!svg || !state.data) return

//   const activeFeature   = state.activeFeature
//   const activeGenresSet = state.activeGenres

//   const groups = svg.selectAll(".genre-group").data(state.data, d => d.genre)
//   groups.exit().remove()

//   const allGroups = groups.enter().append("g")
//     .attr("class", "genre-group")
//     .merge(groups)

//   allGroups.each(function(genreData) {
//     const group      = d3.select(this)
//     const bandWidth  = xScale.bandwidth()
//     const totalGenres = state.data.length
//     const barWidth   = bandWidth / totalGenres
//     const genreIndex = state.data.findIndex(g => g.genre === genreData.genre)

//     const bars = group.selectAll("rect").data(FEATURES)  // datum = feature string
//     bars.exit().remove()

//     bars.enter().append("rect")
//       .attr("y", innerH + margin.top)
//       .attr("height", 0)
//       .merge(bars)
//       .transition().duration(400)
//       .attr("x", d => margin.left + xScale(d) + genreIndex * barWidth)
//       .attr("width", barWidth - 1)
//       .attr("y", d => margin.top + yScale(genreData.features[d] ?? 0))
//       .attr("height", d => innerH - yScale(genreData.features[d] ?? 0))
//       .attr("fill", genreData.color)
//       .attr("opacity", d => {                          // ✅ d = the feature string
//         if (!activeGenresSet.has(genreData.genre)) return 0.08
//         if (activeFeature && activeFeature !== d)   return 0.08
//         return 0.85
//       })
//   })
// }



// NOTE: VERSION 0
// import * as d3 from "d3"
// import { state } from "../main"

// const FEATURES = ["Danceability","Energy","Valence","Acousticness","Tempo","Speechiness"]

// export function renderBar() {
//   const wrap = document.createElement("div")

//   const width = 320
//   const height = 220
//   const margin = { top: 20, right: 10, bottom: 40, left: 30 }

//   const svg = d3.create("svg")
//     .attr("viewBox", `0 0 ${width} ${height}`)

//   const g = svg.append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`)

//   const innerW = width - margin.left - margin.right
//   const innerH = height - margin.top - margin.bottom

//   const x = d3.scaleBand()
//     .domain(FEATURES)
//     .range([0, innerW])
//     .padding(0.2)

//   const y = d3.scaleLinear()
//     .domain([0, 1])
//     .range([innerH, 0])

//   // axes
//   g.append("g")
//     .attr("transform", `translate(0,${innerH})`)
//     .call(d3.axisBottom(x).tickSize(0))
//     .selectAll("text")
//     .attr("font-size", "8px")

//   g.append("g")
//     .call(d3.axisLeft(y).ticks(4))
//     .selectAll("text")
//     .attr("font-size", "8px")

//   const tooltip = document.querySelector(".chart-tooltip")

//   FEATURES.forEach((feat) => {
//     state.data.forEach((d, i) => {

//       const x0 = x(feat) + i * (x.bandwidth()/state.data.length)
//       const w = x.bandwidth()/state.data.length

//       const val = d.features[feat]

//       g.append("rect")
//         .attr("x", x0)
//         .attr("y", y(val))
//         .attr("width", w)
//         .attr("height", innerH - y(val))
//         .attr("fill", d.color)
//         .attr("opacity",
//           state.activeGenres.has(d.genre) &&
//           (state.activeFeature === null || state.activeFeature === feat)
//           ? 0.85 : 0.1
//         )
//         .on("mousemove", (e) => {
//           tooltip.innerHTML =
//             `<strong style="color:${d.color}">${d.genre}</strong><br>${feat}: ${val.toFixed(2)}`
//           tooltip.classList.add("visible")
//           tooltip.style.left = e.clientX + 10 + "px"
//           tooltip.style.top = e.clientY - 30 + "px"
//         })
//         .on("mouseleave", () => {
//           tooltip.classList.remove("visible")
//         })
//     })
//   })

//   wrap.appendChild(svg.node())
//   return wrap
// }