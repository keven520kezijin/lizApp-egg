'use strict';

const path = require('path');

/**
 * [路由集合]
 * @author 	   szjcomo
 * @createTime 2020-08-03
 * @param      {[type]}   app [description]
 * @return     {[type]}       [description]
 */
module.exports = app => {
	/**
	 * 首页控制器
	 */
	require(path.join(app.baseDir,'app','routers','home','home.js'))(app);
	/**
	 * 后台控制器
	 */
	require(path.join(app.baseDir,'app','routers','manager','index.js'))(app);
}