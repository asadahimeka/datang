module.exports = {
    props: ['ibase','host'],
    template:`
    <a href="news_detail.html">
    <div class="baseimg">
        <div class="before"></div>
        <img :src="host + ibase.smallImg">
        <div class="city">
            <img class="hexagon" src="./images/index/liubianxing.png">
            <div class="city-name">
                <b>{{ibase.title.replace('孵化基地', '')}}</b><br>
                {{ibase.pinyin}}
            </div>
        </div>
    </div>
    </a>
    `
}