// Step 3: Genre Attributes

import { renderRadar } from "../radarChart"
import { renderBar } from "../barChart"

export function renderGenreAttributesView() {
  const container = document.createElement("div")
  container.className = "view-container"

  // 🔍 Key insight (plain text, no background)
  const insight = document.createElement("div")
  insight.className = "key-insight"
  insight.innerHTML = `<strong>Key insights:</strong> 
                                  EDM and Latin are the most danceable and energetic.
                                  R&B and Pop feature higher valence. 
                                  Rock is the least danceable, but most acoustic.`

  // Normalisation note
  const annotation = document.createElement("div")
  annotation.className = "takeaway"
  annotation.innerHTML = `📐 All audio features are normalised between 0 and 1.`

  // Charts grid
  const grid = document.createElement("div")
  grid.className = "view-chart-grid"
  grid.appendChild(renderRadar())
  grid.appendChild(renderBar())

  // Placeholders for legend and filters
  const legendSlot = document.createElement("div")
  legendSlot.id = "attributes-legend-slot"
  const filtersSlot = document.createElement("div")
  filtersSlot.id = "attributes-filters-slot"

  // Feature highlight area (below filters)
  const featureHighlight = document.createElement("div")
  featureHighlight.id = "feature-highlight"
  featureHighlight.className = "feature-highlight"
  featureHighlight.textContent = "✨ Hover over a genre →"

  // Decide the order: insight → charts → annotation → legend → filters → highlight
  container.append(insight, annotation, grid, legendSlot, filtersSlot, featureHighlight)
  return container
}