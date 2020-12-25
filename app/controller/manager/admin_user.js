'use strict';

const BaseController = require('../base.js');
const Bean 			 = require('../../bean');
/**
 * [exports 管理员登录控制器]
 * @type {[type]}
 */
module.exports = class AdminUserController extends BaseController {

	/**
	 * [useModel 使用模型]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	get useModel() {
		let that = this;
		return that.app.model.AdminUser;
	}
	/**
	 * [pkValidate 主键验证]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	get pkValidate() {
		let that = this;
		return {
			admin_id:that.ctx.rules.name('管理员ID').required().number()
		};
	}
	/**
	 * [selectValidate 列表查询验证]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	get selectValidate() {
		let that = this;
		return {
			page:that.ctx.rules.default(1).number(),
			limit:that.ctx.rules.default(20).number()
		};
	}
	/**
	 * [createValidate 添加管理员验证]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	get createValidate() {
		let that = this;
		return {
			username:that.ctx.rules.name('管理员账号').required().notEmpty(),
			password:that.ctx.rules.name('管理员密码').required().notEmpty().min_length(6),
			create_time:that.ctx.rules.default(that.app.szjcomo.date('Y-m-d H:i:s')).required()
		};
	}

	/**
	 * [select 管理员列表]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	async select() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.selectValidate,await that.get());
			let selectBean = new Bean(data,{offset:(data.page - 1) * data.limit,limit:data.limit});
			let result = await that.service.base.select(selectBean,that.useModel,true,true);
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [create 管理员添加]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	async create() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.createValidate,await that.post());
			data.password = that.app.szjcomo.md5(data.password);
			let createBean = new Bean(data);
			let result = await that.service.base.create(createBean,that.useModel,'管理员添加失败,请稍候重试');
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [update 管理员更新]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	async update() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.pkValidate,await that.param());
			if(data.password && data.password.length < 30) data.password = that.app.szjcomo.md5(data.password);
			let updateBean = new Bean(data,{where:{admin_id:data.admin_id},fields:Object.keys(data)});
			let result = await that.service.base.update(updateBean,that.useModel,'管理员信息更新失败,请稍候重试');
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result[0],false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [delete 管理员删除]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	async delete() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.pkValidate,await that.param());
			let deleteBean = new Bean(data,{where:{admin_id:data.admin_id}});
			let result = await that.service.base.delete(deleteBean,that.useModel,'管理员删除失败,请稍候重试');
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

}