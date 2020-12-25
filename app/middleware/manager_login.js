'use strict';
/**
 * [后台管理员登录检测]
 * @author        szjcomo
 * @createTime 2020-08-03
 * @return     {[type]}   [description]
 */
module.exports = (options) => {
    /**
     * [notFoundHandler 中间件实现]
     * @author        szjcomo
     * @createTime 2020-08-03
     * @param      {[type]}   ctx  [description]
     * @param      {Function} next [description]
     * @return     {[type]}        [description]
     */
    return async function managerLogin(ctx, next) {
        let token = ctx.request.header.managertoken;
        if(token) {
            try {
                let admin_user = ctx.app.jwt.verify(token,options.secret);
                await next();
            } catch(err) {
                return ctx.body = ctx.app.szjcomo.appResult('登录时间过期,请重新登录',null,true,10001);
            }
        } else {
            return ctx.body = ctx.app.szjcomo.appResult('未登录,请先登录后再进行数据操作',null,true,10001);
        }
    };
};