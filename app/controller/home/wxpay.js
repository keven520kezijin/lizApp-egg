'use strict';

const Base 	= require('../base');
const Bean  = require('../../bean');

/**
 * 支付控制器
 */
class Wxpay extends Base {
	/**
	 * [gratuityCreateOrderValidate 打赏下单]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @return     {[type]}   [description]
	 */
	get gratuityCreateOrderValidate() {
		let that = this;
		return {
			total_fee:that.ctx.rules.name('打赏金额').required().number(),
			body:that.ctx.rules.default('作品打赏').required().max_length(120).min_length(4),
			out_trade_no:that.ctx.rules.default(that.app.szjcomo.date('YmdHis') + '' + that.app.szjcomo.mt_rand(100000,999999)).required()
		};
	}
	/**
	 * [orderVideoValidate 用户购买视频下单接口]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @return     {[type]}   [description]
	 */
	get orderVideoValidate() {
		let that = this;
		return {
			video_id:that.ctx.rules.name('作品ID').required().number(),
			out_trade_no:that.ctx.rules.default(that.app.szjcomo.date('YmdHis') + '' + that.app.szjcomo.mt_rand(100000,999999)).required()
		};
	}
	/**
	 * [notifyURL 下单回调地址]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @return     {[type]}   [description]
	 */
	get notifyURL() {
		return 'http://www.hysdyzx.com/v1/wxpay/callback';
	}
	/**
	 * [findWXpayValidate 查询支付结果]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @return     {[type]}   [description]
	 */
	get findWXpayValidate() {
		let that = this;
		return {
			out_trade_no:that.ctx.rules.name('支付订单号').required()
		};
	}

	/**
	 * [payCallback 支付回调接口]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @return     {[type]}   [description]
	 */
	async payCallback() {
		let that = this;
        let result = await that.post();
        try {
            let sign = result.sign;
            delete result.sign;
            let res = that.app.wxpay.final_params(result,that.app.config.wxpay.key);
            if(res.sign != sign) return that.appJson(that.app.szjcomo.createXml(that.app.szjcomo.appResult('非法操作,请检查')));
            let tmpAttach = that.app.szjcomo.base64_decode(result.attach);
            let attach = that.app.szjcomo.json_decode(tmpAttach);
            let replyObj = {return_code:'SUCCESS',return_msg:'ok'};
            await that.wxpay_write(result,attach,tmpAttach);
            that.ctx.body = that.app.szjcomo.createXml(replyObj);
            return;
        } catch(err) {
            return that.appJson(that.app.szjcomo.createXml(that.app.szjcomo.appResult(err.message)));
        }
	}
	/**
	 * [wxpay_write 微信支付记录回调写入]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @param      {[type]}   result [description]
	 * @param      {[type]}   attach [description]
	 * @return     {[type]}          [description]
	 */
	async wxpay_write(result,attach,attach_origin = '') {
		let that = this;
		let is_log = await that.ctx.model.Wxpay.findOne({where:{out_trade_no:result.out_trade_no},raw:true});
		if(is_log) return true;
		result.user_id = attach.user_id;
		result.scene = attach.scene;
		result.remarks = attach_origin;
		let insertRes = await that.ctx.model.Wxpay.create(result);
		if(!insertRes) throw new Error('支付回调写入失败,请重试');
		return true;
	}
	/**
	 * [gratuity 用户打赏下单接口]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @return     {[type]}   [description]
	 */
	async gratuity() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.gratuityCreateOrderValidate,await that.get());
			let user_id = await that.ctx.service.base.getUserId();
			let openid  = await that.ctx.service.base.getUserOpenId(user_id);
			data.notify_url = that.notifyURL;
			data.trade_type = 'JSAPI';
			let jsonAttach = that.app.szjcomo.json_encode({user_id:user_id,scene:'gratuity'});
			data.attach = that.app.szjcomo.base64_encode(jsonAttach);
			data.openid = openid;
			let result = await that.app.wxpay.orderCreate(data,that.app.config.wxpay.key);
			if(result.result_code == 'SUCCESS') {
				let payOptions = that.createJSWXPAYOptions(result.prepay_id,result.nonce_str);
				return that.appJson(that.app.szjcomo.appResult('SUCCESS',{pay:payOptions,out_trade_no:data.out_trade_no},false));
			}
			return that.appJson(that.app.szjcomo.appResult(result.err_code_des,result));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [order_video 用户购买视频下单]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @return     {[type]}   [description]
	 */
	async order_video() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.orderVideoValidate,await that.get());
			let info = await that.ctx.model.Video.findOne({where:{video_id:data.video_id},attributes:['video_price','video_name']});
			if(!info) throw new Error('The work information does not exist, please check whether the parameter is wrong');
			if((info.video_price * 100) < 1) throw new Error('The price of the works is free of charge and no order is required');  
			let user_id = await that.ctx.service.base.getUserId();
			let openid  = await that.ctx.service.base.getUserOpenId(user_id);
			let jsonAttach = that.app.szjcomo.json_encode({user_id:user_id,scene:'video',video_id:data.video_id});
			let wxpayOptions = {
				body:info.video_name,total_fee:info.video_price * 100,notify_url:that.notifyURL,trade_type:'JSAPI',
				attach:that.app.szjcomo.base64_encode(jsonAttach),
				openid:openid,out_trade_no:data.out_trade_no
			};
			let result = await that.app.wxpay.orderCreate(wxpayOptions,that.app.config.wxpay.key);
			if(result.result_code == 'SUCCESS') {
				let payOptions = that.createJSWXPAYOptions(result.prepay_id,result.nonce_str);
				return that.appJson(that.app.szjcomo.appResult('SUCCESS',{pay:payOptions,out_trade_no:data.out_trade_no},false));
			}
			return that.appJson(that.app.szjcomo.appResult(result.err_code_des,result));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

	/**
	 * [createJSWXPAYOptions 创建微信支付小程序参数]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @param      {[type]}   prepay_id [description]
	 * @param      {[type]}   nonceStr  [description]
	 * @return     {[type]}             [description]
	 */
	createJSWXPAYOptions(prepay_id,nonce_str) {
		let that = this;
        let options = {
            timeStamp:that.app.szjcomo.time() + '',
            nonceStr:nonce_str,
            package:'prepay_id=' + prepay_id,
            signType:'MD5',
            appId:that.app.config.wxpay.appid
        };
        let params = that.app.wxpay.final_params(options,that.app.config.wxpay.key);
        let result = {
        	timeStamp:options.timeStamp,nonceStr:options.nonceStr,package:options.package,
        	signType:options.signType,appId:options.appId,paySign:params.sign
        };
        return result;
	}

	/**
	 * [find_wxpay_result 查询用户下单后支付结果]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @return     {[type]}   [description]
	 */
	async find_wxpay_result() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.findWXpayValidate,await that.get());
			let user_id = await that.ctx.service.base.getUserId();
			let info = await that.ctx.model.Wxpay.findOne({
				where:{out_trade_no:data.out_trade_no,user_id:user_id},
				attributes:['wxpay_id'],raw:true
			});
			if(!info) return that.appJson(that.app.szjcomo.appResult('waiting',null,false));
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',info,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
}

module.exports = Wxpay;