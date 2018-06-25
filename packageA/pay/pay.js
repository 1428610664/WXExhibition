var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var commomPay = require('../utils/commomPay.js')

const app = getApp()

Page({
    data: {
        isVip: false,
        id: '',
        memberId: '',
        activityData: null,
        userData: null,
        imgUrl: '',
        itemData: '',

        count: 1,
        price: 0,
        total: 0,
        number: 0,
        numberActual: 0,
        maxNumber: 0,
        orderId: null
    },
    onLoad: function (options) {
        if (options.orderId){
            this.setData({ id: options.id, orderId: options.orderId })
        }else{
            this.setData({ id: options.id })
        }
    },
    onReady: function () {
        console.log("----app.globalData.openId--" + app.globalData.openId)
        if (app.globalData.activityData) {
            this.setData({
                activityData: app.globalData.activityData,
                memberId: app.globalData.memberId,
                userData: app.globalData.userData
            })
            if (app.globalData.activityData.isNeedPay == 1) {
                this.requestMemberVip()
            } else {
                this._formatData()
            }
        } else {
            wx.switchTab({ url: "/pages/index/index" })
        }
        console.log(JSON.stringify(app.globalData.activityData))
        console.log(app.globalData.memberId + "---------------" + JSON.stringify(app.globalData.userData))
    },
    requestMemberVip: function () {
        //  memberId: this.data.memberId, phone: this.data.userData.phone 
        request.get(Api.queryVip(this.data.id), {}).then(res => {
            console.log(JSON.stringify(res))
            if (res.success && res.data.isVip) {
                this._formatData(true)
                this.setData({ isVip: true})
            } else {
                this.insetMembers()
                this._formatData()
            }
        }, error => {

        })
    },
    _formatData: function (mark) {
        let data = this.data.activityData
        let d = {
            name: data.name,
            address: data.address,
            beginTime: data.beginTime ? utils.formatTime(data.beginTime.time) : "~",
            endTime: data.endTime ? utils.formatTime(data.endTime.time) : "~",
            beginTime1: data.beginTime ? utils.formatDate(data.beginTime.time, "MM/dd") : "~",
            endTime1: data.endTime ? utils.formatDate(data.endTime.time, "MM/dd") : "~",
            content: data.content,
            isNeedPay: data.isNeedPay,
            mbPrice: data.mbPrice,
            nonMBPrice: data.nonMBPrice,
            actualStatus: data.number - data.numberActual > 0,
            timeStatus: data.applyEndTime.time > new Date().getTime()

        }
        this.setData({
            imgUrl: Api.locationUrl + data.posterUrl,
            itemData: d,
            status: data.status,
            number: data.number,
            numberActual: data.numberActual,
            maxNumber: data.number - data.numberActual,
            price: mark ? data.mbPrice : data.nonMBPrice,
            total: this.data.count * (mark ? data.mbPrice : data.nonMBPrice)
        })
    },
    payEvent: function () {
        let requestParms = {
            memberId: app.globalData.memberId,
            memberPhone: this.data.userData.phone,
            activityId: this.data.id,
            number: this.data.count,
            id: this.data.orderId,
            isVip: this.data.isVip ? "是" : "否"
        }
        if (this.data.itemData.isNeedPay == 1 && this.data.total > 0) { // 付费
            // 非会员价总价
            requestParms.priceTotal = (this.data.count * this.data.itemData.nonMBPrice).toFixed(2)
            // 会员价总价
            requestParms.priceDiscount = (this.data.count * this.data.itemData.mbPrice).toFixed(2)
            // 实际付款
            requestParms.priceActual = this.data.total
            requestParms.status = 0
        } else { 
            // 免费
            requestParms.priceTotal = 0
            requestParms.priceDiscount = 0
            requestParms.priceActual = 0
            requestParms.status = 1
        }
        console.log("----requestParms----------"+JSON.stringify(requestParms))
        wx.showLoading({ title: '报名中' })
        request.post(Api.orders, requestParms).then(res => {
            wx.hideLoading()
            console.log("---报名中------"+JSON.stringify(res))
            if (res.success){
                if (this.data.itemData.isNeedPay == 1 && this.data.total > 0) {
                    commomPay.payOrder(parseInt(this.data.total * 100), res.data.id)
                }else{
                    wx.redirectTo({ url: '/packageA/pay-callback/pay-callback?success=true'})
                }
            }else{
                wx.redirectTo({ url: '/packageA/pay-callback/pay-callback?success=false'})
            }
        }, error => {
            wx.redirectTo({ url: '/packageA/pay-callback/pay-callback?success=false'})
            wx.hideLoading()
        })
    },
    minusEvent: function (e) {
        if (this.data.count <= 1) return
        let total = this.data.price * (this.data.count - 1)
        total = total.toFixed(2)
        this.setData({ count: this.data.count - 1, total: total })
    },
    addEvent: function (e) {
        if (this.data.count >= this.data.maxNumber) return
        let total = this.data.price * (this.data.count + 1)
        total = total.toFixed(2)
        this.setData({ count: this.data.count + 1, total: total })
    },
    insetMembers: function(){
        let parms = {
            memberId: this.data.activityData.memberId,
            phone: this.data.userData.phone,
            name: this.data.userData.name,
            sex: app.globalData.userInfo.gender == 1 ? "男" : app.globalData.userInfo.gender == 2 ? "女" : "未知",
            email: this.data.userData.email,
            openid: app.globalData.openId,
            channel: 2,
            level: 0
        }
        console.log("parms=========="+JSON.stringify(parms))
        request.post(Api.vips, parms).then(res => {
            console.log("Api.vips--------"+JSON.stringify(res))
        }, error => {

        })

    } 
})