//菜单切换
Menutab('tab', 'proj-list', 'ontab');
//向页面添加项目数据
appendProj(["hlwms"], 0);
appendProj(["hlwcy"], 1);

function appendProj(typeCodes, index) {
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
            var projls = $('.proj-list').eq(index);
            for (var j = 0; j < count; j++) {
                projls.append(
                    `<div class="proj-cnt clearfix">
                        <div class="proj-img">
                            <img src=${host + data[j].smallImg}>
                        </div>
                        <div class="proj-intro">
                            <p class="proj-tit proj-title">项目名称：${data[j].title}</p>
                            <p class="proj-tit proj-subtit">公司名称：${data[j].subTitle}</p>
                            <p class="prj-intr-p"><span>项目简介：</span>${data[j].intro}</p>
                        </div>
                    </div> `
                );
            }
            index == 1 ? projls.find('.proj-subtit').hide() : 0;
            $('.loading').hide();
        }
    });
}