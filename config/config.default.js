'use strict';

const prod = require('./prod');

/**
 * [总配置器]
 * @author      szjcomo
 * @createTime 2020-08-03
 * @param      {[type]}   appInfo [description]
 * @return     {[type]}           [description]
 */
module.exports = appInfo => {
    const config = exports = {};
    // 用于cookie签名密钥，应更改为您自己的密钥并保持安全
    config.keys = appInfo.name + '_szjcomo-egg';
    const userConfig = prod(appInfo);
    return {...config,...userConfig};
};
