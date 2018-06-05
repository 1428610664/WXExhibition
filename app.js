//app.js
App({
  onLaunch: function () {
    /*wx.login({
        success: function (res) {
            console.log('login====' + JSON.stringify(res))
        }
    })
    wx.getSetting({
        success: function (res) {
            if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                    success: function (res) {
                        console.log("getUserInfo==="+res.userInfo)
                    }
                })
            }
        }
    })
    var that = this;
    wx.getUserInfo({
        success: function (res) {
            that.globalData.userInfo = res.userInfo
        }, fail: function () {
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success: function (res) {
                    if (res.confirm) {
                        wx.openSetting({
                            success: (res) => {
                                console.log(JSON.stringify(res))
                                if (res.authSetting["scope.userInfo"]) {
                                    wx.getUserInfo({
                                        success: function (res) {
                                            that.globalData.userInfo = res.userInfo
                                        }
                                    })
                                }
                            }, fail: function (res) {

                            }
                        })

                    }
                }
            })
        }, complete: function (res) {

        }
    })*/
  },
  globalData: {
    userInfo: null
  }
})