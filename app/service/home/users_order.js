'use strict';

const BaseService = require('../base');
const Bean 		  = require('../../bean');

/**
 * 用户下单购买记录
 */
class UsersOrderService extends BaseService {
	/**
	 * [buy_video_log 用户购买视频记录]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @param      {Object}   data [description]
	 * @return     {[type]}        [description]
	 */
	async buy_video_log(data = {}) {
		let that = this;
		let transaction;
		try {
			transaction = await that.ctx.model.transaction();
			let buyVideoBean = new Bean(data,{transaction:transaction});
			buyVideoBean.addCall(that._buy_video_log_before,'before');
			buyVideoBean.addCall(that._buy_video_log_after_add_user_money,'after');
			let result = await that.ctx.service.base.create(buyVideoBean,that.ctx.model.UsersOrder,'作品购买记录添加失败,请稍候重试');
			await transaction.commit();
		} catch(err) {
			if(transaction) await transaction.rollback();
			that.ctx.logger.error(`${err.message},用户购买视频记录失败,${that.ctx.app.szjcomo.json_encode(data)}`);
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
		let data = that.getData();
		let tmpdata = {
			wxpay_id:data.wxpay_id,video_id:data.video_id,user_id:data.user_id,is_pay:1,pay_money:(data.total_fee / 100),
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
		let money = await ctx.service.base.VideoCommission(result.pay_money);
		let videoUser = await ctx.model.Video.findOne({where:{video_id:result.video_id},attributes:['user_id']});
		let options = that.getOptions();
		if(videoUser) {
			await ctx.service.home.usersMoney.user_money(money,videoUser.user_id,options.transaction);
			await ctx.service.home.usersMoney.user_money_log(money,videoUser.user_id,'作品收入',options.transaction);
		}
	}
}

module.exports = UsersOrderService;
