import { state, updateChartsOnly } from "../main"

export function renderLegend() {
  const container = document.createElement("div")
  container.className = "genre-legend-container"

  const label = document.createElement("div")
  label.className = "legend-label"
  label.textContent = "TOGGLE GENRES →"

  const wrap = document.createElement("div")
  wrap.className = "genre-legend"
  
  state.data.forEach(d => {
    const item = document.createElement("div")
    item.className = "legend-item"
    item.dataset.genre = d.genre
    item.style.borderColor = d.color
    if (state.activeGenres.has(d.genre)) item.classList.add("active")

    const dot = document.createElement("div")
    dot.className = "legend-dot"
    dot.style.background = d.color

    const genreLabel = document.createElement("span")
    genreLabel.textContent = d.genre.toUpperCase()

    item.append(dot, genreLabel)

    // --- CLICK handler (existing) ---
    item.addEventListener("click", () => {
      if (state.activeGenres.has(d.genre)) {
        state.activeGenres.delete(d.genre)
        item.classList.remove("active")
      } else {
        state.activeGenres.add(d.genre)
        item.classList.add("active")
      }
      updateChartsOnly()
    })

    // --- NEW: Feature highlight on hover ---
    // Find the feature with the highest value for this genre
    const features = d.features;
    let topFeature = Object.keys(features).reduce((a, b) => features[a] > features[b] ? a : b);
    let topValue = features[topFeature];

    item.addEventListener("mouseenter", () => {
      const highlightDiv = document.getElementById("feature-highlight");
      if (highlightDiv) {
        highlightDiv.innerHTML = `✨ <strong>${d.genre}</strong>’s standout feature: ${topFeature} (${topValue.toFixed(2)}) ✨`;
      }
    });

    item.addEventListener("mouseleave", () => {
      const highlightDiv = document.getElementById("feature-highlight");
      if (highlightDiv) {
        highlightDiv.innerHTML = `✨ Hover over a genre →`;
      }
    });

    wrap.appendChild(item)
  })

  container.appendChild(label)
  container.appendChild(wrap)
  return container
}

// import { state, updateChartsOnly } from "../main"

// export function renderLegend() {
//   const container = document.createElement("div")
//   container.className = "genre-legend-container"

//   const label = document.createElement("div")
//   label.className = "legend-label"
//   label.textContent = "TOGGLE GENRES →"

//   const wrap = document.createElement("div")
//   wrap.className = "genre-legend"
  
//   state.data.forEach(d => {
//     const item = document.createElement("div")
//     item.className = "legend-item"
//     item.dataset.genre = d.genre
//     item.style.borderColor = d.color
//     if (state.activeGenres.has(d.genre)) item.classList.add("active")

//     const dot = document.createElement("div")
//     dot.className = "legend-dot"
//     dot.style.background = d.color

//     const genreLabel = document.createElement("span")   // renamed to avoid conflict
//     genreLabel.textContent = d.genre.toUpperCase()

//     item.append(dot, genreLabel)

//     item.addEventListener("click", () => {
//       if (state.activeGenres.has(d.genre)) {
//         state.activeGenres.delete(d.genre)
//         item.classList.remove("active")
//       } else {
//         state.activeGenres.add(d.genre)
//         item.classList.add("active")
//       }
//       updateChartsOnly()
//     })

//     wrap.appendChild(item)
//   })

//   container.appendChild(label)
//   container.appendChild(wrap)
//   return container
// }

// NOTE: VERSION 0
// import { state, renderAll } from "../main"

// export function renderLegend() {
//   const wrap = document.createElement("div")
//   wrap.className = "genre-legend"

//   state.data.forEach(d => {
//     const item = document.createElement("div")
//     item.className = "legend-item active"
//     item.style.borderColor = d.color

//     const dot = document.createElement("div")
//     dot.className = "legend-dot"
//     dot.style.background = d.color

//     const label = document.createElement("span")
//     label.textContent = d.genre.toUpperCase()

//     item.append(dot, label)

//     item.addEventListener("click", () => {
//       if (state.activeGenres.has(d.genre)) {
//         state.activeGenres.delete(d.genre)
//       } else {
//         state.activeGenres.add(d.genre)
//       }

//       renderAll() // 🔥 re-render everything
//     })

//     wrap.appendChild(item)
//   })

//   return wrap
// }