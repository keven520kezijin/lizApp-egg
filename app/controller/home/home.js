'use strict';
const Base 	= require('../base');
const fs    = require('fs');
/**
 * 项目首页
 */
class HomeController extends Base {

	/**
	 * [loginValidate 登录验证]
	 * @author 	   szjcomo
	 * @createTime 2020-08-03
	 * @return     {[type]}   [description]
	 */
	get loginValidate() {
		let that = this;
		return {
			username:that.ctx.rules.name('用户名').required(),
			password:that.ctx.rules.name('密码').required()
		};
	}

	/**
	 * [index 访问首页]
	 * @author 	   szjcomo
	 * @createTime 2020-08-03
	 * @return     {[type]}   [description]
	 */
	async index() {
		let that = this;
		try {
			let result;
			// let page = await that.get('id',0,Number);
			// if(page == 0) throw new Error('id不能为空');
			// let content = fs.readFileSync('./app/public/video.json');
			// result = that.app.szjcomo.json_decode(content.toString());
			// let data = [];
			// result.forEach((item,index) => {
			// 	data.push({
			// 		video_name:`批量添加视频操作-0${(index+1)}`,
			// 		video_hash:item.file_sha1,
			// 		video_url:item.file_url,
			// 		video_tags:'健身教程,书法教程',
			// 		video_image:item.thumb_image,
			// 		video_duration:item.video_duration,
			// 		video_price:that.app.szjcomo.mt_rand(10,99),
			// 	});
			// })
			// let res = await that.ctx.curl('http://192.168.1.165:8105/v1/video',{
			// 	method:'POST',dataType:'json',timeout:1*60*1000,
			// 	data:data[page],
			// 	headers:{
			// 		'token':'U2FsdGVkX18+AWoWbWEFx/ZjABd/8WUC9zBM+ylwlfHyuWF4VtP9B0Y2GZ45MB1pALRT1xSRxtCNIXCraDHTojhV8YoUuWoQR7l6XK/x09g='
			// 	}
			// });
			// console.log(res.data);
			// let result = await that.ctx.service.base.getWebAppAccessToken();
			// console.log(result);

			// result = await that.ctx.app.redis.rpush('my_list',2);
			// result = await that.ctx.app.redis.rpush('my_list',3);
			// result = await that.ctx.app.redis.rpush('my_list',4);
			// result = await that.ctx.app.redis.rpush('my_list',5);
			
			// console.log(await that.ctx.app.redis.lpop('my_list'));
			return that.appJson(that.app.szjcomo.appResult('hi,szjcomo',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

	/**
	 * [upload_all 批量上传视频]
	 * @author 	   szjcomo
	 * @createTime 2020-10-04
	 * @return     {[type]}   [description]
	 */
	async upload_all() {
		let that = this;
		try {
			let page = await that.get('id',0,Number);
			if(page == 0) throw new Error('请输入ID');
			let res = fs.readdirSync('./app/public/video');
			let result = await that.app.curl('http://127.0.0.1:8105/v1/video/upload',{
				method:'POST',dataType:'json',files:`./app/public/video/${res[page]}`,
				timeout:1*60*1000
			});
			console.log(result.data);
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result.data,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}





	/**
	 * [void_list 作废列表]
	 * @author 	   szjcomo
	 * @createTime 2020-08-18
	 * @return     {[type]}   [description]
	 */
	async void_list() {
		let that = this;
		try {
			let result = await that.ctx.curl('https://hywx.sizhijie.com/hywx/enroll/delete?page=1&limit=1500',{dataType:'json'});
			let header = [
				{key:'uname',name:'学生姓名'},
				{key:'idcardno',name:'身份证号'},
				{key:'gender',name:'性别'},
				{key:'address',name:'家庭住址'},
				{key:'call_phone',name:'联系电话'},
				{key:'student_type',name:'学生类型',values:['应届生','往届生']},
				{key:'midden_exam',name:'参加中考',values:['未参加','参加']},
				{key:'status_desc',name:'报名状态'},
				{key:'specialty_name',name:'第一志愿'},
				{key:'specialty_second_name',name:'第二志愿'},
				{key:'school_name',name:'毕业学校'},
				{key:'parent_uname',name:'家长姓名'},
				{key:'parent_phone',name:'家长电话'},
				{key:'is_pay',name:'是否付费',values:['未付费','已付费']},
			];
			let res = await that.app.excel.write(result.data.data.rows,'void_list.xlsx',header);
			return that.appJson(result);
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}


	/**
	 * [upload description]
	 * @author 	   szjcomo
	 * @createTime 2020-08-13
	 * @return     {[type]}   [description]
	 */
	async dywx_send() {
		let that = this;
		try {
			let content = await that.app.excel.read('dywx.xlsx');
			let result = [];
			let data = content[0].data;
			let length = data.length;
			for(let i = 0;i < length;i++) {
				let item = data[i];
				let options = {
					data:{
						sign:'【东源卫生职业技术学校】',
						mobile:item[1],
						content:item[0]+'##'+item[3]+'##'+item[2]+'##'+item[4]+'##18938104313',
						templateId:192605
					}
				};
				result.push(await that.app.send_single(options));
			}
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

	async dywx_send1() {
		let that = this;
		try {
			let content = await that.app.excel.read('dywx.xlsx');
			let result = [];
			let data = content[0].data;
			let length = data.length;
			for(let i = 0;i < length;i++) {
				let item = data[i];
				let options = {
					data:{
						sign:'【东源卫生职业技术学校】',
						mobile:item[1],
						content:item[0]+'##'+item[3]+'##'+item[2]+'##'+item[4],
						templateId:196267
					}
				};
				result.push(await that.app.send_single(options));
			}
			return that.appJson(that.app.szjcomo.appResult('SUCCESS',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

	/**
	 * [uploadAll 批量文件上传]
	 * @author 	   szjcomo
	 * @createTime 2020-09-22
	 * @return     {[type]}   [description]
	 */
	async uploadAll() {
		let that = this;
		try {
			let savePath = './app/public/uploads';
			let result = await that.ctx.service.base.uploadAll(savePath);
			console.log(result);
			return that.appJson(that.app.szjcomo.appResult('上传成功',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}


}

module.exports = HomeController;


/**
 *
{
  message: 'SUCCESS',
  result: 
 * 
 */