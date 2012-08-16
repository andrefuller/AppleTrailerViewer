/**
 * Author: andrefuller
 * Date: 7/27/12
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/trailerView.html',
    'trailerModel'
], function( $, _, Backbone, tpl, TrailerModel ){
    var TrailerViewModal;

    TrailerViewModal = Backbone.View.extend({

        className: "container",

        initialize: function(){
           this.template = _.template( tpl );
        },

        render: function( dataModel ){
            var tmpl = this.template( { trailer: dataModel.toJSON() } );
            $( this.el ).html( tmpl );

            return this;
        }
    });

    return TrailerViewModal;
});