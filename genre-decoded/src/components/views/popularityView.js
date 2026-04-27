// Step 1: What is popularity?
export function renderPopularityView() {
  const container = document.createElement("div")
  container.className = "view-container"

  const text = document.createElement("div")
  text.className = "view-text"
  text.innerHTML = `
    <h3>📈 Popularity by Genre</h3>
    <p>Spotify popularity (0–100) measures how often songs are played.  
    Some genres dominate the charts — but the gap is smaller than you'd expect.</p>
  `

  const chart = document.createElement("div")
  chart.className = "view-chart"
  chart.innerHTML = `
    <div class="placeholder-chart">[ Popularity Bar Chart Placeholder ]</div>
  `

  container.append(text, chart)
  return container
}


// NOTE: VERSION 0
// export function renderPopularityView() {
//   const container = document.createElement("div")
//   container.className = "view-container"

//   const text = document.createElement("div")
//   text.className = "view-text"
//   text.innerHTML = `
//     <h3>What is popularity?</h3>
//     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
//     Popularity reflects how often songs are played.</p>
//   `

//   const chart = document.createElement("div")
//   chart.className = "view-chart"
//   chart.innerHTML = `
//     <div class="placeholder-chart">[ Popularity Chart Placeholder ]</div>
//   `

//   container.append(text, chart)

//   // Alternative: use innerHTML for simpler views
//   // container.innerHTML = `
//   //   <div class="view-text">
//   //     <h3>What is popularity?</h3>
//   //     <p>
//   //       Lorem ipsum dolor sit amet. Some genres dominate charts —
//   //       but is that the full story?
//   //     </p>
//   //   </div>

//   //   <div class="view-chart">
//   //     <div class="placeholder-chart">Popularity Chart</div>
//   //   </div>
//   // `
//   return container
// }

// export function renderPopularityView() {
//   const div = document.createElement("div")
//   div.innerHTML = "<h3>Popularity Chart (Step 1)</h3>"
//   return div
// }