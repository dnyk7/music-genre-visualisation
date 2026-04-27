import "./styles.css"
import { initScroll } from "./scrolly/scrollamaSetup"
import { renderView } from "./components/viewRouter"
import { renderLegend } from "./components/legend"
import { renderFilters } from "./components/filters"
import { resetChart as resetRadar, updateRadar } from "./components/radarChart"
import { resetChart as resetBar, updateBar }     from "./components/barChart"

export const state = {
  data: null,
  activeGenres: new Set(),
  activeFeature: null,
  view: "popularity",
  yearFilter: null,
  useSingleGenre: false,
  previousView: null
}

async function init() {
  const res = await fetch("/data/genre_profiles.json")
  const data = await res.json()
  state.data = data
  state.activeGenres = new Set(data.map(d => d.genre))
  renderAll()
  initScroll()
}

// Called when view CHANGES (scroll step) — full DOM rebuild
export function renderAll() {
  const panel = document.getElementById("chart-panel")
  const viewChanged = state.view !== state.previousView

  if (!viewChanged && state.previousView !== null) {
    // Same view — just update chart data, don't touch the DOM
    updateChartsOnly()
    return
  }

  panel.classList.add("fade-out")
  setTimeout(() => {
    resetRadar()
    resetBar()
    panel.innerHTML = ""

    if (state.view === "attributes") {
      panel.appendChild(renderLegend())
      panel.appendChild(renderFilters())
    }

    panel.appendChild(renderView(state.view))
    panel.classList.remove("fade-out")
    panel.classList.add("fade-in")
    setTimeout(() => panel.classList.remove("fade-in"), 300)

    state.previousView = state.view
  }, 200)
}

// Called by legend/filter clicks — only re-draws chart visuals
export function updateChartsOnly() {
  if (state.view === "attributes") {
    updateRadar()
    updateBar()
  }
  // add other views here as you build them out
}

init()

// NOTE: VERSION 1
// import "./styles.css"
// import { initScroll } from "./scrolly/scrollamaSetup"
// import { renderView } from "./components/viewRouter"
// import { renderLegend } from "./components/legend"
// import { renderFilters } from "./components/filters"
// import { resetChart as resetRadar } from "./components/radarChart"
// import { resetChart as resetBar }   from "./components/barChart"

// export const state = {
//   data: null,
//   activeGenres: new Set(),
//   activeFeature: null,
//   view: "popularity",
//   yearFilter: null,
//   useSingleGenre: false,
//   previousView: null
// }

// async function init() {
//   const res = await fetch("/data/genre_profiles.json")
//   const data = await res.json()
//   state.data = data
//   state.activeGenres = new Set(data.map(d => d.genre))
//   renderAll()
  
//   // If the current view is already "attributes", manually redraw charts
//   if (state.view === "attributes") {
//     // Re-render attributes view to pick up data
//     renderAll()
//   }
//   initScroll()
// }

// export function renderAll() {
//   const panel = document.getElementById("chart-panel")
//   const viewChanged = (state.view !== state.previousView)

//   // Simple fade replace for all steps (including attributes)
//   panel.classList.add("fade-out")
//   setTimeout(() => {
//     resetBar()
//     resetRadar()
//     panel.innerHTML = ""

//     if (state.view === "attributes") {
//       panel.appendChild(renderLegend())
//       panel.appendChild(renderFilters())
//     }

//     panel.appendChild(renderView(state.view))
//     panel.classList.remove("fade-out")
//     panel.classList.add("fade-in")
//     setTimeout(() => panel.classList.remove("fade-in"), 300)
//   }, 200)

//   state.previousView = state.view
// }

// init()

// VERSION 0 (before scrolly)
// import "./styles.css"
// import { initScroll } from "./scrolly/scrollamaSetup"
// import { renderView } from "./components/viewRouter"
// import { renderLegend } from "./components/legend"
// import { renderFilters } from "./components/filters"

// export const state = {
//   data: null,
//   activeGenres: new Set(),
//   activeFeature: null,
//   view: "popularity",
//   yearFilter: null,
//   useSingleGenre: false
// }

// async function init() {
//   const res = await fetch("/data/genre_profiles.json")
//   const data = await res.json()

//   state.data = data
//   state.activeGenres = new Set(data.map(d => d.genre))

//   renderAll()
//   initScroll()
// }

// // export function renderAll() {
// //   const panel = document.getElementById("chart-panel")

// //   panel.style.opacity = 0

// //   setTimeout(() => {
// //     panel.innerHTML = ""

// //     // ONLY show legend + filters for attributes step
// //     if (state.view === "attributes") {
// //       panel.appendChild(renderLegend())
// //       panel.appendChild(renderFilters())
// //     }

// //     // Main view (this replaces your old if/else mess)
// //     panel.appendChild(renderView(state.view))

// //     panel.style.opacity = 1
// //   }, 200)
// // }

// // Replace the middle of renderAll() with this simpler version
// export function renderAll() {
//   const panel = document.getElementById("chart-panel")
//   const viewChanged = (state.view !== state.previousView)

//   // If same view and attributes – we could morph, but skip for now
//   // Just rebuild always (simpler, no missing functions)
  
//   panel.classList.add("fade-out")
//   setTimeout(() => {
//     panel.innerHTML = ""

//     if (state.view === "attributes") {
//       panel.appendChild(renderLegend())
//       panel.appendChild(renderFilters())
//     }

//     panel.appendChild(renderView(state.view))
//     panel.classList.remove("fade-out")
//     panel.classList.add("fade-in")
//     setTimeout(() => panel.classList.remove("fade-in"), 300)
//   }, 200)

//   state.previousView = state.view
// }

// init()

// import "./styles.css"
// import { initScroll } from "./scrolly/scrollamaSetup"
// import { renderRadar } from "./components/radarChart"
// import { renderBar } from "./components/barChart"
// import { renderLegend } from "./components/legend"
// import { renderFilters } from "./components/filters"

// export const state = {
//   data: null,
//   activeGenres: new Set(),
//   activeFeature: null,

//   // 🔥 NEW
//   view: "intro",
//   yearFilter: null,
//   useSingleGenre: false
// }

// async function init() {
//   const res = await fetch("/data/genre_profiles.json")
//   const data = await res.json()

//   state.data = data
//   state.activeGenres = new Set(data.map(d => d.genre))

//   renderAll()
//   initScroll()
// }

// export function renderAll() {
//   const panel = document.getElementById("chart-panel")
//   panel.innerHTML = ""

//   // Legend + Filters always present
//   panel.appendChild(renderLegend())
//   panel.appendChild(renderFilters())

//   // 🔥 CONDITIONAL LAYOUT
//   if (state.view === "Radar_and_Bar") {
//     panel.appendChild(renderRadar())
//     panel.appendChild(renderBar())
//   }

//   if (state.view === "radar") {
//     const full = renderRadar()
//     full.style.gridColumn = "1 / -1"
//     panel.appendChild(full)
//   }

//   if (state.view === "bar") {
//     const full = renderBar()
//     full.style.gridColumn = "1 / -1"
//     panel.appendChild(full)
//   }

//   if (state.view === "songs") {
//     panel.appendChild(renderSongCards())
//   }
// }

// init()