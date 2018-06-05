
var domain = "www.watch-life.net";
module.exports = {

    //获取首页滑动文章
    getSwiperPosts: function () {
        return 'https://' + domain + '/wp-json/watch-life-net/v1/' + 'post/swipe';
    },
}