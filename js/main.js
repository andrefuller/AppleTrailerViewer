/**
 * Author: andrefuller
 * Date: 7/23/12
 */
requirejs.config({
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: [ 'jquery', 'underscore' ],
            exports: 'Backbone'
        }
    },

    paths: {
        text                    : "libs/require/plugins/text",

        jquery                  : "libs/jquery/jquery-min",

        underscore              : "libs/underscore/underscore-min",

        backbone                : "libs/backbone/backbone-min",
        backboneRelational      : "libs/backbone/plugins/backbone-relational",
        backbonePaginator       : "libs/backbone/plugins/backbone-paginator-min",

        bootstrap               : "libs/bootstrap/bootstrap.min",

        app                     : "app",
        router                  : "router",

        trailerModel            : "models/trailer",
        trailerCollection       : "collections/trailerCollection",

        navBar                  : "views/navbar",
        trailerListView         : "views/trailerListView",
        trailerView             : "views/trailerView",
        aboutView               : "views/about",

        templates               : "../templates",

        date                    : "libs/date/date"
    }

});

require([
    "app"
], function( App ){
    App.initialize();
});