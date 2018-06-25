var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        id: "",
        status: "",
        voucherList: [],
        voucher: null
    },
    onLoad: function (options) {
        console.log(options)
        this.setData({ id: options.id, status: utils.formatStatus(parseInt(options.status))})
    },
    onReady: function () {
        this.requestTicket()
    },
    requestTicket: function(){
        request.get(Api.orderTicket, { orderId: this.data.id})
        .then(res => {
            console.log(JSON.stringify(res))
            if (res.success) {
                this._parseVoucher(res.data)
            }
        }, error => {

        })
    },
    _parseVoucher: function(data){
        let list = [], voucher = {}
        data.forEach((v, i) => {
            list.push({
                qrCodeUrl: Api.locationUrl + v.qrCodeUrl,
                codeNumber: v.codeNumber,
                status: v.status == 0 ? "未签到" : "已签到"
            })
            if(i == 0){
                voucher.activityName = v.activityName
                voucher.activityAddress = v.activityAddress
                voucher.memberPhone = v.memberPhone
                voucher.ordersPriceActual = v.ordersPriceActual
                voucher.ordersId = v.ordersId
                voucher.activityBeginTime = utils.formatDate(v.activityBeginTime.time, "yyyy-MM-dd hh:mm")
                voucher.activityEndTime = utils.formatDate(v.activityEndTime.time, "yyyy-MM-dd hh:mm")
                voucher.ordersCreateTime = utils.formatDate(v.ordersCreateTime.time, "yyyy-MM-dd hh:mm:ss")
            }
        })
        this.setData({ voucherList: list, voucher: voucher})
    }
})