'use strict';

const BaseController = require('../base.js');
const Bean 			 = require('../../bean');
/**
 * [exports 管理员登录控制器]
 * @type {[type]}
 */
module.exports = class LoginController extends BaseController {
	/**
	 * [dologinValidate 用户登录验证器]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	get dologinValidate() {
		let that = this;
		return {
			username:that.ctx.rules.name('管理员账号').required(),
			password:that.ctx.rules.name('管理员密码').required()
		};
	}

	/**
	 * [dologin 管理员登录验证器]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	async dologin() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.dologinValidate,await that.post());
			let selectBean = new Bean(data,{where:{
				username:data.username,password:that.app.szjcomo.md5(data.password)
			},raw:true});
			let result = await that.service.base.select(selectBean,that.app.model.AdminUser);
			let response = {user:result,managertoken:that.app.jwt.sign(result, that.app.config.jwt.secret)};
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',response,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MiwidXNlcm5hbWUiOiJzempjb21vIiwicGFzc3dvcmQiOiIyMzUyNTA1MzBlYWQ1NWZmZjE0ZDcxMzQ4YTJjZjJjMSIsInVwZGF0ZV90aW1lIjoiMjAyMC0xMi0yNSAxNjo0NDo0MyIsImNyZWF0ZV90aW1lIjoiMjAyMC0xMi0yNSAxNjo0MjoyNCIsImlhdCI6MTYwODg4OTI5MH0.yb9UOrUcWd9t1qdLPW9FVMJbp_AKAyD6LxVeDVKo6dQ