import scrollama from "scrollama"
import { stepsConfig } from "./stepConfig"
import { state, renderAll } from "../main"

export function initScroll() {
  const scroller = scrollama()

  scroller
    .setup({
      step: ".step", // it has to match the HTML structure in index.html
      offset: 0.5
    })
    .onStepEnter(({ element, index }) => {

      // Highlight text
      document.querySelectorAll(".step")
        .forEach(el => el.classList.remove("is-active"))

      element.classList.add("is-active")

      // Apply config
      const config = stepsConfig[index]
      applyStepConfig(config)
    })

  window.addEventListener("resize", scroller.resize)
}

function applyStepConfig(config) {

  if (!state.data) return   // wait for data

  if (config.activeGenres === "all") {
    state.activeGenres = new Set(state.data.map(d => d.genre))
  } else {
    state.activeGenres = new Set(config.activeGenres)
  }

  state.activeFeature = config.activeFeature
  state.view = config.view
  state.useSingleGenre = config.useSingleGenre ?? false
  state.yearFilter = config.yearFilter ?? null

  renderAll()
}

// import scrollama from "scrollama"
// import { state, renderAll } from "../main"
// import { stepsConfig } from "./stepConfig"

// export function initScroll() {
//   const steps = document.querySelectorAll(".step")

//   const scroller = scrollama()

//   scroller
//     .setup({
//       step: ".step",
//       offset: 0.5
//     })
//     .onStepEnter(({ element, index }) => {

//       // UI highlight
//       steps.forEach(s => s.classList.remove("is-active"))
//       element.classList.add("is-active")

//       // 🔥 APPLY CONFIG
//       applyStepConfig(stepsConfig[index])
//     })

//   window.addEventListener("resize", scroller.resize)
// }

// function applyStepConfig(config) {

//   // Genres
//   if (config.activeGenres === "all") {
//     state.activeGenres = new Set(state.data.map(d => d.genre))
//   } else {
//     state.activeGenres = new Set(config.activeGenres)
//   }

//   // Feature
//   state.activeFeature = config.activeFeature

//   // View (THIS is key for your question)
//   state.view = config.view

//   renderAll()
// }