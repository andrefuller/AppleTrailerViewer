// Libs
import Backbone from "backbone";

// eslint-disable-next-line
import BackbonePaginator from 'backbone.paginator'

// Models
import TrailerModel from "../models/trailer";

export default Backbone.PageableCollection.extend({
  model: TrailerModel,
  mode: "infinite",

  urlPrefix: "home/feeds",

  currentFilter: "just_added",

  state: {
    pageSize: 40
  },

  url() {
    return `http://trailers.apple.com/trailers/${this.urlPrefix}/${this.currentFilter}.json`;
  },

  parse(response) {
    return (response &&
      response.query &&
      response.query.results &&
      response.query.results.json &&
      response.query.results.json.json) ||
      Array.isArray(response)
      ? response
      : [];
  }
});
