Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  toPage: function (e) {
      var path = e.currentTarget.dataset.path;
      wx.navigateTo({
          url: path
      })
  }
})