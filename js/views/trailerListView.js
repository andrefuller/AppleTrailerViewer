/**
 * Author: andrefuller
 * Date: 7/25/12
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/trailerListView.html',
    'bootstrap'
], function( $, _, Backbone, tpl ){
    var TrailerListView;

    TrailerListView = Backbone.View.extend({

        className: "container",

        initialize: function(){
           var trailerList;

           this.template = _.template( tpl );
        },

        render: function( data ){
            this.collection = data;

            $( this.el ).empty();

            var template = this.template( { trailers: this.collection.toJSON() } );
            $( this.el ).html( template );

            return this;
        }
    });

    return TrailerListView;
});