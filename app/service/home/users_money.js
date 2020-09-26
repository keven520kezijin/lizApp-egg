'use strict';

const BaseService 	= require('../base');

/**
 * 用户金额记录表
 */
class UsersMoneyService extends BaseService {

	/**
	 * [user_money 操作用户资金]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @param      {[type]}   money [description]
	 * @return     {[type]}         [description]
	 */
	async user_money(money,user_id,transaction = null) {
		let that = this;
		let options = {where:{user_id:user_id},attributes:['money']};
		if(transaction) options.transaction = transaction;
		let userMoney = await that.ctx.model.UsersMoney.findOne(options);
		let action = false;
		let tmpOptions = {};
		if(transaction) tmpOptions.transaction = transaction;
		if(!userMoney) {
			action = await that.ctx.model.UsersMoney.create({money:money,user_id:user_id},tmpOptions);
		} else {
			tmpOptions.where = {user_id:user_id};
			tmpOptions.fields = ['money'];
			let result = await that.ctx.model.UsersMoney.update({money:(userMoney.money + money)},tmpOptions);
			action = result[0];
		}
		if(!action) throw new Error('用户资金更新失败,请联系客服处理');
	}
	/**
	 * [user_money_log 用户资金变动记录]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @param      {[type]}   user_id     [description]
	 * @param      {[type]}   money       [description]
	 * @param      {String}   desc        [description]
	 * @param      {[type]}   transaction [description]
	 * @return     {[type]}               [description]
	 */
	async user_money_log(money,user_id,desc = '',transaction = null) {
		let that = this;
		let tmpdata = {user_id:user_id,money:money,money_desc:desc};
		let options = {};
		if(transaction) options.transaction = transaction;
		let result = await that.ctx.model.UsersMoneyLogs.create(tmpdata,options);
		if(!result) throw new Error('资金记录日志写入失败');
	}

}



module.exports = UsersMoneyService;
