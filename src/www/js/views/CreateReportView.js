// CreateReportView
// =============

define([ "jquery", "backbone", "text!../../templates/page.html", 'text!../../templates/createReport.html' ], function( $, Backbone, pageTemplate, creteReportTemplate ) {

    var CreateReportView = Backbone.View.extend( {

        initialize: function() {
            if (DEBUG) console.log('CreateReportView initialized');

            // Setup here listeners to UI / user-actions  (onclick, etc..)
        },

        render: function() {
            if (DEBUG) console.log('Rendering CreateReportView');
           
            // render page tenplate
            this.$el.html(_.template(pageTemplate, {
                page_id: 'createPage',
                content: _.template(creteReportTemplate, {})
            }));

            return this;
        }

    } );

    // Returns the View class
    return CreateReportView;

} );