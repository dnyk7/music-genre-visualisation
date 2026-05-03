# Music Genre Visualisation

Live demo: [https://dnyk7.github.io/music-genre-visualisation/](https://dnyk7.github.io/music-genre-visualisation/)  
Group name: Fox Says

An interactive scrollytelling data visualisation that explores Spotify track popularity, genre audio features, and temporal trends. Built with Vega‑Lite and D3.js.

[![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-blue)](https://dnyk7.github.io/music-genre-visualisation/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Live website

https://dnyk7.github.io/music-genre-visualisation/

## Overview

The project guides you through a 5‑step story:

| Step | Topic | Visualisation |
|------|-------|---------------|
| 1 | Track popularity distribution | Interactive histogram (Vega‑Lite) |
| 2 | Single‑genre vs multi‑genre tracks | Unstacked histogram + Gaussian fits |
| 3 | Audio feature comparison across genres | Radar chart & horizontal bar chart (D3.js) |
| 4 | Genre popularity over time | Line chart with genre selection |
| 5 | Song explorer | Pie chart, search, radar chart, Spotify links |

<!-- ## Overview

The project is presented as a 5-step narrative:

1. Step 1: Distribution of track popularity (histogram).
2. Step 2: Sticky scrollytelling comparison of single-genre vs multi-genre popularity patterns.
3. Step 3: Audio feature comparison across genres.
4. Step 4: Genre popularity trends over time (5-year bins).
5. Step 5: Interactive song explorer (genre pie chart, song search, radar chart, Spotify track link). -->

## Data

- Raw source: [TidyTuesday Spotify dataset](https://github.com/rfordatascience/tidytuesday/blob/main/data/2020/2020-01-21/readme.md)
- Cleaned CSV: DataCleaning/cleaned_spotify.csv (used by Vega‑Lite specs)
- Preprocessing: DataCleaning/data_cleaning.ipynb

All audio features are normalised to a 0–1 scale for fair genre‑to‑genre comparison.

## Run locally

Because the project uses only static files, any HTTP server works:

```bash
# Python 3, Run a local HTTP server from the project root:
python -m http.server 8000

# Node.js (if you have npx)
npx serve .

# VS Code Live Server extension
```

> Note: No build step is required – the site is pure HTML/CSS/JS.

Then open:

http://localhost:8000/index.html

## Project structure

```txt
├── index.html               # Main entry point (scrollytelling layout, visualisation wiring)
├── style.css                # Global styles
├── specs/                   # Vega‑Lite specifications (steps 1,2 and 4)
│   ├── step1.js
│   ├── step2.js
│   ├── step3.js             # D3.js radar and barcharts
│   ├── step4.js
│   └── step5.js             # D3.js song explorer
├── src/                     # D3 components for step 3
│   ├── components/          # Radar & bar charts, legend, filters
│   └── main.js              # Scrollama setup, view routing
├── DataCleaning/            # Cleaned data (csv) and preprocessing notebook
└── photos/                  # Assets (cover images, Spotify badge)
```

---

## Tech stack

- Vega‑Lite – declarative grammar for steps 1, 2 & 4
- D3.js – custom radar & bar charts (step 3) + song explorer (step 5)
- GitHub Pages – hosting

---

## Acknowledgements

- Original Spotify data from [TidyTuesday](https://github.com/rfordatascience/tidytuesday)
- Vega‑Lite & D3.js communities

Group Members:

| Name         | Github Account                                  |
|--------------|-------------------------------------------------|
| Dana Yak | [dnyk7](https://github.com/dnyk7) |
| ZHANG Hongyi  | [zhybirdy](https://github.com/zhybirdy)         |
| TAM, Siu Lung  | [TamLung87](https://github.com/TamLung87)   |
| WONG, Tsz Ching  | [yoyowtc](https://github.com/yoyowtc)   |

---

## License

MIT © Fox Says
