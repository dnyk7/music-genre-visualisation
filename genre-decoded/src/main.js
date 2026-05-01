import "./styles.css"
import { initScroll } from "./scrolly/scrollamaSetup"
import { renderView } from "./components/viewRouter"
import { renderLegend } from "./components/legend"
import { renderFilters } from "./components/filters"
import { resetChart as resetRadar, updateRadar } from "./components/radarChart"
import { resetChart as resetBar, updateBar } from "./components/barChart"
import * as vegaEmbed from 'vega-embed'
import { spec1 } from './specs/step1.js'
import { spec2c } from './specs/step2.js'   // unstacked + Gaussian curves
import { spec4 } from './specs/step4.js'

export const state = {
  data: null,
  activeGenres: new Set(),
  activeFeature: null,
  view: "popularity",
  yearFilter: null,
  useSingleGenre: false,
  previousView: null
}

let activeVegaView = null      // to resize later
let currentVegaViewName = null // avoid re-embedding the same spec

async function embedVegaChart(containerId, spec) {
  const container = document.getElementById(containerId)
  if (!container) return
  try {
    // Clear any previous Vega canvas/svg inside this container
    container.innerHTML = ''
    const result = await vegaEmbed.default(container, spec, {
      actions: false,
      renderer: 'svg'
    })
    activeVegaView = result.view
    setTimeout(() => activeVegaView?.resize(), 100)
  } catch (err) {
    console.error(`Failed to embed ${containerId}`, err)
  }
}

async function init() {
  const res = await fetch("/data/genre_profiles.json")
  const data = await res.json()
  state.data = data
  state.activeGenres = new Set(data.map(d => d.genre))
  renderAll()
  initScroll()
}

export function renderAll() {
  const panel = document.getElementById("chart-panel")
  const viewChanged = state.view !== state.previousView

  if (!viewChanged && state.previousView !== null) {
    // Same view – just update D3 charts if needed, or resize Vega
    if (state.view === "attributes") {
      updateRadar()
      updateBar()
    } else if (activeVegaView) {
      activeVegaView.resize()
    }
    return
  }

  panel.classList.add("fade-out")
  setTimeout(() => {
    // Reset D3 chart references (they will be recreated if needed)
    resetRadar()
    resetBar()
    panel.innerHTML = ""

    // For attributes view: legend + filters + charts
    if (state.view === "attributes") {
      panel.appendChild(renderView(state.view))     // charts first
      panel.appendChild(renderLegend())
      panel.appendChild(renderFilters())
    } else {
      // For all other views, just append the view container (which contains text + a div for Vega)
      panel.appendChild(renderView(state.view))
    }

    panel.classList.remove("fade-out")
    panel.classList.add("fade-in")
    setTimeout(() => panel.classList.remove("fade-in"), 300)

    // Now embed or resize Vega charts depending on the new view
    if (state.view === "popularity") {
      if (currentVegaViewName !== "popularity") {
        embedVegaChart("pop-chart", spec1)
        currentVegaViewName = "popularity"
      } else if (activeVegaView) {
        activeVegaView.resize()
      }
    } else if (state.view === "multi") {
      if (currentVegaViewName !== "multi") {
        embedVegaChart("multi-chart", spec2c)
        currentVegaViewName = "multi"
      } else if (activeVegaView) {
        activeVegaView.resize()
      }
    } else if (state.view === "time") {
      if (currentVegaViewName !== "time") {
        embedVegaChart("time-chart", spec4)
        currentVegaViewName = "time"
      } else if (activeVegaView) {
        activeVegaView.resize()
      }
    } else {
      // for attributes or any other view, Vega is not used
      currentVegaViewName = null
      activeVegaView = null
    }

    state.previousView = state.view
  }, 200)
}

export function updateChartsOnly() {
  if (state.view === "attributes") {
    updateRadar()
    updateBar()
  }
}

init()

// Optional: resize Vega on window resize (improves responsiveness)
window.addEventListener("resize", () => {
  if (activeVegaView) activeVegaView.resize()
})

// NOTE: VERSION 2 (after adding updateChartsOnly() and separating chart reset vs update)
// import "./styles.css"
// import { initScroll } from "./scrolly/scrollamaSetup"
// import { renderView } from "./components/viewRouter"
// import { renderLegend } from "./components/legend"
// import { renderFilters } from "./components/filters"
// import * as vegaEmbed from 'vega-embed'
// import { spec1 } from './specs/step1.js'
// import { spec2c } from './specs/step2.js'   // using unstacked + Gaussian version
// import { spec4 } from './specs/step4.js'
// import { resetChart as resetRadar, updateRadar } from "./components/radarChart"
// import { resetChart as resetBar, updateBar }     from "./components/barChart"

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
//   initScroll()
// }

// // Called when view CHANGES (scroll step) — full DOM rebuild
// export function renderAll() {
//   const panel = document.getElementById("chart-panel")
//   const viewChanged = state.view !== state.previousView

//   if (!viewChanged && state.previousView !== null) {
//     // Same view — just update chart data, don't touch the DOM
//     updateChartsOnly()
//     return
//   }

//   panel.classList.add("fade-out")
//   setTimeout(() => {
//     resetRadar()
//     resetBar()
//     panel.innerHTML = ""

//     if (state.view === "attributes") {
//       panel.appendChild(renderLegend())
//       panel.appendChild(renderFilters())
//     }

//     panel.appendChild(renderView(state.view))
//     panel.classList.remove("fade-out")
//     panel.classList.add("fade-in")
//     setTimeout(() => panel.classList.remove("fade-in"), 300)

//     state.previousView = state.view
//   }, 200)
// }

// // Called by legend/filter clicks — only re-draws chart visuals
// export function updateChartsOnly() {
//   if (state.view === "attributes") {
//     updateRadar()
//     updateBar()
//   }
//   // add other views here as you build them out
// }

// init()

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