/**
 * Author: andrefuller
 * Date: 7/23/12
 */
define([
    "jquery",
    "underscore",
    "backbone",
    "router",
    "bootstrap"
], function( $, _, Backbone, Router, UIBootstrap ){

    function initialize(){
        var app = new Router();
        Backbone.history.start();
    }

    return {
        initialize: initialize
    };
});