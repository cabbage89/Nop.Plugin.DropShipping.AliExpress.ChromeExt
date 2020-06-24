$(function () {
    console.log(`[${CABBAGE_PRODUCT_HUNTER.NAME}]加载中...`);

    function productDetail() {
        //标题
        var title = $.trim($('.ma-title').text());
        //分类
        var categories = $.map($('.detail-breadcrumb li'), function (n) {
            var $li = $(n), name = $.trim($li.find('a').text());
            return name;
        });
        //供应商
        var $link_verdor = $('a.company-name-lite-vb');
        var verdor = {
            name: $.trim($link_verdor.attr('title')),
            link: $link_verdor.attr('href')
        };
        //sku属性
        var skuAttr = [];
        $('#skuWrap dl').each(function () {
            var $me = $(this), $dt = $me.children('dt'), $dd = $me.children('dd'), $ddspan = $dd.children('span');
            var skuAttrName = $dt.text().replace(':', '');
            var skuAttrVal = $.map($ddspan, function (n) {
                return $.trim($(n).text());
            });
            skuAttr.push({
                name: skuAttrName,
                val: skuAttrVal
            });
        });
        //图片
        var productImgs = $.map($('ul.inav.util-clearfix li'), function (n) {
            var $me = $(n); imgUrl = $.trim($me.find('img').attr('src'));
            return imgUrl;
        });
        //规格属性
        var spec = $.map($('.do-entry:contains("Quick Details") dl'), function (n) {
            var $dl = $(n), name = $.trim($dl.find("dt").text()).replace(':', ''), val = $.trim($dl.find('dd').text());
            return { name: name, val: val }
        });
        //描述
        var desc = $.trim($('.module-productSpecification').html());
        var product = {
            aliId: /(\d+)\.html/.exec(location.pathname)[1],
            aliUrl: location.origin + location.pathname,
            vendor: verdor,
            title: title,
            categories: categories,
            skuAttr: skuAttr,
            productImgs: productImgs,
            spec: spec,
            desc: desc
        };
        console.log(`===========[${CABBAGE_PRODUCT_HUNTER.NAME}]产品信息==============`);
        console.log(product);
    }
    var timer = setInterval(() => {
        if ($('.module-productSpecification').length) {
            clearInterval(timer);
            productDetail();
        }
    }, 1000);
});