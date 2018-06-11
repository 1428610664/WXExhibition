Page({
    data: {
        storageList: []
    },
    onLoad: function (options) {

    },
    onReady: function () {
        let storageList = wx.getStorageSync("storageList") || []
        this.setData({ storageList: storageList })
    },
    onReachBottom: function () {

    },
    searchEvent: function (e) {
        let key = e.currentTarget.id == "search-input" ? key = e.detail.value : key = e.detail.value.input;
        if (key == '') return;
        let storageList = wx.getStorageSync("storageList") || [];
        if (storageList.indexOf(key) == -1) {
            storageList.unshift(key)
            wx.setStorageSync("storageList", storageList)
        }
        wx.navigateTo({url: '../search-details/search-details?search=' + key })
    },
    removeStorage: function () {
        wx.removeStorage({key: "storageList"})
        this.setData({storageList: []})
    },
    clickStorage: function(e){
        wx.navigateTo({ url: '../search-details/search-details?search=' + e.currentTarget.dataset.data })
    },
    onShareAppMessage: function () {

    }
})