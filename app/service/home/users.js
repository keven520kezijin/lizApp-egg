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
				{model:that.ctx.model.RealName,as:'real',attributes:[]}
			],
			attributes:{
				include:[
					[seq.col('users_money.money'),'money'],
					[seq.col('real.username'),'username'],
					[seq.col('real.head_image'),'head_image'],
					[seq.col('real.company_name'),'company_name'],
					[seq.col('real.user_desc'),'user_desc'],
					[seq.col('real.is_real'),'is_real'],
				],
				exclude:['openid','active_time']
			}
		});
		return result;
	}
}


module.exports = UsersService;