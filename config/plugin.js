'use strict';

/** @type Egg.EggPlugin */
module.exports = {
	/**
	 * [routerPlus 路由增强插件]
	 * @type {Object}
	 */
	routerPlus:{
	  	enable: true,
	  	package: 'egg-router-plus',
	},
	/**
	 * [cors 跨域插件处理]
	 * @type {Object}
	 */
	cors:{
		enable: true,
		package: 'egg-cors',
	},
	/**
	 * [validate 表单验证插减]
	 * @type {Object}
	 */
	validate:{
		enable: true,
		package: 'egg-szjcomo-validate',
	},
	/**
	 * [szjcomo 工具类]
	 * @type {Object}
	 */
	szjcomo:{
		enable: true,
		package: 'egg-szjcomo-utils',
	},
	/**
	 * [sequelize 数据库操作插件]
	 * @type {Object}
	 */
	sequelize:{
	  	enable: true,
	  	package: 'egg-sequelize'
	},
	/**
	 * [szjcomoDyw 短信发送接口]
	 * @type {Object}
	 */
	szjcomoDyw:{
		enable: true,
		package: 'egg-szjcomo-dyw',
	},
	/**
	 * [excel excel插件]
	 * @type {Object}
	 */
	excel:{
		enable: true,
		package: 'egg-szjcomo-excel',
	},
	/**
	 * [szjcomoCache 缓存插件]
	 * @type {Object}
	 */
	szjcomoCache:{
		enable:true,
		package:'egg-szjcomo-cache'
	},
	/**
	 * [ffmpeg 视频处理包]
	 * @type {Object}
	 */
	ffmpeg:{
	  	enable: true,
  		package: 'egg-szjcomo-ffmpeg',
	},
	/**
	 * [redis 消息队列+缓存]
	 * @type {Object}
	 */
	redis:{
	  	enable: true,
	  	package: 'egg-redis',
	}
};
