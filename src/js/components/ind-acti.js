module.exports = {
    props: ['iacti'],
    template:`
    <a href="news_detail.html" target="_blank">
    <div class="actidiv">
        <div class="acti-img">
            <img :src="iacti.smallImg" width="160" height="120">
            <div class="acti-status">{{iacti.attr.activityStatus}}</div>
        </div>
        <div class="acti-cnt">
            <p class="acti-tit">{{iacti.title}}</p>
            <p class="acti-time">活动时间：{{iacti.subTitle}}</p>
            <p class="acti-posi">活动地点：{{iacti.intro}}</p>
        </div>
    </div>
    </a>
    `
}