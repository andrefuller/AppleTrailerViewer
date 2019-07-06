// Libs
import _ from "underscore";
import Backbone from "backbone";
import Moment from "moment";

// TODO: Manage locale in a global cofig
const LOCALE = "en";

export default Backbone.Model.extend({
  initialize(data) {
    let initData;

    if (data) {
      initData = data.isFeedData
        ? this.parseFeedData(data)
        : this.parseCollectionData(data);
      this.set(initData);
    }
  },

  formatListForDisplay(list) {
    return list ? list.join(", ") : "";
  },

  parseFeedData(data) {
    const heroImages = data.heros;

    const modelObj = {
      backgroundImg: heroImages[1].imageurl || heroImages[0].imageurl
    };

    modelObj.title = data.details.locale[LOCALE].movie_title;
    modelObj.description = data.details.locale[LOCALE].synopsis;
    modelObj.rating = data.page.movie_rating;
    modelObj.mappedRating = `rating-${modelObj.rating}`;

    const releaseDate = data.page.release_copy;

    if (releaseDate !== undefined) {
      modelObj.releaseDateTxt = `In Theatres: ${releaseDate}`;
    } else {
      modelObj.releaseDateTxt = "In Theatres Coming Soon";
    }

    modelObj.copyright = data.page.copyright;

    const crew = data.details.locale[LOCALE].castcrew;

    const actors = crew && crew.actors;
    modelObj.castListTxt = this.formatListForDisplay(
      actors.map(actor => actor.name)
    );

    const directors = crew && crew.directors;
    modelObj.directors = this.formatListForDisplay(
      directors.map(director => director.name)
    );

    const writers = crew && crew.writers;
    modelObj.writerListTxt = this.formatListForDisplay(
      writers.map(writer => writer.name)
    );

    const { genres } = data.details;
    modelObj.genreListTxt = this.formatListForDisplay(
      genres.map(genre => genre.name)
    );

    const trailers = data.clips;
    modelObj.trailerList = trailers
      .map(trailer => {
        const mappedObj = {
          videoTitle: trailer.title,
          videoThumbnail: trailer.screen,
          videoRuntime: trailer.runtime
        };

        const trailerSizes = trailer.versions.enus.sizes;

        mappedObj.videoTrailerUrl = trailerSizes.hd1080.srcAlt;

        return mappedObj;
      })
      .reverse();

    return modelObj;
  },

  parseCollectionData(data) {
    let trailerDescList;
    const posterAttribute = "poster";
    const trailerSitePrefix = "http://trailers.apple.com";

    const trailerLocation = data.location;

    // Simplify poster access
    const splitUrlArr = data.poster.split(posterAttribute);

    const posterUrl = splitUrlArr[0];
    const posterExtension = splitUrlArr[1];

    const modelObj = {
      posterSmall: `${trailerSitePrefix}${posterUrl +
        posterAttribute +
        posterExtension}`,
      posterLarge: `${posterUrl + posterAttribute}-large${posterExtension}`,
      posterXLarge: `${posterUrl + posterAttribute}-xlarge${posterExtension}`,
      backgroundImg: `${trailerSitePrefix}${trailerLocation}images/background.jpg`
    };

    // Parse release date
    const rDate = data.releasedate;
    if (rDate !== undefined) {
      modelObj.releaseDateTxt = `In Theatres: ${Moment(rDate).format(
        "MMMM Do, YYYY"
      )}`;
    } else {
      modelObj.releaseDateTxt = "In Theatres Coming Soon";
    }

    // Format genre list
    modelObj.genreListTxt = this.formatListForDisplay(data.genre);

    // Format cast list
    modelObj.castListTxt = this.formatListForDisplay(data.actors);

    modelObj.isExclusive = _.reduce(
      trailerDescList,
      item => item && item.exclusive,
      false
    );
    modelObj.trailerList = Array.from(data.trailers);

    return modelObj;
  }
});
