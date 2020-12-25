'use strict';

/**
 * [manager]
 * @author 	   szjcomo
 * @createTime 2020-08-03
 * @param      {[type]}   app [description]
 * @return     {[type]}       [description]
 */
module.exports = app => {
	/**
	 * [manager 后台命名空间]
	 * @type {[type]}
	 */
	const manager = app.router.namespace('/manager');
	/**
	 * [adminCtr 后台管理员控制器]
	 * @type {[type]}
	 */
	const adminCtr = app.controller.manager;
	//管理员登录检查函数
	const managerLogin = app.middleware.managerLogin(app.config.jwt);
	/**
	 * 后台管理员
	 */
	manager.get('/admin_user',managerLogin,adminCtr.adminUser.select);
	manager.post('/admin_user',managerLogin,adminCtr.adminUser.create);
	manager.put('/admin_user',managerLogin,adminCtr.adminUser.update);
	manager.delete('/admin_user',managerLogin,adminCtr.adminUser.delete);
	manager.post('/dologin',adminCtr.login.dologin);
	manager.get('/video',managerLogin,adminCtr.video.select);
	manager.put('/video/examine',managerLogin,adminCtr.video.examine);
	manager.delete('/video',managerLogin,adminCtr.video.delete);
}