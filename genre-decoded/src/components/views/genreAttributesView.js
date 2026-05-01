// Step 3: Genre Attributes
import { renderRadar } from "../radarChart"
import { renderBar } from "../barChart"

export function renderGenreAttributesView() {
  const container = document.createElement("div")
  container.className = "view-container"

  const text = document.createElement("div")
  text.className = "view-text"
  text.innerHTML = `
    <h3>🎨 What makes a genre?</h3>
    <p>Genres have distinct audio personalities — but differences are subtle.</p>
  `

  const grid = document.createElement("div")
  grid.className = "view-chart-grid"
  grid.appendChild(renderRadar())
  grid.appendChild(renderBar())

  const annotation = document.createElement("div")
  annotation.className = "takeaway"
  annotation.innerHTML = `📐 <strong>Note:</strong> All audio features are normalised between 0 and 1 for fair comparison across genres.`

  container.append(text, grid, annotation)
  return container
}