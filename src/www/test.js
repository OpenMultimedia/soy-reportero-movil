var ui;
var report_list = {};
var selected_slug;

$(document).ready(
    function() {
      $(".ui-content").height($(window).height() - $(".ui-footer").height() - $(".ui-header").height()-30);
    }
);

document.addEventListener("deviceready", function() {
  ui.phone.init();
  console.log(ui);

},false);

$(document).on('pageinit', function(e, pageOptions) {

        if(ui){
          ui.setContetSize(e.target.id);
        } else {
          ui = new UserInterface();
          ui.init();
          ui.setContetSize(e.target.id);
        }
        switch (e.target.id) {
            case "listPage":
              ui.setListPage();
              break;
          case "showReport":
              ui.showReport();
              break;
          case "createReport":
              ui.setCreatePage();
              ui.capturePhoto();
              break;
          }
}).on('pagechange', function(e, pageOptions) {
        ui.setContetSize(pageOptions.toPage[0].id);
        switch (pageOptions.toPage[0].id) {
            case "listPage":
              break;
            case "showReport":
              ui.showReport();
        }
});