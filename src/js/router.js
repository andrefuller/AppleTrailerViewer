'use strict';
// Libs
import $ from 'jquery';
import Backbone from 'backbone';

// Views
import NavBar from './views/navbar';
import AboutView from './views/about';
import Footer from './views/footer';
import TrailerListView from './views/trailerListView';
import TrailerView from './views/trailerView';

// Collections
import TrailerCollection from './collections/trailerCollection';

// Model
import Trailer from './models/trailer';

export default Backbone.Router.extend({
  routes: {
    '': 'viewTrailerList',
    'section/:filter': 'viewTrailerList',
    'trailers*location': 'viewTrailerInfo',
    'about': 'viewAbout',
    '*actions': 'defaultAction'
  },

  initialize() {
    this.collection = new TrailerCollection();
    this.collection.isFetchPending = false;

    // Nav Bar
    this.navBar = new NavBar({
      el: '#navbar',
      collection: this.collection
    });

    // Footer
    this.footer = new Footer({
      el: '#footer'
    });

    this.appInfo = this.getApplicationInfo().then(appInfo => {
      this.renderView(this.navBar, appInfo, 'navBar')
      this.renderView(this.footer, appInfo, 'footer')
    }).catch((data, response) => this.onGetDataError(data, response));
  },

  getTrailers(filter) {
    return new Promise((resolve, reject) => {
      if (!this.collection.isFetchPending) {
        this.collection.isFetchPending = true;
        this.collection.currentFilter = filter || this.collection.currentFilter;

        this.collection.fetch({
          success: data => resolve(data),
          error: (data, response) => reject(data, response)
        });
      } else {
        resolve(null);
      }
    });
  },

  getTrailerInfoByLocation(location) {
    return new Promise((resolve) => {
      // Use the trailer info to look up the FilmID which is only available via
      // a variable on the trailer site (I assume it's injected into the page
      // using some sort of server side rendering)
      fetch(`/trailers/${location}/`)
        .then(response => response.text())
        .then(text => {
          let found = text.match(/var FilmId.*\'(\d+)*\'/);
          return found && found[1];
        })
        .then(filmID => {
          fetch(`/feeds/data/${filmID}.json`)
            .then(response => response.text())
            .then(data => {
              let trailerJSON = JSON.parse(data);

              trailerJSON.isFeedData = true;

              resolve(new Trailer(trailerJSON));
            })
            .catch((data, response) => this.onGetDataError(data, response));
        })
        .catch((data, response) => this.onGetDataError(data, response));
    });
  },

  searchTrailers(searchTerm) {
    return new Promise((resolve) => {
      fetch(`/trailers/home/scripts/quickfind.php?q=${searchTerm}`)
        .then(response => response.json())
        .then(json => {
          let resultsArr = json.results || [];

          if (resultsArr) {
            resultsArr = resultsArr.map(item => new Trailer(item));
          }

          resolve(resultsArr);
        })
        .catch((data, response) => this.onGetDataError(data, response));
    });
  },

  getApplicationInfo() {
    return new Promise((resolve) => {
      fetch('./package.json')
        .then(response => response.json())
        .then(json => {
          resolve(json);
        })
        .catch((data, response) => this.onGetDataError(data, response));
    });
  },

  onSearchInputChange(searchTerm) {
    let router = this;

    if (searchTerm && searchTerm.length > 1) {
      this.searchTrailers(searchTerm)
        .then(resultModels => {
          router.collection.reset(resultModels);
          router.renderView(router.trailerListView, router.collection);
        })
        .catch((data, response) => this.onGetDataError(data, response))
    }
  },

  onGetDataError(data) {
    this.collection.isFetchPending = false;
    console.error(data);
  },

  renderView(view, data, target) {
    let $targetContainer = $(target || '#app-container');
    if ($targetContainer) {
      this.collection.isFetchPending = false;

      $targetContainer.empty();
      view.render(data);
      $targetContainer.hide().fadeIn('slow');
    }
  },

  viewTrailerList(filter) {
    let defaultFilter = 'just_added';

    if (!this.trailerListView) {
      this.trailerListView = new TrailerListView({
        el: '#app-container'
      });
    }

    if (this.navBar) {
      this.navBar.$el.find('.input-group input').val('');
    }

    this.getTrailers(filter || defaultFilter)
      .then(() => this.renderView(this.trailerListView, this.collection))
      .catch((data, response) => this.onGetDataError(data, response));
  },

  viewTrailerInfo(trailerLocation) {
    if (!this.trailerView) {
      this.trailerView = new TrailerView({
        el: '#app-container'
      });
    }

    this.getTrailerInfoByLocation(trailerLocation)
      .then(trailer => this.renderView(this.trailerView, trailer))
      .catch((data, response) => this.onGetDataError(data, response));
  },

  viewAbout() {
    if (!this.aboutView) {
      this.aboutView = new AboutView({
        el: '#app-container'
      });
    }

    this.getApplicationInfo()
      .then(appInfo => this.renderView(this.aboutView, appInfo))
      .catch((data, response) => this.onGetDataError(data, response));
  },

  defaultAction(actions) {
    console.log(actions);
  }
});
