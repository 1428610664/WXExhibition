//app.js

var auth = require('utils/auth.js');

App({
    onLaunch: function () {
        let that = this
        this.globalData.userData = wx.getStorageSync("userData")
        wx.getUserInfo({
            success: function (res) {
                that.globalData.userInfo = res.userInfo
            }, fail: function () {
                
            }, complete: function (res) {

            }
        })

        wx.login({
            success: function (res) {
                console.log(res.code + '==login====' + JSON.stringify(res))
                auth.getOpenId(res.code, that)
            }
        })

        //auth.loginWechat("", this)
        /*wx.login({
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
                        auth.loginWechat(that.globalData.openid, that)
                    }
                })
            }
        })*/
    },
    globalData: {
        sessionId: '',
        memberId: '',
        session_key: '',
        openId: '',
        member: null,       // 登录返回数据
        userData: null,     // 用户名、手机、邮箱、昵称数据
        userInfo: null,     // 用户授权数据
        activityData: null  // 活动跳转数据
    }
})