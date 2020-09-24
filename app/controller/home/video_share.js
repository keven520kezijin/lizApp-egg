'use strict';

const Base = require('../base.js');
const Bean = require('../../bean');

/**
 * 视频分享记录
 */
class VideoShare extends Base {

	/**
	 * [shareValidate 用户分享视频记录]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	get shareValidate() {
		let that = this;
		return {
			video_id:that.ctx.rules.name('video_id').required().number()
		};
	}


	/**
	 * [user_video_share 用户分享视频]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	async user_video_share() {
		let that = this;
		let transaction;
		try {
			let data = await that.ctx.validate(that.shareValidate,await that.get());
			data.user_id = await that.ctx.service.base.getUserId();
			transaction = await that.ctx.model.transaction();
			let options = {where:{video_id:data.video_id},fields:['video_share'],transaction:transaction};
			let videoBean = new Bean(data,options);
			videoBean.addCall(that._user_video_share_before,'before');
			videoBean.addCall(that._user_video_share_after,'after');
			let result = await that.ctx.service.base.update(videoBean,that.ctx.model.Video,'视频分享记录更新失败,请稍候重试');
			await transaction.commit();
			return that.appJson(that.app.szjcomo.appResult('视频分享记录成功',result[0],false));
		} catch(err) {
			if(transaction) await transaction.rollback();
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [_user_video_share_before_find 用户分享视频操作]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @param      {[type]}   ctx [description]
	 * @return     {[type]}       [description]
	 */
	async _user_video_share_before(ctx) {
		let that = this;
		let data = that.getData();
		let result = await ctx.model.Video.findOne({where:{video_id:data.video_id},attributes:['video_share']});
		if(!result) throw new Error('作品信息不存在,请勿非法操作');
		let is_find = await ctx.model.UsersShare.findOne({where:{user_id:data.user_id},attributes:['videos']});
		if(!is_find) {
			data.videos = data.video_id;
			data.insert_user_share = true;
			data.video_share = 1;
		} else {
			data.update_user_share = true;
			let arr = is_find.videos.split(',');
			if(!ctx.app.szjcomo.inArray(arr,`${data.video_id}`)) {
				app.push(data.video_id);
				data.videos = arr.join(',');
			}
			data.video_share = (result.video_share + 1);
		}
	}
	/**
	 * [_user_video_share_after 用户分享视频后续操作]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @param      {[type]}   ctx    [description]
	 * @param      {[type]}   result [description]
	 * @return     {[type]}          [description]
	 */
	async _user_video_share_after(ctx,result) {
		let that = this;
		let data = that.getData();
		let options = that.getOptions();
		let tmpOptions = {};
		if(options.transaction) tmpOptions.transaction = options.transaction;
		if(data.insert_user_share) {
			let res = await ctx.model.UsersShare.create({user_id:data.user_id,videos:data.videos},tmpOptions);
			if(!res) throw new Error('视频分享记录失败,请稍候重试');
		} else {
			if(data.videos) {
				tmpOptions.where = {user_id:data.user_id};
				tmpOptions.fields = ['videos'];
				await ctx.model.UsersShare.update({videos:data.videos},tmpOptions);
			}
		}
	}
}

module.exports = VideoShare;