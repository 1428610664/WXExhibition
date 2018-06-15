var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
let app = getApp()

Page({
    data: {
        id: '',
        checked: true,
        isModel: false,
        nickName: ''
    },
    onLoad: function (options) {
        console.log(JSON.stringify(app.globalData.userInfo))
        this.setData({ id: options.id, nickName: app.globalData.userInfo ? app.globalData.userInfo.nickName : ''})
    },
    onReady: function () {

    },
    getPhoneNumber: function (e) {
        console.log(JSON.stringify(e))
    },
    submitEvent: function(e){
        let form = e.detail.value
        if (utils.isPhone(form.phone)){
            wx.showToast({icon: "none",title: '手机输入不正确'})
            return
        }
        if (utils.isEmpty(form.name)) {
            wx.showToast({ icon: "none", title: '姓名不能为空'})
            return
        }
        if (!utils.isEmail(form.email)) {
            wx.showToast({ icon: "none", title: '邮箱不正确'})
            return
        }
        console.log(JSON.stringify(e.detail.value))

        let parms = e.detail.value
        parms.id = app.globalData.memberId
        wx.showLoading({ title: '提交中' })
        request.post(Api.members, parms).then( res => {
            wx.hideLoading()
            if (res.success){
                app.globalData.userData = e.detail.value
                wx.redirectTo({ url: '/packageA/pay/pay?id=' + this.data.id})
            }
            console.log(JSON.stringify(res))
        }, error => {
            wx.hideLoading()
        })
    },
    checkboxChange: function (e) {
        console.log(e)
    },
    coloseModel: function (e) {
        this.setData({ isModel: false })
    },
    checkedEvent: function (e) {
        this.setData({ checked: !this.data.checked})
    },
    agreementEvent: function(e){
        wx.showToast({title: '《用户注册协议》'})
    }
})