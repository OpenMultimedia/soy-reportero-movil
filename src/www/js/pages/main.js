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

  $(document).on('pagechange', function(e, pageOptions) {
  currentPage = pageOptions.toPage[0].id;

  //$("#"+pageOptions.toPage[0].id+".content").height($(window).height() - $("#"+pageOptions.toPage[0].id+".ui-footer").height() - $("#"+pageOptions.toPage[0].id+".ui-header").height());

  if (pageOptions.options.fromPage && pageOptions.options.fromPage[0].id == "listPage") {
    //wht to do when one leaves the page
  }

  switch (pageOptions.toPage[0].id) {

    case 'select':
      var report = manager.getCurrentReport();
      if (!report || (report.getStatus() > ReportStatus.New))
        manager.newReport();
    break;

    case 'formPage': //'editReport':
    break;

    case "listPage":
    break;
    case "showReport":
    break;
  //api.more();
  }
});


$("#file-id-input").on("change", function() {


  console.log("cambio");
  $("#send-button-container").html('<a data-role="button" id="send-button" data-icon="check">Enviar Reporte</a>');
  $("#send-button-container").trigger("create");
  $("#send-button").on("click", function() {
    post_report();
  });
});

$(".report-list-item").on("tap", function() {
  console.log($(this).attr("data-slug"));
  console.log("hee");
});
