var Vue = require('../utils/vue');
var header = require('./components/header');
var footer = require('./components/footer');
var bktop = require('./components/bktop');
var news = require('./components/ind-news');
var acti = require('./components/ind-acti');
var proj = require('./components/ind-proj');
var ibase = require('./components/ind-base');

Vue.component('mynav', header);
Vue.component('myfot', footer);
Vue.component('bktop', bktop);
Vue.component('news', news);
Vue.component('acti', acti);
Vue.component('proj', proj);
Vue.component('ibase', ibase);

var app = new Vue({
    el: '#app',
    data: {
        host: "http://115.182.107.203:8088",
        url: "http://115.182.107.203:8088/ylkj-api/c/article/grid",
        inewsList: [],
        iactiList: [],
        iprojList: [],
        ibaseList: []
    },
    methods: {
        getData: function (data, successfn) {
            var _self = this;
            $.ajax({
                type: 'POST',
                url: _self.url,
                data: data,
                dataType: 'json',
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(textStatus);
                },
                success: function (res) {
                    successfn(res);
                }
            });
        }
    }
});

app.getData({
    typeCodes: ["information", "mediaReport"],
    limit: 3
}, function (res) {
    app.inewsList = res.data;
});

app.getData({
    typeCodes: ["activity"],
    limit: 4
}, function (res) {
    app.iactiList = res.data;
});

app.getData({
    typeCodes: ["hlwms", "hlwcy"],
    limit: 5
}, function (res) {
    $('.swiper-wrapper').empty();
    app.iprojList = res.data;
    setTimeout(() => {
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            autoplay: 3000,
            slidesPerView: 4,
            slidesPerGroup: 1,
            spaceBetween: 10,
            slidesOffsetBefore: 5,
            slidesOffsetAfter: 5,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev'
        });
    }, 0);
});

app.getData({ typeCodes: ["jidi"] }, function (res) {
    res.data[0].title = '北京';
    for (var i = 0; i < res.data.length; i++) {
        var city = res.data[i].title.replace('孵化基地', '');
        res.data[i].pinyin = ConvertPinyin(city).toUpperCase();
    }
    app.ibaseList = res.data;
    $('.loading').hide();
});