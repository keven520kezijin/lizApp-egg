'use strict';
/**
 * [exports 上传的响应主体大小配置]
 * @type {Object}
 */
module.exports = appInfo => {
    /**
     * 项目日志配置项
     */
    return {
        /**
         * [level 日志级别的配置 日志分为 NONE，DEBUG，INFO，WARN 和 ERROR 5 个级别]
         * NONE 关闭所有打印到文件的日志
         * 默认只会输出 INFO 及以上（WARN 和 ERROR）的日志到终端中
         * @type {String}
         */
        level: 'INFO',
        /**
         * [buffer 如果启用，则以特定频率将日志刷新到磁盘以提高性能，默认为true]
         * @type {Boolean}
         */
        buffer:true,
        /**
         * [outputJSON log as JSON or not, defaults to false]
         * @type {Boolean}
         */
        outputJSON: false,
        /**
         * [encoding log file encoding, defaults to utf8]
         * @type {String}
         */
        encoding: 'utf8',
        /**
         * [consoleLevel 打印所有级别日志到终端]
         * NONE 关闭所有打印到终端的日志
         * @type {String}
         */
        consoleLevel:'ERROR',
        /**
         * [allowDebugAtProd 为了避免一些插件的调试日志在生产环境打印导致性能问题，
         * 生产环境默认禁止打印 DEBUG 级别的日志，如果确实有需求在生产环境打印 DEBUG 日志进行调试，
         * 需要打开 allowDebugAtProd 配置项。]
         * @type {Boolean}
         */
        allowDebugAtProd: false,
        /**
         * [disableConsoleAfterReady 基于性能的考虑，在正式环境下，默认会关闭终端日志输出。如有需要，
         * 你可以通过下面的配置开启。（不推荐）]
         * @type {Boolean}
         */
        disableConsoleAfterReady:false,
        /**
         * [dir 日志记录位置]
         * @type {String}
         */
        dir:'runtime/logs/',
        /**
         * [appLogName 应用相关日志，供应用开发者使用的日志]
         * @type {[type]}
         */
        appLogName: `${appInfo.name}-egg-access.log`,
        /**
         * [coreLogName 框架内核、插件日志]
         * @type {[type]}
         */
        coreLogName:`${appInfo.name}-egg-core.log`,
        /**
         * [errorLogName 任何 logger 的 .error() 调用输出的日志都会重定向到这里，重点通过查看此日志定位异常。]
         * @type {[type]}
         */
        errorLogName:`${appInfo.name}-egg-error.log`,
        /**
         * [agentLogName agent 进程日志，框架和使用到 agent 进程执行任务的插件会打印一些日志到这里]
         * @type {[type]}
         */
        agentLogName:`${appInfo.name}-egg-agent.log`
    };
};