/**
 * Author: andrefuller
 * Date: 7/27/12
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/navbar.html'
], function( $, _, Backbone, tpl ){
    var NavBar;

    NavBar = Backbone.View.extend({

        events: {
            "click .nav li"              : "select"
        },

        initialize: function(){
            this.template = _.template( tpl );
        },

        render: function(){
            $( this.el ).html( this.template() );
            return this;
        },

        select: function( event ) {
            $( ".nav li" ).removeClass( 'active' );
            $( event.currentTarget ).addClass( 'active' );
        }
    });

    return NavBar;
});