// Step 1: Popularity histogram (Vega-Lite)
export function renderPopularityView() {
  const container = document.createElement("div")
  container.className = "view-container"
  container.id = "popularity-view-container"

  const text = document.createElement("div")
  text.className = "view-text"
  text.innerHTML = `
    <h3>📈 Track Popularity Distribution</h3>
    <p>Spotify popularity (0–100) measures how often a track is played recently.  
    The tallest bar is at 0–5 → most songs remain unheard.  
    Use the toggle above the chart to switch between density (%) and raw count.</p>
  `

  const chartDiv = document.createElement("div")
  chartDiv.id = "pop-chart"
  chartDiv.style.minHeight = "460px"
  chartDiv.style.width = "100%"

  container.append(text, chartDiv)
  return container
}

// NOTE: VERSION 1
// export function renderPopularityView() {
//   const container = document.createElement("div")
//   container.className = "view-container"

//   const text = document.createElement("div")
//   text.className = "view-text"
//   text.innerHTML = `
//     <h3>📈 Popularity by Genre</h3>
//     <p>Spotify popularity (0–100) measures how often songs are played.  
//     Some genres dominate the charts — but the gap is smaller than you'd expect.</p>
//   `

//   const chart = document.createElement("div")
//   chart.className = "view-chart"
//   chart.innerHTML = `
//     <div class="placeholder-chart">[ Popularity Bar Chart Placeholder ]</div>
//   `

//   container.append(text, chart)
//   return container
// }


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