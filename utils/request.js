
var commonParams = {}
module.exports = {
    ajax(url, parma, type) {
        let data = Object.assign({}, commonParams, parma)
        return new Promise((resolve, reject) => {
            wx.request({
                method: type ? type : "POST",
                url: url,
                data: data,
                header: { 'content-type': 'application/json' },
                success: function (res) {
                    resolve(res.data)
                },
                fail: function (error) {
                    console.log(url+"====error ============" + JSON.stringify(error))
                    reject(error)
                }
            })
        })
    },
    post(url, parma) {
        return this.ajax(url, parma, "POST")
    },
    get(url, parma) {
        return this.ajax(url, parma, "GET")
    },
    delete(url, parma) {
        return this.ajax(url, parma, "DELETE")
    }
}