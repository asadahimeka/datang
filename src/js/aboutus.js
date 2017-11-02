//Init Swiper
var mySwiper = new Swiper('.swiper-container', {
    autoplay: 2000,
    slidesPerView: 6,
    slidesPerColumn: 3,
    spaceBetween: 20,
    slidesOffsetBefore: 10,
    slidesOffsetAfter: 5,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev'
});

//创建和初始化地图
MapUtil.initMap({
    mapId: 'bdmap',
    posi: "北京市海淀区北太平庄路18号城建大厦C座",
    markerArr: [{
        title: "大唐网络",
        content: "详细地址：北京市海淀区北太平庄路18号城建大厦C座",
        point: [116.377673, 39.975033],
        isOpen: 0,
        icon: { w: 21, h: 21, l: 0, t: 0, x: 6, lb: 5 }
    }]
});