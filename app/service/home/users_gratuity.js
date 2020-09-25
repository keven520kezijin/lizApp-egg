'use strict';

const BaseService = require('../base');
const Bean 		  = require('../../bean');

/**
 * 用户下单购买记录
 */
class UsersGratuityService extends BaseService {
	/**
	 * [buy_video_log 用户购买视频记录]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @param      {Object}   data [description]
	 * @return     {[type]}        [description]
	 */
	async gratuity_log(data = {}) {
		let that = this;
		let transaction;
		try {
			transaction = await that.ctx.model.transaction();
			let gratuityBean = new Bean(data,{transaction:transaction});
			gratuityBean.addCall(that._gratuity_log_before,'before');
			gratuityBean.addCall(that._gratuity_log_after_add_user_money,'after');
			let result = await that.ctx.service.base.create(gratuityBean,that.ctx.model.UsersGratuity,'打赏记录添加失败,请稍候重试');
			await transaction.commit();
		} catch(err) {
			if(transaction) await transaction.rollback();
			that.ctx.logger.error(`${err.message},用户打赏记录失败,${that.ctx.app.szjcomo.json_encode(data)}`);
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
		let data = that.getData();
		let tmpdata = {
			wxpay_id:data.wxpay_id,
			message:data.message,
			touser_id:data.touser_id,
			gratuity_money:(data.total_fee / 100),
			user_id:data.user_id
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

}

module.exports = UsersGratuityService;
