$(function () {

  $.Deferred(getApiInfo)
    .done(init);

  function getApiInfo(dtd) {
    chrome.storage.sync.get({ baseUrl: 'https://www.yourstore.com', token: "access_token" }, function (item) {
      dtd.resolve(item.baseUrl, item.token);
    });
  }

  function init(URL_NOP_BASE, ACCESS_TOKEN) {
    eval($('script:contains("runParams")').html());
    console.log(window.runParams.data);

    var $btn_upload = $(`<span class="addcart-wrap" aria-haspopup="true" aria-expanded="false"><button title="" style="background-color:darkblue;" type="button" class="next-btn next-large next-btn-primary" role="button">${T('SyncToNop')}</button></span>`)
      .appendTo($('.product-action'))
      .children('button')
      .click(upload);
    var timer;
    function upload() {
      //防抖
      clearTimeout(timer);
      timer = setTimeout(() => {
        $btn_upload.text(T('Synchronizing')).parent().addClass('tbc_loader');
        chrome.extension.sendMessage({
          cmd: 'ajax',
          param: {
            type: 'post',
            crossDomain: true,
            cache: false,
            async: false,
            url: `${URL_NOP_BASE}/AliexpressDropShipping/CreateOrUpdateProduct`,
            contentType: "application/json",
            //dataType:'json',
            data: JSON.stringify(window.runParams.data),
            headers: {
              "X-AE2NOP-TOKEN": ACCESS_TOKEN
            }
          }
        }, function (result) {
          $btn_upload.parent().removeClass('tbc_loader');
          if (!result.success) {
            console.error(`======产品上架失败======`);
            console.error(result);
            $btn_upload.css({ backgroundColor: 'palevioletred' }).attr({ title: result.XMLHttpRequest.statusText }).text(T('RetrySync'));
          } else {
            $btn_upload.css({ backgroundColor: 'gray' }).attr({ disabled: 'disabled', title: `${result.data.Sku}上架成功,产品Id为:${result.data.Id}` }).text(T('Synced'));
            //window.open(`${URL_NOP_BASE}/product/ProductDetails?productId=${result.data.Id}`);
            window.open(`${URL_NOP_BASE}/Admin/Product/Edit/${result.data.Id}`);
          }
        });
      }, 500);
    }

    chrome.extension.sendMessage({
      cmd: 'ajax',
      param: {
        type: 'get',
        crossDomain: true,
        cache: false,
        async: false,
        headers: {
          "X-AE2NOP-TOKEN": ACCESS_TOKEN
        },
        url: `${URL_NOP_BASE}/AliexpressDropShipping/GetProductBySku?sku=${window.runParams.data.pageModule.productId}`,
      }
    }, function (result) {
      if (!result.success || typeof (result.data) != "object") {
        console.error(`======获取SKU失败======`);
        console.error(result);
        var $cfgErr = $(`<span class="addcart-wrap" aria-haspopup="true" aria-expanded="false"><span style="background-color:darkred;" class="next-btn next-large next-btn-primary">${T("configErr")}</span></span>`)
          .appendTo($('.product-action'));
        $btn_upload.hide();
      } else {
        if (result.data && result.data.length > 0) {
          var product = result.data[0];
          $btn_upload.css({ backgroundColor: 'green' }).attr({ title: T(`skuExisted`, product.Sku, product.Id) }).text(T('SyncLatest'));
          if (product.Published) {
            var $viewLink = $(`<span class="addcart-wrap" aria-haspopup="true" aria-expanded="false"><a target="_blank" style="background-color:deepskyblue;" class="next-btn next-large next-btn-primary" href="${URL_NOP_BASE}/product/ProductDetails?productId=${product.Id}">${T("ViewInNop")}</a></span>`)
              .appendTo($('.product-action'));
          }
          var $editLink = $(`<span class="addcart-wrap" aria-haspopup="true" aria-expanded="false"><a target="_blank" style="background-color:darkred;" class="next-btn next-large next-btn-primary" href="${URL_NOP_BASE}/Admin/Product/Edit/${product.Id}">${T("EditInNop")}</a></span>`)
            .appendTo($('.product-action'));

        }
      }
    });
  }
});