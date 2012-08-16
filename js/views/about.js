/**
 * Author: andrefuller
 * Date: 7/27/12
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/about.html'
], function( $, _, Backbone, tpl ){

    var HomeView;

    HomeView = Backbone.View.extend({

        className: "container",

        initialize: function(){
            this.template = _.template( tpl );
        },

        render: function(){
            $( this.el).html( this.template() );
            return this;
        }
    });

    return HomeView;
});