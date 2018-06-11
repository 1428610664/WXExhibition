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

module.exports = {
    formatTime: formatTime,
    format: format
}
