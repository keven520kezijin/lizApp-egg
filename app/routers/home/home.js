'use strict';

/**
 * [home的模块功能]
 * @author 	   szjcomo
 * @createTime 2020-08-03
 * @param      {[type]}   app [description]
 * @return     {[type]}       [description]
 */
module.exports = app => {

	const appCtr = app.controller;

	/**
	 * 首页路由
	 */
	app.router.get('/',app.controller.home.home.index);
	app.router.get('/dywx',app.controller.home.home.dywx_send);
	app.router.get('/void_list',app.controller.home.home.void_list);
	/**
	 * [subRouter 命名空间路由]
	 * @type {[type]}
	 */
	const v1Router = app.router.namespace('/v1');
	/*======================用户管理接口=====================*/
	v1Router.get('/user',appCtr.home.users.select);//用户查询
	v1Router.post('/user',appCtr.home.users.register);//用户注册
	v1Router.get('/user/login',appCtr.home.users.login);//用户登录
	v1Router.get('/user/active',appCtr.home.users.active_user);//激活用户访问时间
	v1Router.get('/user/search',appCtr.home.users.user_seach); //获取用户搜索历史记录
	v1Router.post('/user/search',appCtr.home.users.user_seach_video);//用户搜索视频

	/*======================视频标签接口=====================*/
	v1Router.get('/tags',appCtr.home.tags.select);
	v1Router.post('/tags',appCtr.home.tags.create);
	v1Router.put('/tags',appCtr.home.tags.update);
	v1Router.delete('/tags',appCtr.home.tags.delete);
	/*======================视频操作接口=====================*/
	v1Router.post('/video/upload',appCtr.home.video.upload_video);//上传视频
	v1Router.post('/video',appCtr.home.video.publish_video);//发布作品
	v1Router.get('/video',appCtr.home.video.select);//查询作品
	v1Router.delete('/video',appCtr.home.video.delete);//删除作品
	v1Router.get('/video/praise',appCtr.home.videoPraise.user_video_praise);//用户给视频点赞
	v1Router.get('/video/share',appCtr.home.videoShare.user_video_share);//用户分享视频
	v1Router.post('/video/comment',appCtr.home.userComment.create_comment); //用户给视频发表评论
	v1Router.get('/video/comment/praise',appCtr.home.userComment.comment_praise);//用户给评论点赞
	v1Router.get('/video/comment',appCtr.home.userComment.comment_list); //获取视频评论列表
}