var manager = new ReportManager();

var api = new ApiStream({pageSize: 10});

var ui = {
  getActivePage: function() {
    return $.mobile.activePage;
  },
  getActivePageId: function() {
    return ui.getActivePage().attr('id');
  },
  setSelectedReport: function(type, slug) {
    ui.selectedType =  type;
    ui.selectedSlug = slug;
  },
  navTo: function(page) {
    $.mobile.changePage(page);
  },
  launchCapture: function(type, source) {
    manager.capture(type, source);
  },
  onCaptureSuccess: function(uri) {
    console.log('Captured: ' + uri);
    ui.navTo('#form');
    manager.upload();
  },
  onCaptureError: function(error) {
    console.error(error);
  },
  onUploadProgress: function(p) {

  },
  onUploadError: function() {

  },
  onUploadSuccess: function() {

  },
  onPullDown: function() {
    api.reset();
  },
  onPullUp: function() {
    api.more();
  }
};

var router = new $.mobile.Router({
  '#view(?:[?]([^\:]+):(.*))': {
    handler: 'view',
    events: 's'
  }
},{
  'view': function(type, match, pageOptions) {
    var tipo = match[1];
    var slug = match[2];

    ui.setSelectedReport(tipo, slug);

    var report = api.fromCache(ui.selectedSlug);

    //TODO: Comportamiento cuando el reporte no existe
    if (!report) return;

    var isVideo = (ui.selectedType == TipoReporte.Video);

    $("#report-img").hide();
    $("#report-title").text(report.titulo);
    $("#report-description").text(report.descripcion);

    if(isVideo) {
      $('#report-img').hide();

      $("#report-video").show().omplayer({
        slug: report.slug,
        width: $("#report-video").width(),
        height: $("#report-video").width() / 4 * 3
      });

    } else {
      $('#report-video').hide();
      $("#report-img").show().attr("src", report.thumbnail_grande);
    }
  }
},{
  defaultHandler: function(type, pageOptions, page) {
    console.log('Default handler called due to unknown route (' +
      type + ', ' + pageOptions + ', ' + page.id + ')');
  },
  defaultHandlerEvents: 's'
});
