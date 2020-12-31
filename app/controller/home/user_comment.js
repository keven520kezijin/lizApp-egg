'use strict';

const Base = require('../base.js');
const Bean = require('../../bean');

/**
 * 用户对视频评论控制器
 */
class UserComment extends Base {

	/**
	 * [createValidate 视频开始评论]
	 * @author 	   szjcomo
	 * @createTime 2020-08-22
	 * @return     {[type]}   [description]
	 */
	get createValidate() {
		let that = this;
		return {
			video_id:that.ctx.rules.name('视频ID').required().number(),
			content:that.ctx.rules.name('评论内容').required().min_length(2).max_length(255),
			pid:that.ctx.rules.default(0).required().number()
		};
	}
	/**
	 * [praiseValidate 给评论点赞功能]
	 * @author 	   szjcomo
	 * @createTime 2020-08-22
	 * @return     {[type]}   [description]
	 */
	get praiseValidate() {
		let that = this;
		return {
			comment_id:that.ctx.rules.name('评论ID').required().number()
		};
	}
	/**
	 * [commentValidate 获取视频评论列表]
	 * @author 	   szjcomo
	 * @createTime 2020-08-22
	 * @return     {[type]}   [description]
	 */
	get commentValidate() {
		let that = this;
		return {
			video_id:that.ctx.rules.name('视频ID').required().number(),
			page:that.ctx.rules.default(1).number(),
			limit:that.ctx.rules.default(10).number(),
			pid:that.ctx.rules.default(0).required().number()
		};
	}

	/**
	 * [create_comment 用户评论视频]
	 * @author 	   szjcomo
	 * @createTime 2020-08-22
	 * @return     {[type]}   [description]
	 */
	async create_comment() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.createValidate,await that.post());
			data.user_id = await that.ctx.service.base.getUserId();
			let commentBean = new Bean(data);
			let curTime = that.app.szjcomo.time();
			await that.service.home.users.checkTextSec(data.content);
			commentBean.addCall(that.createCommentBeanBefore);
			let result = await that.ctx.service.base.create(commentBean,that.ctx.model.UsersComment,'评论添加失败');
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

	/**
	 * [createCommentBeanBefore 添加评论前内容检查]
	 * @author    szjcomo
	 * @date   		2020-11-20
	 * @param  {[type]}     app [description]
	 * @return {[type]}         [description]
	 */
	async createCommentBeanBefore(app) {
		let that = this;
		let arr = ['全国销量冠军','国家级产品','国家免检','国家领导人','国家级','领袖品牌','世界领先','质量免检','无需国家质量检测','免抽检','国家领导人推荐','国家机关推荐'];
		let data = that.getData();
		arr.forEach(item=> {
			data.content = data.content.replace(item,'*');
		})
		that.setData(data);
	}

	/**
	 * [comment_praise 评论点赞功能]
	 * @author 	   szjcomo
	 * @createTime 2020-08-22
	 * @return     {[type]}   [description]
	 */
	async comment_praise() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.praiseValidate,await that.get());
			let seq = that.ctx.app.Sequelize;
			let info = await that.ctx.model.UsersComment.update({praise_total:seq.literal('praise_total+1')},{
				where:{comment_id:data.comment_id}
			});
			if(info && info[0] > 0) return that.appJson(that.app.szjcomo.appResult('SUCCESS',info[0],false));
			return that.appJson(that.app.szjcomo.appResult('FAIL'));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [comment_list 获取评论列表]
	 * @author 	   szjcomo
	 * @createTime 2020-08-22
	 * @return     {[type]}   [description]
	 */
	async comment_list() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.commentValidate,await that.get());
			let seq = that.ctx.app.Sequelize;
			let options = {
				where:{video_id:data.video_id,pid:data.pid},
				include:[
					{model:that.ctx.model.Users,as:'users',attributes:[]}
				],limit:data.limit,offset:((data.page - 1) * data.limit),raw:true,
				attributes:{
					include:[
						[seq.col('users.nickname'),'nickname'],
						[seq.col('users.avatarurl'),'avatarurl'],
						[seq.col('users.user_type'),'user_type']
					],
					exclude:['video_star']
				},order:[['praise_total','desc'],['comment_id','desc']]
			};
			let commentBean = new Bean(data,options);
			let result = await that.ctx.service.base.select(commentBean,that.ctx.model.UsersComment,true,true);
			if(data.pid == 0) result.rows = await that.comment_list_handler(result.rows);
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [comment_list_handler 评论处理]
	 * @author 	   szjcomo
	 * @createTime 2020-08-22
	 * @param      {[type]}   data [description]
	 * @return     {[type]}        [description]
	 */
	async comment_list_handler(data) {
		let that = this;
		let result = [];
		let length = data.length;
		let seq = that.app.Sequelize;
		for(let i = 0;i < length;i++) {
			let item = data[i];
			let tmpdata = {count:0,rows:{}};
			let childCount = await that.ctx.model.UsersComment.count({where:{pid:item.comment_id}});
			if(childCount > 0) {
				tmpdata.count = childCount;
				let rows = await that.ctx.model.UsersComment.findOne({
					where:{pid:item.comment_id},
					include:[
						{model:that.ctx.model.Users,as:'users',attributes:[]}
					],attributes:{
						include:[
							[seq.col('users.nickname'),'nickname'],
							[seq.col('users.avatarurl'),'avatarurl'],
							[seq.col('users.user_type'),'user_type']
						],
						exclude:['video_star']
					},order:[['praise_total','desc'],['comment_id','desc']]
				});
				tmpdata.rows = rows;
				item.children = tmpdata;
			} else {
				item.children = null;
			}
			result.push(item);
		}
		return result;
	}



}

module.exports = UserComment;

