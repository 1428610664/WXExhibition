
var locationUrl = "https://pmp.coreware.cn/gather";
module.exports = {
    locationUrl: locationUrl,
    getHomeList: locationUrl + "/activitys",                // 活动
    queryComprehensive: locationUrl + "/activitys/queryComprehensive",  // 活动综合查询
    queryActivity(id){                                      // 查询活动
        return locationUrl + "/activitys/info/" + id
    },
    loginWechat: locationUrl + '/members/loginWechat',      // 登录
    orders: locationUrl + "/orders",                        // 订单
    keeps: locationUrl + "/keeps",                          // 收藏
    members: locationUrl + "/members",                      // 用户
    queryMemberVip: locationUrl + "/vips/queryMemberVip",   // vip用户查询
    queryVip(id){
        return locationUrl + "/activitys/"+id+"/vip"           // vip用户查询
    },
    vips: locationUrl + "/vips",                            // 会员
    getOpenId: locationUrl + "/weixin/getOpenId",           // openID
    pay: locationUrl + "/weixin/pay",                       // 支付
    sign: locationUrl + "/weixin/sign",                     // 签名
    myTicket: locationUrl + "/activitys/myTicket",          // 我的票券
    orderTicket: locationUrl + "/ticket/orderTicket",       // 票券详情
    ticket: locationUrl + "/ticket",                        // 票券信息
    ticketSign: locationUrl + "/ticket/sign",               // 签到
    accessLog: locationUrl + "/accessLog",                  // 访问记录
    orderStatistics: locationUrl + "/orders/ctByFormat",    // 订单统计
    browseStatistics: locationUrl + "/accessLog/ctByFormat",// 浏览统计
    config: locationUrl + "/activitys/config",              // 分类
    findTree: locationUrl + "/configs/findTree",            // 分类
    homeCategory: locationUrl + "/configs/queryList",       // 首页分类
}