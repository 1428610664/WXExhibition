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
            url: '../exhibition-details/exhibition-details'
        })
    },
    onShareAppMessage: function () {

    }
})