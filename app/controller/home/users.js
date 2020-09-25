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
	 * [gratuityLogValidate 记录用户打赏验证器]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @return     {[type]}   [description]
	 */
	get gratuityLogValidate() {
		let that = this;
		return {
			wxpay_id:that.ctx.rules.name('支付ID').required().number(),
			touser_id:that.ctx.rules.name('打赏的用户ID').required().number(),
			message:that.ctx.rules.default('一点小意思').required().max_length(250).min_length(1)
		};
	}
	/**
	 * [buyVideoLogValidate 用户购买视频验证器]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @return     {[type]}   [description]
	 */
	get buyVideoLogValidate() {
		let that = this;
		return {
			wxpay_id:that.ctx.rules.name('支付ID').required().number(),
			video_id:that.ctx.rules.name('视频ID').required().number(),
			create_time:that.ctx.rules.default(that.app.szjcomo.date('Y-m-d H:i:s')).required()
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
			let user_id = await that.ctx.service.base.getUserId();
			let bean = new Bean({},{where:{user_id:user_id}});
			let result = await that.ctx.service.base.select(bean,that.ctx.model.Users);
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
	 * [gratuity_log 写入用户打赏记录]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @return     {[type]}   [description]
	 */
	async gratuity_log() {
		let that = this;
		let transaction;
		try {
			let data = await that.ctx.validate(that.gratuityLogValidate,await that.post());
			transaction = await that.ctx.model.transaction();
			let gratuityBean = new Bean(data,{transaction:transaction});
			gratuityBean.addCall(that._gratuity_log_before,'before');
			gratuityBean.addCall(that._gratuity_log_after_add_user_money,'after');
			let result = await that.ctx.service.base.create(gratuityBean,that.ctx.model.UsersGratuity,'打赏记录添加失败,请稍候重试');
			await transaction.commit();
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			if(transaction) await transaction.rollback();
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [_gratuity_log_before 写入打赏记录前完善数据]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @param      {[type]}   ctx [description]
	 * @return     {[type]}       [description]
	 */
	async _gratuity_log_before(ctx) {
		let that = this;
		let user_id = await ctx.service.base.getUserId();
		let data = that.getData();
		let wxpayInfo = await ctx.model.Wxpay.findOne({where:{wxpay_id:data.wxpay_id,user_id:user_id},attributes:['total_fee']});
		if(!wxpayInfo) throw new Error('非法请求参数,wxpay_id错误');
		let tmpdata = {
			wxpay_id:data.wxpay_id,
			message:data.message,
			touser_id:data.touser_id,
			gratuity_money:(wxpayInfo.total_fee / 100),
			user_id:user_id
		};
		that.setData(tmpdata);
	}
	/**
	 * [_gratuity_log_after 打赏记录完成后应该给用户增加资金]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @param      {[type]}   ctx    [description]
	 * @param      {[type]}   result [description]
	 * @return     {[type]}          [description]
	 */
	async _gratuity_log_after_add_user_money(ctx,result) {
		let that = this;
		let touser_id = result.touser_id;
		let gratuity_money = await ctx.service.base.GratuityCommission(result.gratuity_money);
		let options = that.getOptions();
		await ctx.service.home.usersMoney.user_money(gratuity_money,touser_id,options.transaction);
		await ctx.service.home.usersMoney.user_money_log(gratuity_money,touser_id,'打赏收入',options.transaction);
	}
	/**
	 * [buy_video_log 写入用户购买记录]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @return     {[type]}   [description]
	 */
	async buy_video_log() {
		let that = this;
		let transaction;
		try {
			let data = await that.ctx.validate(that.buyVideoLogValidate,await that.post());
			transaction = await that.ctx.model.transaction();
			let buyVideoBean = new Bean(data,{transaction:transaction});
			buyVideoBean.addCall(that._buy_video_log_before,'before');
			buyVideoBean.addCall(that._buy_video_log_after_add_user_money,'after');
			let result = await that.ctx.service.base.create(buyVideoBean,that.ctx.model.UsersOrder,'作品购买记录添加失败,请稍候重试');
			await transaction.commit();
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			if(transaction) await transaction.rollback();
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [buy_video_log_before 视频购买记录前置操作 完善订单信息]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @param      {[type]}   ctx [description]
	 * @return     {[type]}       [description]
	 */
	async _buy_video_log_before(ctx) {
		let that = this;
		let user_id = await ctx.service.base.getUserId();
		let data = that.getData();
		let wxpayInfo = await ctx.model.Wxpay.findOne({where:{wxpay_id:data.wxpay_id,user_id:user_id},attributes:['total_fee']});
		if(!wxpayInfo) throw new Error('非法请求参数,wxpay_id错误');
		let tmpdata = {
			wxpay_id:data.wxpay_id,video_id:data.video_id,user_id:user_id,is_pay:1,pay_money:(wxpayInfo.total_fee / 100),
			create_time:data.create_time
		};
		that.setData(tmpdata);
	}
	/**
	 * [buy_video_log_after_add_user_money 用户购买记录后需要给另外一个用户增加金额]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @param      {[type]}   ctx    [description]
	 * @param      {[type]}   result [description]
	 * @return     {[type]}          [description]
	 */
	async _buy_video_log_after_add_user_money(ctx,result) {
		let that = this;
		let user_id = await ctx.service.base.getUserId();
		let money = await ctx.service.base.VideoCommission(result.pay_money);
		let videoUser = await ctx.model.Video.findOne({where:{video_id:result.video_id},attributes:['user_id']});
		let options = that.getOptions();
		if(videoUser) {
			await ctx.service.home.usersMoney.user_money(money,videoUser.user_id,options.transaction);
			await ctx.service.home.usersMoney.user_money_log(money,videoUser.user_id,'作品收入',options.transaction);
		}
	}
}


module.exports = Users;