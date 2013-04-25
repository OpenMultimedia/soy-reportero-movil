function cleanForm() {
  $("#name-input").val("");
  $("#title-input").val("");
  $("#description-input").val("");
  $("#description-input").text("");

  $("#send-button").hide();
}

$(document).on('pagecreate', '#form', function(e, pageOptions) {
  $('#send-button').on('click', function(e) {

    manager.getCurrentReport().setInfo({
      'titulo': $("#name-input").val(),
      'report': $("#description-input").val(),
    });

    $("#send-button").hide();
    $('#send-progress-text').text("Publicando...").show();
    $("#send-continue-button").hide();

    $('#form div[data-iscroll]').iscrollview('refresh');

    manager.publish();
  });

  manager.on(ReportEvent.UploadSuccess, function(data) {
    var full = $('#progress-container').width();

    $('#progress-bar-indicator').width(full);
    $('#progress-text').text('Archivo subido con éxito');

    $("#send-button").show();
    $('#send-progress-text').hide();
    $("#send-continue-button").hide();

    $('#form div[data-iscroll]').iscrollview('refresh');
  });

  manager.on(ReportEvent.UploadProgress, function(p) {

    var full = $('#progress-container').width();

    $('#progress-bar-indicator').width(full / 100 * p.percentLoaded);
    $('#progress-text').text('Subiendo archivo: ' + p.percentLoaded + '%');
  });

  manager.on(ReportEvent.UploadError, function(e) {
    $('#progress-text').text('Error subiendo el archivo');

    //TODO: Enable Retry button functionality
    $('#progress-retry-button').show();

    $('#form div[data-iscroll]').iscrollview('refresh');
  });

  manager.on(ReportEvent.PublishSuccess, function(data) {
    console.log("Yeah");
    $("#send-button").hide();
    $('#send-progress-text').text("Reporte publicado con éxito").show();
    $("#send-continue-button").show();

    $('#form div[data-iscroll]').iscrollview('refresh');
  });
});

$(document).on('pagebeforeshow', '#form', function(e, pageOptions) {
  var report = manager.getCurrentReport();

  if (report.getStatus() <= ReportStatus.MediaUploading) {

    $('#progress-retry-button').hide();
    $('#send-button').hide();
    $('#send-progress-text').hide();
    $("#send-continue-button").hide();

  } else if (report.getStatus() >= ReportStatus.MediaUploaded) {

    $('#progress-retry-button').hide();
    $('#send-button').show();
    $('#send-progress-text').hide();
    $("#send-continue-button").hide();

  }

  $('#form div[data-iscroll]').iscrollview('refresh');
});
