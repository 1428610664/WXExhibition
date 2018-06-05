Page({
  data: {
      topTabItems: ["全部", "已签到", "未签到"],
      currentTopItem: 0,
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  switchTab: function (e) {
      wx.showToast({ title: 'id:' + e.currentTarget.dataset.idx })
      this.setData({ currentTopItem: e.currentTarget.dataset.idx })
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  }
})