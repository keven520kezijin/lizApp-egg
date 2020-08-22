'use strict';

const Base 	= require('../base');
const Bean  = require('../../bean');

/**
 * 视频标签控制器
 */
class Tags extends Base {

	/**
	 * [hotValidate 获取热门标签]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	get listValidate() {
		let that = this;
		return {
			limit:that.ctx.rules.default(30).required().number(),
			sort:that.ctx.rules.default('tag_id').required(),
			page:that.ctx.rules.default(1).required().number(),
			hot:that.ctx.rules.default(0).required().number(),
			tag_id:that.ctx.rules.default(0).required().number(),
			tag_name:that.ctx.rules.default('').required()
		};
	}
	/**
	 * [createValidate 添加标签]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	get createValidate() {
		let that = this;
		return {
			tag_name:that.ctx.rules.name('标签名称').required().extend(async (field,value) => {
				let res = await that.ctx.model.Tags.findOne({where:{tag_name:value}});
				if(res) return '标签已经存在,请不要重复添加';
			}),
			pid:that.ctx.rules.default(0).required().number(),
			is_hot:that.ctx.rules.default(0).required().number(),
			create_time:that.ctx.rules.default(that.app.szjcomo.date('Y-m-d H:i:s')).required()
		};
	}
	/**
	 * [pkValidate 更新标签]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	get pkValidate() {
		let that = this;
		return {
			tag_id:that.ctx.rules.name('标签ID').required().number()
		};
	}

	/**
	 * [select 获取所有标签]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	async select() {
		let that = this;
		try {
			let seq = that.ctx.app.Sequelize;
			let data = await that.ctx.validate(that.listValidate,await that.get());
			let options = {limit:data.limit,offset:(data.page - 1) * data.limit,order:[[data.sort,'desc']],where:{}};
			if(data.hot > 0) options.where.is_hot = 1;
			if(data.tag_id > 0) options.where.tag_id = data.tag_id;
			if(!that.app.szjcomo.empty(data.tag_name)) options.where.tag_name = {[seq.Op.like]:`%${data.tag_name}%`};
			let tagsBean = new Bean({},options);
			let info = data.tag_id > 0?false:true;
			let result = await that.ctx.service.base.select(tagsBean,that.ctx.model.Tags,info,info?true:false);
			return that.appJson(that.app.szjcomo.appResult('标签获取成功',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [create 添加标签数据]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	async create() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.createValidate,await that.post());
			let tagBean = new Bean(data);
			let result = await that.ctx.service.base.create(tagBean,that.ctx.model.Tags,'视频标签创建失败');
			return that.appJson(that.app.szjcomo.appResult('视频标签创建成功',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [update 更新标签]
	 * @author 	   szjcomo
	 * @createTime 2020-08-15
	 * @return     {[type]}   [description]
	 */
	async update() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.pkValidate,await that.param());
			let tagBean = new Bean(data,{where:{tag_id:data.tag_id}});
			let result = await that.ctx.service.base.update(tagBean,that.ctx.model.Tags,'视频标签更新失败');
			return that.appJson(that.app.szjcomo.appResult('视频标签更新成功',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}
	/**
	 * [delete 删除视频标签]
	 * @author 	   szjcomo
	 * @createTime 2020-08-16
	 * @return     {[type]}   [description]
	 */
	async delete() {
		let that = this;
		try {
			let data = await that.ctx.validate(that.pkValidate,await that.param());
			let tagBean = new Bean(data,{where:{tag_id:data.tag_id}});
			let result = await that.ctx.service.base.delete(tagBean,that.ctx.model.Tags,'视频标签删除失败');
			return that.appJson(that.app.szjcomo.appResult('视频标签删除更新成功',result,false));
		} catch(err) {
			return that.appJson(that.app.szjcomo.appResult(err.message));
		}
	}

}

module.exports = Tags;