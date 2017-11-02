//菜单切换
Menutab('tab', 'newslist', 'ontab');
//月份缩写数组
var moutharr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
//向页面添加资讯数据
appendNews(["information"], 0);
appendNews(["mediaReport"], 1);

function appendNews(typeCodes, index) {
    $.ajax({
        type: "post",
        url: "http://115.182.107.203:8088/ylkj-api/c/article/grid",
        data: {
            typeCodes: typeCodes,
            limit: 2000
        },
        dataType: "json",
        success: function (response) {
            var data = response.data;
            var count = response.totalCount;
            //TODO： 先按发布时间对data排序 (kari)
            data = data.sort((a, b) => b.publishTime - a.publishTime);
            //处理一下数据，把同月的资讯放在一起
            var newsarr = [[data[0]]];
            for (var i = ii = 1; i < count; i++) {
                var pmno = getmouth(newsarr[ii - 1][0].publishTime);
                var mouth_no = getmouth(data[i].publishTime);
                if (mouth_no == pmno) {
                    newsarr[ii - 1].push(data[i]);
                } else {
                    newsarr.push([data[i]]);
                    ii++;
                }
            }
            var len = newsarr.length;
            var newsls = $('.newslist').eq(index);
            for (var i = 0; i < len; i++) {
                newsls.append(
                    `<div class="mouth-news">
                        <div class="mouth">${moutharr[getmouth(newsarr[i][0].publishTime)]}</div>
                    </div>`
                );
                for (var k = 0; k < newsarr[i].length; k++) {
                    var news = newsls.find('.mouth-news').eq(i);
                    news.append(
                        `<div class="news-div clearfix">
                            <div class="news-date">
                                ${msecformat(newsarr[i][k].publishTime)}<span class="reddot"></span>
                            </div>
                            <a href="news_detail.html" target="_blank"><img class="news-img" src=${host + newsarr[i][k].smallImg}></a>
                            <p class="news-tit"><a href="news_detail.html" target="_blank">${newsarr[i][k].title}</a></p>
                            <p class="news-intro">${newsarr[i][k].intro}<a href="news_detail.html" target="_blank">[阅读全文]</a></p>
                            <input class="inp-hid" type="hidden" value=${newsarr[i][k].id}>
                        </div>`
                    );
                }
            }

            $('.news-div').click(function () {
                saves('id', $(this).find('.inp-hid').val());
                saves('navtype', 4);
            });

            $('.loading').hide();
        }
    });
}

//得到毫秒时间相对应的月份(0-11)
function getmouth(msec) {
    return new Date(msec).getMonth();
}