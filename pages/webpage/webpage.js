var Api = require('../../utils/Api.js')

Page({
  data: {
      url: ""
  },
  onLoad: function (options) {
      if (options.id){
          this.setData({
              url: Api.locationUrl + "/deltail?id=" + options.id
          })
      }
  },
  onReady: function () {
  
  }
})