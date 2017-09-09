'use strict';
// Libs
import $ from 'jquery';
import 'underscore';
import 'bootstrap';
import Backbone from 'backbone';
import AppRouter from './router';

$(document).ready(function() {
  $('body').addClass('loaded');

  setTimeout(function() {
    // eslint-disable-next-line
    new AppRouter();
    Backbone.history.start();
  }, 500);
});
