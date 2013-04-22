PageView = Backbone.View.extend({
  template: _.template($('#page-template').html()),

  render: function() {
    var html = this.template({
      page_id: this.options.page_id
    });

    $(this.el).append(html);
  }
});