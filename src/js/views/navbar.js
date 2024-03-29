// Libs
import _ from "underscore";
import $ from "jquery";
import Marionette from "backbone.marionette";
// eslint-disable-next-line
import { typeahead } from 'typeahead.js';
import Bloodhound from "typeahead.js/dist/bloodhound";

import template from "../templates/navbar.hbs";
import searchSuggestionTemplate from "../templates/searchSuggestion.hbs";

// Model
import Trailer from "../models/trailer";

export default Marionette.View.extend({
  template: _.template(template()),

  events: {
    "click .navbar-nav li a": "onNavMenuClick"
  },

  render(data) {
    $(this.el).html(this.template(data));

    const engine = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace("title"),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url:
          "https://cors-anywhere.herokuapp.com/http://trailers.apple.com/trailers/home/scripts/quickfind.php?q=%QUERY",
        wildcard: "%QUERY",
        transform(response) {
          let items = response.results || [];

          items = items.map(item => new Trailer(item).toJSON());
          return items;
        }
      }
    });

    $(".typeahead").typeahead(
      {
        hint: true,
        highlight: true,
        minLength: 1
      },
      {
        source: engine,
        async: true,
        display(suggestion) {
          return suggestion.title;
        },
        templates: {
          empty: [
            '<div class="empty-message m-2">',
            "No Results",
            "</div>"
          ].join("\n"),
          suggestion: _.template(searchSuggestionTemplate())
        }
      }
    );

    return this;
  },

  onNavMenuClick(event) {
    $(".navbar-nav li a").removeClass("active");
    $(event.currentTarget).addClass("active");
  }
});
