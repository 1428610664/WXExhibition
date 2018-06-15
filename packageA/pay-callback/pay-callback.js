Page({
  data: {
    status: false,
    text: ""
  },
  onLoad: function (options) {
      console.log(options)
      this.setData({ status: options.success == "true", text: options.success == "true" ? "报名成功" : "报名失败"})
  },
  onReady: function () {
  
  },
  toHome: function (e) {
      wx.switchTab({ url: "/pages/index/index" })
  },
})