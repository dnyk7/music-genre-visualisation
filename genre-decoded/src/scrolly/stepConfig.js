export const stepsConfig = [

  // STEP 1 — Popularity
  {
    view: "popularity",
    activeGenres: "all",
    activeFeature: null,
    useSingleGenre: false,
    yearFilter: 1970
  },

  // STEP 2 — Multi vs Single
  {
    view: "multi",
    activeGenres: "all",
    activeFeature: null,
    useSingleGenre: false,
    yearFilter: 1970
  },

  // STEP 3 — Genre attributes (Intro)
  {
    view: "attributes",
    activeGenres: "all",
    activeFeature: null,
    useSingleGenre: true,
    yearFilter: 1970
  },

  // STEP 4 — Time trends
  {
    view: "time",
    activeGenres: "all",
    activeFeature: null,
    useSingleGenre: true,
    yearFilter: 1970
  },

  // STEP 5 — Sunburst
  {
    view: "sunburst",
    activeGenres: "all",
    activeFeature: null,
    yearFilter: 1970
  }
]