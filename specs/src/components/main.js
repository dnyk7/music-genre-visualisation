// Shared state for Step 3 components
export const state = {
  data: null,
  activeGenres: new Set(),
  activeFeature: null
}

// Placeholder - will be set by step3.js
export let updateChartsOnly = () => {}

// Set the update function
export function setUpdateChartsOnly(fn) {
  updateChartsOnly = fn
}
