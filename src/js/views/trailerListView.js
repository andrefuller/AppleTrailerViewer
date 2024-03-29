// Libs
import $ from "jquery";
import _ from "underscore";
import Marionette from "backbone.marionette";

import template from "../templates/trailerListView.hbs";

export default Marionette.View.extend({
  template: _.template(template()),

  events: {
    "click .pagination .page-link": "getPage"
  },

  navList: [
    {
      label: "Just Added",
      filter: "just_added"
    },
    {
      label: "Most Popular",
      filter: "most_pop"
    },
    {
      label: "Exclusive",
      filter: "exclusive"
    },
    {
      label: "Genres",
      filter: "genres"
    },
    {
      label: "Studios",
      filter: "studios"
    }
  ],

  render(coll) {
    let groups;
    let pageData;

    // eslint-disable-next-line no-multi-assign
    const currentCollection = (this.collection = this.collection || coll);

    const activeNavList = [...this.navList].map(elem => {
      const output = { ...elem };
      if (elem.filter === currentCollection.currentFilter)
        output.active = "active";
      else output.active = "";

      return output;
    });

    const buildPagingData = () => {
      const pageInfo = {};

      pageInfo.list = Array.from(
        new Array(currentCollection.state.totalPages),
        (x, i) => {
          const mappedIndex = i + 1;

          return {
            index: mappedIndex,
            label: mappedIndex,
            active:
              mappedIndex === currentCollection.state.currentPage
                ? "active"
                : ""
          };
        }
      );

      pageInfo.nextPageIndex = currentCollection.state.currentPage + 1;
      pageInfo.previousPageIndex = currentCollection.state.currentPage - 1;
      pageInfo.hasNextPage = currentCollection.hasNextPage();
      pageInfo.hasPreviousPage = currentCollection.hasPreviousPage();

      return pageInfo;
    };

    const trailers = currentCollection.toJSON();
    switch (currentCollection.currentFilter) {
      case "genres":
        groups = _.groupBy(trailers, item => item.genre[0]);
        break;
      case "studios":
        groups = _.groupBy(trailers, item => item.studio);
        break;
      default:
        pageData = buildPagingData();
        break;
    }

    $(this.el).html(
      this.template({
        navItems: activeNavList,
        paging: pageData,
        trailers,
        groups
      })
    );

    return this;
  },

  getPage(event) {
    event.preventDefault();

    const $page = $(event.target);
    const pageIndex = $page.data("pageIndex");

    if (this.collection) {
      this.collection.getPage(pageIndex);
      this.render(this.collection);
    }
  }
});
