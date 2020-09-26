'use strict';
const Base 		= require('../base');
const Bean 	= require('../../bean');
/**
 * 用户类
 */
class Users extends Base {
	/**
	 * [loginValidate 登录验证]
	 * @author 	   szjcomo
	 * @createTime 2020-08-12
	 * @return     {[type]}   [description]
	 */
	get loginValidate() {
		let that = this;
		return {
			code:that.ctx.rules.name('code').required()
		};
	}
	/**
	 * [seachValidate 用户搜索标签列表]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	get seachValidate() {
		let that = this;
		return {
			page:that.ctx.rules.default(1).number(),
			limit:that.ctx.rules.default(10).number()
		};
	}
	/**
	 * [searchVideoValidate 用户搜索视频]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	get searchVideoValidate() {
		let that = this;
		return {
			page:that.ctx.rules.default(1).number(),
			limit:that.ctx.rules.default(30).number(),
			tag_name:that.ctx.rules.name('关键字').required()
		};
	}
	/**
	 * [registerValidate 注册ID]
	 * @author 	   szjcomo
	 * @createTime 2020-08-12
	 * @return     {[type]}   [description]
	 */
	get registerValidate() {
		let that = this;
		return {
			openid:that.ctx.rules.name('微信ID').required(),
			nickname:that.ctx.rules.name('微信昵称').required(),
			user_status:that.ctx.rules.default(1).required(),
			avatarurl:that.ctx.rules.name('微信头像').required(),
			gender:that.ctx.rules.name('性别').required(),
			city:that.ctx.rules.name('所在城市').required(),
			province:that.ctx.rules.name('所在省份').required(),
			country:that.ctx.rules.name('所在国家').required(),
			create_time:that.ctx.rules.default(that.app.szjcomo.date('Y-m-d H:i:s')).required()
		};
	}
	/**
	 * [moneyLogValidate 获取用户资金明细列表]
	 * @author 	   szjcomo
	 * @createTime 2020-09-26
	 * @return     {[type]}   [description]
	 */
	get moneyLogValidate() {
		let that = this;
		return {
			limit:that.ctx.rules.default(30).number(),
			page:that.ctx.rules.default(1).number()
		};
	}
	/**
	 * [gratuityLogValidate 获取打赏记录]
	 * @author 	   szjcomo
	 * @createTime 2020-09-26
	 * @return     {[type]}   [description]
	 */
	get gratuityLogValidate() {
		let that = this;
		return {
			limit:that.ctx.rules.default(10).number(),
			page:that.ctx.rules.default(1).number(),
		};
	}


	/**
	 * [login 用户登录]
	 * @author 	   szjcomo
	 * @createTime 2020-08-12
	 * @return     {[type]}   [description]
	 */
	async login() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.loginValidate,await that.get());
			let result = await that.login_wechat(data.code);
			let user = await that.ctx.model.Users.findOne({where:{openid:result.openid},raw:true});
			if(!user) return that.appJson(that.app.szjcomo.appResult('User not registered',result,false,20001));
			let token = that.app.szjcomo.aes_encode(that.app.szjcomo.json_encode({user_id:user.user_id,openid:user.openid}));
			return that.appJson(that.app.szjcomo.appResult('login SUCCESS',{token:token,user:user},false));
		} catch(err) {
			console.log(err);
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [login_wechat 凭借code换取微信用户信息]
	 * @author 	   szjcomo
	 * @createTime 2020-08-12
	 * @param      {[type]}   code [description]
	 * @return     {[type]}        [description]
	 */
	async login_wechat(code) {
		let that = this;
		let appid = that.app.config.webapp.appid;
		let secret = that.app.config.webapp.secret;
		let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
		let result = await that.ctx.curl(url,{dataType:'json',timeout:5000});
		if(result.data && result.data.openid) {
			return result.data;
		} else if(result.data && result.data.errcode != 0) {
			throw new Error(result.data.errmsg);
		} else {
			throw new Error('微信服务器返回错误,请联系管理员处理');
		}
	}

	/**
	 * [register 用户注册]
	 * @author 	   szjcomo
	 * @createTime 2020-08-12
	 * @return     {[type]}   [description]
	 */
	async register() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.registerValidate,await that.post());
			let user = await that.ctx.model.Users.findOne({where:{openid:data.openid},raw:true});
			if(!user) {
				let bean = new Bean(data);
				user = await that.ctx.service.base.create(bean,that.ctx.model.Users,'用户注册失败,请稍候重试');
			}
			let token = that.app.szjcomo.aes_encode(that.app.szjcomo.json_encode({user_id:user.user_id,openid:user.openid}));
			return that.appJson(that.app.szjcomo.appResult('用户注册成功',{token:token,user:user},false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [userinfo 获取用户详情]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	async select() {
		let that = this;
		try {
			let user_id = await that.get('user_id',0,Number);
			if(!user_id) user_id = await that.ctx.service.base.getUserId();
			let result = await that.ctx.service.home.users.userInfo(user_id);
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [active_user 更新用户活跃时间]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	async active_user() {
		let that = this;
		try {
			let user_id = await that.ctx.service.base.getUserId();
			let bean = new Bean({active_time:that.app.szjcomo.date('Y-m-d H:i:s')},{where:{user_id:user_id}});
			let result = await that.ctx.service.base.update(bean,that.ctx.model.Users,'用户活跃时间更新失败');
			return that.appJson(that.app.szjcomo.appResult('user active time update success',result[0],false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [user_seach 获取用户搜索标签]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	async user_seach() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.seachValidate,await that.get());
			let user_id = await that.ctx.service.base.getUserId();
			let bean = new Bean(data,{
				where:{user_id:user_id},
				limit:data.limit,
				offset:(data.page - 1) * data.limit,
				order:[['seach_total','desc']],attributes:{exclude:['update_time','user_id']}
			});
			let result = await that.ctx.service.base.select(bean,that.ctx.model.UsersSeach,true);
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [user_seach_video 用户搜索视频]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	async user_seach_video() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.searchVideoValidate,await that.post());
			data.user_id = await that.ctx.service.base.getUserId();
			let seq = that.ctx.app.Sequelize;
			let options = {
				where:{[seq.Op.or]:[
					{video_name:{[seq.Op.like]:`%${data.tag_name}%`}},
					{['$video_tag.tag_name$']:{[seq.Op.like]:`%${data.tag_name}%`}}
				],video_status:1},
				limit:data.limit,offset:(data.page -1) * data.limit,
				include:[
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
			let videoBean = new Bean(data,options);
			videoBean.addCall(that._user_seach_video_before,'before');
			let result = await that.ctx.service.base.select(videoBean,that.ctx.model.Video,true,true);
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [_user_seach_video_before 视频搜索前置操作] 2006550 778050 = 2784600
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	async _user_seach_video_before(ctx) {
		let that = this;
		let data = that.getData();
		let is_find = await ctx.model.UsersSeach.findOne({where:{user_id:data.user_id,tag_name:data.tag_name},attributes:['seach_total','seach_id']});
		if(is_find){
			await ctx.model.UsersSeach.update({seach_total:(is_find.seach_total + 1)},{where:{seach_id:is_find.seach_id},fields:['seach_total']});
		} else {
			await ctx.model.UsersSeach.create({user_id:data.user_id,seach_total:1,tag_name:data.tag_name});
		}
	}
	/**
	 * [user_money_log_list 获取用户资金明细列表]
	 * @author 	   szjcomo
	 * @createTime 2020-09-26
	 * @return     {[type]}   [description]
	 */
	async user_money_log_list() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.moneyLogValidate,await that.get());
			let user_id = await that.ctx.service.base.getUserId();
			let moneyBean = new Bean(data,{
				where:{user_id:user_id},
				offset:(data.page - 1) * data.limit,
				limit:data.limit,order:[['log_id','desc']],attributes:{exclude:['user_id']}
			});
			let result = await that.ctx.service.base.select(moneyBean,that.ctx.model.UsersMoneyLogs,true,true);
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [user_gratuity_list 获取用户打赏记录]
	 * @author 	   szjcomo
	 * @createTime 2020-09-26
	 * @return     {[type]}   [description]
	 */
	async user_gratuity_list() {
		let that = this;
		try {
			let data 	= await that.ctx.validate(that.gratuityLogValidate,await that.get());
			let user_id = await that.ctx.service.base.getUserId();
			let seq = that.app.Sequelize;
			let gratuityBean = new Bean(data,{
				where:{touser_id:user_id},include:[
					{model:that.ctx.model.Users,as:'users',attributes:[]}
				],order:[['gratuity_id','desc']],
				attributes:{
					include:[
						[seq.col('users.nickname'),'nickname'],
						[seq.col('users.avatarurl'),'avatarurl'],
						[seq.col('users.user_type'),'user_type'],
					],exclude:['touser_id','wxpay_id']
				},offset:(data.page - 1) * data.limit,limit:data.limit
			})
			let result = await that.ctx.service.base.select(gratuityBean,that.ctx.model.UsersGratuity,true,true);
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
}


module.exports = Users;