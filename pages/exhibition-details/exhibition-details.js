Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  toHome: function(e){
      wx.switchTab({ url: "../index/index"})
  },
  onShareAppMessage: function () {
      return {
          title: '自定义转发标题',
          path: "pages/exhibition-details/exhibition-details"
      }
  }
})