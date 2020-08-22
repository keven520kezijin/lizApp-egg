'use strict';

/**
 * [数据库配置]
 * @author 	   szjcomo
 * @createTime 2020-08-11
 * @param      {[type]}   appInfo [description]
 * @return     {[type]}           [description]
 */
module.exports = appInfo => {
	/**
	 * [dbConfig 配置]
	 * @type {Object}
	 */
	const dbConfig = {
		//单数据库操作配置
		dialect: 'mysql',
		delegate: 'model',
		baseDir: 'models/mysql',
		host: '192.168.1.126',
		port: 3306,
		database: 'appjz',
		username: 'appjz',
		password: 'appjz',
		pool: {
			max: 3,
			min: 1,
			acquire: 60000,
			idle: 10000
		},
		/**
		 * [是否在控制台打印sql语句]
		 * @author 	   szjcomo
		 * @createTime 2020-08-11
		 * @param      {...[type]} msg [description]
		 * @return     {[type]}        [description]
		 */
		logging:console.log,
		/**
		 * [timezone 东八时区]
		 * @type {String}
		 */
		timezone: '+08:00', 
		/**
		 * [charset 设置字符集]
		 * @type {String}
		 */
		charset:'utf8',
		/**
		 * [dialectOptions 其它参数]
		 * @type {Object}
		 */
		dialectOptions: {  
			/**
			 * [dateStrings 让读取date类型数据时返回字符串而不是UTC时间]
			 * @type {Boolean}
			 */
			dateStrings: true,
			/**
			 * [typeCast 时间格式处理]
			 * @type {Boolean}
			 */
			typeCast:true,
		},
		/**
		 * [define 定义全局]
		 * @type {Object}
		 */
		define:{
			/**
			 * [是否使用自定义表名,如何为false 那么就同模型名一致]
			 * @type {Boolean}
			 */
			freezeTableName:true,
			/**
			 * [添加create,update,delete时间戳]
			 * @type {Boolean}
			 */
			timestamps:false
		}
	};
	return dbConfig;
}