//index.js
//获取应用实例
const app = getApp()
var Api = require('../../utils/Api.js');
var wxRequest = require('../../utils/wxRequest.js')

Page({
    data: {
        showallDisplay:"none",
        displaySwiper: "none",
        postsShowSwiperList: [],
        navList: ['个人榜', '活动日历', '认证活动','收藏'],
        currentID: "nav1",
        navTabList: [
            { name: "精选", id: "nav1"},
            { name: "IT互联网", id: "nav2" },
            { name: "创业", id: "nav3" },
            { name: "科技", id: "nav4" },
            { name: "金融", id: "nav5" },
            { name: "演出", id: "nav6" }]
    },
    //生命周期函数-监听页面初次渲染完毕
    onReady: function () {
       
    },
    onLoad: function () {
        this.fetchTopFivePosts();
    },
    onShareAppMessage: function () {
        return {
            title: '测试分享文字',
            path: 'pages/index/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    fetchTopFivePosts: function () {
        var self = this;
        var getPostsRequest = wxRequest.getRequest(Api.getSwiperPosts());
        getPostsRequest.then(response => {
            //console.log(JSON.stringify(response.data))
            if (response.data.status == '200' && response.data.posts.length > 0) {
                self.setData({
                    postsShowSwiperList: response.data.posts,
                    showallDisplay: "block",
                    displaySwiper: "block"
                });
            }
            else {
                self.setData({
                    displaySwiper: "none",
                    displayHeader: "block",
                    showallDisplay: "block",
                });
            }

        })
            .then(response => {
                // self.fetchPostsData(self.data);

            })
            .catch(function (response) {
                //   console.log(response);
                //   self.setData({
                //       showerror: "block",
                //       floatDisplay: "none"
                //   });

            })
            .finally(function () {

            });
    },
    onPullDownRefresh: function () {
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 2000)
        wx.showToast({ title: 'onPullDownRefresh'})
    },
    onReachBottom: function () {
        wx.showToast({ title: 'loadMoreData' })
    },
    // 扫码
    scanCode: function(){
        wx.scanCode({
            success: (res) => {
                wx.showModal({
                    title: '扫码',
                    content: JSON.stringify(res),
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        })
    },
    toCity: function(){
        wx.navigateTo({
            url: '../city/city'
        })
    },
    // 跳转至查看小程序列表页面或文章详情页
    redictAppDetail: function (e) {
        /*var id = e.currentTarget.id,
            url = '../detail/detail?id=' + id;*/
        wx.navigateTo({
            url: '../exhibition-details/exhibition-details'
        })
    },
    searchClick: function(e){
        wx.navigateTo({
            url: '../search/search'
        })
    },
    addCategoryClick: function(e){
        wx.navigateTo({
            url: '../category-details/category-details'
        })
    },
    navTabItemClick: function(e){
        let id = e.currentTarget.id;
        this.setData({ currentID: id})
    }
})
