var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')

Page({
    data: {
        status: 0,
        
        pageNo: 1,
        pageTotal: 0,
        listCol: [],
        requestParms: { status: ">=1", keyWord: '', offset: 1, limit: 10, order: 'asc' }
    },
    onLoad: function (options) {
        console.log(options.search)
        let requestParms = this.data.requestParms
        requestParms.keyWord = options.search
        this.setData({ requestParms: requestParms })
    },
    onReady: function () {
        this.requestListData()
    },
    requestListData: function (status) { // status： 1(下拉刷新) 、2(上拉加载) 
        setTimeout(() => {
            request.get(Api.getHomeList, this.data.requestParms).then((res) => {
                wx.hideLoading()
                if (status == 1) wx.stopPullDownRefresh()
                if (res.data.rows.length > 0) {
                    this.setData({ pageTotal: res.data.total, status: 1, listCol: this._formatListData(res.data.rows, status) })
                } else {
                    this.setData({ status: 2 })
                }

            }, (error) => {
                if (status == 1) wx.stopPullDownRefresh()
                wx.hideLoading()
                this.setData({ status: 3 })
            })
        }, 800)
    },
    _formatListData: function (data, status) {
        let list = []
        data.forEach((v, i) => {
            list.push({
                id: v.id,
                name: v.name,
                time: utils.format(v.createTime.time),
                address: v.address,
                imgUrl: Api.locationUrl + v.posterUrl,
                label: utils.formatLabel(v.label),
                orderStatus: v.isNeedPay == "1" ? "￥" + v.nonMBPrice : "免费",
                status: (v.status == "99" || v.status == "2" || v.status == "3") ? "" : "立即报名"
            })
        })
        if (status == 2) {
            list = this.data.listCol.concat(list)
            this.setData({ pageNo: this.data.pageNo + 1 })
        }
        console.log(list)
        return list
    },
    errorImage: function (e) {
        let index = e.target.dataset.index, name = e.target.dataset.name
        let imgObject = name + "[" + index + "].imgUrl", errorImg = {}
        errorImg[imgObject] = "../../images/loading.png"
        this.setData(errorImg)
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
    // 跳转至查看小程序列表页面或文章详情页
    redictAppDetail: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../exhibition-details/exhibition-details?id=' + id
        })
    },
})