import * as d3 from "d3"
import { state } from "../main"

const FEATURES = ["Danceability","Energy","Valence","Acousticness","Tempo","Speechiness"]
let svg = null          // persistent reference
export function resetChart() { svg = null }
let width = 300, height = 300
let margin = { top: 20, right: 20, bottom: 20, left: 20 }
let innerW, innerH, cx, cy, R, angles

function initGeometry() {
  innerW = width - margin.left - margin.right
  innerH = height - margin.top - margin.bottom
  cx = innerW / 2 + margin.left
  cy = innerH / 2 + margin.top
  R = Math.min(innerW, innerH) * 0.35
  angles = FEATURES.map((_, i) => Math.PI * 2 * i / FEATURES.length - Math.PI / 2)
}

function pointOnAxis(i, value) {
  const a = angles[i]
  return [cx + value * R * Math.cos(a), cy + value * R * Math.sin(a)]
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
    // ✅ Draw polygons immediately
    updateRadar()
    return container
  }
  updateRadar()
  return document.querySelector(".radar-svg")?.parentNode || document.createElement("div")
}

function drawAxesAndLabels() {
  const g = svg.append("g").attr("class", "radar-axes")
  // draw axes lines
  FEATURES.forEach((_, i) => {
    const [x2, y2] = pointOnAxis(i, 1)
    g.append("line")
      .attr("x1", cx).attr("y1", cy)
      .attr("x2", x2).attr("y2", y2)
      .attr("stroke", "#444").attr("stroke-width", 1)
  })
  // labels
  FEATURES.forEach((feat, i) => {
    const [x, y] = pointOnAxis(i, 1.1)
    g.append("text")
      .attr("x", x).attr("y", y)
      .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
      .attr("fill", "#aaa").attr("font-size", 8)
      .text(feat)
  })
}

export function updateRadar() {
  if (!svg || !state.data) return

  const activeGenresSet = state.activeGenres

  const paths = svg.selectAll(".genre-path").data(state.data, d => d.genre)
  paths.exit().remove()

  paths.enter().append("polygon")
    .attr("class", "genre-path")
    .attr("stroke-width", 1.5)
    .merge(paths)
    .each(function(d) {
      if (!d.features) return
      const points = FEATURES.map((f, i) => pointOnAxis(i, d.features[f] ?? 0)).flat()
      const isActive = activeGenresSet.has(d.genre)

      d3.select(this)
        .transition().duration(400)
        .attr("points", points.join(" "))
        .attr("fill",         d.color)
        .attr("fill-opacity",   isActive ? 0.25 : 0.02)  // ✅ fill fades
        .attr("stroke",       d.color)
        .attr("stroke-opacity", isActive ? 1    : 0.05)  // ✅ stroke fades too
        .attr("stroke-width",   isActive ? 1.5  : 0.5)
    })
  
  paths.enter().append("polygon")
  .on("mousemove", function(event, d) {
    const tooltip = document.querySelector(".chart-tooltip")
    // You need to know which feature is under mouse? Hard with radar.
    // Simpler: show genre name and all features.
    let html = `<strong>${d.genre}</strong><br>`
    FEATURES.forEach(f => {
      html += `${f}: ${(d.features[f] || 0).toFixed(2)}<br>`
    })
    tooltip.innerHTML = html
    tooltip.classList.add("visible")
    tooltip.style.left = (event.clientX + 12) + "px"
    tooltip.style.top = (event.clientY - 20) + "px"
  })
  .on("mouseleave", () => {
    document.querySelector(".chart-tooltip").classList.remove("visible")
  })
}

// VERSION 0
// import { state } from "../main"

// const FEATURES = ["Danceability","Energy","Valence","Acousticness","Tempo","Speechiness"]

// export function renderRadar() {
//   const wrap = document.createElement("div")

//   const W = 260, H = 260
//   const cx = W/2, cy = H/2, R = W*0.33
//   const N = FEATURES.length

//   const angles = FEATURES.map((_, i) =>
//     Math.PI*2*i/N - Math.PI/2)

//   const svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
//   svg.setAttribute("viewBox", `0 0 ${W} ${H}`)

//   function pt(i, v) {
//     return [
//       cx + v*R*Math.cos(angles[i]),
//       cy + v*R*Math.sin(angles[i])
//     ]
//   }
    
//   // AXES
//   FEATURES.forEach((feat, i) => {
//     const a = angles[i]

//     const line = document.createElementNS(svg.namespaceURI,"line")
//     line.setAttribute("x1", cx)
//     line.setAttribute("y1", cy)
//     line.setAttribute("x2", cx + R*Math.cos(a))
//     line.setAttribute("y2", cy + R*Math.sin(a))
//     line.setAttribute("stroke", "#333")
//     svg.appendChild(line)

//     const text = document.createElementNS(svg.namespaceURI,"text")
//     text.setAttribute("x", cx + (R+14)*Math.cos(a))
//     text.setAttribute("y", cy + (R+14)*Math.sin(a))
//     text.setAttribute("fill", "#888")
//     text.setAttribute("font-size", "9")
//     text.setAttribute("text-anchor", "middle")
//     text.textContent = feat
//     svg.appendChild(text)
//   })

//   // GENRE POLYGONS
//   state.data.forEach(d => {
//     const isOn = state.activeGenres.has(d.genre)

//     const poly = document.createElementNS(svg.namespaceURI,"polygon")

//     const points = FEATURES.map((f,i) => {
//       const val = d.features[f] ?? 0
//       const [x,y] = pt(i,val)
//       return `${x},${y}`
//     }).join(" ")

//     poly.setAttribute("points", points)
//     poly.setAttribute("fill", d.color)
//     poly.setAttribute("fill-opacity", isOn ? "0.15" : "0.02")
//     poly.setAttribute("stroke", d.color)

//     svg.appendChild(poly)
//   })

//   wrap.appendChild(svg)
//   return wrap
// }