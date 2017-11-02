module.exports = {
    props: ['inews'],
    template:`
    <div class="dtnews clearfix">
    <div class="titleft">大唐网络&nbsp;●&nbsp;资讯</div>
    <div class="more"><a href="news.html">查看更多&gt;&gt;</a></div>
    <div class="newsdiv">
        <div class="box b1">
            <a href="news_detail.html"><img class="newsimg" :src="host+inews[0].smallImg" ></a>
            <div class="box-content">
                <span class="post">{{inews[0].title}}</span>
            </div>
        </div>
        <p class="newstit"><a class="news-intro-a" href="news_detail.html" target="_blank">{{inews[0].intro}}</a></p>
    </div>
    <div class="newsdiv">
        <div class="box b2">
            <a href="news_detail.html"><img class="newsimg" :src="host+inews[1].smallImg" ></a>
            <div class="box-content">
                <span class="post">{{inews[1].title}}</span>
            </div>
        </div>
        <p class="newstit"><a class="news-intro-a" href="news_detail.html" target="_blank">{{inews[1].intro}}</a></p>
    </div>
    <div class="newsdiv n3">
        <div class="box b3">
            <a href="news_detail.html"><img class="newsimg" :src="host+inews[2].smallImg" ></a>
            <div class="box-content">
                <span class="post">{{inews[2].title}}</span>
            </div>
        </div>
        <p class="newstit"><a class="news-intro-a" href="news_detail.html" target="_blank">{{inews[2].intro}}</a></p>
    </div>
    </div>
    `,
    data: function(){
        return {
            host:'http://115.182.107.203:8088'
        }
    }
}