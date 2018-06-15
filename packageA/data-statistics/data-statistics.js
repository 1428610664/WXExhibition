var wxCharts = require('../../utils/wxcharts-min.js');
var lineChart = null, lineChart1 = null;
var chartArr = {
    lineChart: null,
    lineChart1: null
}
var simulationData = {
    "categories": ["2016-6-1", "2016-6-2", "2016-6-3", "2016-6-4", "2016-6-5", "2016-6-6", "2016-6-7", "2016-6-8", "2016-6-9", "2016-6-10"],
    "data": [123, 145, 168, 67, 325, 234, 178, 134, 356, 190]
}

Page({
    data: {

    },
    /*touchHandler: function (e) {
        var id = e.target.id;
        chartArr[id].scrollStart(e);
    },
    moveHandler: function (e) {
        var id = e.target.id;
        chartArr[id].scroll(e);
    },
    touchEndHandler: function (e) {
        var id = e.target.id;
        chartArr[id].scrollEnd(e);
        chartArr[id].showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },*/
    touchHandler: function (e) {
        lineChart.scrollStart(e);
    },
    moveHandler: function (e) {
        lineChart.scroll(e);
    },
    touchEndHandler: function (e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },
    touchHandler1: function (e) {
        lineChart1.scrollStart(e);
    },
    moveHandler1: function (e) {
        lineChart1.scroll(e);
    },
    touchEndHandler1: function (e) {
        lineChart1.scrollEnd(e);
        lineChart1.showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },
    onLoad: function (e) {
        this.initLineChart();
        this.initLineChart1();
    },
    initLineChart: function(){

        lineChart = new wxCharts({
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
                //title: '活动浏览数',
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
        });
    },
    initLineChart1: function(){
        lineChart1 = new wxCharts({
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
                //title: '活动浏览数',
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
        });
    }
});