$(document).on('pageinit', '#main', function(e, pageOptions) {

});

$(document).on('pagebeforeshow', '#main', function(e, pageOptions) {
  var report = manager.getCurrentReport();
  var status = report && report.getStatus();

  if (report && (status > ReportStatus.New) && (status < ReportStatus.Publishing)) {
    $('#edit-report-button', this).show();
  } else {
    $('#edit-report-button', this).hide();
  }
});
