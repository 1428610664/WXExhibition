var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js')
var auth = require('../../utils/auth.js')
const app = getApp()

Page({
    data: {
        isLoginPopup: false,
        userInfo: null,

        id: '',
        status: '',
        imgUrl: '../../images/loading.png',
        likeImg: '/images/like.png',
        keepId: '',
        itemData: null,
        activityData: null
    },
    onLoad: function (options) {
        wx.showLoading({ title: '加载中' })
        console.log(JSON.stringify(options))
        this.requestData(options.id)
        this.setData({ id: options.id })
        this.requestKeeps()

        if (options.memberId){
            console.log('转发进来-----------memberId==' + options.memberId)
            /*wx.showModal({
                title: '转发进来',
                content: 'memberId==' + options.memberId,
            })*/
        }
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
            this.setData({ activityData: res.data.rows[0]})
            this._formatData(res.data.rows[0])
        }, (error) => {
            wx.hideLoading()
            console.log("----22---" + JSON.stringify(error))
        })
    },
    errorFunction: function () {
        this.setData({ imgUrl: "../../images/loading.png" })
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
            nonMBPrice: data.nonMBPrice,
            actualStatus: data.number - data.numberActual > 0,
            timeStatus: data.applyEndTime.time > new Date().getTime(),
            agenda: data.agenda,
            remark: data.remark
        }
        WxParse.wxParse('article', 'html', data.content, this, 5);
        this.setData({ imgUrl: Api.locationUrl + data.posterUrl, itemData: d, status: data.status })
    },
    collectionEvent: function (e) {
        let flag = this.data.likeImg.indexOf("on") != -1, _this = this
        wx.showLoading({ title: '请求中...' })
        if (flag) {
            request.delete(Api.keeps + "/" + this.data.keepId, {})
                .then(res => {
                    wx.hideLoading()
                    _this.setData({ likeImg: "/images/like.png" })
                    console.log("----delete-----" + JSON.stringify(res))
                }, error => {
                    wx.hideLoading()
                })
        } else {
            request.post(Api.keeps, { activityId: this.data.id, memberId: app.globalData.memberId })
                .then(res => {
                    console.log(JSON.stringify(res))
                    wx.hideLoading()
                    if (res.success) {
                        _this.setData({ keepId: res.data.id })
                        _this.setData({ likeImg: "/images/like-on.png" })
                        wx.showToast({ title: '操作成功' })
                    }
                }, error => {
                    wx.hideLoading()
                })
        }
    },
    requestKeeps: function () {
        request.get(Api.keeps, { activityId: this.data.id, memberId: app.globalData.memberId })
            .then(res => {
                if (res.success && res.data.rows.length > 0){
                    this.setData({ likeImg: "/images/like-on.png" ,keepId: res.data.rows[0].id})
                }
            }, error => {
            })
    },
    toHome: function (e) {
        wx.switchTab({ url: "/pages/index/index" })
    },
    onShareAppMessage: function () {
        return {
            title: this.data.itemData.name,
            path: "pages/exhibition-details/exhibition-details?id=" + this.data.id + "&memberId=" + app.globalData.memberId
        }
    },
    enrollEvent: function (e) {
        app.globalData.activityData = this.data.activityData

        if (app.globalData.userData && app.globalData.userData.phone){
            wx.navigateTo({ url: '/packageA/pay/pay?id=' + this.data.id })
        }else{
            wx.navigateTo({ url: '/packageA/perfect-information/perfect-information?id=' + this.data.id})
        }
    },

    agreeGetUser: function (e) {
        var userInfo = e.detail.userInfo
        var self = this;
        if (userInfo) {
            self.setData({ userInfo: userInfo })
            app.globalData.userInfo = userInfo
            auth.updateMembers(userInfo, app)
            setTimeout(function () {
                self.setData({ isLoginPopup: false })
            }, 1200)
        }
    },
    closeLoginPopup() {
        this.setData({ isLoginPopup: false })
    },
    openLoginPopup() {
        this.setData({ isLoginPopup: true })
    }
})