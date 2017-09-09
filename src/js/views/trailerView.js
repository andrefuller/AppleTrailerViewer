'use strict';
// Libs
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette'

import template from '../templates/trailerView.hbs';

export default Marionette.View.extend({

  template: _.template(template()),

  events: {
    "click .video-link": "showModal"
  },

  render(model) {
    $(this.el).html(this.template(model.toJSON()));
  },

  showModal(event) {
    let link = $(event.currentTarget);
    let videoTitle = link.data('videoTitle');
    let videoUrl = link.data('videoUrl');
    let modal = $('#videoModal');
    let video = modal.find('.video').get()[0];
    let videoSrc = modal.find('source');

    modal.find('.modal-title').text(videoTitle);
    modal.one('hide.bs.modal', (e) => {
      video.pause();
    });

    videoSrc.attr('src', videoUrl);
    video.load();
    video.play();
  }
});
