// CreateReportView
// =============

// Includes file dependencies
define([ "jquery", "backbone","text!../templates/page.html", 'text!../templates/createReport.html' ], function( $, Backbone, CategoryModel, pageTemplate, creteReportTemplate ) {

    // Extends Backbone.View
    var CreateReportView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {

            // The render method is called when Category Models are added to the Collection
            //this.collection.on( "added", this.render, this );

        },

        // Renders all of the Category models on the UI
        render: function() {
            var page_template = _.template(pageTemplate, { 'page_id': 'createPage'});
            this.$el.html(page_template);

            this.template = _.template(creteReportTemplate, {})
            this.$el.find('[data-role="content"]').html(this.template);

            return this;
        }

    } );

    // Returns the View class
    return CreateReportView;

} );