'use strict';

const Controller = require('egg').Controller;

/**
 * 项目基类控制器
 */
class BaseController extends Controller {
	/**
	 * [appJson json数据统一返回值]
	 * @author szjcomo
	 * @dateTime 2019-12-24
	 * @param    {Object}   data [description]
	 * @return   {[type]}        [description]
	 */
	appJson(data = {}) {
		let that = this;
		return that.ctx.body = data;
	}
	/**
	 * [param 获取请求参数]
	 * @Author   szjcomo
	 * @DateTime 2019-10-03
	 * @return   {[type]}   [description]
	 */
	async param(name = null,defaults = null,handler = null){
		let that = this;
		let result = Object.assign(that.ctx.request.body,that.ctx.query);
		return await that.params_handler(result,name,defaults,handler);
	}
	/**
	 * [params_handler 统一的参数请求处理]
	 * @Author   szjcomo
	 * @DateTime 2019-10-03
	 * @param    {[type]}   result   [description]
	 * @param    {[type]}   name     [description]
	 * @param    {[type]}   defaults [description]
	 * @param    {[type]}   handler  [description]
	 * @return   {[type]}            [description]
	 */
	async params_handler(result,name = null,defaults = null,handler = null){
		let that = this;
		try{
			if(name === null){
				let tmp = {};
				Object.getOwnPropertyNames(result).forEach(key => {
					if(typeof result[key] !== 'string'){
						tmp[key] = result[key];
					} else {
						tmp[key] = that.htmlspecialchars(result[key]);
					}
				})
				return tmp;
			}
			if(result.hasOwnProperty(name)) {
				if(typeof handler === 'function'){
					return await handler(result[name]);
				}
				if(typeof result[name] !== 'string'){
					return result[name];
				}
				return that.htmlspecialchars(result[name]);
			}
			return defaults;
		} catch(err){
			that.debug(err.message);
			return null;
		}
	}
	/**
	 * [htmlspecialchars html转义符号]
	 * @Author   szjcomo
	 * @DateTime 2019-10-04
	 * @param    {[type]}   str [description]
	 * @return   {[type]}       [description]
	 */
	htmlspecialchars(str) {        
		var s = "";
		if (str.length == 0) return "";
		for   (var i=0; i<str.length; i++){  
			switch (str.substr(i,1)){
				case "<": s += "&lt;"; break;
				case ">": s += "&gt;"; break;
				case "&": s += "&amp;"; break;
				case " ":
					if(str.substr(i + 1, 1) == " "){
						s += " &nbsp;";
						i++;
					} else s += " ";
					break;
				case "\"": s += "&quot;"; break;
				case "\n": s += "<br>"; break;
				default: s += str.substr(i,1); break;
			}
		}
		return s;
	}
	/**
	 * [htmlspecialchars_decode html反转义]
	 * @Author   szjcomo
	 * @DateTime 2019-10-04
	 * @param    {[type]}   str [description]
	 * @return   {[type]}       [description]
	 */
    htmlspecialchars_decode(str){           
		str = str.replace(/&amp;/g, '&');
		str = str.replace(/&lt;/g, '<');
		str = str.replace(/&gt;/g, '>');
		str = str.replace(/&quot;/g, "''");
		str = str.replace(/&#039;/g, "'");
		return str;
    }
	/**
	 * [post 获取post过来的参数]
	 * @Author szjcomo
	 * @DateTime 2019-10-03
	 * @param    {[type]}   name     [description]
	 * @param    {[type]}   defaults [description]
	 * @param    {[type]}   handler  [description]
	 * @return   {[type]}            [description]
	 */
	async post(name = null,defaults = null,handler = null){
		let that = this;
		return await that.params_handler(that.ctx.request.body,name,defaults,handler);
	}
	/**
	 * [get 获取get请求参数]
	 * @Author   szjcomo
	 * @DateTime 2019-10-03
	 * @param    {[type]}   name     [description]
	 * @param    {[type]}   defaults [description]
	 * @param    {[type]}   handler  [description]
	 * @return   {[type]}            [description]
	 */
	async get(name = null,defaults = null,handler = null){
		let that = this;
		return await that.params_handler(that.ctx.query,name,defaults,handler);
	}

	/**
	 * [cache_get 获取缓存]
	 * @author 	   szjcomo
	 * @createTime 2020-01-07
	 * @param      {[type]}   key [description]
	 * @return     {[type]}       [description]
	 */
	cache_get(key) {
		let that = this;
		return new Promise((reslove,reject) => {
			that.app.cache.get(key,(err,result) => {
				if(err) {
					reject(err);
				} else {
					reslove(result);
				}
			})
		})
	}
	/**
	 * [cache_set 缓存设置]
	 * @author 	   szjcomo
	 * @createTime 2020-01-07
	 * @param      {[type]}   key     [description]
	 * @param      {[type]}   value   [description]
	 * @param      {Object}   options [description]
	 * @return     {[type]}           [description]
	 */
	cache_set(key,value,options = {}) {
		let that = this;
		return new Promise((reslove,reject) => {
			that.app.cache.set(key,value,Object.assign({ttl:1 * 360 * 24 * 60 * 60},options),function(err) {
				if(err) {
					reject(err);
				} else {
					reslove(true);
				}
			})
		})
	}
	/**
	 * [cache_del 删除缓存]
	 * @author 	   szjcomo
	 * @createTime 2020-01-07
	 * @param      {[type]}   key [description]
	 * @return     {[type]}       [description]
	 */
	cache_del(key) {
		let that = this;
		return new Promise((reslove,reject) => {
			that.app.cache.del(key,function(err){
				if(err) {
					reject(err);
				} else {
					reslove(true);
				}
			})
		})
	}
	/**
	 * [debug 打印日志]
	 * @Author   szjcomo
	 * @DateTime 2019-10-03
	 * @param    {[type]}   str [description]
	 * @return   {[type]}       [description]
	 */
	debug(str){
		this.ctx.logger.error(str);
	}
}


module.exports = BaseController;
