'use strict';

const Service 			= require('egg').Service;
const awaitWriteStream 	= require('await-stream-ready').write;
const sendToWormhole 	= require('stream-wormhole');//管道读入一个虫洞
const fs 				= require('fs');
const path 				= require('path');
const Bean  			= require('../bean');

/**
 * 基础服务类
 */
class BaseService extends Service {
	
	/*=============================数据库操作==========================*/
	/**
	 * [create 执行创建函数]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @param      {[type]}   execBean [description]
	 * @param      {[type]}   model    [description]
	 * @return     {[type]}            [description]
	 */
	async create(execBean,model,fail_alert = '数据创建失败') {
		let that = this;
		if((execBean instanceof Bean) !== true) throw new Error('参数错误,请传execBean类型参数');
		let tmpBean = await execBean.beforeAction.call(execBean,that.ctx);
		if(tmpBean) execBean = tmpBean;
		let result = await model.create(execBean.getData(),execBean.getOptions());
		if(!result) throw new Error(fail_alert);
		let afRes = await execBean.afterAction.call(execBean,that.ctx,result);
		if(afRes) return afRes;
		return result;
	}
	/**
	 * [select 查询用户信息]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @param      {[type]}   execBean [description]
	 * @param      {[type]}   model    [description]
	 * @param      {Boolean}  more     [description]
	 * @return     {[type]}            [description]
	 */
	async select(execBean,model,more = false,count = false,fail_alert = '数据获取失败') {
		let that = this;
		if((execBean instanceof Bean) !== true) throw new Error('参数错误,请传execBean类型参数');
		let tmpBean = await execBean.beforeAction.call(execBean,that.ctx);
		if(tmpBean) execBean = tmpBean;
		let result;
		if(more && count) {
			result = await model.findAndCountAll(execBean.getOptions());
		} else if(more) {
			result = await model.findAll(execBean.getOptions());
		} else {
			result = await model.findOne(execBean.getOptions());
		}
		if(!result) throw new Error(fail_alert);
		let afRes = await execBean.afterAction.call(execBean,that.ctx,result);
		if(afRes) return afRes;
		return result;
	}
	/**
	 * [update 更新操作]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @param      {[type]}   execBean   [description]
	 * @param      {[type]}   model      [description]
	 * @param      {String}   fail_alert [description]
	 * @return     {[type]}              [description]
	 */
	async update(execBean,model,fail_alert = '数据更新失败') {
		let that = this;
		if((execBean instanceof Bean) !== true) throw new Error('参数错误,请传execBean类型参数');
		let tmpBean = await execBean.beforeAction.call(execBean,that.ctx);
		if(tmpBean) execBean = tmpBean;
		let result = await model.update(execBean.getData(),execBean.getOptions());
		if(!result[0]) throw new Error(fail_alert);
		let afRes = await execBean.afterAction.call(execBean,that.ctx,result);
		if(afRes) return afRes;
		return result;
	}
	/**
	 * [delete 删除数据]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @param      {[type]}   execBean   [description]
	 * @param      {[type]}   model      [description]
	 * @param      {String}   fail_alert [description]
	 * @return     {[type]}              [description]
	 */
	async delete(execBean,model,fail_alert = '数据删除失败') {
		let that = this;
		if((execBean instanceof Bean) !== true) throw new Error('参数错误,请传execBean类型参数');
		let tmpBean = await execBean.beforeAction.call(execBean,that.ctx);
		if(tmpBean) execBean = tmpBean;
		let result = await model.destroy(execBean.getOptions());
		if(!result) throw new Error(fail_alert);
		let afRes = await execBean.afterAction.call(execBean,that.ctx,result);
		if(afRes) return afRes;
		return result;
	}


	/**
	 * [uploadOne 单文件上传功能]
	 * @author 	   szjcomo
	 * @createTime 2020-08-14
	 * @param      {[type]}   savePath [description]
	 * @param      {[type]}   filename [description]
	 * @return     {[type]}            [description]
	 */
	async uploadOne(savePath,filename) {
		let that = this;
		filename = filename || (that.ctx.app.szjcomo.date('YmdHis') + '' + that.ctx.app.szjcomo.mt_rand(100000,999999));
		return await that.uploadHandler(await that.ctx.getFileStream(),savePath,filename);
	}
	/**
	 * [uploadAll 批量上传文件功能]
	 * @author 	   szjcomo
	 * @createTime 2020-08-14
	 * @param      {[type]}   savePath [description]
	 * @return     {[type]}            [description]
	 */
	async uploadAll(savePath) {
		let that = this;
		let part;
		let result = [];
		let fields = {};
		let parts = await that.ctx.multipart({autoFields: true});
		while ((part = await parts()) != null) {
			if (part.length) {
				fields[part[0]] = part[1];
			} else {
				// 定义文件名
  				let filename 	= (that.ctx.app.szjcomo.date('YmdHis') + '' + that.ctx.app.szjcomo.mt_rand(100000,999999));
				// part 是上传的文件流
				result.push(await that.uploadHandler(part,savePath,filename));
			}
		}
		return result;
	}
	/**
	 * [uploadHandler 上传的文件流]
	 * @Author   szjcomo
	 * @DateTime 2019-10-05
	 * @param    {[type]}   stream [description]
	 * @return   {[type]}          [description]
	 */
	async uploadHandler(stream,savePath,filename){
		let that = this;
	  		let ext 		= path.extname(filename);
	  		if(that.ctx.app.szjcomo.empty(ext)) filename += path.extname(stream.filename);
	  		// 生成文件路径
	  		that.ctx.app.szjcomo.mkdir(savePath);
	  		// 目标文件
	  		let target 		= path.join(savePath, filename);
	  		// 创建文件流
	  		let writeStream = fs.createWriteStream(target);
	  		try{
	  			//异步把文件流 写入
    			await awaitWriteStream(stream.pipe(writeStream));
	  		} catch(err){
			    //如果出现错误，关闭管道
			    await sendToWormhole(stream);
	  			throw err;
	  		}
	  		 await sendToWormhole(stream);
	  		return {save_path:savePath,save_name:filename,file_sha1:that.ctx.app.szjcomo.FileSHA1(target),
	  			fields:stream.fields,file_size:writeStream.bytesWritten,mime:stream.mime,encoding:stream.encoding,
	  			origin_name:stream.filename,file_md5:that.ctx.app.szjcomo.FileMD5(target),ext:path.extname(stream.filename)}
	}
	/**
	 * [getWebAppAccessToken 获取微信小程序access_token]
	 * @author 	   szjcomo
	 * @createTime 2020-08-21
	 * @return     {[type]}   [description]
	 */
	async getWebAppAccessToken() {
		let that = this;
		let access_token = await that.ctx.app.redis.get(that.ctx.app.config.webapp.appid);
		if(access_token) return access_token;
		let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${that.ctx.app.config.webapp.appid}&secret=${that.ctx.app.config.webapp.secret}`;
		let result = await that.ctx.curl(url,{dataType:'json'});
		if(result.data && result.data.access_token) {
			access_token = result.data.access_token;
			await that.ctx.app.redis.set(that.ctx.app.config.webapp.appid,access_token,'EX',7000);
			return access_token;
		}
		throw new Error(result.data.errmsg,result.data.errcode);
	}
	/**
	 * [getUserId 获取前台用户的user_id]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @return     {[type]}   [description]
	 */
	async getUserId() {
		let that = this;
		let token = that.ctx.request.header.token;
		let userJson = that.ctx.app.szjcomo.aes_decode(token);
		let user = that.ctx.app.szjcomo.json_decode(userJson);
		return user.user_id;
	}
	/**
	 * [getUserOpenId 获取前台用户的openid]
	 * @author 	   szjcomo
	 * @createTime 2020-09-23
	 * @param      {[type]}   user_id [description]
	 * @return     {[type]}           [description]
	 */
	async getUserOpenId(user_id) {
		let that = this;
		let user = await that.ctx.model.Users.findOne({where:{user_id:user_id},raw:true,attributes:['openid']});
		return user.openid;
	}
	/**
	 * [GratuityCommission 打赏提成比例]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 */
	async GratuityCommission(money) {
		let that = this;
		const commission = 0.1;
		let result =  (money - money * commission);
		return result;
	}
	/**
	 * [VideoCommission 视频提成]
	 * @author 	   szjcomo
	 * @createTime 2020-09-25
	 * @param      {[type]}   money [description]
	 */
	async VideoCommission(money) {
		let that = this;
		const commission = 0.1;
		let result = (money - money * commission);
		return result;
	}
}


module.exports = BaseService;