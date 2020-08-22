'use strict';

const path = require('path');

/**
 * [exports 子进程的配置项]
 * @type {Object}
 */
module.exports = appInfo => {
	/**
	 * 返回缓存配置项
	 */
	return {
    	/**
    	 * [path 缓存目录]
    	 * @type {String}
    	 */
		path: path.join(appInfo.root, 'runtime', 'cache').replace(/\\/g,'/'),
		/**
		 * [ttl 缓存过期时间]
		 * @type {Number}
		 */
		ttl: 60,
		/**
		 * [preventfill 防止用缓存目录中的文件填充缓存]
		 * @type {String}
		 */
		preventfill: false,
		/**
		 * [fillcallback 初始缓存填充完成后激发的回调]
		 * @type {[type]}
		 */
		fillcallback: null,
		/**
		 * [zip 如果为true，将压缩缓存文件以节省磁盘空间]
		 * @type {Boolean}
		 */
		zip: true,
		/**
		 * [reviveBuffers 如果true,缓冲区作为缓冲区从缓存返回，则不是对象]
		 * @type {Boolean}
		 */
		reviveBuffers: false
	};
};