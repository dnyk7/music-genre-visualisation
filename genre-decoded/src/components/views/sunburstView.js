// Step 5: Sunburst Explorer

// NOTE: VERSION 1
export function renderSunburstView() {
  const container = document.createElement("div")
  container.className = "view-container"

  const text = document.createElement("div")
  text.className = "view-text"
  text.innerHTML = `
    <h3>🌐 Explore the Genre Universe</h3>
    <p>
      Dive into the hierarchical relationships between subgenres.  
      Click on any segment to zoom in and discover how songs are connected.
    </p>
  `

  const chart = document.createElement("div")
  chart.className = "view-chart"
  chart.innerHTML = `
    <div class="placeholder-chart">[ Interactive Sunburst Chart ]</div>
  `

  container.append(text, chart)
  return container
}

// NOTE: VERSION 0
// export function renderSunburstView() {
//   const container = document.createElement("div")
//   container.className = "view-container"

//   const text = document.createElement("div")
//   text.className = "view-text"
//   text.innerHTML = `
//     <h3>Sunburst Explorer (Step 5)</h3>
//     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
//     This view provides an interactive exploration of genre hierarchies.</p>
//   `

//   const chart = document.createElement("div")
//   chart.className = "view-chart"
//   chart.innerHTML = `
//     <div class="placeholder-chart">[ Sunburst Chart Placeholder ]</div>
//   `

//   container.append(text, chart)
//   return container

//   // Alternative: use innerHTML for simpler views
//   // container.innerHTML = `
//   //   <div class="view-text">
//   //     <h3>Explore the Dataset</h3>
//   //     <p>
//   //       Find your song’s genre and discover new music.
//   //     </p>
//   //   </div>

//   //   <div class="view-chart">
//   //     <div class="placeholder-chart">Sunburst Chart</div>
//   //   </div>
//   // `
// }