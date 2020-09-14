'use strict';

const path = require('path');

/**
 * [exports 导出对象]
 * @type {Object}
 */
module.exports = appInfo => {

	return {
		/**
		 * [middleware 中间件的使用配置]
		 * @type {Array}
		 */
		middleware:['notfoundHandler'],
		/**
		 * [bodyParser middleware]
		 * @type {[type]}
		 */
		bodyParser: 		require('./body_parser'),
		/**
		 * [multipart 文件上传配置项]
		 * @type {[type]}
		 */
		multipart: 			require('./multipart'),
		/**
		 * [cluster 项目端口相关配置项]
		 * @type {[type]}
		 */
		cluster: 			require('./cluster'),
		/**
		 * [sequelize 数据库配置]
		 * @type {[type]}
		 */
		sequelize: 			require('./sequelize')(appInfo),
		/**
		 * [security 项目安全机制配置项]
		 * @type {[type]}
		 */
		security: 			require('./security'),
		/**
		 * [logger 项目日志配置]
		 * @type {[type]}
		 */
		logger: 			require('./logger')(appInfo),
		/**
		 * [qiniu 七牛存储功能]
		 * @type {[type]}
		 */
		qiniu: 				require('./qiniu'),
		/**
		 * [redis redis配置]
		 * @type {[type]}
		 */
		redis: 				require('./redis'),
		/**
		 * [webapp 微信小程序appid secret]
		 * @type {[type]}
		 */
		webapp: 			require('./webapp'),
		/**
		 * [assets 静态资源目录]
		 * @type {Object}
		 */
		static: 			require('./static_file_config')(appInfo),
		/**
		 * [rundir 正在运行的服务器的目录。您可以在下面找到从app.config转储的“application_config.json”`]
		 * @type {[type]}
		 */
		rundir: path.join(appInfo.root,'runtime', 'run'),
		/**
		 * [siteFile 中间件的选项]
		 * 您可以使用此选项映射一些文件，当匹配时它将立即响应
		 * @type {Object}
		 */
		siteFile:{'/favicon.ico': 'https://eggjs.org/favicon.ico'},
		/**
		 * [cors 跨域处理]
		 * @type {Object}
		 */
		cors:{
			origin: '*',
			allowMethods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS'
		},
		/**
		 * [szjcomoCache 缓存插件配置]
		 * @type {Object}
		 */
		szjcomoCache: require('./szjcomo_cache')(appInfo),
		/**
		 * [onerror 出错响应配置]
		 * @author szjcomo
		 * @dateTime 2019-12-15
		 * @param    {[type]}   err [description]
		 * @return   {[type]}       [description]
		 */
		onerror:{
		    /**
		     * [all 所有错误请求处理]
		     * 注意，定义了 config.all 之后，其他错误处理方法不会再生效
		     * @author szjcomo
		     * @dateTime 2019-12-15
		     * @param    {[type]}   err [description]
		     * @param    {[type]}   ctx [description]
		     * @return   {[type]}       [description]
		     */
		    all(err, ctx) {
		    	ctx.logger.error(err);
		        ctx.status = 200;
		        ctx.body = JSON.stringify(ctx.app.szjcomo.appResult('服务器内部出错,请联系管理员'));
		    }
		},
		/**
		 * [szjcomoDyw 短信网]
		 * @type {Object}
		 */
		szjcomoDyw:{
			/**
			 * [accesskey 短信网密钥]
			 * @type {String}
			 */
			accesskey:'dxwSZJ0762',
			/**
			 * [secret 短信网密钥]
			 * @type {String}
			 */
			secret:'2551C8A538A00FA1A1F1A6D42BCB',
			/**
			 * [sign 签名]
			 * @type {String}
			 */
			sign:'【东源卫生职业技术学校】'
		},
	};
}