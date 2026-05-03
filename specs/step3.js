/**
 * Step 3: Audio Features by Genre
 * Orchestrates the radar chart, bar chart, legend, and filters
 * Extracted from inline code in index.html
 */

import { state, setUpdateChartsOnly } from "./src/components/main.js"
import { renderRadar, updateRadar } from "./src/components/radarChart.js"
import { renderBar, updateBar } from "./src/components/barChart.js"
import { renderLegend } from "./src/components/legend.js"
import { renderFilters } from "./src/components/filters.js"

const STEP3_RADAR_FEATURES = ["Danceability", "Speechiness", "Valence", "Acousticness", "Energy"]
const STEP3_BAR_FEATURES = ["Danceability", "Energy", "Valence", "Acousticness", "Speechiness"]

/**
 * Load genre profile data from JSON
 */
async function loadStep3Data() {
  const urls = [
    './specs/src/data/genre_profiles.json',   // relative to HTML root
    './src/data/genre_profiles.json'          // fallback if you move later
  ]
  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (res.ok) return await res.json()
    } catch (_) {}
  }
  return []
}

/**
 * Create tooltip element if it doesn't exist
 */
function ensureStep3Tooltip() {
  if (!document.querySelector('.chart-tooltip')) {
    const tooltip = document.createElement('div')
    tooltip.className = 'chart-tooltip'
    document.body.appendChild(tooltip)
  }
}

/**
 * Render the full Step 3 layout
 */
function renderStep3Layout() {
  const chart3 = document.getElementById('chart3')
  if (!chart3) return null
  chart3.innerHTML = ''

  const container = document.createElement('div')
  container.className = 'view-container'

  const insight = document.createElement('div')
  insight.className = 'key-insight'
  insight.innerHTML = `<strong>Key insights:</strong> Surprisingly, <span style="color: #F77F00;">Rap</span> is the most danceable. <span style="color: #F72585;">Latin</span> is the second most danceable but highest valence. Then, <span style="color: #1DB954;">EDM</span> has the least acousticness but most energy.`

  const annotation = document.createElement('div')
  annotation.className = 'takeaway'
  annotation.textContent = '📐 All audio features are normalised between 0 and 1.'

  const grid = document.createElement('div')
  grid.className = 'view-chart-grid'

  const radarHost = document.createElement('div')
  radarHost.id = 'step3-radar-host'
  const barHost = document.createElement('div')
  barHost.id = 'step3-bar-host'
  grid.appendChild(radarHost)
  grid.appendChild(barHost)

  const legendSlot = document.createElement('div')
  legendSlot.id = 'attributes-legend-slot'

  const filtersSlot = document.createElement('div')
  filtersSlot.id = 'attributes-filters-slot'

  const featureHighlight = document.createElement('div')
  featureHighlight.id = 'feature-highlight'
  featureHighlight.className = 'feature-highlight'
  featureHighlight.textContent = '✨ Hover over a genre →'

  container.append(insight, annotation, grid, legendSlot, filtersSlot, featureHighlight)
  chart3.appendChild(container)
  
  return { radarHost, barHost, legendSlot, filtersSlot }
}

/**
 * Initialize radar chart and render it
 */
function initStep3Radar(hostEl) {
  if (!hostEl) return
  const radarContainer = renderRadar()
  hostEl.appendChild(radarContainer)
}

/**
 * Initialize bar chart and render it
 */
function initStep3Bar(hostEl) {
  if (!hostEl) return
  const barContainer = renderBar()
  hostEl.appendChild(barContainer)
}

/**
 * Update both charts and apply filters
 */
function updateChartsCallback() {
  updateRadar()
  updateBar()
}

/**
 * Initialize Step 3
 */
export async function initStep3() {
  ensureStep3Tooltip()
  
  // Load data
  state.data = await loadStep3Data()
  if (!state.data || state.data.length === 0) {
    console.warn('Step 3: No genre data loaded')
    return
  }

  // Initialize all active genres by default
  state.data.forEach(d => {
    state.activeGenres.add(d.genre)
  })

  // Set the update callback
  setUpdateChartsOnly(updateChartsCallback)

  // Render layout
  const slots = renderStep3Layout()
  if (!slots) return

  // Initialize charts
  initStep3Radar(slots.radarHost)
  initStep3Bar(slots.barHost)

  // Render legend and filters
  slots.legendSlot.appendChild(renderLegend())
  slots.filtersSlot.appendChild(renderFilters())

  // Initial render
  updateChartsCallback()
}
