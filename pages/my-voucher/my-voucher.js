Page({
  data: {
      topTabItems: ["全部", "待参加", "待审核", "待支付"],
      currentTopItem: -1,
  },
  onLoad: function (options) {
      this.setData({ currentTopItem: options.id})
  },
  onReady: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  switchTab: function (e) {
      wx.showToast({ title: 'id:' + e.currentTarget.dataset.idx })
      this.setData({ currentTopItem: e.currentTarget.dataset.idx })
  },
  redictAppDetail: function (e) {
      /*var id = e.currentTarget.id,
          url = '../detail/detail?id=' + id;*/
      wx.navigateTo({
          url: '../voucher-details/voucher-details'
      })
  },
  onShareAppMessage: function () {
  
  }
})