var request = require('request.js')
var Api = require('Api.js');
var app = getApp()

module.exports = {
    getOpenId(code, that) {
        request.post(Api.getOpenId, {'code': code}).then((res) => {
            if (res.success){
                that.globalData.session_key = res.data.session_key
                that.globalData.openId = res.data.openid
                this.loginWechat(res.data.openid, that)
            }
        }, (error) => {

        })
    },
    loginWechat: function (openid, that){
        request.post(Api.loginWechat, { wechat: openid}).then((res) => {
            if (res.success){
                let member = res.data.member
                that.globalData.memberId = member.id
                that.globalData.userData = {
                    phone: member.phone,
                    email: member.email,
                    nickName: member.nickName,
                    name: member.name
                }
                wx.setStorageSync("sessionId", "JSESSIONID=" + res.data.sessionId)
                if (that.globalData.userInfo)this.updateMembers(that.globalData.userInfo, that)
            }
        }, (error) => {
            
        })
    },
    updateMembers: function (userInfo, app){
        let parms = {
            id: app.globalData.memberId,
            nickName: userInfo.nickName,
            sex: userInfo.gender == 1 ? "男" : userInfo.gender == 2 ? "女" : "未知",
            address: userInfo.country + "-" + userInfo.province + "-" + userInfo.city,
            img: userInfo.avatarUrl
        }
        request.post(Api.members, parms)
            .then(res => {
                console.log("updateMembers=="+JSON.stringify(res))
            }, error => {

            })
    }
}