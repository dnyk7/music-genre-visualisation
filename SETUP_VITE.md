# Vite

## Structure

```txt
genre-decoded/
│── index.html
│── vite.config.js
│── package.json
│
├── public/
│   └── data/
│       ├── genre_profiles.json
│       └── top_songs.json
│
├── src/
│   ├── main.js
│   ├── styles.css
│   │
│   ├── components/
│   │   ├── radarChart.js
│   │   ├── barChart.js
│   │   ├── legend.js
│   │   ├── filters.js
│   │   └── songCards.js
│   │
│   ├── scrolly/
│   │   └── scrollamaSetup.js
│   │
│   └── utils/
│       └── helpers.js
│
└── dist/   ← build output (deploy this)
```

## Initialise Vite

```bash
npm create vite@latest
```

CHoose

```txt
✔ Project name: genre-decoded (or current repo name)
✔ Framework: Vanilla
✔ Variant: JavaScript
```

Then:

```bash
cd genre-decoded
npm install
```

Clean default Vite files:

- src/counter.js
- src/javascript.svg

Create folder structure within the project folder:

```bash
mkdir -p public/data
mkdir -p src/components
mkdir -p src/scrolly
mkdir -p src/utils
```

Move your data into `public/data`

Install dependencies

```bash
npm install d3 scrollama
```

Set up the files and run

```bash
npm run dev
```

To deploy to github pages

```bash
npm run build
```

this creates `/dist`

## Notes

Your genreAttributesView.js remains D3-based. That's fine – they coexist. Just ensure the container elements have unique IDs or classes so Vega-Lite doesn't conflict.

Bundler / Dev server: Vite (you have index.html in root, src/ folder, and you ran npm run dev)

Charting: D3.js (radar, bar chart)

Scrolling: Scrollama.js

Styling: CSS (no framework)

Language: Vanilla JavaScript (ES modules)

If your groupmates want to use Vega‑Lite, you can integrate it by:

Including Vega‑Lite via CDN or npm.

Creating a wrapper component that renders Vega‑Lite specs into a DOM element.

You'll lose the smooth D3 transitions (morphing) unless you rebuild everything in Vega‑Lite, but it's possible side‑by‑side.