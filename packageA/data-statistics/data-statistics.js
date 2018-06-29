var Api = require('../../utils/Api.js');
var request = require('../../utils/request.js')
var utils = require('../../utils/util.js')
let wxCharts = require('../../utils/wxcharts-min.js')


let chartArr = {
    lineChart: null,
    lineChart1: null
}
let simulationData = {
    "categories": [0],
    "data": [0],
    "categories1": ["2016-6-1"],
    "data1": [32],
    "data2": [12, 209, 34, 23, 45, 278, 321, 32, 345, 128]
}

Page({
    data: {
        requestParms: {}
    },
    touchHandler: function (e) {
        let id = e.target.id
        chartArr[id].scrollStart(e)
    },
    moveHandler: function (e) {
        let id = e.target.id
        chartArr[id].scroll(e)
    },
    touchEndHandler: function (e) {
        let id = e.target.id
        chartArr[id].scrollEnd(e)
        chartArr[id].showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        })
    },
    onLoad: function (options) {
        console.log(JSON.stringify(options))
        this.setData({
            requestParms: {
                activityId: options.id,
                bTime: utils.formatDate(options.createTime * 1, "yyyy-MM-dd hh:mm:ss"),
                eTime: utils.formatDate(options.endTime * 1, "yyyy-MM-dd hh:mm:ss"),
                ctType: "sum"
            }
        })
        this.initLineChart()
        this.initLineChart1()
    },
    onReady: function () {
        this.requestData()
    },
    requestData: function(){
        let orderParms = Object.assign(this.data.requestParms, { ctKey: "price_actual"}) 
        request.get(Api.orderStatistics, orderParms)
            .then( res => {
                console.log(JSON.stringify(res))
                if (res.success && res.data.price_actual.length > 0){
                    let data = this._parseData(res.data.price_actual)
                    this.updateChart("lineChart1", "票款金额", data.value, data.categories)
                }
            }, error => {

            })
        request.get(Api.browseStatistics, this.data.requestParms)
            .then(res => {
                console.log(JSON.stringify(res))
                if (res.success && res.data.length > 0) {
                    let data = this._parseData(res.data)
                    this.updateChart("lineChart", "浏览数", data.value, data.categories)
                }
            }, error => {

            })
    },
    initLineChart: function(){

        chartArr.lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: simulationData.categories,
            series: [{
                name: '浏览数',
                data: simulationData.data
            }],
            xAxis: {
                gridColor: "#f1f1f1",
                disableGrid: false
            },
            yAxis: {
                gridColor: "#f1f1f1",
                min: 0
            },
            width: wx.getSystemInfoSync().windowWidth | 320,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                lineStyle: 'curve'
            }
        })
    },
    initLineChart1: function(){
        chartArr.lineChart1 = new wxCharts({
            canvasId: 'lineCanvas1',
            type: 'line',
            categories: simulationData.categories,
            series: [{
                name: '票款金额',
                data: simulationData.data,
                format: function (val, name) {
                    return val + '元';
                }
            }],
            xAxis: {
                gridColor: "#f1f1f1",
                disableGrid: false
            },
            yAxis: {
                gridColor: "#f1f1f1",
                min: 0,
            },
            width: wx.getSystemInfoSync().windowWidth | 320,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                lineStyle: 'curve'
            }
        })
    },
    updateChart: function (chart, name, data, categories){
        chartArr[chart].updateData({
            categories: categories,
            series: [{
                name: name,
                data: data,
                format: function (val, name) {
                    return val + (chart == "lineChart1" ? "元" : '')
                }
            }]
        })
    },
    _parseData: function(data){
        let value = [], timer = []
        data.forEach((v, i) => {
            value.push(v.ct)
            timer.push(v.time)
        })
        return { value: value, categories: timer}
    }
});