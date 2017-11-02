//iaas部分的鼠标hover时动画
$('.iaas-intro').hover(function () {
    // over
    $(this).find('.intro-hover').show();
    $(this).find('.intro-hover').css('right', 0);
}, function () {
    // out
    $(this).find('.intro-hover').css('right', -380);
    setTimeout(() => {
        $(this).find('.intro-hover').hide();
        $(this).find('.intro-hover').css('right', 380);
    }, 100);
});

//菜单切换
Menutab('srvtab', 'srv-cnt', 'srvontab');

//向页面添加创业服务数据
$.ajax({
    type: "post",
    url: "http://115.182.107.203:8088/ylkj-api/c/article/grid",
    data: {
        typeCodes: ["cyfw"],
        limit: 2000
    },
    dataType: "json",
    success: function (response) {
        var data = response.data;
        var count = response.totalCount;
        var csrv = $('.csrv');
        for (var j = 0; j < count; j++) {
            /^\//.test(data[j].smallImg) ? data[j].smallImg = host + data[j].smallImg : 0;
            csrv.append(
                `<a href="news_detail.html" target="_blank">
                    <div class="carveout-srv">
                        <img src=${data[j].smallImg}>
                        <div class="cs-content">
                            <b>${data[j].title}</b><p>${data[j].subTitle}</p>
                        </div>
                        <input class="inp-hid" type="hidden" value=${data[j].id}>
                    </div>
                </a>`
            );
        }

        $('.carveout-srv').click(function () {
            saves('id', $(this).find('.inp-hid').val());
            saves('navtype', 1);
        });

        $('.loading').hide();
    }
});

//创建和初始化地图
MapUtil.initMap({
    mapId: 'bdmap',
    posi: [120.418652, 36.095708],
    markerArr: [{
        title: "青岛实训基地",
        content: "详细地址：银川西路67号动漫产业园C座203",
        point: [120.421552, 36.094177],
        isOpen: 0,
        icon: { w: 21, h: 21, l: 0, t: 0, x: 6, lb: 5 }
    }]
});


