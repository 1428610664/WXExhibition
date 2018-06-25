const app = getApp()

let originalCategory = [{ name: "行业", images: "/images/industry.png", childer: [{ name: "IT互联网", id: 2 }, { name: "创业", id: 3 }, { name: "科技", id: 4 }, { name: "金融", id: 5 }, { id: 1, name: "游戏" }, { id: 1, name: "文娱" }, { id: 1, name: "电商" }, { id: 1, name: "教育" }, { id: 1, name: "营销" }, { id: 1, name: "设计" }, { id: 1, name: "地产" }, { id: 1, name: "医疗" }, { id: 1, name: "服务业" }] }, { name: "生活", images: "/images/life.png", childer: [{ name: "演出", id: 6 }, { id: 1, name: "文艺" }, { id: 1, name: "手工" }, { id: 1, name: "公益" }, { id: 1, name: "户外出游" }, { id: 1, name: "运动健康" }, { id: 1, name: "聚会交友" }, { id: 1, name: "休闲娱乐" }, { id: 1, name: "投资理财" }, { id: 1, name: "时尚" }, { id: 1, name: "心理" }, { id: 1, name: "体育赛事" }] }, { name: "亲子", images: "/images/parenting.png", childer: [{ id: 1, name: "儿童才艺" }, { id: 1, name: "益智潮玩" }, { id: 1, name: "儿童剧/展览" }, { id: 1, name: "亲子旅游" }, { id: 1, name: "早教/升学" }] }, { name: "学习", images: "/images/study.png", childer: [{ id: 1, name: "社团" }, { id: 1, name: "讲座" }, { id: 1, name: "课程" }, { id: 1, name: "读书" }, { id: 1, name: "职场" }] }]

Page({
    data: {
        isEdit: "none",
        editTxt: "编辑",
        existData: [],
        listData: []
    },
    onLoad: function (options) {
        let existData = wx.getStorageSync("navTabList")
        this.setData({ existData: [{ name: "已添加", childer: existData ? existData : app.globalData.navTabList}]})
        this.requestCategory()
    },
    onReady: function () {

    },
    requestCategory: function(){
        let existData = this.data.existData[0].childer,
            list = []
        originalCategory.forEach((v, i) => {
            list.push({ name: v.name, images: v.images, childer: v.childer.slice()})
        })

        originalCategory.forEach((v, i) => {
            existData.forEach((childer, index) => {
                let _i = this._findIndex(originalCategory[i].childer, childer.name)
                if (_i != -1){
                    list[i].childer.splice(_i, 1)
                }
            })
        })
        this.setData({ listData: list })
    },
    editEvent: function (e) {
        if (this.data.isEdit == "none") {
            this.setData({ isEdit: "block", editTxt: "完成" })
        } else {
            this.setData({ isEdit: "none", editTxt: "编辑" })
            app.globalData.navTabList = this.data.existData[0].childer
            wx.setStorageSync("navTabList", this.data.existData[0].childer)
        }
    },
    existEvent: function (e) {
        let item = e.currentTarget.dataset.item,
            index = e.currentTarget.dataset.index,
            existData = this.data.existData,
            listData = this.data.listData
        existData[0].childer.splice(index, 1)
        originalCategory.forEach((v, i) => {
            let _i = this._findIndex(v.childer, item.name)
            if (_i != -1) {
                listData[i].childer.push(item)
            }
        })

        this.setData({ existData: existData, listData: listData})
    },
    categoryEvent: function (e) {
        let item = e.currentTarget.dataset.item,
            index = e.currentTarget.dataset.index,
            childerindex = e.currentTarget.dataset.childerindex,
            existData = this.data.existData,
            listData = this.data.listData
        listData[index].childer.splice(childerindex, 1)
        existData[0].childer.push(item)
        this.setData({ existData: existData, listData: listData})
    },
    _findIndex: function(data, name){
        return data.findIndex(item => {
            return item.name == name
        })
    }
})