'use strict';

const BaseService = require('../base');


/**
 * 用户服务
 */
class UsersService extends BaseService {

	/**
	 * [userInfo 获取用户详情]
	 * @author 	   szjcomo
	 * @createTime 2020-09-26
	 * @param      {[type]}   user_id [description]
	 * @return     {[type]}           [description]
	 */
	async userInfo(user_id) {
		let that = this;
		let seq = that.ctx.app.Sequelize;
		let result = await that.ctx.model.Users.findOne({
			where:{user_id:user_id},
			include:[
				{model:that.ctx.model.UsersMoney,as:'users_money',attributes:[]},
				{model:that.ctx.model.RealName,as:'real',attributes:[]},
				{model:that.ctx.model.UsersPhotos,as:'photos',attributes:[['image_url','url'],'photo_id']}
			],
			attributes:{
				include:[
					[seq.col('users_money.money'),'money'],
					[seq.col('real.username'),'username'],
					[seq.col('real.head_image'),'head_image'],
					[seq.col('real.company_name'),'company_name'],
					[seq.col('real.exp_value'),'exp_value'],
					[seq.col('real.user_desc'),'user_desc'],
					[seq.col('real.is_real'),'is_real'],
					[seq.col('real.user_position'),'user_position'],
					[seq.col('real.user_phone'),'user_phone'],
					[seq.col('real.user_tel'),'user_tel'],
					[seq.col('real.user_fax'),'user_fax'],
					[seq.col('real.user_email'),'user_email'],
					[seq.col('real.user_web'),'user_web'],
					[seq.col('real.user_address'),'user_address'],
					[seq.col('real.user_postcode'),'user_postcode'],
					[seq.col('real.user_product'),'user_product'],
					[seq.col('real.user_other'),'user_other'],
				],
				exclude:['openid','active_time']
			}
		});
		result.setDataValue('follow_count',await that.getUserFollowCount(user_id));
		result.setDataValue('fans_count',await that.getUserFansCount(user_id));
		return result;
	}
	/**
	 * [getUserFollowCount 获取用户关注的人数]
	 * @author    szjcomo
	 * @date   		2020-12-30
	 * @param  {[type]}     user_id [description]
	 * @return {[type]}             [description]
	 */
	async getUserFollowCount(user_id) {
		let that = this;
		let count = await that.app.model.Follow.count({where:{user_id:user_id}});
		return count;
	}
	/**
	 * [getUserFansCount 获取用户的粉丝人数]
	 * @author    szjcomo
	 * @date   		2020-12-30
	 * @param  {[type]}     author_id [description]
	 * @return {[type]}               [description]
	 */
	async getUserFansCount(author_id) {
		let that = this;
		let count = await that.app.model.Follow.count({where:{author_id:author_id}});
		return count;
	}


	/**
	 * [checkTextSec 检查内容是否安全]
	 * @author    szjcomo
	 * @date   		2020-11-20
	 * @param  {[type]}     str [description]
	 * @return {[type]}         [description]
	 */
	async checkTextSec(str) {
		let that = this;
		if(that.app.szjcomo.empty(str)) return false;
		let access_token = await that.service.base.getWebAppAccessToken();
		if(!access_token) return false;
		let url = `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${access_token}`;
		let result = await that.app.curl(url,{
			method:'POST',data:{content:str},dataType:'json',contentType:'json'
		});
		if(result && result.data.errcode > 0) throw new Error('内容含有违法违规内容,无法验证通过');
		return result;
	}
	/**
	 * [rechargeOrder 用户充值后回调函数]
	 * @author    szjcomo
	 * @date   		2020-12-11
	 * @param  {[type]}     money   [description]
	 * @param  {[type]}     user_id [description]
	 * @return {[type]}             [description]
	 */
	async rechargeOrder(money,user_id) {
		let that = this;
		let transaction;
		try {
			transaction = await that.app.model.transaction();
			await that.service.home.usersMoney.user_money(money,user_id,transaction);
			await that.service.home.usersMoney.user_money_log(money,user_id,'账户充值',transaction);
			await transaction.commit();
		} catch(err) {
			if(transaction) await transaction.rollback();
			throw err;
		}
	}
}


module.exports = UsersService;