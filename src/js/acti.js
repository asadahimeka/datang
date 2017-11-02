//请求获取所有活动相关数据
$.ajax({
    type: "post",
    url: "http://115.182.107.203:8088/ylkj-api/c/article/grid",
    data: {
        typeCodes: ["activity"], //所有活动
        limit: 2000
    },
    dataType: "json",
    success: function (response) {
        var data = response.data;
        var count = response.totalCount;
        var acti = $('.acti-container');
        for (var j = 0; j < count; j++) {
            acti.append(
                `<div class="actidiv">
                    <div class="acti-img">
                        <a href="news_detail.html" target="_blank"><img src="./images/index/u48.png"></a>
                        <div class="acti-status">${data[j].attr.activityStatus}</div>
                    </div>
                    <div class="acti-cnt">
                        <p class="acti-tit"><a href="news_detail.html" target="_blank">${data[j].title}</a></p>
                        <p class="acti-time">活动时间：${data[j].subTitle}</p>
                        <p class="acti-posi">活动地点：${data[j].intro}</p>
                    </div>
                    <input class="inp-hid" type="hidden" value=${data[j].id}>
                </div>`
            );
            /^\//.test(data[j].smallImg)
                ? $('.acti-img img').eq(j).attr('src', host + data[j].smallImg)
                : $('.acti-img img').eq(j).attr('src', data[j].smallImg);
        }
        //链接被点击时保存文章id到session
        $('.actidiv').click(function () {
            saves('id', $(this).find('.inp-hid').val());
            saves('navtype', 5);
        });
        //移除Loading
        $('.loading').remove();
    }
});

//select筛选活动类型
$('.sel-acti').change(function () {
    $('.loading').remove();
    $('.actidiv').show();
    var sel_text = $('.sel-acti').find('option:selected').text();
    if ($('.sel-acti').val() != 0) {
        var sts = $('.acti-status');
        var num = 0;
        for (var k = 0, slen = sts.length; k < slen; k++) {
            if (sts.eq(k).text() != sel_text) {
                $('.actidiv').eq(k).hide();
                num++;
            }
        }
        num == $('.actidiv').length ? $('.seldiv').after('<div class="loading">No Activity</div>') : 0;
    } else {
        $('.actidiv').length ? 0 : $('.seldiv').after('<div class="loading">No Activity</div>');
    }
});