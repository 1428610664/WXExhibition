Page({
    data: {
    },
    onLoad: function (options) {
    },
    onReady: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    redictAppDetail: function (e) {
        /*var id = e.currentTarget.id,
            url = '../detail/detail?id=' + id;*/
        wx.navigateTo({
            url: '../my-launch-details/my-launch-details'
        })
    },
    onShareAppMessage: function () {

    }
})