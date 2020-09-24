'use strict';

const Base = require('../base');
const Bean = require('../../bean');
const path = require('path');

/**
 * 视频处理接口类
 */
class Video extends Base {


	/**
	 * [publishValidate 发布视频验证器]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @return     {[type]}   [description]
	 */
	get publishValidate() {
		let that = this;
		return {
			video_name:that.ctx.rules.name('作品标题').required(),
			video_hash:that.ctx.rules.name('作品hash').required().extend(async (field,value) => {
				let res = await that.ctx.model.Video.findOne({where:{video_hash:value}});
				if(res) return '作品已经存在,请不要重复发表作品';
			}),
			video_image:that.ctx.rules.name('作品封面图').required(),
			video_duration:that.ctx.rules.name('作品时长').required(),
			video_tags:that.ctx.rules.name('作品分类').required(),
			video_url:that.ctx.rules.name('作品地址').required(),
			video_alias:that.ctx.rules.default('').required(),
			video_desc:that.ctx.rules.default('').required(),
			video_price:that.ctx.rules.default(0).required().number(),
			video_status:that.ctx.rules.default(1).required(),
			create_time:that.ctx.rules.default(that.app.szjcomo.date('Y-m-d H:i:s')).required()
		};
	}
	/**
	 * [listValidate 获取视频列表]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @return     {[type]}   [description]
	 */
	get listValidate() {
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
	 * [pkValidate 删除作品]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @return     {[type]}   [description]
	 */
	get pkValidate() {
		let that = this;
		return {
			video_id:that.ctx.rules.name('作品id').required().number()
		};
	}


	/**
	 * [publish_video 用户发布视频]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @return     {[type]}   [description]
	 */
	async publish_video() {
		let that = this;
		let transaction;
		try {
			let data = await that.ctx.validate(that.publishValidate,await that.post());
			data.user_id = await that.ctx.service.base.getUserId();
			transaction = await that.ctx.model.transaction();
			let videoBean = new Bean(data,{transaction:transaction});
			videoBean.addCall(that._publish_video_after,'after');
			let result = await that.ctx.service.base.create(videoBean,that.ctx.model.Video,'作品发布失败,请稍候重试');
			await transaction.commit();
			return that.appJson(that.app.szjcomo.appResult('作品发布成功',result,false));
		} catch(err) {
			if(transaction) await transaction.rollback();
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [_publish_video_after 发布视频后置操作]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @param      {[type]}   ctx    [description]
	 * @param      {[type]}   result [description]
	 * @return     {[type]}          [description]
	 */
	async _publish_video_after(ctx,result) {
		let that = this;
		let data = that.getData();
		if(!ctx.app.szjcomo.empty(data.video_tags)) {
			let res = await ctx.model.VideoTag.findOne({where:{video_id:result.video_id},attributes:['vt_id'],raw:true});
			if(res) {
				await ctx.model.VideoTag.update({tag_name:data.video_tags},Object.assign({where:{vt_id:res.vt_id}},that.getOptions()));
			} else {
				await ctx.model.VideoTag.create({video_id:result.video_id,tag_name:data.video_tags},that.getOptions());
			}
		}
	}

	/**
	 * [select 获取视频列表]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @return     {[type]}   [description]
	 */
	async select() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.listValidate,await that.get());
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
		let seq = that.ctx.app.Sequelize;
		let user_id = await that.ctx.service.base.getUserId();
		let options = {
			where:{video_id:video_id},include:[
				{model:that.ctx.model.Users,as:'users',attributes:[]},
				{model:that.ctx.model.VideoTag,as:'video_tag',attributes:[]}
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
		let result = await that.ctx.service.base.select(videoBean,that.ctx.model.Video);
		if(result.video_price == 0) {
			result.video_play = true;
		} else if(user_id == result.user_id) {
			result.video_play = true;
		} else {
			let is_buy = await that.ctx.model.UsersOrder.findOne({where:{video_id:video_id,user_id:user_id,is_pay:1},attributes:['order_id']});
			result.video_play = is_buy?true:false;
		}
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
		let result = await that.ctx.service.base.select(videoBean,that.ctx.model.Video,true,true);
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
		if(data.user_id > 0) options.where.user_id = data.user_id;
		return options;
	}

	/**
	 * [update 视频资源更新操作]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @return     {[type]}   [description]
	 */
	async update() {

	}
	/**
	 * [delete 删除视频资源]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @return     {[type]}   [description]
	 */
	async delete() {
		let that = this;
		let transaction;
		try {
			let data = await that.ctx.validate(that.pkValidate,await that.param());
			let user_id = await that.ctx.service.base.getUserId();
			transaction = await that.ctx.model.transaction();
			let videoBean = new Bean(data,{where:{video_id:data.video_id,user_id:user_id},transaction:transaction});
			videoBean.addCall(that._delete_after,'after');
			videoBean.addCall(that._delete_before,'before');
			let result = await that.ctx.service.base.delete(videoBean,that.ctx.model.Video,'作品删除失败,请稍候重试');
			await transaction.commit();
			return that.appJson(that.app.szjcomo.appResult('作品删除成功',result,false));
		} catch(err) {
			if(transaction) await transaction.rollback();
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [_delete_after 删除作品后置操作]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @param      {[type]}   ctx    [description]
	 * @param      {[type]}   result [description]
	 * @return     {[type]}          [description]
	 */
	async _delete_after(ctx,result) {
		let that = this;
		let data = that.getData();
		let options = that.getOptions();
		if(result) {
			let videoTagBean = new Bean({},{where:{video_id:options.where.video_id}});
			await ctx.service.base.delete(videoTagBean,ctx.model.VideoTag,'作品标签删除失败');
			if(data.video_url) {
				await ctx.service.qiniu.remove_file(data.video_url.replace(ctx.app.config.qiniu.name_domain + '/',''));
				await ctx.service.qiniu.remove_file(data.video_image.replace(ctx.app.config.qiniu.name_domain + '/',''));
			}
		}
	}
	/**
	 * [_delete_before 删除前置操作]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @param      {[type]}   ctx [description]
	 * @return     {[type]}       [description]
	 */
	async _delete_before(ctx) {
		let that = this;
		let data = that.getData();
		let result = await ctx.model.Video.findOne({where:{video_id:data.video_id},attributes:['video_url','video_hash','video_image'],raw:true});
		if(result) that.setData({video_id:data.video_id,video_url:result.video_url,video_image:result.video_image});
	}

	/**
	 * [upload_video 上传视频资源]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @return     {[type]}   [description]
	 */
	async upload_video() {
		let that = this;
		try {
			let tmp_save_path = path.join(that.app.baseDir,'app','public','uploads/');
			let upRes = await that.ctx.service.base.uploadOne(tmp_save_path);
			let filename = `${that.app.config.qiniu.name_prefix}/${upRes.file_sha1}${upRes.ext}`;
			let is_existis = await that.ctx.model.Video.findOne({where:{video_hash:upRes.file_sha1},attributes:['video_id']});
			if(is_existis) throw new Error('视频已经发布,请勿重复发布');
			let is_find = await that.ctx.service.qiniu.exists_file(filename);
			let thumb_image_filename = `${that.app.config.qiniu.name_prefix}-voide-image/${upRes.file_sha1}.jpg`;
			let video_info = await that.app.ffmpeg.input(`${upRes.save_path}${upRes.save_name}`).info();
			let thumb_image = await that.app.ffmpeg.input(`${upRes.save_path}${upRes.save_name}`).thumb(`${tmp_save_path}${thumb_image_filename}`);
			if(is_find === false) {
				await that.ctx.service.qiniu.upload_file(filename,{path:`${upRes.save_path}${upRes.save_name}`});
				await that.ctx.service.qiniu.upload_file(thumb_image_filename,{path:`${upRes.save_path}${thumb_image_filename}`});
			}
			setTimeout(async function(image_path,file_path) {
				await that.app.szjcomo.deleteFile(image_path);
				await that.app.szjcomo.deleteFile(file_path);
			},3 *60 * 1000,`${tmp_save_path}${thumb_image_filename}`,`${upRes.save_path}${upRes.save_name}`);
			let result = {
				file_size:upRes.file_size,
				file_sha1:upRes.file_sha1,
				video_duration:video_info.format.duration,
				thumb_image:`${that.app.config.qiniu.name_domain}/${thumb_image_filename}`,
				file_url:`${that.app.config.qiniu.name_domain}/${filename}`
			};
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			console.log(err);
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [upload_image 上传视频封面图片]
	 * @author 	   szjcomo
	 * @createTime 2020-09-14
	 * @return     {[type]}   [description]
	 */
	async upload_image() {
		let that = this;
		try {
			let tmp_save_path = path.join(that.app.baseDir,'app','public','uploads/');
			let upRes = await that.ctx.service.base.uploadOne(tmp_save_path);
			let thumb_image_filename = `${that.app.config.qiniu.name_prefix}-voide-image/${upRes.file_sha1}${upRes.ext}`;
			let is_find = await that.ctx.service.qiniu.exists_file(thumb_image_filename);
			if(is_find === false) {
				await that.ctx.service.qiniu.upload_file(thumb_image_filename,{path:`${upRes.save_path}${upRes.save_name}`});
			}
			setTimeout(async function(image_path) {
				await that.app.szjcomo.deleteFile(image_path);
			},3 *60 * 1000,`${tmp_save_path}${upRes.save_name}`);
			let result = {
				file_size:upRes.file_size,
				file_sha1:upRes.file_sha1,
				thumb_image:`${that.app.config.qiniu.name_domain}/${thumb_image_filename}`,
			};
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}


}
module.exports = Video;
