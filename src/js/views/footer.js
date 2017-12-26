'use strict';
// Libs
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette'

import template from '../templates/footer.hbs';

export default Marionette.View.extend({

    template: _.template(template()),

    render(data) {
        $(this.el).html(this.template(data));
        return this;
    }

});
