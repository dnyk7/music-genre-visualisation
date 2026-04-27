// Step 4: Time Trend Chart

// NOTE: VERSION 1
export function renderTimeTrendView() {
  const container = document.createElement("div")
  container.className = "view-container"

  const text = document.createElement("div")
  text.className = "view-text"
  text.innerHTML = `
    <h3>⏱️ Genres Over Time</h3>
    <p>
      Over the decades, genres have diversified in their audio features,  
      but popularity has converged — today’s hits sound more alike than ever.
    </p>
  `

  const chart = document.createElement("div")
  chart.className = "view-chart"
  chart.innerHTML = `
    <div class="placeholder-chart">[ Line Chart: Feature Trends by Year ]</div>
  `

  container.append(text, chart)
  return container
}


// // NOTE: VERSION 0
// export function renderTimeTrendView() {
//   const container = document.createElement("div")
//   container.className = "view-container"

//   const text = document.createElement("div")
//   text.className = "view-text"
//   text.innerHTML = `
//     <h3>Time Trend Chart (Step 4)</h3>
//     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
//     This view shows how song popularity changes over time.</p>
//   `

//   const chart = document.createElement("div")
//   chart.className = "view-chart"
//   chart.innerHTML = `
//     <div class="placeholder-chart">[ Time Trend Chart Placeholder ]</div>
//   `

//   container.append(text, chart)

//   // Alternative: use innerHTML for simpler views
//   // container.innerHTML = `
//   //   <div class="view-text">
//   //     <h3>Genres Over Time</h3>
//   //     <p>
//   //       Genres have diversified, but popularity has converged.
//   //     </p>
//   //   </div>

//   //   <div class="view-chart">
//   //     <div class="placeholder-chart">Time Trend Chart</div>
//   //   </div>
//   // return container
// }