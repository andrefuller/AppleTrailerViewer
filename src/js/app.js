// Libs
import $ from "jquery";
import "underscore";
import "bootstrap";
import Backbone from "backbone";
import AppRouter from "./router";

$(document).ready(() => {
  $("body").addClass("loaded");

  setTimeout(() => {
    // eslint-disable-next-line
    new AppRouter();
    Backbone.history.start();
  }, 500);
});
