$(document).on('pageinit', '#list', function(e, pageOptions) {
  var listElement = $('#list-reports', this);
  var listItemTemplate = _.template($('script#list-page-list-item-template').html(), null, {variable: 'reporte'});

  function onListClick() {
    ui.navTo($(this).attr('data-link'));
  }

  function onApiReset() {
    listElement.empty();
    $("#list-reports").listview("refresh");
    api.more();
  }

  function onApiMoreLoaded(data) {
    console.log('Data loaded: ', data);
    var i = 0;
    var html;
    var item;

    for(i=0; i< data.length; i++) {
      html = $.parseHTML(listItemTemplate(data[i]));
      item = $(html).on('click', onListClick);

      $("#list-reports").append(item);
    }

    $("#list-reports").listview("refresh");
  }

  $(".iscroll-wrapper", this).bind({
    iscroll_onpulldown: ui.onPullDown,
    iscroll_onpullup: ui.onPullUp
  });
  api.on('reset', onApiReset);
  api.on('more', onApiMoreLoaded);
  api.reset();
});

$(document).on('pagechange', function(e, pageOptions) {
  var idPage = pageOptions.toPage.attr("id");
  //$('a[data-rel="back"] .ui-btn-text').text("Volver");
  $('#'+idPage+' div[data-iscroll]').iscrollview('refresh');
  if (pageOptions.toPage.attr("id") == "list") {
    $('#report-video').hide();
    $('#report-img').hide();
    $("#report-description").text("");
    $("#report-title").text("");
  }
});
