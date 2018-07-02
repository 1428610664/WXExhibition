var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        id: "",
        signUrl: '',
        showCode: true,
        value: ""
    },
    onLoad: function (options) {
        console.log(options)
        this.setData({ id: options.id, signUrl: options.signUrl})
    },
    onReady: function () {

    },
    // 扫码
    scanCode: function () {
        wx.scanCode({
            success: (res) => {
                console.log(JSON.stringify(res))
                this.upDateTicket(res.result, 0)
            }
        })
    },
    upDateTicket: function (code, signType){
        wx.showLoading({title: '签到中...' })
        console.log(JSON.stringify({ activityId: this.data.id, codeNumber: code, signType: signType }))
        request.post(Api.ticketSign, { activityId: this.data.id, codeNumber: code, signType: signType})
            .then(res => {
                wx.hideLoading()
                wx.showModal({
                    title: '扫码结果',
                    content: res.desc,
                    showCancel: false
                })
            }, error => {
                wx.hideLoading()
            })
    },
    signInEvent: function (e) {
        let value = e.currentTarget.id == "input" ? e.detail.value : e.detail.value.input
        if (utils.isEmpty(value)){
            wx.showToast({ icon: "none",title: '请输入签到码' })
            return
        }
        this.upDateTicket(value, 2)
    },
    swickEvent: function(e){
        let mark = e.currentTarget.dataset.mark
        console.log(JSON.stringify(e))
        if (mark == 1){
            if(this.data.showCode){
                this.scanCode()
            }else{
                this.setData({ showCode: true})
            }
        }else{
            this.setData({ showCode: false})
        }
    }
})