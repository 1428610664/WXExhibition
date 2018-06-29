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
        requestData: null,
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
        request.get(Api.queryActivity(id), {}).then((res) => {
            wx.hideLoading()
            console.log("==========" + JSON.stringify(res.data))
            this._formatData(res.data)
        }, (error) => {
            wx.hideLoading()
        })
    },
    errorFunction: function () {
        this.setData({ imgUrl: "/images/loading.png" })
    },
    _formatData: function (v) {
        let self = this, data = v.data 
        let d = {
            number: data.number == 0 ? '不限' : data.number,
            numberActual: data.numberActual,
            signNumber: v.signNumber,
            keepNumber: v.keepNumber,
            accessLogNumber: v.accessLogNumber,
            name: data.name,
            address: data.city1 + data.city2 + data.city3 + data.address,
            beginTime: data.beginTime ? utils.formatDate(data.beginTime.time, "yyyy-MM-dd hh:mm") : "~",
            endTime: data.endTime ? utils.formatDate(data.endTime.time, "yyyy-MM-dd hh:mm") : "~",
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
            requestData: data,
            statusEnd: data.status == 3 || data.status == 99 ? true : false
        })
    },
    toPage: function (e) {
        var path = e.currentTarget.dataset.path;
        wx.navigateTo({ 
            url: path + 
            "?id=" + this.data.id + 
            "&signUrl=" + this.data.signUrl + 
            "&endTime=" + this.data.requestData.endTime.time + 
            "&createTime=" + this.data.requestData.createTime.time
        })
    }
})