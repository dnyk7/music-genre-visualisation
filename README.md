# Music Genre Visualisation

**Group name:** Fox Says

An interactive scrollytelling data visualisation built with **Vega-Lite** and **D3.js** using Spotify song data.

## Overview

The project is presented as a 5-step narrative:

1. **Step 1**: Distribution of track popularity (histogram).
2. **Step 2**: Sticky scrollytelling comparison of single-genre vs multi-genre popularity patterns.
3. **Step 3**: Audio feature comparison across genres.
4. **Step 4**: Genre popularity trends over time (5-year bins).
5. **Step 5**: Interactive song explorer (genre pie chart, song search, radar chart, Spotify track link).

## Data

- Raw dataset: `spotify_songs.csv`
- Cleaned dataset used by the visualisations: `DataCleaning/cleaned_spotify.csv`
- Cleaning notebook: `DataCleaning/comp4462_Project_DataCleaning.ipynb`

Original dataset source:  
https://github.com/rfordatascience/tidytuesday/blob/main/data/2020/2020-01-21/readme.md

## Run locally

Run a local HTTP server from the project root:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000/index.html`

## Project structure

- `index.html` — main scrollytelling page and visualization wiring.
- `specs/step1.js` to `specs/step4.js` — Vega-Lite specs for Steps 1-4.
- `specs/step5.js` — D3.js logic for the Step 5 explorer.
- `DataCleaning/` — cleaned CSV and notebook.
- `style.css` — standalone stylesheet (the current `index.html` uses inline styles).
- `del/` — older development files.
