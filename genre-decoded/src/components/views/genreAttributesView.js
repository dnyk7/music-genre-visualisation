// Step 3: Genre Attributes

// NOTE: VERSION 2
import { renderRadar } from "../radarChart"
import { renderBar } from "../barChart"

export function renderGenreAttributesView() {
  const container = document.createElement("div")
  container.className = "view-container"

  const text = document.createElement("div")
  text.className = "view-text"
  text.innerHTML = `
    <h3>🎨 What makes a genre?</h3>
    <p>
      Genres have distinct audio «personalities» — but the differences are smaller than expected.  
      Use the legend to toggle genres, and filters to highlight a feature.
    </p>
  `

  const grid = document.createElement("div")
  grid.className = "view-chart-grid"

  grid.appendChild(renderRadar())  // real radar
  grid.appendChild(renderBar())    // real bar

  container.append(text, grid)
  return container
}

export function updateAttributesView() {
  // This will be called when morphing
  if (typeof updateRadar === 'function') updateRadar()
  if (typeof updateBar === 'function') updateBar()
}

// // NOTE: VERSION 2
// import { renderRadar, updateRadar } from "../radarChart"
// import { renderBar, updateBar } from "../barChart"

// let radarContainer = null
// let barContainer = null

// export function renderGenreAttributesView() {
//   const container = document.createElement("div")
//   container.className = "view-container"
//   container.id = "attributes-view"

//   const text = document.createElement("div")
//   text.className = "view-text"
//   text.innerHTML = `<h3>What makes a genre?</h3><p>Genres have distinct personalities — but the differences are smaller than expected.</p>`

//   const grid = document.createElement("div")
//   grid.className = "view-chart-grid"

//   radarContainer = renderRadar()
//   barContainer = renderBar()
//   grid.appendChild(radarContainer)
//   grid.appendChild(barContainer)

//   container.append(text, grid)
//   return container
// }

// export function updateAttributesView() {
//   if (radarContainer && barContainer) {
//     updateRadar()
//     updateBar()
//   }
// }


// // VERSION 1
// import { renderRadar } from "../radarChart"
// import { renderBar } from "../barChart"

// export function renderGenreAttributesView() {
//   const container = document.createElement("div")
//   container.className = "view-container"

//   const text = document.createElement("div")
//   text.className = "view-text"
//   text.innerHTML = `
//     <h3>What makes a genre?</h3>
//     <p>
//       Genres have distinct personalities —
//       but the differences are smaller than expected.
//     </p>
//   `

//   const grid = document.createElement("div")
//   grid.className = "view-chart-grid"

//   grid.appendChild(renderRadar())
//   grid.appendChild(renderBar())

//   container.append(text, grid)
//   return container
// }


// NOTE: VERSION 0
// import { renderRadar } from "../radarChart"
// import { renderBar } from "../barChart"

// export function renderGenreAttributesView() {
//   const container = document.createElement("div")
//   container.className = "view-container"

//   const text = document.createElement("div")
//   text.className = "view-text"
//   text.innerHTML = `
//     <h3>Genre Attributes</h3>
//     <p>Lorem ipsum dolor sit amet — genres have personalities.</p>
//   `

//   const charts = document.createElement("div")
//   charts.className = "view-chart-grid"

//   charts.appendChild(renderRadar())
//   charts.appendChild(renderBar())

//   container.append(text, charts)
//   return container
// }

// NOTE: VERSION 0
// import { renderRadar } from "../radarChart"
// import { renderBar } from "../barChart"

// export function renderGenreAttributesView() {
//   const container = document.createElement("div")
//   container.style.display = "contents"

//   container.appendChild(renderRadar())
//   container.appendChild(renderBar())

//   return container
// }