// pages/perfect-information/perfect-information.js
Page({
    data: {
        checked: true,
        isModel: true
    },
    onLoad: function (options) {

    },
    onReady: function () {

    },
    getPhoneNumber: function (e) {

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