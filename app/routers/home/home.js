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
	app.router.get('/upload_all',app.controller.home.home.upload_all);
	/**
	 * [subRouter 命名空间路由]
	 * @type {[type]}
	 */
	const v1Router = app.router.namespace('/v1');
	/*======================用户管理接口=====================*/
	v1Router.get('/user',appCtr.home.users.select);//用户查询
	v1Router.post('/user',appCtr.home.users.register);//用户注册
	v1Router.post('/user/rela',app.middleware.authToken(),appCtr.home.users.create_rela_user);//添加用户实名认证资料
	v1Router.put('/user/rela',app.middleware.authToken(),appCtr.home.users.update_rela_user);//更新用户实名认证信息
	v1Router.get('/user/login',appCtr.home.users.login);//用户登录
	v1Router.get('/user/active',app.middleware.authToken(),appCtr.home.users.active_user);//激活用户访问时间
	v1Router.get('/user/search',app.middleware.authToken(),appCtr.home.users.user_seach); //获取用户搜索历史记录
	v1Router.post('/user/search',app.middleware.authToken(),appCtr.home.users.user_seach_video);//用户搜索视频
	v1Router.get('/user/money_log',app.middleware.authToken(),appCtr.home.users.user_money_log_list);//获取用户资金明细
	v1Router.get('/user/gratuity_log',app.middleware.authToken(),appCtr.home.users.user_gratuity_list); //获取打赏我的记录
	v1Router.post('/user/photo',app.middleware.authToken(),appCtr.home.users.add_rela_user_photo);//添加用户的相册资质
	v1Router.delete('/user/photo',app.middleware.authToken(),appCtr.home.users.delete_rela_user_photo);//删除用户的相册资质

	/*======================视频标签接口=====================*/
	v1Router.get('/tags',appCtr.home.tags.select);
	v1Router.post('/tags',appCtr.home.tags.create);
	v1Router.put('/tags',appCtr.home.tags.update);
	v1Router.delete('/tags',appCtr.home.tags.delete);
	/*======================视频操作接口=====================*/
	v1Router.post('/video/upload',appCtr.home.video.upload_video);//上传视频
	v1Router.post('/video/upload/image',appCtr.home.video.upload_image);//上传视频封面图片
	v1Router.post('/video',app.middleware.authToken(),appCtr.home.video.publish_video);//发布作品
	v1Router.get('/video',appCtr.home.video.select);//查询作品
	v1Router.delete('/video',app.middleware.authToken(),appCtr.home.video.delete);//删除作品
	v1Router.put('/video',app.middleware.authToken(),appCtr.home.video.update);//更新作品
	v1Router.get('/video/praise',app.middleware.authToken(),appCtr.home.videoPraise.user_video_praise);//用户给视频点赞
	v1Router.get('/video/share',app.middleware.authToken(),appCtr.home.videoShare.user_video_share);//用户分享视频
	v1Router.post('/video/comment',app.middleware.authToken(),appCtr.home.userComment.create_comment); //用户给视频发表评论
	v1Router.get('/video/comment/praise',app.middleware.authToken(),appCtr.home.userComment.comment_praise);//用户给评论点赞
	v1Router.get('/video/comment',appCtr.home.userComment.comment_list); //获取视频评论列表
	/*=====================支付下单操作接口=====================*/
	v1Router.post('/wxpay/gratuity',app.middleware.authToken(),appCtr.home.wxpay.gratuity);   			 //用户打赏操作接口
	v1Router.get('/wxpay/video',app.middleware.authToken(),appCtr.home.wxpay.order_video);   			 //用户购买视频下单接口
	v1Router.get('/wxpay/find',app.middleware.authToken(),appCtr.home.wxpay.find_wxpay_result); 		 //查询用户是否真正的支付成功
	v1Router.post('/wxpay/callback',appCtr.home.wxpay.payCallback); 		 							 //微信支付回调
}