'use strict';
/**
 * [exports 安全机制验证配置]
 * @type {Object}
 */
module.exports = {
	/**
	 * [xframe 框架的安全插件是默认开启的，如果我们想关闭其中一些安全防范，
	 * 直接设置该项的 enable 属性为 false 即可]
	 * @type {Object}
	 */
	xframe: {
	  	enable: true,
	},
	/**
	 * [csrf CSRF 攻击：伪造用户请求向网站发起恶意请求]
	 * @type {Object}
	 */
	csrf:{
		enable:false,
		queryName:'szjkj_token',//设置安全机制的名称
		bodyName:'szjkj_token',//设置安全机制的名称
	}
};