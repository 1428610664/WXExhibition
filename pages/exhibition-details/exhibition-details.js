var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        isLoginPopup: false,
        userInfo: null,

        id: '',
        status: '',
        imgUrl: '../../images/loading.png',
        itemData: null
    },
    onLoad: function (options) {
        wx.showLoading({ title: '加载中' })
        console.log(JSON.stringify(options))
        this.requestData(options.id)
        this.setData({ id: options.id })
    },
    onReady: function () {
        if (app.globalData.userInfo) {
            this.setData({ userInfo: app.globalData.userInfo })
        } else {
            this.openLoginPopup()
        }
    },
    requestData: function (id) {
        request.get(Api.getHomeList, { id: id }).then((res) => {
            wx.hideLoading()
            console.log("==========" + JSON.stringify(res.data.rows[0]))
            this._formatData(res.data.rows[0])
        }, (error) => {
            wx.hideLoading()
            console.log("----22---" + JSON.stringify(error))
        })
    },
    errorFunction: function(){
        this.setData({ imgUrl: "../../images/loading.png"})
    },
    _formatData: function (data) {
        let d = {
            name: data.name,
            address: data.address,
            beginTime: data.beginTime ? utils.formatTime(data.beginTime.time) : "~",
            endTime: data.endTime ? utils.formatTime(data.endTime.time) : "~",
            content: data.content,
            isNeedPay: data.isNeedPay,
            mbPrice: data.mbPrice,
            nonMBPrice: data.nonMBPrice
        }
        console.log("imgUrl===" + data.imgUrl+"----------" + JSON.stringify(d))
        this.setData({ imgUrl: data.imgUrl, itemData: d, status: data.status})
    },
    toHome: function (e) {
        wx.switchTab({ url: "../index/index" })
    },
    onShareAppMessage: function () {
        return {
            title: '自定义转发标题',
            path: "pages/exhibition-details/exhibition-details?id="+ this.data.id
        }
    },
    enrollEvent: function(e){
        wx.navigateTo({url: '../perfect-information/perfect-information'})
    },
    
    agreeGetUser: function (e) {
        var userInfo = e.detail.userInfo;
        var self = this;
        if (userInfo) {
            self.setData({ userInfo: userInfo })
            app.globalData.userInfo = userInfo
            setTimeout(function () {
                self.setData({ isLoginPopup: false })
            }, 1200);
        }
    },
    closeLoginPopup() {
        this.setData({ isLoginPopup: false });
    },
    openLoginPopup() {
        this.setData({ isLoginPopup: true });
    }
})