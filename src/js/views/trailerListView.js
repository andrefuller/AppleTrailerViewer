'use strict';
// Libs
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette'

import template from '../templates/trailerListView.hbs';

export default Marionette.View.extend({

  template: _.template(template()),

  events: {
    "click .pagination .page-link": "getPage"
  },


  navList:[
    {
      label: 'Just Added',
      filter: 'just_added'
    }, {
      label: 'Most Popular',
      filter: 'most_pop'
    }, {
      label: 'Exclusive',
      filter: 'exclusive'
    }, {
      label: 'Genres',
      filter: 'genres'
    }, {
      label: 'Studios',
      filter: 'studios'
    }
  ],

  render(coll) {
    let activeNavList,
      currentCollection,
      pageList;

    currentCollection = this.collection = this.collection || coll;

    activeNavList = [...this.navList].map(elem => {
      if(elem.filter === currentCollection.currentFilter)
        elem.active = 'active';
      else
        elem.active = ''

      return elem;
    });

    pageList = Array.from(new Array(currentCollection.state.totalPages), (x,i) => {
      let mappedIndex = i + 1;

      return {
        index: mappedIndex,
        label: mappedIndex,
        active: mappedIndex === currentCollection.state.currentPage ? 'active' : ''
      }
    });

    $(this.el).html(this.template({
      navItems: activeNavList,
      trailers: currentCollection.toJSON(),
      paging: {
        nextPageIndex: currentCollection.state.currentPage + 1,
        previousPageIndex: currentCollection.state.currentPage - 1,
        hasNextPage: currentCollection.hasNextPage(),
        hasPreviousPage: currentCollection.hasPreviousPage(),
        list: pageList
      }

    }));

    return this;
  },

  getPage(event) {
    event.preventDefault();

    let $page = $(event.target);
    let pageIndex = $page.data('pageIndex');

    if (this.collection) {
      this.collection.getPage(pageIndex);
      this.render(this.collection);
    }
  }
});
