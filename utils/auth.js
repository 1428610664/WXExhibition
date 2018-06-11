var request = require('request.js')
var Api = require('Api.js');
var app = getApp()

module.exports = {
    getOpenId(code) {
        request.get("https://api.weixin.qq.com/sns/jscode2session?appid=wx44024c68a5bc7399&secret=b67d4e2a4244989aa92982628e61faf9&js_code=" + code + "&grant_type=authorization_code", {}).then((res) => {
            console.log(res.openid+"===========" + res.session_key)
            console.log(JSON.stringify(app))
            app.globalData.session_key = res.session_key
            app.globalData.openid = res.openid
        }, (error) => {

        })
    },
    loginWechat: function (openid){
        console.log(Api.loginWechat+"=========openid-------" + openid)
        /*request.post(Api.loginWechat, { wechat: "wechat"}).then((res) => {
            console.log("---loginWechat-------"+JSON.stringify(res))
        }, (error) => {
            
        })*/
        request.get(Api.login, { phone: "11111111111", passWord:"123asd"}).then((res) => {
            console.log("---loginWechat-------" + JSON.stringify(res))
        }, (error) => {

        })
    }
}