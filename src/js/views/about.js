'use strict';
// Libs
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette'

import template from '../templates/about.hbs';

export default Marionette.View.extend({

  template: _.template(template()),

  render(data) {
    let dependencies = data.dependencies;

    dependencies = Object.keys(dependencies).map( key => {
      return {
        title: key,
        version: dependencies[key].replace(/\^/, 'v')
      }
    });

    data.dependencies = dependencies;

    $(this.el).html(this.template(data));

    return this;
  }

});
