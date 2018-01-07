'use strict';
// Libs
import $ from 'jquery';
import _ from 'underscore';
import Marionette from 'backbone.marionette'

import template from '../templates/trailerListView.hbs';

export default Marionette.View.extend({

  template: _.template(template()),

  events: {
    'click .pagination .page-link': 'getPage'
  },

  navList: [
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
      trailers,
      groups,
      pageData;

    currentCollection = this.collection = this.collection || coll;

    activeNavList = [...this.navList].map(elem => {
      if (elem.filter === currentCollection.currentFilter)
        elem.active = 'active';
      else
        elem.active = ''

      return elem;
    });

    const buildPagingData = () => {
      let pageInfo = {};

      pageInfo.list = Array.from(new Array(currentCollection.state.totalPages), (x, i) => {
        let mappedIndex = i + 1;

        return {
          index: mappedIndex,
          label: mappedIndex,
          active: mappedIndex === currentCollection.state.currentPage ? 'active' : ''
        }
      });

      pageInfo.nextPageIndex = currentCollection.state.currentPage + 1;
      pageInfo.previousPageIndex = currentCollection.state.currentPage - 1;
      pageInfo.hasNextPage = currentCollection.hasNextPage();
      pageInfo.hasPreviousPage = currentCollection.hasPreviousPage();

      return pageInfo;
    }

    trailers = currentCollection.toJSON();
    switch (currentCollection.currentFilter) {
      case 'genres':
        groups = _.groupBy(trailers, item => item.genre[0]);
        break;
      case 'studios':
        groups = _.groupBy(trailers, item => item.studio);
        break;
      default:
        pageData = buildPagingData();
        break;
    }

    $(this.el).html(this.template({
      navItems: activeNavList,
      paging: pageData,
      trailers,
      groups
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
