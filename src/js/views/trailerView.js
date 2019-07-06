// Libs
import $ from "jquery";
import _ from "underscore";
import Marionette from "backbone.marionette";

import template from "../templates/trailerView.hbs";

export default Marionette.View.extend({
  template: _.template(template()),

  events: {
    "click .video-link": "showModal"
  },

  render(model) {
    $(this.el).html(this.template(model.toJSON()));
  },

  showModal(event) {
    const link = $(event.currentTarget);
    const videoTitle = link.data("videoTitle");
    const videoUrl = link.data("videoUrl");
    const modal = $("#videoModal");
    const video = modal.find(".video").get()[0];
    const videoSrc = modal.find("source");

    modal.find(".modal-title").text(videoTitle);
    modal.one("hide.bs.modal", () => {
      video.pause();
    });

    videoSrc.attr("src", videoUrl);
    video.load();
    video.play();
  }
});
