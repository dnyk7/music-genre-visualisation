import { renderPopularityView } from "./views/popularityView"
import { renderMultiGenreView } from "./views/multiGenreView"
import { renderGenreAttributesView } from "./views/genreAttributesView"
import { renderTimeTrendView } from "./views/timeTrendView"
import { renderSunburstView } from "./views/sunburstView"

export function renderView(view) {

  switch(view) {
    case "popularity":
      return renderPopularityView()

    case "multi":
      return renderMultiGenreView()

    case "attributes":
      return renderGenreAttributesView()

    case "time":
      return renderTimeTrendView()

    case "sunburst":
      return renderSunburstView()

    default:
      const div = document.createElement("div")
      div.innerHTML = "<h3>Unknown View</h3>"
      return div
  }
}