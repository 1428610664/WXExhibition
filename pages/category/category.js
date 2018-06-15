var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var auth = require('../../utils/auth.js')
const app = getApp()
Page({
    data: {
        isLoginPopup: false,
        userInfo: null,

        status: 0,
        pageNo: 1,
        pageTotal: 0,
        listCol: [],
        requestParms: { status: ">= 1", offset: 1, limit: 10, order: 'asc' },

        topTabItems: ["全部", "行业", "生活", "亲子", "学习"],
        currentTopItem: 0,
        showMask: "none",
        selectIndex: -1,
        sortListTitle: [{ name: "全类型", id: 1 }, { name: "全时段", id: 1 }, { name: "全价格", id: 1 }, { name: "综合排序", id: 1 }],
        sortList: [],
        sortData: [[{ name: "全类型", id: 1 }, { name: "IT互联网", id: 1 }, { name: "创业", id: 1 }, { name: "科技", id: 1 }, { name: "金融", id: 1 }, { name: "游戏", id: 1 }, { name: "文娱", id: 1 }, { name: "电商", id: 1 }, { name: "教育", id: 1 }, { name: "营销", id: 1 }, { name: "设计", id: 1 }, { name: "职场", id: 1 }, { name: "地产", id: 1 }, { name: "医疗", id: 1 }, { name: "服务业", id: 1 }, { name: "演出", id: 1 }, { name: "文艺", id: 1 }, { name: "手工", id: 1 }, { name: "公益", id: 1 }, { name: "户外出游", id: 1 }, { name: "运动健康", id: 1 }, { name: "聚会交友", id: 1 }, { name: "休闲娱乐", id: 1 }, { name: "投资理财", id: 1 }, { name: "课程", id: 1 }, { name: "读书", id: 1 }, { name: "时尚", id: 1 }, { name: "心理", id: 1 }, { name: "体育赛事", id: 1 }, { name: "儿童才艺", id: 1 }, { name: "益智潮玩", id: 1 }, { name: "儿童剧/展览", id: 1 }, { name: "亲子旅游", id: 1 }, { name: "早教/升学", id: 1 }, { name: "社团", id: 1 }, { name: "讲座", id: 1 }], [{ name: "全时段", id: 1 }, { name: "今天", id: 1 }, { name: "明天", id: 1 }, { name: "本周", id: 1 }, { name: "本周末", id: 1 }, { name: "本月", id: 1 }], [{ name: "全价格", id: 1 }, { name: "免费", id: 1 }, { name: "付费", id: 1 }], [{ name: "综合排序", id: 1 }, { name: "最新发布", id: 1 }, { name: "热门点击", id: 1 }, { name: "最多参与", id: 1 }]]
    },
    onLoad: function (options) {
    },
    onReady: function () {
        this.requestListData()
        if (app.globalData.userInfo) {
            this.setData({ userInfo: app.globalData.userInfo })
        } else {
            this.openLoginPopup()
        }
    },
    onShow: function () {
        if (app.globalData.userInfo) {
            this.closeLoginPopup()
            this.setData({ userInfo: app.globalData.userInfo})
        }
    },
    requestListData: function (status) { // status： 1(下拉刷新) 、2(上拉加载) 
        setTimeout(() => {
            request.get(Api.getHomeList, this.data.requestParms).then((res) => {
                wx.hideLoading()
                if (status == 1) wx.stopPullDownRefresh()
                if (res.data.total > 0) {
                    this.setData({ pageTotal: res.data.total, status: 1, listCol: this._formatListData(res.data.rows, status) })
                } else {
                    this.setData({status: 2})
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
                status: (v.status == "99" || v.status == "3") ? "" : "立即报名"
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
    toCity: function () {
        wx.navigateTo({
            url: '/packageA/city/city'
        })
    },
    switchTab: function (e) {
        wx.showToast({ title: 'id:' + e.currentTarget.dataset.idx })
        this.setData({ currentTopItem: e.currentTarget.dataset.idx })
    },
    tabItemClick: function (e) {
        var id = e.currentTarget.dataset.id;
        console.log(this.data.sortData[id])
        if (this.data.selectIndex == id) {
            this.setData({ showMask: "none", selectIndex: -1 })
        } else {
            this.setData({ showMask: "block", selectIndex: id, sortList: this.data.sortData[id] })
        }
    },
    maskClick: function (e) {
        this.setData({ showMask: "none", selectIndex: -1 })
    },
    redictAppDetail: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../exhibition-details/exhibition-details?id=' + id
        })
    },
    searchClick: function (e) {
        wx.navigateTo({
            url: '../search/search'
        })
    },
    sortClick: function (e) {
        wx.showToast({ title: e.currentTarget.dataset.data.name })
        let sortListTitle = this.data.sortListTitle
        sortListTitle[this.data.selectIndex] = e.currentTarget.dataset.data
        this.setData({ showMask: "none", selectIndex: -1, sortListTitle: sortListTitle})
    },
    errorImage: function (e) {
        let index = e.target.dataset.index, name = e.target.dataset.name
        let imgObject = name + "[" + index + "].imgUrl", errorImg = {}
        errorImg[imgObject] = "../../images/loading.png"
        this.setData(errorImg)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    agreeGetUser: function (e) {
        var userInfo = e.detail.userInfo;
        var self = this;
        if (userInfo) {
            self.setData({ userInfo: userInfo })
            app.globalData.userInfo = userInfo
            auth.updateMembers(userInfo, app)
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