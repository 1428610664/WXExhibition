Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onReachBottom: function () {
  
  },
  search: function(e){
      wx.navigateTo({
          url: '../search-details/search-details'
      })
  },
  searchEvent: function(e){
      wx.showToast({ title: e.detail.value })
      wx.navigateTo({
          url: '../search-details/search-details'
      })
  },
  onShareAppMessage: function () {
  
  }
})