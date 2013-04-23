// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "backbone", 'views/CreateReportView' ], function( $, Backbone, CreateReportView ) {

    var MobileRouter = Backbone.Router.extend( {

        initialize: function() {
            if (DEBUG) console.log('Router initialized');
            Backbone.history.start(); // Tells Backbone to start watching for hashchange events
        },

        routes: {
            "":               "createReport",
            "createPage":     "createReport",
            "listPage":       "listReports", 
            "showPage?:slug": "showReport",
            "trackPage":      "trackReports",
            "searchPage":     "searchReports",
        },

        createReport: function() {
            if (DEBUG) console.log('createReport route');

            // create new View if it does not exist yet

            this.createReportView = this.createReportView ||
                 new CreateReportView( { el: $("#createPage") } ).render();

            // change view
            $.mobile.changePage("#createPage", { reverse: false, changeHash: false } );            
        },

        listReports: function() {
            this.listPageView = this.listPageView ||
                new ListPageView( { el: $('body') } ).render();

            $.mobile.changePage("#listPage", { reverse: false, changeHash: false } );            
        },

        showReport: function(report) {
            this.showReportView = this.showReportView ||
                new ShowReportView( { report: report, el: $('body') } );

            $.mobile.changePage("#showPage", { reverse: false, changeHash: false } );            
        },

        // trackReports: function() {
        //     this.showReportView = this.showReportView |
        //         new ShowReportView( { el: $('body') } );

        //     $.mobile.changePage( ."#showPage", { reverse: false, changeHash: false } );            
        // },

        // searchReports: function() {
        //     $.mobile.changePage( "#searchPage" , { reverse: false, changeHash: false } );
        // },

        // Category method that passes in the type that is appended to the url hash

      
    } );

    // Returns the Router class
    return MobileRouter;

} );