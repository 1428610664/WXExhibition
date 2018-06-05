
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  // 跳转至查看小程序列表页面或文章详情页
  redictAppDetail: function (e) {
      /*var id = e.currentTarget.id,
          url = '../detail/detail?id=' + id;*/
      wx.navigateTo({
          url: '../exhibition-details/exhibition-details'
      })
  },
})