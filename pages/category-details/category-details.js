Page({
  data: {
      isEdit: "none",
      editTxt: "编辑",
      existData: [{ name: "已添加", childer: [{ name: "精选", id: 1 }, { name: "IT互联网", id: 2 }, { name: "创业", id: 3 }, { name: "科技", id: 4 }, { name: "金融", id: 5 }, { name: "演出", id: 6 }] }],
      listData: [{ name: "行业", images: "/images/industry.png", childer: [{ id: 1, name: "游戏" }, { id: 1, name: "文娱" }, { id: 1, name: "电商" }, { id: 1, name: "教育" }, { id: 1, name: "营销" }, { id: 1, name: "设计" }, { id: 1, name: "地产" }, { id: 1, name: "医疗" }, { id: 1, name: "服务业" }] }, { name: "生活", images: "/images/life.png", childer: [{ id: 1, name: "文艺" }, { id: 1, name: "手工" }, { id: 1, name: "公益" }, { id: 1, name: "户外出游" }, { id: 1, name: "运动健康" }, { id: 1, name: "聚会交友" }, { id: 1, name: "休闲娱乐" }, { id: 1, name: "投资理财" }, { id: 1, name: "时尚" }, { id: 1, name: "心理" }, { id: 1, name: "体育赛事" }] }, { name: "亲子", images: "/images/parenting.png", childer: [{ id: 1, name: "儿童才艺" }, { id: 1, name: "益智潮玩" }, { id: 1, name: "儿童剧/展览" }, { id: 1, name: "亲子旅游" }, { id: 1, name: "早教/升学" }] }, { name: "学习", images: "/images/study.png", childer: [{ id: 1, name: "社团" }, { id: 1, name: "讲座" }, { id: 1, name: "课程" }, { id: 1, name: "读书" }, { id: 1, name: "职场" }] }]
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  editClick: function(e){
      if (this.data.isEdit == "none"){
          this.setData({ isEdit: "block", editTxt: "完成"})
      }else{
          this.setData({ isEdit: "none", editTxt: "编辑"})
      }
  }
})