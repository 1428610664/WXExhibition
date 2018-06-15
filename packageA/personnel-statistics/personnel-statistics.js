var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        id: '',
        topTabItems: [{ id: "", name: "全部" }, { id: "1", name: "已签到" }, { id: "0", name: "未签到" }],
        currentTopItem: 0,

        status: 0,
        pageNo: 1,
        pageTotal: 0,
        listCol: [],
        requestParms: { offset: 1, limit: 10, order: 'asc'},
    },
    onLoad: function (options) {
        console.log(options)
        this.setData({ id: options.id})
    },
    onReady: function () {
        let requestParms = this.data.requestParms
        requestParms.activityId = this.data.id
        this.setData({ requestParms: requestParms})
        wx.showLoading({title: '加载中...'})
        this.requestListData()
    },
    switchTab: function (e) {
        let id = e.currentTarget.dataset.id, requestParms = this.data.requestParms
        if (this.data.currentTopItem == e.currentTarget.dataset.idx) return
        this.setData({ currentTopItem: e.currentTarget.dataset.idx })
        requestParms.status = id
        this.setData({ requestParms: requestParms})
        wx.showLoading({ title: '加载中...' })
        this.requestListData()
    },
    requestListData: function (status) { // status： 1(下拉刷新) 、2(上拉加载) 
        setTimeout(() => {
            this._calcParms()
            console.log(JSON.stringify(this.data.requestParms))
            request.get(Api.ticket, this.data.requestParms).then((res) => {
                console.log(JSON.stringify(res))
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
        /*let requestParms = this.data.requestParms,
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
        this.setData({ requestParms: requestParms })*/
    },
    _formatListData: function (data, status) {
        let list = []
        console.log(JSON.stringify(data))
        data.forEach((v, i) => {
            list.push({
                memberName: v.memberName,
                memberImg: v.memberImg,
                signTime: v.signTime ? utils.formatDate(v.signTime.time, "yyyy-MM-dd hh-mm:ss") : "~",
                status: v.status == 1 ? true : false
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
})