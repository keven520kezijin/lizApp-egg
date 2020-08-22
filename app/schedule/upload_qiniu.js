'use strict';

const Subscription = require('egg').Subscription;
const path 		   = require('path');

/**
 * 定时扫描文件到七牛
 */
class UpdateQiniu extends Subscription {

	// 通过 schedule 属性来设置定时任务的执行间隔等配置
	static get schedule() {
		return {
		  	interval: 1000, // 1 分钟间隔
		  	type: 'worker', // 指定所有的 worker 都需要执行
		  	disable:true
		};
	}
	/**
	 * [subscribe  是真正定时任务执行时被运行的函数]
	 * @author 	   szjcomo
	 * @createTime 2020-08-14
	 * @return     {[type]}   [description]
	 */
	async subscribe() {
		let that = this;
		console.log(await that.ctx.app.redis.lpop('my_list'));
	}
}

module.exports = UpdateQiniu;