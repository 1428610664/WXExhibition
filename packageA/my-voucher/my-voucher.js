var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var commomPay = require('../utils/commomPay.js')
var app = getApp()

Page({
    data: {
        topTabItems: ["全部", "待参加", "待支付", "已结束"],
        currentTopItem: '',

        status: 0,
        pageNo: 1,
        pageTotal: 0,
        listCol: [],
        listData: [],
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
                console.log(JSON.stringify(res))
                wx.hideLoading()
                if (status == 1) wx.stopPullDownRefresh()
                if (res.data && res.data.total > 0 && res.success) {
                    this.setData({ pageTotal: res.data.total, status: 1, listCol: this._formatListData(res.data.rows, status)})
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
                requestParms.orderStatus = "1,3"
                break
        }
        this.setData({ requestParms: requestParms})
    },
    _calcStatus: function (v) {
        let status = { orderStatus: "", status: "" }
        switch (v.orderStatus) {
            case 0:
                if (v.status == 99 || v.status == 3) {
                    status.orderStatus = "已结束"
                }else{
                    status.orderStatus = "待支付"
                    status.status = "立即支付"
                }
                break
            case 1:
                status.orderStatus = "报名成功"
                break
            case 2:
                status.orderStatus = "订单已取消"
                break
            case 3:
                status.orderStatus = "报名成功"
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
                address: utils.getAddress(v.city1, v.city2),
                imgUrl: Api.locationUrl + v.posterUrl,
                label: utils.formatLabel(v.label),
                orderStatus: status.orderStatus,
                mOrderStatus: v.orderStatus,
                status: status.status,
                acticityStatus: v.status,
                isPay: true,
                orderNumber: v.orderNumber,
                orderPriceActual: v.orderPriceActual
            })
        })
        if (status == 2) {
            list = this.data.listCol.concat(list)
            data = this.data.listData.concat(data)
            this.setData({ pageNo: this.data.pageNo + 1 })
        }
        this.setData({ listData: data})
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
            index = e.currentTarget.dataset.index,
            item = e.currentTarget.dataset.item,
            path = ""
        console.log(item.mOrderStatus)
        if (item.mOrderStatus == "2") { // 订单已取消
            path = '/pages/exhibition-details/exhibition-details?id=' + item.activityId
        } else if (item.mOrderStatus == "1" || item.mOrderStatus == "3") { // 支付成功
            path = '../voucher-details/voucher-details?id=' + id + "&status=" + item.acticityStatus
        } else { // 订单未支付
            if (item.acticityStatus == 99 || item.acticityStatus == 3) {
                path = '/pages/exhibition-details/exhibition-details?id=' + item.activityId
            }else{
                // 直接支付
                commomPay.payOrder(parseInt(item.orderPriceActual * 100), item.id)
                // 跳往支付页面
                //app.globalData.activityData = this.data.listData[index]
                //path = '../pay/pay?id=' + item.activityId + "&orderId=" + item.id
            }
        }
        wx.navigateTo({ url:  path})
    },
    errorImage: function (e) {
        let index = e.target.dataset.index, name = e.target.dataset.name
        let imgObject = name + "[" + index + "].imgUrl", errorImg = {}
        errorImg[imgObject] = "../../images/loading.png"
        this.setData(errorImg)
    },
})