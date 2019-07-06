// Libs
import $ from "jquery";
import _ from "underscore";
import Marionette from "backbone.marionette";

import template from "../templates/about.hbs";

export default Marionette.View.extend({
  template: _.template(template()),

  render(data) {
    const info = { ...data };
    const dependencies = Object.keys(data.dependencies).map(key => {
      return {
        title: key,
        version: data.dependencies[key].replace(/\^/, "v"),
        reason: data.dependencyReasons[key]
      };
    });

    info.dependencies = dependencies;

    $(this.el).html(this.template(info));

    return this;
  }
});
