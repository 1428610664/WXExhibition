Page({
  data: {
      topTabItems: ["全部", "行业", "生活", "亲子", "学习"],
      currentTopItem: 0,
      windowHeight: 0,
      showMask: "none",
      selectIndex: -1,
      sortList: [],
      sortData: [[{ name: "精选", id: 1 }], [{ name: "全时段", id: 1 }, { name: "今天", id: 1 }, { name: "明天", id: 1 }, { name: "本周", id: 1 }, { name: "本周末", id: 1 }, { name: "本月", id: 1 }], [{ name: "全价格", id: 1 }, { name: "免费", id: 1 }, { name: "付费", id: 1 }], [{ name: "综合排序", id: 1 }, { name: "最新发布", id: 1 }, { name: "热门点击", id: 1 }, { name: "最多参与", id: 1 }]]
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
      var that = this;
      wx.getSystemInfo({
          success: function (res) {
              that.setData({
                  windowHeight: (res.windowHeight - 83)
              });
          }
      })
  },
  onPullDownRefresh: function () {
      setTimeout(() => {
          wx.stopPullDownRefresh()
      }, 2000)
      wx.showToast({ title: 'onPullDownRefresh' })
  },
  onReachBottom: function () {
      wx.showToast({ title: 'loadMoreData' })
  },
  toCity: function () {
      wx.navigateTo({
          url: '../city/city'
      })
  },
  switchTab: function (e) {
      wx.showToast({ title: 'id:' + e.currentTarget.dataset.idx })
      this.setData({ currentTopItem: e.currentTarget.dataset.idx})
  },
  tabItemClick: function(e){
      var id = e.currentTarget.dataset.id;
      console.log(this.data.sortData[id])
      if (this.data.selectIndex == id){
          this.setData({ showMask: "none", selectIndex: -1 })
      }else{
          this.setData({ showMask: "block", selectIndex: id, sortList: this.data.sortData[id]})
      }
  },
  maskClick: function(e){
      this.setData({ showMask: "none", selectIndex: -1 })
  },
  // 跳转至查看小程序列表页面或文章详情页
  redictAppDetail: function (e) {
      /*var id = e.currentTarget.id,
          url = '../detail/detail?id=' + id;*/
      wx.navigateTo({
          url: '../exhibition-details/exhibition-details'
      })
  },
  searchClick: function (e) {
      wx.navigateTo({
          url: '../search/search'
      })
  },
  sortClick: function(e){
      wx.showToast({ title: e.currentTarget.dataset.data.name })
      this.setData({ showMask: "none", selectIndex: -1 })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      
  }
})