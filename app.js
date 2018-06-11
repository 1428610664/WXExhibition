//app.js

var auth = require('utils/auth.js');

App({
    onLaunch: function () {
        let that = this
        wx.getUserInfo({
            success: function (res) {
                that.globalData.userInfo = res.userInfo
            }, fail: function () {
                /*wx.showModal({
                    title: '警告',
                    showCancel: false,
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
                })*/
            }, complete: function (res) {

            }
        })
        wx.login({
            success: function (res) {
                console.log(res.code + '==login====' + JSON.stringify(res))
                wx.request({
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx44024c68a5bc7399&secret=b67d4e2a4244989aa92982628e61faf9&js_code=' + res.code + '&grant_type=authorization_code',
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                        console.log('login====' + JSON.stringify(res))
                        that.globalData.session_key = res.data.session_key
                        that.globalData.openid = res.data.openid
                        auth.loginWechat(that.globalData.openid)
                    }
                })
            }
        })
    },
    globalData: {
        phoneNumber: '',
        userInfo: null,
        session_key: '',
        openid: ''
    }
})