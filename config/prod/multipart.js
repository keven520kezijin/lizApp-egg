'use strict';

const os   = require('os');
const path = require('path');

/**
 * [exports 文件流式上传配置]
 * @type {Object}
 */
module.exports = {
	/**
	 * [mode 以流的方式进行上传]
	 * @type {String}
	 */
    mode: 'stream',
    /**
     * [autoFields 将字段自动设置为部分，默认值为“false”。只在“stream”模式下工作。
     * 如果设置为true，则所有字段都将是自动句柄，并且可以通过“parts.fields”访问]
     * @type {Boolean}
     */
    autoFields: true,
    /**
     * [defaultCharset 默认字符集编码，在你真正知道之前不要更改它]
     * @type {String}
     */
    defaultCharset: 'utf8',
    /**
     * [fieldNameSize 最大字段名大小（字节），默认为'100]
     * @type {Number}
     */
    fieldNameSize: 100,
    /**
     * [fieldSize 最大字段值大小（字节），默认值为“100kb”`]
     * @type {String}
     */
    fieldSize: '100kb',
    /**
     * [fields 非文件字段的最大数目，默认为“10”`]
     * @type {Number}
     */
    fields: 10,
    /**
     * [fileSize 最大文件大小（字节），默认为“10mb`]
     * @type {String}
     */
    fileSize: '50mb',
    /**
     * [files 最大文件字段数，默认为“10”`]
     * @type {Number}
     */
    files: 10,
    /**
     * [fileExtensions 在“白名单”中添加更多的ext文件名，默认为`[]`]
     * @type {Array}
     */
    fileExtensions: [],
    /**
     * [whitelist 白名单的ext文件名，默认为'null`]
     * @type {[type]}
     */
    whitelist: ['.png','.jpeg','.jpg','.bmp','.mp4','.mp3','.wmv'],
    /**
     * [tmpdir 临时文件的目录。只在“文件”模式下工作]
     * @type {[type]}
     */
    tmpdir: path.join(os.tmpdir(), 'egg-multipart-tmp', 'szjkj'),
    /**
     * [cleanSchedule 定时清除临时文件缓存]
     * @type {Object}
     */
    cleanSchedule: {
      	// 每天凌晨4:30运行tmpdir clean job
      	cron: '0 30 4 * * *',
    },
};