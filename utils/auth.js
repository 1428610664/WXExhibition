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
                that.globalData.role = res.data.member.role
                wx.setStorageSync("memberId", member.id)
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
    },
    // 访问记录提交
    accessLog: function (access, app){
        let pages = getCurrentPages(), url = pages[pages.length - 1].route
        let systemInfo = app.globalData.systemInfo, userInfo = app.globalData.userInfo
        let parms = {
            accessUrl: url,
            belongToMember: access.belongToMember,
            belongToObject: access.belongToObject,
            accessUrlDesc: access.accessUrlDesc,
            visitorId: app.globalData.memberId
        }
        if (systemInfo){
            parms = Object.assign({}, parms, {
                visitorClientSys: systemInfo.system,
                visitorClientModel: systemInfo.model,
            })
        }
        if (userInfo){
            parms = Object.assign({}, parms, {
                visitorProvince: userInfo.province,
                visitorCity: userInfo.city,
                visitorSex: userInfo.gender
            })
        }
        request.post(Api.accessLog, parms)
            .then( res => {
                console.log("accessLog------"+JSON.stringify(res))
            }, error => {

            })
    }
}