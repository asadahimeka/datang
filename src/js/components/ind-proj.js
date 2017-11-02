module.exports = {
    props: ['iproj','host'],
    template:`
    <div class="swiper-slide">
        <a href="project.html"><img class="slideimg" :src="host + iproj.middleImg"></a>
    </div>
    `
}