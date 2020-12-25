'use strict';

const BaseController = require('../base.js');
const Bean 			 = require('../../bean');
/**
 * [exports 管理员登录控制器]
 * @type {[type]}
 */
module.exports = class VideoController extends BaseController {

	/**
	 * [useModel 使用模型]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	get useModel() {
		let that = this;
		return that.app.model.Video;
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
			video_id:that.ctx.rules.name('视频ID').required().number()
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
			page:that.ctx.rules.default(1).required().number(),
			limit:that.ctx.rules.default(30).required().number(),
			tag_name:that.ctx.rules.default('').required(),
			video_price:that.ctx.rules.default(-1).required().number(),
			sort:that.ctx.rules.default('video_id').required(),
			video_status:that.ctx.rules.default(-1).required().number(),
			user_id:that.ctx.rules.default(0).required().number(),
			video_id:that.ctx.rules.default(0).required().number()
		};
	}
	/**
	 * [examineValidate 审核视频验证器]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	get examineValidate() {
		let that = this;
		return {
			video_id:that.ctx.rules.name('视频ID').required().number(),
			video_status:that.ctx.rules.name('视频状态').required().number()
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
			let result = data.video_id > 0?await that._select_info(data.video_id):await that._select_list(data);
			return that.appJson(result);
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

	/**
	 * [_select_info 获取视频详情]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @param      {[type]}   video_id [description]
	 * @return     {[type]}            [description]
	 */
	async _select_info(video_id) {
		let that = this;
		let seq = that.app.Sequelize;
		let options = {
			where:{video_id:video_id},include:[
				{model:that.app.model.Users,as:'users',attributes:[]},
				{model:that.app.model.VideoTag,as:'video_tag',attributes:[]}
			],
			attributes:{
				include:[
					[seq.col('users.nickname'),'nickname'],
					[seq.col('users.avatarurl'),'avatarurl'],
					[seq.col('video_tag.tag_name'),'tag_name']
				],
				exclude:['video_hash','admin_id','update_time']
			},raw:true
		};
		let videoBean = new Bean({video_id:video_id},options);
		let result = await that.ctx.service.base.select(videoBean,that.useModel);
		return that.app.szjcomo.appResult('视频详情查询成功',result,false);
	}


	/**
	 * [_select_list 获取视频列表]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @param      {[type]}   data [description]
	 * @return     {[type]}        [description]
	 */
	async _select_list(data) {
		let that = this;
		let options = that.getListOptions(data);
		let videoBean = new Bean(data,options);
		let result = await that.service.base.select(videoBean,that.useModel,true,true);
		return that.app.szjcomo.appResult('作品列表查询成功',result,false);
	}

	/**
	 * [getListOptions 查询options]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @param      {[type]}   data [description]
	 * @return     {[type]}        [description]
	 */
	getListOptions(data = {}) {
		let that = this;
		let seq = that.ctx.app.Sequelize;
		let options = {offset:(data.page - 1) * data.limit,limit:data.limit,
			where:{},sort:[[data.sort,'desc']],include:[
				{model:that.ctx.model.VideoTag,as:'video_tag',attributes:[]},
				{model:that.ctx.model.Users,as:'users',attributes:[]}
			],
			attributes:{
				include:[
					[seq.col('video_tag.tag_name'),'tag_name'],
					[seq.col('users.nickname'),'nickname'],
					[seq.col('users.avatarurl'),'avatarurl'],
				],
				exclude:['video_desc','update_time']
			}
		};
		if(!that.app.szjcomo.empty(data.tag_name)) {
			options.where[seq.Op.or] = [
				{video_name:{[seq.Op.like]:`%${data.tag_name}%`}},
				{['$video_tag.tag_name$']:{[seq.Op.like]:`%${data.tag_name}%`}}
			];
		}
		if(data.video_price > -1) {
			if(data.video_price == 0) options.where.video_price = 0;
			if(data.video_price > 0) options.where.video_price = {[seq.Op.gt]:0};
		}
		if(data.video_status > -1) options.where.video_status = data.video_status;
		return options;
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
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',false,false));
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
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',false,false));
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
			let deleteBean = new Bean(data,{where:{video_id:data.video_id}});
			let result = await that.service.base.delete(deleteBean,that.useModel,'视频删除失败,请稍候重试');
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [examine 视频审核]
	 * @author    szjcomo
	 * @date   		2020-12-25
	 * @return {[type]}     [description]
	 */
	async examine() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.examineValidate,await that.param());
			let examineBean = new Bean(data,{where:{video_id:data.video_id},fields:['video_status']});
			let result = await that.service.base.update(examineBean,that.useModel,'视频审核失败,请稍候重试');
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result[0],false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

}