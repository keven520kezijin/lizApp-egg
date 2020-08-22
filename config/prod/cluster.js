'use strict';
/**
 * [exports 子进程的配置项]
 * @type {Object}
 */
module.exports = {
	/**
	 * [listen 监听配置]
	 * @type {Object}
	 */
    listen: {
    	/**
    	 * [path 在服务器侦听时设置unix sock路径]
    	 * @type {String}
    	 */
		path: '',
		/**
		 * [port 服务器侦听时设置端口]
		 * @type {Number}
		 */
		port: 8105,
		/**
		 * [hostname 在服务器侦听时设置主机名绑定服务器]
		 * @type {String}
		 */
		hostname: '',
    },
};