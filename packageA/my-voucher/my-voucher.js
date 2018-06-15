var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        topTabItems: ["全部", "待参加", "待支付", "已结束"],
        currentTopItem: '',

        status: 0,
        pageNo: 1,
        pageTotal: 0,
        listCol: [],
        requestParms: { offset: 1, limit: 10, order: 'asc', activityStatus: '', orderStatus: ''},
    },
    onLoad: function (options) {
        this.setData({ currentTopItem: options.id })
    },
    onReady: function () {
        let requestParms = this.data.requestParms
        requestParms.memberId = app.globalData.memberId
        this.setData({ requestParms: requestParms })
        this.requestListData()
    },
    requestListData: function (status) { // status： 1(下拉刷新) 、2(上拉加载) 
        setTimeout(() => {
            this._calcParms()
            request.get(Api.myTicket, this.data.requestParms).then((res) => {
                wx.hideLoading()
                if (status == 1) wx.stopPullDownRefresh()
                if (res.data && res.data.total > 0 && res.success) {
                    this.setData({ pageTotal: res.data.total, status: 1, listCol: this._formatListData(res.data.rows, status) })
                } else {
                    this.setData({ status: res.success ? 2 : 3 })
                }
            }, (error) => {
                if (status == 1) wx.stopPullDownRefresh()
                wx.hideLoading()
                this.setData({ status: 3 })
            })
        }, 800)
    },
    _calcParms: function () {
        let requestParms = this.data.requestParms,
            status = this.data.currentTopItem
        switch (status) {
            case "0":
                requestParms.activityStatus = ""
                requestParms.orderStatus = ""
                break
            case "1":
                requestParms.activityStatus = "1,2"
                requestParms.orderStatus = "1"
                break
            case "2":
                requestParms.activityStatus = ""
                requestParms.orderStatus = "0"
                break
            case "3":
                requestParms.activityStatus = "99"
                requestParms.orderStatus = "1"
                break
        }
        this.setData({ requestParms: requestParms})
    },
    _calcStatus: function (v) {
        let status = { orderStatus: "", status: "" }
        switch (v.orderStatus) {
            case 0:
                status.orderStatus = "待支付"
                status.status = "立即支付"
                break
            case 1:
                status.orderStatus = "报名成功"
                break
            case 2:
                status.orderStatus = "订单已取消"
                break
        }
        return status
    },
    _formatListData: function (data, status) {
        let list = []
        data.forEach((v, i) => {
            let status = this._calcStatus(v)
            list.push({
                activityId: v.id,
                id: v.orderId,
                name: v.name,
                time: utils.format(v.createTime.time),
                address: v.address,
                imgUrl: Api.locationUrl + v.posterUrl,
                label: utils.formatLabel(v.label),
                orderStatus: status.orderStatus,
                status: status.status,
                acticityStatus: v.status,
                isPay: true,
                orderNumber: v.orderNumber,
                orderPriceActual: v.orderPriceActual
            })
        })
        if (status == 2) {
            list = this.data.listCol.concat(list)
            this.setData({ pageNo: this.data.pageNo + 1 })
        }
        return list
    },
    onPullDownRefresh: function () {
        var requestParms = this.data.requestParms
        requestParms.offset = 1
        this.setData({ status: 1, pageNo: 1, requestParms: requestParms })
        this.requestListData(1)
        wx.showLoading({ title: '加载中' })
    },
    onReachBottom: function () {
        if (this.data.pageTotal <= this.data.listCol.length) {
            this.setData({ status: 4 })
            return
        }
        var requestParms = this.data.requestParms
        requestParms.offset = requestParms.limit * this.data.pageNo
        this.setData({ requestParms: requestParms })
        this.requestListData(2)
        wx.showLoading({ title: '加载中' })
    },
    switchTab: function (e) {
        if (this.data.currentTopItem == e.currentTarget.dataset.idx) return
        wx.showLoading({ title: '加载中' })
        this.setData({ currentTopItem: e.currentTarget.dataset.idx+"" })
        this.requestListData()
    },
    redictAppDetail: function (e) {
        let id = e.currentTarget.dataset.id,
            item = e.currentTarget.dataset.item
        if (item.orderStatus == "订单已取消"){
            wx.navigateTo({ url: '/pages/exhibition-details/exhibition-details?id=' + item.activityId})
            return
        }
        wx.navigateTo({ url: '../voucher-details/voucher-details?id=' + id + "&status=" + item.acticityStatus })
    },
    errorImage: function (e) {
        let index = e.target.dataset.index, name = e.target.dataset.name
        let imgObject = name + "[" + index + "].imgUrl", errorImg = {}
        errorImg[imgObject] = "../../images/loading.png"
        this.setData(errorImg)
    },
})