import { state, updateChartsOnly } from "./main.js"

const FEATURES = ["Danceability","Energy","Valence","Acousticness","Speechiness"]

export function renderFilters() {
  const wrap = document.createElement("div")
  wrap.className = "filters-wrap"
  wrap.id = "filters-container"

  const label = document.createElement("div")
  label.className = "filters-label"
  label.textContent = "Highlight a feature →"
  wrap.appendChild(label)

  const buttons = document.createElement("div")
  buttons.className = "filters-buttons"

  FEATURES.forEach(feat => {
    const btn = document.createElement("button")
    btn.textContent = feat
    btn.className = "filter-btn"
    if (state.activeFeature === feat) btn.classList.add("active")

    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"))
      if (state.activeFeature === feat) {
        state.activeFeature = null
      } else {
        state.activeFeature = feat
        btn.classList.add("active")
      }
      updateChartsOnly()
    })

    buttons.appendChild(btn)
  })

  wrap.appendChild(buttons)
  return wrap
}
