'use strict';
/**
 * [用户授权拦截插件]
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
    return async function autoToken(ctx, next) {
        let token = ctx.request.header.token;
        try {
            if(!token) {
                ctx.body = ctx.app.szjcomo.appResult('Invalid token request');
                return;
            }
            let user = ctx.app.szjcomo.aes_decode(token);
            if(!user) {
                ctx.body = ctx.app.szjcomo.appResult('Invalid token request');
                return;
            }
            await next();
        } catch(err) {
            ctx.body = ctx.app.szjcomo.appResult(err.message);
            return;
        }
    };
};