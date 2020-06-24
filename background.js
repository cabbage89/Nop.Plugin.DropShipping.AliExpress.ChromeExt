chrome.extension.onMessage.addListener(function (objRequest, _, sendResponse) {
  if (objRequest.cmd == 'ajax') {
    $.ajax($.extend(objRequest.param, {
      success: function (data, textStatus, jqXHR) {
        sendResponse({
          success: true,
          data: data,
          textStatus: textStatus,
          jqXHR: jqXHR
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        sendResponse({
          success: false,
          XMLHttpRequest: XMLHttpRequest,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
      }
    }, true));
  } else if (objRequest.cmd == "activate_icon") {
    chrome.pageAction.show(sender.tab.id);
  }
});