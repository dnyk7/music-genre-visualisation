import { state, updateChartsOnly } from "../main"

export function renderLegend() {
  const wrap = document.createElement("div")
  wrap.className = "genre-legend"
  wrap.id = "genre-legend-container"

  state.data.forEach(d => {
    const item = document.createElement("div")
    item.className = "legend-item"
    item.dataset.genre = d.genre
    item.style.borderColor = d.color
    if (state.activeGenres.has(d.genre)) item.classList.add("active")

    const dot = document.createElement("div")
    dot.className = "legend-dot"
    dot.style.background = d.color

    const label = document.createElement("span")
    label.textContent = d.genre.toUpperCase()

    item.append(dot, label)

    item.addEventListener("click", () => {
      if (state.activeGenres.has(d.genre)) {
        state.activeGenres.delete(d.genre)
        item.classList.remove("active")
      } else {
        state.activeGenres.add(d.genre)
        item.classList.add("active")
      }
      updateChartsOnly() // ✅ no DOM wipe, just redraw
    })

    wrap.appendChild(item)
  })
  return wrap
}

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