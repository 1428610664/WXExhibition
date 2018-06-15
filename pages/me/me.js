var auth = require('../../utils/auth.js')
var app = getApp();

Page({
  data: {
      isLoginPopup: false,
      userInfo: null,
      navList: [{ name: '待参加', id: 1, images: "/images/coupons.png" }, { name: '待支付', id: 2, images: "/images/payment.png" }, { name: '已结束', id: 3, images: "/images/examine.png" }],
  },
  onLoad: function (options) {
      
  },
  onReady: function () {
      if (app.globalData.userInfo) {
          this.setData({ userInfo: app.globalData.userInfo })
      } else {
          this.openLoginPopup()
      }
  },
  onShow: function () {
      if (app.globalData.userInfo) {
          this.closeLoginPopup()
          this.setData({ userInfo: app.globalData.userInfo })
      }
  },
  voucherEvent: function(e){
      var url = '/packageA/my-voucher/my-voucher?id=' + e.currentTarget.dataset.id
      wx.navigateTo({url: url})
  },
  toPage: function(e){
      var path = e.currentTarget.dataset.path
      wx.navigateTo({url: path})
  },
  onShareAppMessage: function () {
  
  },
  agreeGetUser: function (e) {
      var userInfo = e.detail.userInfo;
      var self = this;
      if (userInfo) {
          self.setData({ userInfo: userInfo })
          app.globalData.userInfo = userInfo
          auth.updateMembers(userInfo, app)
          setTimeout(function () {
              self.setData({ isLoginPopup: false })
          }, 1200);
      }
  },
  closeLoginPopup() {
      this.setData({ isLoginPopup: false });
  },
  openLoginPopup() {
      this.setData({ isLoginPopup: true });
  }
})