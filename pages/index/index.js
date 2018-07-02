//index.js
//获取应用实例
const app = getApp()
var Api = require('../../utils/Api.js')
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var auth = require('../../utils/auth.js')


Page({
    data: {
        userInfo: null,
        isLoginPopup: false,

        status: 0,
        pageNo: 1,
        pageTotal: 0,
        list: [],
        requestParms: { status: ">=1",offset: 1, limit: 10, order: 'asc' },

        choiceList: [],     // 精选列表
        choiceParms: { status: ">= 1", importance: 1 },
        recommendList: [],  // 推荐列表
        recommendNo: 1,
        recommendTotal: 0,
        recommendParms: { offset: 1, limit: 6, order: 'asc', status: ">= 1", importance: 2 },

        navList: ['个人榜', '活动日历', '认证活动','收藏'],
        currentID: "nav0",
        navTabList: []
    },
    //生命周期函数-监听页面初次渲染完毕
    onReady: function () {
        this.requestCategory()
        if (app.globalData.userInfo) {
            this.setData({ userInfo: app.globalData.userInfo })
        } else {
            this.openLoginPopup()
        }
    },
    onShow: function(){
        if (app.globalData.userInfo) {
            this.closeLoginPopup()
            this.setData({ userInfo: app.globalData.userInfo })
        }
        let flag = this.watchCategory()
        if(flag){
            console.log("999999999999===" + app.globalData.navTabList)
            this.setData({ currentID: "nav0", navTabList: app.globalData.navTabList})
            this.swichCategory('')
        }
    },
    watchCategory: function(){
        let gNavTabList = app.globalData.navTabList,
            navTabList = this.data.navTabList,
            mark = false
        if (gNavTabList.length != navTabList.length) return true
        navTabList.forEach((v, i) => {
            if (v.title != gNavTabList[i].title) mark = true
        })
        return mark
    },
    onLoad: function () {
        this.requestChoice()
        this.requestRecommend()
        this.requestList()
    },
    onShareAppMessage: function () {
        return {
            title: '聚热会',
            path: 'pages/index/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    requestCategory: function(){
        request.get(Api.homeCategory, { useWx: 1, type: "ACTIVITY"})
            .then(res => {
                if (res.success){
                    let row = res.data.rows, category = [{ title: "精选" }]
                    row.forEach(v => {
                        category.push({ title: v.name, id: v.id})
                    })
                    let existData = wx.getStorageSync("tabList")
                    app.globalData.navTabList = existData ? existData : category
                    this.setData({ 
                        navTabList: existData ? existData : app.globalData.navTabList
                    })
                }
            })
    },
    requestChoice: function(){
        request.get(Api.getHomeList, this.data.choiceParms)
        .then(res => {
            if (res.success){
                this.setData({choiceList: this._formatListData(res.data.rows)})
            }
        })
    },
    requestRecommend: function(){
        request.get(Api.getHomeList, this.data.recommendParms)
            .then(res => {
                if (res.success) {
                    this.setData({ 
                        recommendTotal: res.data.total,
                        recommendList: this._formatListData(res.data.rows)
                    })
                }
            })
    },
    requestList: function (status) { // status： 1(下拉刷新) 、2(上拉加载) 
        setTimeout(() => {
            request.get(Api.getHomeList, this.data.requestParms).then((res)=>{
                wx.hideLoading()
                if (status == 1) wx.stopPullDownRefresh()
                if (res.data.rows){
                    this.setData({ status: 1, pageTotal: res.data.total, list: this._formatListData(res.data.rows, status)})
                }else{
                    this.setData({ status:  2})
                }
            }, (error) => {
                wx.hideLoading()
                if (status == 1) wx.stopPullDownRefresh()
                this.setData({status: 3})
            })
        }, 800)
    },
    errorImage: function(e){
        let index = e.target.dataset.index, name = e.target.dataset.name
        let imgObject = name + "[" + index + "].imgUrl", errorImg = {}
        errorImg[imgObject] = "../../images/loading.png"
        this.setData(errorImg)
    },
    _formatListData: function (data, status){
        let list = []
        data.forEach((v, i) => {
            list.push({
                id: v.id,
                name: v.name,
                time: utils.format(v.createTime.time),
                address: utils.getAddress(v.city1, v.city2),
                imgUrl: Api.locationUrl + v.posterUrl,
                label: utils.formatLabel(v.label),
                orderStatus: v.isNeedPay == "1" ? "￥" +v.nonMBPrice: "免费",
                status: (v.status == "99" || v.status == "2" || v.status == "3") ? "" : "立即报名"
            })
        })
        if (status == 2) {
            list = this.data.list.concat(list)
            this.setData({ pageNo: this.data.pageNo + 1 })
        }
        return list
    },
    onPullDownRefresh: function () {
        this.swichCategory()
    },
    onReachBottom: function () {
        if (this.data.pageTotal <= this.data.list.length) {
            this.setData({ status: 4 })
            return
        }
        var requestParms = this.data.requestParms
        requestParms.offset = requestParms.limit * this.data.pageNo
        this.setData({ requestParms: requestParms })
        this.requestList(2)
        wx.showLoading({ title: '加载中' })
    },
    anotherBatchEvent: function(e){
        let count = Math.ceil(this.data.recommendTotal / 6), 
            recommendParms = this.data.recommendParms

        if (count <= this.data.recommendNo){
            recommendParms.offset = 1
            this.setData({ recommendNo: 1})
        }else{
            recommendParms.offset = this.data.recommendNo * 6
            this.setData({ recommendNo: this.data.recommendNo + 1})
        }
        this.setData({ recommendParms: recommendParms })
        this.requestRecommend()
    },
    // 扫码
    scanCode: function(){
        wx.scanCode({
            success: (res) => {
                console.log(JSON.stringify(res) + "---------------" + JSON.stringify({ activityId: res.result, memberId: app.globalData.memberId }))
                wx.showLoading()
                request.post(Api.ticketSign, { signType: 1,activityId: res.result, memberId: app.globalData.memberId})
                    .then(res => {
                        console.log(JSON.stringify(res))
                        wx.hideLoading()
                        wx.showModal({
                            title: '扫码结果',
                            content: res.desc,
                            showCancel: false
                        })
                    }, error => {
                        wx.hideLoading()
                    })
            }
        })
    },
    toCity: function(){
        wx.navigateTo({url: '/packageA/city/city'})
    },
    // 跳转至查看小程序列表页面或文章详情页
    redictAppDetail: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../exhibition-details/exhibition-details?id=' + id
        })
    },
    searchClick: function(e){
        wx.navigateTo({
            url: '../search/search'
        })
    },
    addCategoryClick: function(e){
        wx.navigateTo({
            url: '../category-details/category-details'
        })
    },
    navTabItemClick: function(e){
        let id = e.currentTarget.id, 
            data = e.currentTarget.dataset.data

        if (id == this.data.currentID) return
        this.setData({ currentID: id })
        this.swichCategory(data.title == "精选" ? '' : data.title)
    },
    swichCategory: function (category){
        var requestParms = this.data.requestParms,
            recommendParms = this.data.recommendParms,
            choiceParms = this.data.choiceParms
        requestParms.offset = 1
        recommendParms.offset = 1
        if (typeof category == "string"){
            requestParms.style = category
            recommendParms.style = category
            choiceParms.style = category
        }
        this.setData({
            status: 1,
            pageNo: 1,
            recommendNo: 1,
            recommendParms: recommendParms,
            requestParms: requestParms,
            choiceParms: choiceParms
        })
        this.requestList(1)
        this.requestChoice()
        this.requestRecommend()
        wx.showLoading({ title: '加载中' })
    },

    agreeGetUser: function (e) {
        console.log(JSON.stringify(e))
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
