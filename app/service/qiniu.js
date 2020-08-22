'use strict';

const BaseService 	= require('./base');
const Qiniu 		= require('node-qiniu-sdk');

/**
 * 七牛云对象存储
 */
class QiniuService extends BaseService {

	/**
	 * [upload_file description]
	 * @author 	   szjcomo
	 * @createTime 2020-08-13
	 * @param      {[type]}   bucket   [description]
	 * @param      {[type]}   filename [description]
	 * @return     {[type]}            [description]
	 */
	async upload_file(filename,options = {},bucket = null,tabZone = null,AccessKey = null,SecretKey = null) {
		let that = this;
		try {
			bucket = bucket || that.ctx.app.config.qiniu.bucket;
			tabZone = tabZone || that.ctx.app.config.qiniu.tabZone;
			let instance = await that.instance(AccessKey,SecretKey);
			const file = instance.file(`${bucket}:${filename}`);
			file.tabZone(tabZone);
			return await file.upload(options);
		} catch(err) {
			console.log(err);
			throw new Error(err.errmsg,err.statusCode);
		}
	}
	/**
	 * [upload_slice 并发上传]
	 * @author 	   szjcomo
	 * @createTime 2020-08-14
	 * @param      {[type]}   filename  [description]
	 * @param      {Object}   options   [description]
	 * @param      {[type]}   bucket    [description]
	 * @param      {String}   tabZone   [description]
	 * @param      {[type]}   AccessKey [description]
	 * @param      {[type]}   SecretKey [description]
	 * @return     {[type]}             [description]
	 */
	async upload_slice(filename,options = {},bucket = null,tabZone = null,AccessKey = null,SecretKey = null) {
		let that = this;
		try {
			bucket = bucket || that.ctx.app.config.qiniu.bucket;
			tabZone = tabZone || that.ctx.app.config.qiniu.tabZone;
			let instance = await that.instance(AccessKey,SecretKey);
			const file = instance.file(`${bucket}:${filename}`);
			file.tabZone(tabZone);
			return await file.sliceUpload(options);
		} catch(err) {
			throw new Error(err.errmsg,err.statusCode);
		}
	}

	/**
	 * [remove_file 删除文件]
	 * @author 	   szjcomo
	 * @createTime 2020-08-13
	 * @param      {[type]}   filename [description]
	 * @param      {[type]}   bucket   [description]
	 * @return     {[type]}            [description]
	 */
	async remove_file(filename,bucket = null,tabZone = null,AccessKey = null,SecretKey = null) {
		let that = this;
		let res = await that.exists_file(filename);
		if(res === false) return false;
		try {
			bucket = bucket || that.ctx.app.config.qiniu.bucket;
			tabZone = tabZone || that.ctx.app.config.qiniu.tabZone;
			let instance = await that.instance(AccessKey,SecretKey);
			const file = instance.file(`${bucket}:${filename}`);
			file.tabZone(tabZone);
			return await file.delete();
		} catch(err) {
			throw new Error(err.errmsg,err.statusCode);
		}
	}
	/**
	 * [remove_after 延期删除]
	 * @author 	   szjcomo
	 * @createTime 2020-08-14
	 * @param      {[type]}   filename  [description]
	 * @param      {[type]}   bucket    [description]
	 * @param      {Number}   after_day [description]
	 * @return     {[type]}             [description]
	 */
	async remove_after(filename,bucket = null,after_day = 1,tabZone = null,AccessKey = null,SecretKey = null) {
		let that = this;
		let res = await that.exists_file(filename);
		if(res === false) return false;
		bucket = bucket || that.ctx.app.config.qiniu.bucket;
		tabZone = tabZone || that.ctx.app.config.qiniu.tabZone;
		let instance = await that.instance(AccessKey,SecretKey);
		const file = instance.file(`${bucket}:${filename}`);
		file.tabZone(tabZone);
		return await file.deleteAfterDays(after_day);
	}
	/**
	 * [find_file 查找文件是否存在]
	 * @author 	   szjcomo
	 * @createTime 2020-08-14
	 * @param      {[type]}   filename  [description]
	 * @param      {[type]}   bucket    [description]
	 * @param      {[type]}   tabZone   [description]
	 * @param      {[type]}   AccessKey [description]
	 * @param      {[type]}   SecretKey [description]
	 * @return     {[type]}             [description]
	 */
	async exists_file(filename,bucket = null,tabZone = null,AccessKey = null,SecretKey = null,debug = false) {
		let that = this;
		try {
			bucket = bucket || that.ctx.app.config.qiniu.bucket;
			tabZone = tabZone || that.ctx.app.config.qiniu.tabZone;
			let instance = await that.instance(AccessKey,SecretKey);
			const file = instance.file(`${bucket}:${filename}`);
			file.tabZone(tabZone);
			return await file.stat();
		} catch(err) {
			if(debug) throw new Error(err.errmsg,err.statusCode);
			return false;
		}
	}
	/**
	 * [rename_file 文件重命名]
	 * @author 	   szjcomo
	 * @createTime 2020-08-14
	 * @param      {[type]}   new_filename [description]
	 * @param      {[type]}   old_filename [description]
	 * @param      {[type]}   bucket       [description]
	 * @param      {[type]}   tabZone      [description]
	 * @param      {[type]}   AccessKey    [description]
	 * @param      {[type]}   SecretKey    [description]
	 * @return     {[type]}                [description]
	 */
	async rename_file(new_filename,old_filename,bucket = null,tabZone = null,AccessKey = null,SecretKey = null) {
		let that = this;
		try {
			bucket = bucket || that.ctx.app.config.qiniu.bucket;
			tabZone = tabZone || that.ctx.app.config.qiniu.tabZone;
			let instance = await that.instance(AccessKey,SecretKey);
			const file = instance.file(`${bucket}:${old_filename}`);
			file.tabZone(tabZone);
			await file.move(`${bucket}:${new_filename}`,true);
			return true;
		} catch(err) {
			throw new Error(err.errmsg,err.statusCode);
		}
	}
	/**
	 * [list_file 获取空间文件]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @param      {Object}   options   [description]
	 * @param      {[type]}   bucket    [description]
	 * @param      {[type]}   tabZone   [description]
	 * @param      {[type]}   AccessKey [description]
	 * @param      {[type]}   SecretKey [description]
	 * @return     {[type]}             [description]
	 */
	async list_file(options = {}, bucket = null,tabZone = null,AccessKey = null,SecretKey = null) {
		let that = this;
		try {
			bucket = bucket || that.ctx.app.config.qiniu.bucket;
			tabZone = tabZone || that.ctx.app.config.qiniu.tabZone;
			let instance = await that.instance(AccessKey,SecretKey);
			const file = instance.bucket(`${bucket}`);
			file.tabZone(tabZone);
			return await file.list(options);
		} catch(err) {
			throw new Error(err.errmsg,err.statusCode);
		}
	}

	/**
	 * [Qiniu 获取七牛对象实例]
	 * @author 	   szjcomo
	 * @createTime 2020-08-13
	 * @param      {[type]}   AccessKey [description]
	 * @param      {[type]}   SecretKey [description]
	 */
	async instance(AccessKey,SecretKey) {
		let that = this;
		AccessKey = AccessKey || that.ctx.app.config.qiniu.AccessKey;
		SecretKey = SecretKey || that.ctx.app.config.qiniu.SecretKey;
		return new Qiniu(AccessKey,SecretKey);
	}
}

module.exports = QiniuService;