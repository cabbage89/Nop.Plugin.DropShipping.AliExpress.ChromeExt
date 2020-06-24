$(function () {
  var $successTip = $('#save_success');
  $('#btn_save').click(function () {
    var baseUrl = $.trim($('#input_url').val());
    var token = $.trim($('#input_token').val());
    chrome.storage.sync.set({ baseUrl: baseUrl, token: token }, function () {
      $successTip.show();
      setTimeout(function () {
        $successTip.hide();
      }, 3000)
    });
  });
  chrome.storage.sync.get({ baseUrl: 'https://www.yourstore.com', token: "access_token" }, function (item) {
    $('#input_url').val(item.baseUrl);
    $('#input_token').val(item.token);
  });
});