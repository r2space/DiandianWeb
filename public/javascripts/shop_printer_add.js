/**
 * Created by ZengXR on 12/12/13.
 */

$(function () {
  'use strict';

  var printerId = $('#printerId').val();
  render(printerId);

  $("#savePrinter").bind("click", function(event){

    var printer = {
      name: $("#name").val()
      , IP: $("#IP").val()
      , invoiceHead: $("#invoiceHead").val()
      , invoiceTail: $("#invoiceTail").val()
      , type: $("#inputType").attr("value")
    };

    if (!check_printer(printer)) {

      if (printerId) {

        printer.id = printerId;

        smart.dopost("/printer/update.json", printer, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.update.error"],false);
          } else {
            window.location = "/shop/printer/list";
          }
        });
      } else {
        smart.dopost("/printer/add.json", printer, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.add.error"],false);
          } else {
            window.location = "/shop/printer/list";
          }
        });
      }
    }
  });

});

function render(printerId) {

  if (printerId) {

    smart.doget("/printer/findOne.json?printerId=" + printerId , function(err, result) {
      if (err) {
        smart.error(err,i18n["js.common.search.error"],false);
      } else {

        $("#name").val(result.name);
        $("#IP").val(result.printerIP);
        $("#invoiceHead").val(result.invoiceHead);
        $("#invoiceTail").val(result.invoiceTail);
        new ButtonGroup("inputType", result.type).init();
      }
    });
  } else {
    new ButtonGroup("inputType", "0").init();
  }
}

function check_printer(printer) {
  var flag = 0;
  if (printer.name == "") {
    Alertify.log.error(i18n["js.public.check.printer.name"]);
    flag = 1;
  } else if (printer.capacity == "") {
    Alertify.log.error(i18n["js.public.check.printer.capacity"]);
    flag = 1;
  } else if (printer.type == "") {
    Alertify.log.error(i18n["js.public.check.printer.type"]);
    flag = 1;
  }

  return flag;
}
