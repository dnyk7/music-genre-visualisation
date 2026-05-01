import { state, updateChartsOnly } from "../main"

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
      // Toggle active class directly on the button — no DOM wipe
      wrap.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"))
      if (state.activeFeature === feat) {
        state.activeFeature = null
      } else {
        state.activeFeature = feat
        btn.classList.add("active")
      }
      updateChartsOnly() // ✅ no DOM wipe, just redraw
    })

    buttons.appendChild(btn)
  })

  wrap.appendChild(buttons)
  return wrap
}

export function updateFiltersActive() {
  const btns = document.querySelectorAll("#filters-container .filter-btn")
  btns.forEach(btn => {
    const feat = btn.textContent
    if (state.activeFeature === feat) {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })
}

// NOTE: VERSION 0
// import { state, updateChartsOnly, renderAll } from "../main"

// const FEATURES = ["Danceability","Energy","Valence","Acousticness","Tempo","Speechiness"]

// export function renderFilters() {
//   const wrap = document.createElement("div")
//   wrap.className = "filters-wrap"
//   wrap.id = "filters-container"

//   FEATURES.forEach(feat => {
//     const btn = document.createElement("button")
//     btn.textContent = feat
//     btn.className = "filter-btn"
//     if (state.activeFeature === feat) btn.classList.add("active")

//     btn.addEventListener("click", () => {
//       state.activeFeature = (state.activeFeature === feat) ? null : feat
//       if (state.view === "attributes") {
//         updateChartsOnly()
//         updateFiltersActive()
//       } else {
//         renderAll()
//       }
//     })
//     wrap.appendChild(btn)
//   })
//   return wrap
// }

// export function updateFiltersActive() {
//   const btns = document.querySelectorAll("#filters-container .filter-btn")
//   btns.forEach(btn => {
//     const feat = btn.textContent
//     if (state.activeFeature === feat) {
//       btn.classList.add("active")
//     } else {
//       btn.classList.remove("active")
//     }
//   })
// }