$(document).on('pageinit', '#list', function(e, pageOptions) {
  var listElement = $('#list-reports', this);
  var listItemTemplate = _.template($('script#list-page-list-item-template').html(), null, {variable: 'reporte'});

  function onApiReset() {
    listElement.empty();
    //$("#list-reports").listview("refresh");
    api.more();
  }

  function onApiMoreLoaded(data) {
    console.log('Data loaded');
    var i = 0;
    var html = '';

    for(i=0; i< data.length; i++) {
      $("#list-reports").append(listItemTemplate(data[i]));
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
