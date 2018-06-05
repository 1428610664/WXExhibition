Page({
  data: {
      navList: [{ name: '待参加', id: 1, images: "/images/coupons.png" }, { name: '待审核', id: 2, images: "/images/examine.png" }, { name: '待支付', id: 3, images: "/images/payment.png"}],
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  voucherClick: function(e){
      var url = '../my-voucher/my-voucher?id=' + e.currentTarget.dataset.id;
      wx.navigateTo({
          url: url
      })
  },
  toPage: function(e){
      var path = e.currentTarget.dataset.path;
      wx.navigateTo({
          url: path
      })
  },
  onShareAppMessage: function () {
  
  }
})