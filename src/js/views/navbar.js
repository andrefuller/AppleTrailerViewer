'use strict';
// Libs
import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette'
import template from '../templates/navbar.hbs';
import searchSuggestionTemplate from '../templates/searchSuggestion.hbs';
import { typeahead } from 'typeahead.js';

// Model
import Trailer from '../models/trailer';

export default Marionette.View.extend({

  template: _.template(template()),

  events: {
    'click .navbar-nav li a': 'onNavMenuClick',
  },

  // render(data) {
  //   $(this.el).html(this.template(data));
  //   return this;
  // },

  onDomRefresh: function () {
    let engine = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: '/trailers/home/scripts/quickfind.php?q=%QUERY',
        wildcard: '%QUERY',
        transform: function (response) {
          let items = response.results || [];

          items = items.map(item => new Trailer(item).toJSON());
          return items;
        }
      }
    });

    $('.typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
      {
        source: engine,
        async: true,
        display: function (suggestion) {
          return suggestion.title;
        },
        templates: {
          empty: [
            '<div class="empty-message m-2">',
            'No Results',
            '</div>'
          ].join('\n'),
          suggestion: _.template(searchSuggestionTemplate())
        }
      });

    console.log('onDomRefresh')
  },

  onNavMenuClick(event) {
    $('.navbar-nav li a').removeClass('active');
    $(event.currentTarget).addClass('active');
  }
});
