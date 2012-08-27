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
            var self = this,
	            i,
	            trailerSitePrefix = "http://trailers.apple.com",
	            trailerLocation,
	            posterAttribute = 'poster',
	            splitUrlArr,
	            posterUrl,
	            posterExtension,
	            rDate,
	            parsedDate,
	            genreList,
	            castList,
	            trailerDescList,
	            trailerDesc,
	            isAnyTrailerExclusive,
	            trailerTypePrefix,
	            previewNameSplit,
	            previewName,
	            trailerList = [];

	        trailerLocation = self.get( "location" );

            // Simplify poster access
	        splitUrlArr  = self.get( posterAttribute ).split( posterAttribute );

	        posterUrl  = splitUrlArr[0];
	        posterExtension  = splitUrlArr[1];

            self.set( { posterLarge: posterUrl + posterAttribute + '-large' + posterExtension } );
            self.set( { posterXLarge: posterUrl + posterAttribute + '-xlarge' + posterExtension } );

	        self.set( { backgroundImg: trailerSitePrefix + trailerLocation + 'images/background.jpg' } );

            // Parse release date
	        rDate  = self.get( 'releasedate' );
            if( rDate !== undefined ){
                rDate = rDate.split( ' -' )[0];
	            parsedDate  =  Date.parseExact( rDate, 'ddd, d MMM yyyy hh:mm:ss' );

                self.set( { releaseDateTxt: parsedDate.toString( 'MMMM dd, yyyy' ) } );
            }

	        // Format genre list
	        genreList = self.get( 'genre' );
	        if( genreList ){
		        self.set( { genreListTxt: genreList.toString().split( ',' ).join( ', ' ) } );
	        }

	        // Format cast list
	        castList = self.get( 'actors' );
		    if( castList ){
			    self.set( { castListTxt: castList.toString().split( ',' ).join( ', ' ) } );
		    }

	        trailerDescList = self.get('trailers');

	        // Sometimes the trailer list is just a single object... so make it into an array
	        if( _.isArray( trailerDescList ) === false )
		        trailerDescList = [ trailerDescList ];

	        for( i=0; i < trailerDescList.length; i++ ){
		        trailerDesc = trailerDescList[ i ];

		        previewNameSplit = trailerLocation.split( '/' );
		        previewName = '/movies/' + previewNameSplit[ previewNameSplit.length - 3 ];
		        previewName += '/' + previewNameSplit[ previewNameSplit.length - 2 ];
		        previewName += '/' + previewNameSplit[ previewNameSplit.length - 2 ];

		        if( !isAnyTrailerExclusive && trailerDesc.exclusive === "true" )
			        isAnyTrailerExclusive = true;

		        switch( trailerDesc.type ){
			        case( "Featurette" ):
				        trailerTypePrefix = '-fte1_h';
				        break;
			        case( "Clip" ):
				        trailerTypePrefix = '-clip_h';
				        break;
			        case( "Trailer 2" ):
				        trailerTypePrefix = '-clip_h';
				        break;
			        case( "Trailer" ):
			        default:
				        trailerTypePrefix = '-tlr1_h';
				        break;
		        }

		        trailerList.push({
			        videoType: trailerDesc.type,
			        videoSmall: trailerSitePrefix + previewName + trailerTypePrefix + '480p.mov',
			        videoMedium: trailerSitePrefix + previewName + trailerTypePrefix + '720p.mov',
			        videoLarge: trailerSitePrefix  + previewName + trailerTypePrefix + '1080p.mov'
		        });
	        }

	        // Detect whether the trailer is exclusive
	       self.set( { isExclusive: isAnyTrailerExclusive } );

	        // Format Trailer Video Url
	        self.set( { trailerList: trailerList } );
        }
    });

    return Trailer;
});