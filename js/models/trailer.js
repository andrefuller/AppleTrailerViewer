/**
 * Author: andrefuller
 * Date: 7/25/12
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'date'
], function( $, _, Backbone ){
    var Trailer;

    Trailer = Backbone.Model.extend({

        initialize: function(){
            var self = this;

            // Simplify poster access
            var posterAttribute = 'poster';

            var splitUrlArr = self.get( posterAttribute ).split( posterAttribute );

            var posterUrl = splitUrlArr[0];
            var posterExtension = splitUrlArr[1];

            self.set( { posterLarge: posterUrl + posterAttribute + '-large' + posterExtension } );
            self.set( { posterXLarge: posterUrl + posterAttribute + '-xlarge' + posterExtension } );

            // Parse release date
            var rDate = self.get( 'releasedate' );
            if( rDate !== undefined )
            {
                rDate = rDate.split( ' -' )[0];
                var parsedDate =  Date.parseExact( rDate, 'ddd, d MMM yyyy hh:mm:ss' );

                self.set( { releaseDateTxt: parsedDate.toString( 'MMMM dd, yyyy' ) } );
            }
        }
    });

    return Trailer;
});