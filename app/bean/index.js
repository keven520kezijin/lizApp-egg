'use strict';

/**
 * 数据接口
 */
class Bean {

	/**
	 * [constructor 构造数据对象]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @param      {Object}   data [description]
	 * @return     {[type]}        [description]
	 */
	constructor(data = {},options = {}) {
		this.data = data;
		this.options = options;
		this.calls = [];
	}
	/**
	 * [getOptions 获取数据]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	getOptions() {
		return this.options;
	}
	/**
	 * [getData 返回数据对象]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	getData() {
		return this.data;
	}
	/**
	 * [setData 设置数据对象]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @param      {Object}   data [description]
	 */
	setData(data = {}) {
		this.data = data;
	}
	/**
	 * [setOptions 设置数据]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @param      {Object}   options [description]
	 */
	setOptions(options = {}) {
		this.options = options;
	}
	/**
	 * [beforeAction 数据操作前]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	async beforeAction(ctx) {
		let that = this;
		let length = that.calls.length;
		for(let i = 0;i<length;i++) {
			let item = that.calls[i];
			if(item.sence == 'before') {
				await item.callback.call(that,ctx);
			}
		}
	}
	/**
	 * [afterAction 数据操作后]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	async afterAction(ctx,result) {
		let that = this;
		let length = that.calls.length;
		for(let i = 0;i<length;i++) {
			let item = that.calls[i];
			if(item.sence == 'after') {
				let res = await item.callback.call(that,ctx,result);
				if(res) result = res;
			}
		}
	}
	/**
	 * [addCall 注册回调参数]
	 * @author 	   szjcomo
	 * @createTime 2020-08-19
	 * @param      {[type]}   callable [description]
	 * @param      {String}   sence    [description]
	 */
	addCall(callable,sence = 'before') {
		let that = this;
		if(typeof callable !== 'function') return false;
		that.calls.push({callback:callable,sence:sence});
	}
};

module.exports = Bean;