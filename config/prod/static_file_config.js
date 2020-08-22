'use strict';

const path = require('path');

/**
 * [静态文件配置]
 * @author 	   szjcomo
 * @createTime 2020-08-11
 * @param      {[type]}   appInfo [description]
 * @return     {[type]}           [description]
 */
module.exports = appInfo => {
	/**
	 * [static_config 静态文件配置]
	 * @type {Object}
	 */
	const static_config = {
		prefix: '/', //靜態化URL  我這裏默認網站根目錄（項目需要）
		dir: path.join(appInfo.baseDir, 'app/public'), // 靜態文件夾地址 可以設置多個 可以簡寫為 ：['app/public','app/public1']
		dynamic: true, //是否緩存靜態資源
		preload: false, //啓動項目開啓緩存
		// maxAge: 31536000,
		maxAge: 0, //緩存時間 開發建議設0 跳坑
		buffer: false, //是否緩存到内存 默認prod 緩存
	};
	return static_config;
}