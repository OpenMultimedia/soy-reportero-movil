$(document).on('pageinit', '#select', function(e, pageOptions) {

});

$(document).on('pagebeforeshow', '#select', function(e, pageOptions) {
  var report = manager.getCurrentReport();
  if (!report || report.getStatus() == ReportStatus.Published) {
    manager.newReport();
  }
});
