
var locationUrl1 = "https://www.watch-life.net";
var locationUrl = "https://pmp.coreware.cn/acm";
module.exports = {
    getHomeList: locationUrl + "/activitys",
    //获取首页滑动文章
    getSwiperPosts: function () {
        return locationUrl1 + '/wp-json/watch-life-net/v1/' + 'post/swipe'
    },
    loginWechat: locationUrl + '/members/loginWechat',
    login: locationUrl + '/members/login'
}