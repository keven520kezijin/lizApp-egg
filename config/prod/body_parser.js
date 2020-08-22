'use strict';
/**
 * [bodyParser 配置项]
 * @type {Object}
 */
module.exports = {
	/**
	 * [enable 是否启用bodyParser，默认为true]
	 * @type {Boolean}
	 */
    enable: true,
    /**
     * [encoding body's encoding type，default is utf8]
     * @type {String}
     */
    encoding: 'utf8',
    /**
     * [formLimit urlencoded主体的限制。如果主体最终大于此限制，则返回413错误代码。默认值为1mb]
     * @type {String}
     */
    formLimit: '2mb',
    /**
     * [jsonLimit json主体的限制，默认为1mb]
     * @type {String}
     */
    jsonLimit: '2mb',
    /**
     * [textLimit 文本体的限制，默认为1mb]
     * @type {String}
     */
    textLimit: '2mb',
    /**
     * [strict 当设置为true时，JSON解析器将只接受数组和对象。默认为真]
     * @type {Boolean}
     */
    strict: true,
    /**
     * [queryString 请求参数配置]
     * @type {Object}
     */
    queryString: {
    	/**
    	 * [arrayLimit urlencoded body数组的最大长度，默认为100]
    	 * @type {Number}
    	 */
      	arrayLimit: 100,
      	/**
      	 * [depth urlencoded body对象的最大深度，默认为5]
      	 * @type {Number}
      	 */
      	depth: 5,
      	/**
      	 * [parameterLimit UrLink码体最大参数，默认值为1000]
      	 * @type {Number}
      	 */
      	parameterLimit: 1000,
    }
};