var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js')
var app = getApp()

Page({
    data: {
        id: '',
        status: '',
        statusEnd: false,
        imgUrl: '/images/loading.png',
        itemData: null
    },
    onLoad: function (options) {
        console.log(JSON.stringify(options.id))
        this.setData({ id: options.id })
        this.requestData(options.id)
    },
    onReady: function () {

    },
    requestData: function (id) {
        request.get(Api.getHomeList, { id: id }).then((res) => {
            wx.hideLoading()
            console.log("==========" + JSON.stringify(res.data.rows[0]))
            this._formatData(res.data.rows[0])
        }, (error) => {
            wx.hideLoading()
        })
    },
    errorFunction: function () {
        this.setData({ imgUrl: "/images/loading.png" })
    },
    _formatData: function (data) {
        let self = this
        let d = {
            number: data.number,
            numberActual: data.numberActual,
            orderNumber: data.orderNumber,
            name: data.name,
            address: data.address,
            beginTime: data.beginTime ? utils.formatTime(data.beginTime.time) : "~",
            endTime: data.endTime ? utils.formatTime(data.endTime.time) : "~",
            content: data.content,
            isNeedPay: data.isNeedPay,
            mbPrice: data.mbPrice,
            nonMBPrice: data.nonMBPrice,
            statusTxt: utils.formatStatus(data.status)
        }
        WxParse.wxParse('article', 'html', data.content, self, 5);
        this.setData({ 
            imgUrl: Api.locationUrl + data.posterUrl, 
            signUrl: data.signUrl ? Api.locationUrl + data.signUrl : "/images/loading.png",
            itemData: d, 
            status: data.status,
            statusEnd: data.status == 3 || data.status == 99 ? true : false
        })
    },
    toPage: function (e) {
        var path = e.currentTarget.dataset.path;
        wx.navigateTo({ url: path + "?id=" + this.data.id + "&signUrl=" + this.data.signUrl})
    }
})