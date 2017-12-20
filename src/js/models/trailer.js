'use strict';
// Libs
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Moment from 'moment';

// TODO: Manage locale in a global cofig
const LOCALE = 'en';

export default Backbone.Model.extend({
  initialize: function (data) {
    let initData;

    if (data) {
      initData = data.isFeedData ? this.parseFeedData(data) : this.parseCollectionData(data);
      this.set(initData);
    }
  },

  formatListForDisplay(list) {
    return list ? list.join(', ') : '';
  },

  parseFeedData(data) {
    let modelObj,
      heroImages,
      releaseDate,
      crew,
      directors,
      actors,
      writers,
      genres,
      trailers;

    heroImages = data.heros;


    modelObj = {
      backgroundImg: heroImages[1].imageurl || heroImages[0].imageurl
    };

    modelObj.title = data.details.locale[LOCALE].movie_title;
    modelObj.description = data.details.locale[LOCALE].synopsis;
    modelObj.rating = data.page.movie_rating;
    modelObj.mappedRating = `rating-${modelObj.rating}`;

    releaseDate = data.page.release_copy;

    if (releaseDate !== undefined) {
      modelObj.releaseDateTxt = 'In Theatres: ' + releaseDate;
    } else {
      modelObj.releaseDateTxt = 'In Theatres Coming Soon';
    }

    modelObj.copyright = data.page.copyright;

    crew = data.details.locale[LOCALE].castcrew;

    actors = crew && crew.actors;
    modelObj.castListTxt = this.formatListForDisplay(actors.map(actor => actor.name));

    directors = crew && crew.directors;
    modelObj.directors = this.formatListForDisplay(directors.map(director => director.name));

    writers = crew && crew.writers;
    modelObj.writerListTxt = this.formatListForDisplay(writers.map(writer => writer.name));

    genres = data.details.genres;
    modelObj.genreListTxt = this.formatListForDisplay(genres.map(genre => genre.name));

    trailers = data.clips;
    modelObj.trailerList = trailers.map(trailer => {
      let trailerSizes,
        mappedObj = {
          videoTitle: trailer.title,
          videoThumbnail: trailer.screen,
          videoRuntime: trailer.runtime
        };

      trailerSizes = trailer.versions.enus.sizes;

      mappedObj.videoTrailerUrl = trailerSizes.hd1080.srcAlt;

      return mappedObj;
    }).reverse();

    return modelObj;
  },

  parseCollectionData(data) {
    let trailerLocation,
      splitUrlArr,
      posterUrl,
      posterExtension,
      rDate,
      trailerDescList,
      isAnyTrailerExclusive,
      modelObj,
      posterAttribute = 'poster',
      trailerSitePrefix = 'http://trailers.apple.com',
      trailerList = [];

    trailerLocation = data.location;

    // Simplify poster access
    splitUrlArr = data.poster.split(posterAttribute);

    posterUrl = splitUrlArr[0];
    posterExtension = splitUrlArr[1];

    modelObj = {
      posterLarge: posterUrl + posterAttribute + '-large' + posterExtension,
      posterXLarge: posterUrl + posterAttribute + '-xlarge' + posterExtension,
      backgroundImg: trailerSitePrefix + trailerLocation + 'images/background.jpg'
    };

    // Parse release date
    rDate = data.releasedate;
    if (rDate !== undefined) {
      modelObj.releaseDateTxt = 'In Theatres: ' + Moment(rDate).format('MMMM Do, YYYY');
    } else {
      modelObj.releaseDateTxt = 'In Theatres Coming Soon';
    }

    // Format genre list
    modelObj.genreListTxt = this.formatListForDisplay(data.genre);

    // Format cast list
    modelObj.castListTxt = this.formatListForDisplay(data.actors);

    trailerDescList = data.trailers;

    // Sometimes the trailer list is just a single object... so make it into an array
    if (_.isArray(trailerDescList) === false) {
      trailerDescList = [trailerDescList];
    }

    modelObj.isExclusive = isAnyTrailerExclusive;
    modelObj.trailerList = trailerList;

    return modelObj;
  }
});
