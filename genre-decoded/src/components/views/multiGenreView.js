// Step 2: Single vs Multi Genre

// Step 2: Single‑genre vs Multi‑genre (Vega-Lite, unstacked + Gaussian fits)
export function renderMultiGenreView() {
  const container = document.createElement("div")
  container.className = "view-container"
  container.id = "multi-view-container"

  const text = document.createElement("div")
  text.className = "view-text"
  text.innerHTML = `
    <h3>🎯 Single‑Genre vs Multi‑Genre Tracks</h3>
    <p>Multi‑genre tracks are only <strong>6.8%</strong> of the dataset, yet they dominate the highest popularity bins.  
    The fitted curves show a clear gap: multi‑genre mean popularity = <strong>62.7</strong> vs. single‑genre mean = <strong>44.5</strong>.  
    Use the toggle to see density (%) or raw count.</p>
    <div class="takeaway" style="margin-top: 1rem;">
      ⚠️ Multi‑genre tracks blend audio features → harder to analyse.  
      <strong>From now on, we focus only on single‑genre tracks.</strong>
    </div>
  `

  const chartDiv = document.createElement("div")
  chartDiv.id = "multi-chart"
  chartDiv.style.minHeight = "520px"
  chartDiv.style.width = "100%"

  container.append(text, chartDiv)
  return container
}

// NOTE: VERSION 1
// export function renderMultiGenreView() {
//   const container = document.createElement("div")
//   container.className = "view-container"

//   const text = document.createElement("div")
//   text.className = "view-text"
//   text.innerHTML = `
//     <h3>🎯 Single‑Genre vs Multi‑Genre Tracks</h3>
//     <p>Multi‑genre tracks tend to be more popular — but they also make analysis trickier.  
//     Here we compare average popularity of songs tagged with one genre vs multiple genres.</p>
//   `

//   const chart = document.createElement("div")
//   chart.className = "view-chart"
//   chart.innerHTML = `
//     <div class="placeholder-chart">[ Grouped Bar Chart: Single vs Multi ]</div>
//   `

//   container.append(text, chart)
//   return container
// }

// NOTE: VERSION 0
// export function renderMultiGenreView() {
//   const container = document.createElement("div")
//   container.className = "view-container"

//   const text = document.createElement("div")
//   text.className = "view-text"
//   text.innerHTML = `
//     <h3>Single vs Multi Genre (Step 2)</h3>
//     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
//     This view compares songs from a single genre to those from multiple genres.</p>
//   `

//   const chart = document.createElement("div")
//   chart.className = "view-chart"
//   chart.innerHTML = `
//     <div class="placeholder-chart">[ Multi-Genre Chart Placeholder ]</div>
//   `

//   container.append(text, chart)

//   // Alternative: use innerHTML for simpler views
//   // container.innerHTML = `
//   //   <div class="view-text">
//   //     <h3>Single vs Multi-Genre</h3>
//   //     <p>
//   //       Multi-genre tracks tend to be more popular —
//   //       but they complicate analysis.
//   //     </p>
//   //   </div>

//   //   <div class="view-chart">
//   //     <div class="placeholder-chart">Multi vs Single Chart</div>
//   //   </div>
//   // `
//   return container
// }