Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  // 扫码
  scanCode: function () {
      wx.scanCode({
          success: (res) => {
              wx.showModal({
                  title: '扫码',
                  content: JSON.stringify(res),
                  success: function (res) {
                      if (res.confirm) {
                          console.log('用户点击确定')
                      } else if (res.cancel) {
                          console.log('用户点击取消')
                      }
                  }
              })
          }
      })
  },
})