// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "backbone", 'views/CreateReportView' ], function( $, Backbone, CreateReportView ) {

    var Router = Backbone.Router.extend( {

        initialize: function() {
            console.log('Router initialized');
            Backbone.history.start(); // Tells Backbone to start watching for hashchange events
        },

        // Backbone.js Routes
        routes: {
            "":               "createReport",
            "createPage":     "createReport",
            "listPage":       "listReports", 
            "showPage?:slug": "showReport",
            "trackPage":      "trackReports",
            "searchPage":     "searchReports",
        },

        createReport: function() {
            console.log('createReport');
            var self = this;

            if (typeof this.createReportView == 'undefined') {
                var createReportView = new CreateReportView({
                    el: $('body');
                });
            }

            $.mobile.changePage( "#createPage" , { reverse: false, changeHash: false } );            
        },

        listReports: function() {
            console.log('listReports');
            $.mobile.changePage( "#listPage" , { reverse: false, changeHash: false } );
        },

        showReport: function() {
            $.mobile.changePage( "#showPage" , { reverse: false, changeHash: false } );
        },

        trackReports: function() {
            $.mobile.changePage( "#trackPage" , { reverse: false, changeHash: false } );
        },

        searchReports: function() {
            $.mobile.changePage( "#searchPage" , { reverse: false, changeHash: false } );
        },

        // Category method that passes in the type that is appended to the url hash
        ashowReport: function(report) {

            // Stores the current Category View  inside of the currentView variable
            var currentView = this[ type + "View" ];

            // If there are no collections in the current Category View
            if(!currentView.collection.length) {

                // Show's the jQuery Mobile loading icon
                $.mobile.loading( "show" );

                // Fetches the Collection of Category Models for the current Category View
                currentView.collection.fetch().done( function() {

                    // Programatically changes to the current categories page
                    $.mobile.changePage( "#" + type, { reverse: false, changeHash: false } );
    
                } );

            }

            // If there already collections in the current Category View
            else {

                // Programatically changes to the current categories page
                $.mobile.changePage( "#" + type, { reverse: false, changeHash: false } );

            }

        }

    } );

    // Returns the Router class
    return Router;

} );