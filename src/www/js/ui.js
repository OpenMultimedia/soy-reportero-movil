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
    manager.upload();

    ui.navTo('#form');
  },
  onCaptureError: function(error) {
    console.error(error);
  },
  onUploadProgress: function(p) {
    var full = $('#progress-container').width();

    $('#progress-bar-indicator').width(full / 100 * p.percentLoaded);

    $('#progress-text').text('Subiendo archivo: ' + p.percentLoaded + '%');
  },
  onUploadError: function() {
    $('#progress-text').text('Error subiendo el archivo');
    $('#progress-retry-button').show();
  },
  onUploadSuccess: function() {
    var full = $('#progress-container').width();
    $('#progress-bar-indicator').width(full);
    $('#progress-text').text('Archivo subido con éxito');
    $('#send-button-container').show();
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

    console.log("Params", tipo, slug);
    ui.setSelectedReport(tipo, slug);

    var report = api.fromCache(ui.selectedSlug);

    //TODO: Comportamiento cuando el reporte no existe
    if (!report) return;

    var isVideo = (ui.selectedType == TipoReporte.Video);

    $("#report-img").hide();

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
