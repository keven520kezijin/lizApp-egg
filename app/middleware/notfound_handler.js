'use strict';
/**
 * [自定义404返回处理]
 * @author        szjcomo
 * @createTime 2020-08-03
 * @return     {[type]}   [description]
 */
module.exports = () => {
    /**
     * [notFoundHandler 中间件实现]
     * @author        szjcomo
     * @createTime 2020-08-03
     * @param      {[type]}   ctx  [description]
     * @param      {Function} next [description]
     * @return     {[type]}        [description]
     */
    return async function notFoundHandler(ctx, next) {
        await next();
        if (ctx.status === 404 && !ctx.body) {
            if (ctx.acceptJSON) {
                ctx.body = ctx.app.szjcomo.appResult('访问页面不存在');
            } else {
                ctx.body = '<h1 style="text-align:center;line-height:300px;">访问页面不存在</h1>';
            }
        }
    };
};