//从session中得到文章id
var id = gets('id');
//从session中得到文章类型
var detailType = gets('navtype');
//导航相应部分变为active样式
$('.navmenu').eq(detailType).addClass('red');
//后台获取到的数据中没有基地图片路径时的备用图片途径
var baseimgs = {
    "c2912175e3de4d8b986c0f40d2e2d9ec":"./images/projects/nobase.png",
    "8fe457ac84ab4cd6ab393ca8481f97e7":"http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/bj_add01(1).jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/bj_add02(1).jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/bj_add03(1).jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/bj_add04(1).jpg",
    "cf5f59bb0d054d60b1d09a0cf6cebe80":"http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/nc_add01.jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/nc_add02.jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/nc_add03.jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/nc_add04.jpg",
    "fc88aa102da44f5d97917a1aabca29b1":"http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/dl_add01.jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/dl_add02.jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/dl_add03.jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/1/_thumbs/images/dtwl/bases/2016/09/dl_add04.jpg",
    "1c71f454d3324b73a19aaa1feadd7ff3":"http://www.datangnet.com.cn/datang_mgt/userfiles/bed1b81bd2af4c6cbd3950a9e30db49b/images/dtwl/bases/2017/04/1.jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/bed1b81bd2af4c6cbd3950a9e30db49b/images/dtwl/bases/2017/04/2.jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/bed1b81bd2af4c6cbd3950a9e30db49b/images/dtwl/bases/2017/04/3.jpg,http://www.datangnet.com.cn/datang_mgt/userfiles/bed1b81bd2af4c6cbd3950a9e30db49b/images/dtwl/bases/2017/04/4.jpg"
}

//请求获取文章详情数据
$.ajax({
    type: "post",
    url: "http://115.182.107.203:8088/ylkj-api/c/article/detail",
    data: {
        id: id
    },
    dataType: "json",
    success: function (response) {
        var data = response.data;
        if (detailType == 3) {
            var imgarr = data.imgs ? data.imgs.split(',') : baseimgs[id].split(',');
            var intro = data.intro || '紹介テキスト無し';
            $('.detail-container').append(
                `<div class="swiper-container">
                    <div class="swiper-wrapper"></div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
                <div class="base-text">
                    <div class="base-tit">${data.title}</div>
                    <p class="base-intro">${intro}</p>
                    <div class="base-contact">${data.content}</div>
                </div>
                <div id="base-map"></div>`
            );
            for (var i = 0; i < imgarr.length; i++) {
                $('.swiper-wrapper').append('<img class="swiper-slide" src=' + imgarr[i] + '>');
            }
            $('.loading').hide();

            if (imgarr.length > 1) {
                // -- Initialize Swiper --
                var mySwiper = new Swiper('.swiper-container', {
                    loop: true,
                    autoplay: 1000,
                    pagination: '.swiper-pagination',
                    paginationClickable: '.swiper-pagination',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    grabCursor: true,
                    effect: 'fade',
                    fade: {
                        crossFade: true,
                    }
                });
                $('.swiper-wrapper').mouseover(function () {
                    mySwiper.stopAutoplay();
                });
                $('.swiper-wrapper').mouseout(function () {
                    mySwiper.startAutoplay();
                });
            }

            var c = data.content;
            var addr = c.substring(c.indexOf('地址：') + 3, c.indexOf('</'));
            //创建和初始化地图
            MapUtil.initMap({ mapId: 'base-map', posi: addr });
            
        } else {
            $('.detail-container').append(
                `<p class="detail-title">${data.title}</p>
                <p class="detail-subtit"></p>
                <div class="detail">${data.content}</div>`
            );
            detailType == 1
                ? $('.detail-subtit').html(data.subTitle)
                : $('.detail-subtit').html('发布日期：' + msecformat(data.publishTime));
            $('.loading').hide();
        }
    }
});