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
        requestParms: { 
            status: '>=1', offset: 1, limit: 10, order: 'asc', 
            style: '', 
            isNeedPay: '', 
            configPid: '',
            days: '',
            isHost: false
        },
        topTabItems: [],
        categoryArray: [],
        currentTopItem: 0,
        showMask: "none",
        selectIndex: -1,
        sortListTitle: [{ title: "全类型" }, { title: "全时段" }, { title: "全价格" }, { title: "最新发布"}],
        sortList: [],
        sortData: [[], [{ title: "全时段", value: '' }, { title: "昨天到今天", value: 1 }, { title: "一周内", value: 7 }, { title: "30天内", value: 30 }], [{ title: "全价格", value: '' }, { title: "免费", value: 0 }, { title: "付费", value: 1 }], [{ title: "最新发布", value: false }, { title: "热门点击", value: true }]]
    },
    onLoad: function (options) {
    },
    onReady: function () {
        this.requestCategory()
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
    requestCategory: function () {
        request.get(Api.findTree, {})
            .then(res => {
                if (res.success) {
                    let row = JSON.parse(res.data.rows)
                    this._parseCategory(row.children)
                    console.log("------------" + JSON.stringify(row))
                }
            })
    },
    requestListData: function (status) { // status： 1(下拉刷新) 、2(上拉加载) 
        setTimeout(() => {
            request.get(Api.queryComprehensive, this.data.requestParms).then((res) => {
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
    _parseCategory: function(row){
        let topTabItems = [{ title: "全部", id: ''}], 
            sortData = [], 
            sort = this.data.sortData, 
            categoryArray = []
        row.forEach((v, i) => {
            topTabItems.push({ title: v.title, id: v.id})
            sortData.push(v.children)
            categoryArray = categoryArray.concat(v.children)
        })
        sortData.unshift(categoryArray)
        sort[0] = categoryArray
        this.setData({ topTabItems: topTabItems, categoryArray: sortData, sortData: sort})
    },
    _formatListData: function (data, status) {
        let list = []
        data.forEach((v, i) => {
            list.push({
                id: v.id,
                name: v.name,
                time: utils.format(v.createTime.time),
                address: utils.getAddress(v.city1, v.city2),
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
        let index = e.currentTarget.dataset.idx,
            itemData = e.currentTarget.dataset.data,
            currentTopItem = this.data.currentTopItem,
            category = this.data.categoryArray[index],
            sortData = this.data.sortData,
            sortListTitle = this.data.sortListTitle,
            requestParms = this.data.requestParms

        if (index == currentTopItem) return
        sortListTitle[0] = {title: "全类型"}
        sortData[0] = category

        requestParms.style = ''
        requestParms.configPid = itemData.id

        this.setData({
            currentTopItem: index,
            showMask: "none",
            sortListTitle: sortListTitle,
            sortData: sortData,
            requestParms: requestParms
        })
        // 一级分类查询
        wx.showLoading({ title: '加载中' })
        this.requestListData()
    },
    sortClick: function (e) {
        let data = e.currentTarget.dataset.data,
            sortListTitle = this.data.sortListTitle,
            index = this.data.selectIndex,
            requestParms = this.data.requestParms

        console.log(index + "------------" + JSON.stringify(data))
        if (index == 0) { // 二级分类
            requestParms.style = data.title
        } else if (index == 1) { // 时间段
            requestParms.days = data.value

        } else if (index == 2) { // 价格
            requestParms.isNeedPay = data.value
        } else if (index == 3) { // 综合排序
            requestParms.isHost = data.value
        }
        requestParms.offset = 1
        sortListTitle[index] = data
        this.setData({
            showMask: "none",
            selectIndex: -1,
            sortListTitle: sortListTitle,
            requestParms: requestParms
        })
        // 排序查询
        wx.showLoading({ title: '加载中' })
        this.requestListData()
    },
    tabItemClick: function (e) {
        var index = e.currentTarget.dataset.id;
        console.log(this.data.sortData[index])
        if (this.data.selectIndex == index) {
            this.setData({ showMask: "none", selectIndex: -1 })
        } else {
            this.setData({
                showMask: "block", selectIndex: index, sortList: this.data.sortData[index]
            })
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
    toPage: function (e) {
        var path = e.currentTarget.dataset.path
        wx.navigateTo({ url: path })
    },
    errorImage: function (e) {
        let index = e.target.dataset.index, name = e.target.dataset.name
        let imgObject = name + "[" + index + "].imgUrl", errorImg = {}
        errorImg[imgObject] = "../../images/loading.png"
        this.setData(errorImg)
    },

    // 授权登录
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