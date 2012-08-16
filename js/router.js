/**
 * Author: andrefuller
 * Date: 7/25/12
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'navBar',
    'trailerCollection',
    'trailerListView',
    'trailerView',
    'aboutView'
], function( $, _, Backbone, NavBar, TrailerCollection, TrailerListView, TrailerView, AboutView ){
    var AppRouter, initialize;

    AppRouter = Backbone.Router.extend({
        routes: {
            ''                         : "viewTrailerList",
            'trailer/:index'           : "viewTrailerInfo",
            'about'                    : "showAbout",
            '*actions'                 : "defaultAction"
        },

        initialize: function(){
            this.collectionDataPending = false;
            this.trailerIndex = -1;

            // Header Navigation Bar
            this.navBar = new NavBar();
            $( '#navbar').html( this.navBar.render().el );
        },

        getData: function( successCallback, errorCallback ){
            var that = this;

            this.collectionDataPending = true;

            this.collection = new TrailerCollection();

            this.collection.fetch({
                success: function( data ){
                    successCallback( that, data );
                },
                error: function( data, response ){
                    errorCallback( that, data, response );
                }
            });
        },

        onGetInitialDataSuccess: function( context, data ){
            context.collectionDataPending = false;

            if( context.trailerIndex !== -1 )
                context.viewTrailerInfo( context.trailerIndex );
            else
                context.viewTrailerList();
        },

        onGetInitialDataError: function( context, data, response ){
            context.collectionDataPending = false;
            // TODO: Handle Error
        },

        viewTrailerList: function(){
            var self = this;
            if( !this.collection )
            {
                this.getData( this.onGetInitialDataSuccess, this.onGetInitialDataError );
                return;
            }

            if( !this.trailerListView )
                this.trailerListView = new TrailerListView();

            $( '#app-container' ).empty();
            $( '#app-container' ).html( this.trailerListView.render( this.collection ).el );
        },

        viewTrailerInfo: function( trailerIndex ){
            var that = this;
            this.trailerIndex = trailerIndex;

            if( !this.collection )
            {
                this.getData( this.onGetInitialDataSuccess, this.onGetInitialDataError );
                return;
            }

            if( !this.collectionDataPending )
            {
                if( !this.trailerView )
                    this.trailerView = new TrailerView();

                $( '#app-container' ).html( this.trailerView.render( this.collection.at( trailerIndex ) ).el );
            }
        },

        showAbout: function(){
          if( !this.aboutView )
            this.aboutView = new AboutView();

            $( '#app-container').hide().html( this.aboutView.render().el ).fadeIn( 'slow' );
        },

        defaultAction: function( actions ){
            console.log( actions );
        }
    });

    return AppRouter;
});