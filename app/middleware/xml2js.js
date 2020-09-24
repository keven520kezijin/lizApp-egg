'use strict';
module.exports = () => {
    return async function xml2js(ctx, next){
        if (ctx.method === 'POST' && ctx.is('text/xml')) {
            const promise = new Promise((resolve, reject) => {
                let data = '';
                ctx.req.on('data', chunk => {data += chunk;});
                ctx.req.on('end', () => {
                    ctx.app.szjcomo.parseXml(data).then(result => {
                        resolve(result);
                    }).catch(err => {
                        reject(err);
                    });
                });
            });
            await promise.then(result => {ctx.request.body = result;}).catch(() => {ctx.request.body = '';});
        }
        await next();
    };
};