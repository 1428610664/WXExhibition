var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')

let app = getApp()

module.exports = {
    // 下单
    payOrder(price, orderId) {
        console.log("0000000000000000==="+app.globalData.openId)
        request.post(Api.pay, { 'openId': app.globalData.openId, 'fee': price, orderCode: orderId})
            .then(res => {
                console.log("-------下单---------" + JSON.stringify(res))
                if (res.success){
                    this.sign(res.data.prepay_id)
                }else{
                    wx.redirectTo({ url: '/packageA/pay-callback/pay-callback?success=false&status=0'})
                }
            }, error => {

            })
    },
    // 签名
    sign(prepay_id) {
        request.post(Api.sign, { 'repay_id': prepay_id })
            .then(res => {
                console.log("-------签名---------" + JSON.stringify(res))
                if (res.success){
                    this.requestPayment(res.data)
                } else {
                    wx.redirectTo({ url: '/packageA/pay-callback/pay-callback?success=false&status=0'})
                }
            }, error => {

            })
    },
    // 支付
    requestPayment(data) {
        wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function (res) {
                console.log("-------支付---------"+JSON.stringify(res))
                if (res.errMsg == "requestPayment:ok"){
                    // 付款成功 
                    wx.redirectTo({ url: '/packageA/pay-callback/pay-callback?success=true&status=0'})
                }else{
                    wx.redirectTo({ url: '/packageA/pay-callback/pay-callback?success=false&status=0'})
                }
            },
            'fail': function (res) {
                console.log(res)
                wx.redirectTo({ url: '/packageA/pay-callback/pay-callback?success=false&status=0' })
            }
        })
    }
}
