jQuery.support.cors = true; //IE8本地测试用，服务器上无效
//TODO： IE8下ajax请求的跨域问题
if(isIE()){
    alert('Please update your browser! Do not use IE any more! FUCK IE!');
}

//主机地址
var host = 'http://115.182.107.203:8088';

function appendData(data, successfn) {
    $.ajax({
        type: "post",
        url: "http://115.182.107.203:8088/ylkj-api/c/article/grid",
        data: data,
        dataType: "text",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
            console.log(errorThrown);
            alert('读取数据失败!');
        },
        success: function(res, status, xhr){
            successfn(res);
        }
    });
}

//请求获取首页项目数据
appendData({
    typeCodes: ["hlwms", "hlwcy"], //互联网-民生 互联网-产业
    limit: 5  //显示5条
}, function (response) {
    var data = $.parseJSON(response).data;
    $('.swiper-wrapper').empty();
    for (var k = 0; k < 5; k++) {
        $('.swiper-wrapper').append('<div class="swiper-slide"><img class="slideimg" src="./images/projects/u211.png" alt=""></div>');
        $('.slideimg').eq(k).attr('src', host + data[k].middleImg);
        $('.slideimg').eq(k).wrap('<a href="project.html"></a>');
    }
    var shownum = $(window).width() > 751 ? 4 : 1;
    //获取到项目数据后初始化Swiper
    var mySwiper = new Swiper('.swiper-container', {
        //水平方向滑动
        direction: 'horizontal',
        //循环
        loop: true,
        //自动开始滑动
        autoplay: 3000,
        //设置slider容器能够同时显示的slides数量(carousel模式)
        slidesPerView: shownum,
        //在carousel模式下定义slides的数量多少为一组
        slidesPerGroup: 1,
        //slide之间的距离（单位px）
        spaceBetween: 10,
        //设定slide与边框的预设偏移量（单位px）
        slidesOffsetBefore: 5,
        slidesOffsetAfter: 5,
        //鼠标滑轮控制
        // mousewheelControl: true,
        // 前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    });
    //IE8下的前进后退按钮功能
    if (isIE()) {
        $('.arrow-left').on('click', function (e) {
            e.preventDefault();
            mySwiper.swipePrev();
        });
        $('.arrow-right').on('click', function (e) {
            e.preventDefault();
            mySwiper.swipeNext();
        });
    }
}
);

//请求获取首页资讯数据
appendData({
        typeCodes: ["information", "mediaReport"],//公司资讯 媒体报道
        limit: 3  //显示3条
    },function (response) {
        var data = $.parseJSON(response).data;
        var newsdiv = $('.newsdiv');
        var newsimg = $('.newsimg');
        var newsintro = $('.newstit');
        var newstit = $('.post');
        var len = newsimg.length;
        for (var i = 0; i < len; i++) {
            newsimg.eq(i).attr('src', host + data[i].smallImg);
            newsimg.eq(i).parent().attr('href', 'news_detail.html');
            newsintro.eq(i).html('<a class="news-intro-a" href="news_detail.html" target="_blank">' + data[i].intro + '</a>');
            newstit.eq(i).text(data[i].title);
            newsdiv.eq(i).append('<input class="inp-hid" type="hidden" value=' + data[i].id + '>');
        }
        //链接被点击时保存文章id到session
        newsdiv.click(function () {
            saves('id', $(this).find('.inp-hid').val());
            saves('navtype', 4);
        });
    }
);

//请求获取首页活动数据
appendData({
        typeCodes: ["activity"], //活动
        limit: 4  //显示4条
    },function (response) {
        var data = $.parseJSON(response).data;
        var len = $('.actidiv').length;
        for (var j = 0; j < len; j++) {
            $('.acti-img img').eq(j).attr('src', data[j].smallImg);
            $('.acti-status').eq(j).text(data[j].attr.activityStatus);
            $('.acti-tit').eq(j).text(data[j].title);
            $('.acti-time').eq(j).text('活动时间：' + data[j].subTitle);
            $('.acti-posi').eq(j).text('活动地点：' + data[j].intro);
            $('.actidiv').eq(j).wrap('<a href="news_detail.html" target="_blank"></a>');
            $('.actidiv').eq(j).append('<input class="inp-hid" type="hidden" value=' + data[j].id + '>');
        }
        $('.actidiv').click(function () {
            saves('id', $(this).find('.inp-hid').val());
            saves('navtype', 5);
        });
    }
);

//请求获取首页基地数据
appendData({
        typeCodes: ["jidi"], //获取基地列表
        limit: 2000
    },function (response) {
        var data = $.parseJSON(response).data;
        var count =$.parseJSON(response).totalCount;
        var base = $('.baseimgdiv');
        var city = [];
        city.push('北京');
        for (var j = 0; j < count; j++) {
            j > 0 ? city.push(data[j].title.replace('孵化基地', '')) : 0;
            var pinyin = ConvertPinyin(city[j]).toUpperCase(); //转化汉字为拼音(大写,无声调)
            pinyin == 'XIAN' ? pinyin = "XI'AN" : 0;
            base.append(
                '<a href="news_detail.html" title=' + data[j].intro + '>' +
                '<div class="baseimg">' +
                '<div class="before"></div>' +
                '<img src=' + host + data[j].smallImg + '>' +
                '<div class="city">' +
                '<img class="hexagon" src="./images/index/liubianxing.png">' +
                '<div class="city-name"><b>' + city[j] + '</b><br>' + pinyin + '</div>' +
                '</div>' +
                '<input class="inp-hid" type="hidden" value=' + data[j].id + '>' +
                '</div>' +
                '</a>'
            );
            $('.baseimg').click(function () {
                saves('id', $(this).find('.inp-hid').val());
                saves('navtype', 3);
            });
        }
        $('.loading').hide();

        //IE8不支持CSS3的transition属性，用jQuery的animate代替
        //So IE8 users don't deserve nice looking websites anyway :-) I can't agree more about this :-)
        if (isIE()) {
            $('.baseimg').hover(function () {
                // over
                $(this).find(".city").animate({
                    top: -85,
                    left: -75
                }, "normal");
            }, function () {
                // out
                $(this).find(".city").animate({
                    top: 0,
                    left: 0
                }, "normal");
            });
        }
    }
);

//点击时导航菜单显示隐藏切换
$('.xsbtn').click(function () {
    $('.navdiv').slideToggle();
    $('.xsbtn').toggleClass('xsbtn-close');
});
