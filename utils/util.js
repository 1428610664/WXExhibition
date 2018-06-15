const formatTime = dStr => {
    const date = new Date(dStr),year = date.getFullYear(),month = date.getMonth() + 1,day = date.getDate(),hour = date.getHours(),minute = date.getMinutes(),second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const format = dStr => {
    const date = new Date(dStr), month = date.getMonth() + 1, day = date.getDate(), d = date.getDay()
    return [month, day].map(formatNumber).join('/') + ' ' + formatDay(d)
}


const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const formatDay = d => {
    const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    return days[d]
}

const formatDate = (d, format) => {
    console.log(typeof d +"-------")
    if (typeof d == "string" || typeof d == "number"){
        d = new Date(d)
    }
    // 日期格式化
    var o = {
        'M+': d.getMonth() + 1, // month
        'd+': d.getDate(), // day
        'h+': d.getHours(), // hour
        'm+': d.getMinutes(), // minute
        's+': d.getSeconds(), // second
        'q+': Math.floor((d.getMonth() + 3) / 3), // quarter
        'S': d.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (var k in o) {
        if (o.hasOwnProperty(k) && new RegExp('(' + k + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)) }
    }
    return format
}


const formatLabel = d => {
    let list = d.split(","), str = ''
    list.forEach((v, i) => {
        str += "#" + v +" "
    })
    return str
}

const formatStatus = s => {
    switch(s){
        case -1: 
            return "审核不通过"
        case 0:
            return "未审核"
        case 1:
            return "未开始"
        case 2:
            return "执行中"
        case 3:
            return "暂停"
        case 99:
            return "结束"
    }
}

const isPhone = v => {
    var ref = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    return !ref.test(v);
}

const isEmail = v => {
    var ref = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    return ref.test(v);
}

const isEmpty = val => {
    if (val == null) return true;
    if (val == undefined || val == 'undefined') return true;
    if (val == "") return true;
    if (val.length == 0) return true;
    if (!/[^(^\s*)|(\s*$)]/.test(val)) return true;
    return false;
}

module.exports = {
    formatTime: formatTime,
    format: format,
    formatDate: formatDate,
    formatStatus: formatStatus,
    formatLabel: formatLabel,
    isPhone: isPhone,
    isEmail: isEmail,
    isEmpty: isEmpty
}
