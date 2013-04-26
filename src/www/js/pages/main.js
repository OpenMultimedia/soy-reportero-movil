$(document).on('pageinit', '#main', function(e, pageOptions) {
  var buttons = [{
    selector: '#capture-photo-button',
    mediaType: MediaType.Picture,
    mediaSource: MediaSource.Camera
  }, {
    selector: '#capture-video-button',
    mediaType: MediaType.Video,
    mediaSource: MediaSource.Camera
  }, {
    selector: '#select-photo-button',
    mediaType: MediaType.Picture,
    mediaSource: MediaSource.Library
  }, {
    selector: '#select-video-button',
    mediaType: MediaType.Video,
    mediaSource: MediaSource.Library
  }];

  for (var i = 0; i < buttons.length; i += 1) {
    var button = buttons[i];
    if (CordovaDevice.supportsMedia(button.mediaType, button.mediaSource)) {
      $(e.target).
        find(button.selector).
        show().
        on('click', _.partial(ui.launchCapture, button.mediaType, button.mediaSource));
    }
  }

  manager.on(ReportEvent.CaptureSuccess, _.bind(ui.onCaptureSuccess, ui));
  manager.on(ReportEvent.CaptureError, _.bind(ui.onCaptureError, ui));
  manager.on(ReportEvent.UploadSuccess, _.bind(ui.onUploadSuccess, ui));
  manager.on(ReportEvent.UploadProgress, _.bind(ui.onUploadProgress, ui));
  manager.on(ReportEvent.UploadError, _.bind(ui.onUploadError, ui));
});

$(document).on('pagebeforeshow', '#main', function(e, pageOptions) {
  var report = manager.getCurrentReport();

  if (report.getStatus() == ReportStatus.Published) {
    report = manager.newReport();
  }

  if ((report.getStatus() > ReportStatus.Created) && (report.getStatus() < ReportStatus.Publishing)) {
    $('#edit-report-button', this).show();
  } else {
    $('#edit-report-button', this).hide();
  }
});
