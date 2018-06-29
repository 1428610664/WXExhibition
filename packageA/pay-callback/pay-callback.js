Page({
  data: {
    status: false,
    text: ""
  },
  onLoad: function (options) {
      console.log(options)
      let status = options.status
      this.setData({ status: options.success == "true", text: options.success == "true" ? "报名成功" : status == 0 ? "支付失败" : options.msg ? options.msg : "报名失败"})
  },
  onReady: function () {
  
  },
  toHome: function (e) {
      wx.switchTab({ url: "/pages/index/index" })
  }
})