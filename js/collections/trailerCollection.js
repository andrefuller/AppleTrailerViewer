/**
 * Author: andrefuller
 * Date: 7/25/12
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'backbonePaginator',
    'trailerModel'
], function( $, _, Backbone, BackbonePaginator, TrailerModel ){
    var TrailerCollection;

    TrailerCollection = Backbone.Paginator.clientPager.extend({
        model: TrailerModel,

        paginator_core: {
                type            : 'GET',
                dataType        : 'jsonp',
                url             : "http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"http://trailers.apple.com/trailers/home/feeds/just_added.json\"&format=json"

        },

        paginator_ui: {
                firstPage       : 1,
                currentPage     : 1,
                perPage         : 10
        },

        server_api: {
            '$top': function() { return this.perPage },

            '$skip': function() { return this.currentPage * this.perPage },

            '$format': 'json'
        },

        parse           : function( response ){
            return response.query.results.json.json;
        }
    });

    return TrailerCollection;
});