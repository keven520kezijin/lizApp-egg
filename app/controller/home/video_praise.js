'use strict';

const Base = require('../base.js');
const Bean = require('../../bean');

/**
 * 视频点赞记录表
 */
class VideoPraise extends Base {


	/**
	 * [praiseValidate 用户给视频点赞或取消赞]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	get praiseValidate() {
		let that = this;
		return {
			user_id:that.ctx.rules.name('user_id').required().number(),
			video_id:that.ctx.rules.name('video_id').required().number()
		};
	}

	/**
	 * [user_video_praise 用户给视频点赞]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	async user_video_praise() {
		let that = this;
		let transaction;
		try {
			let data = await that.ctx.validate(that.praiseValidate,await that.get());
			transaction = await that.ctx.model.transaction();
			let options = {where:{video_id:data.video_id},fields:['video_praise'],transaction:transaction};
			let videoBean = new Bean(data,options);
			videoBean.addCall(that._user_video_praise_before_find,'before');
			videoBean.addCall(that._user_video_praise_after_find,'after');
			let result = await that.ctx.service.base.update(videoBean,that.ctx.model.Video,'用户点赞更新失败');
			await transaction.commit();
			return that.appJson(that.app.szjcomo.appResult('视频点赞更新成功',result[0],false));
		} catch(err) {
			if(transaction) await transaction.rollback();
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [_user_video_praise_before_find 用户给视频点赞前查询出视频当前赞的数量并判断是增加还是减少]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @param      {[type]}   ctx [description]
	 * @return     {[type]}       [description]
	 */
	async _user_video_praise_before_find(ctx) {
		let that = this;
		let data = that.getData();
		let result = await ctx.model.Video.findOne({where:{video_id:data.video_id},attributes:['video_praise']});
		if(!result) throw new Error('作品信息不在,请勿非法操作');
		let is_find = await ctx.model.UsersPraise.findOne({where:{user_id:data.user_id},attributes:['videos']});
		if(!is_find) {
			data.insert_user_praise = true;
			data.video_praise = 1;
			data.videos = data.video_id;
		} else {
			data.update_user_praise = true;
			let arr = is_find.videos.split(',');
			if(arr.includes(`${data.video_id}`)) {
				data.videos = ctx.app.szjcomo.arrayRemove(arr,`${data.video_id}`).join(',');
				data.video_praise = result.video_praise - 1;
			} else {
				data.video_praise = result.video_praise + 1;
				if(arr.length == 0) {
					data.videos = data.video_id;
				} else {
					arr.push(data.video_id);
					data.videos = arr.join(',');
				}
			}
		}
	}
	/**
	 * [_user_video_praise_after_find 视频点赞数更新完成后续操作]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @param      {[type]}   ctx    [description]
	 * @param      {[type]}   result [description]
	 * @return     {[type]}          [description]
	 */
	async _user_video_praise_after_find(ctx,result) {
		let that = this;
		let data = that.getData();
		let options = that.getOptions();
		let tmpOptions = {};
		if(options.transaction) tmpOptions.transaction = options.transaction;
		if(data.insert_user_praise) {
			let res = await ctx.model.UsersPraise.create({user_id:data.user_id,videos:data.videos},tmpOptions);
			if(!res) throw new Error('用户点赞记录失败,请稍候重试');
		} else {
			tmpOptions.where = {user_id:data.user_id};
			tmpOptions.fields = ['videos'];
			await ctx.model.UsersPraise.update({videos:data.videos},tmpOptions);
		}
	}
}


module.exports = VideoPraise;