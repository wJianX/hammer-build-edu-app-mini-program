var api = new function() {
	const uniAppUrl = 'https://map.xclearn.com/build_edu_app_api'
	// const uniAppUrl = 'http://192.168.1.69:8084'
	this.uniUrl = "https://map.xclearn.com/hdf?q=";  //获取请求地址
	this.uniLogin = uniAppUrl + "/user/login/{userName}";  // uniapp 登录
	this.getTasks = uniAppUrl + "/appTask/getTasks";  // 获取任务列表
	this.getQuestionJson = uniAppUrl + "/question/getQuestionJson/{qid}" //获取json
	this.submitRecord = uniAppUrl + "/question/submitRecord"  // 提交试卷
	
	this.getVerify = uniAppUrl + "/verifyCode/generateVerifyCode"  // 获取验证码
	
	this.getVerifyCodeLogin = uniAppUrl + "/verifyCode/getVerifyCodeLogin/{telephone}"  // 获取登录时的 手机验证码
	this.getVerifyCodeRegister = uniAppUrl + "/verifyCode/getVerifyCodeRegister/{telephone}"  // 获取注册时的 手机验证码
	this.getVerifyCodeChangeTelephone = uniAppUrl + "/verifyCode/getVerifyCodeChangeTelephone/{telephone}"  //更换手机号 手机验证码
	this.getVerifyCodeFeedBack = uniAppUrl + "/verifyCode/getVerifyCodeFeedBack" //意见反馈获取验证码
	
	this.bindLogin = uniAppUrl + "/miniUser/bindLogin/{wxCode}/{telephone}"  // 绑定用户
	this.getToken = uniAppUrl + "/miniUser/getToken/{wxCode}"  //
	
	this.getAllProject = uniAppUrl + "/appProjectApi/getAllProject" //获取项目
	this.getProductByProjectCode = uniAppUrl + "/productApi/getProductByProjectCode/{projectCode}"  //获取子项目
	this.getQuestionByProductId = uniAppUrl + "/question/getQuestionByProductId/{productId}"   //获取子项目下试题
	this.checkApply = uniAppUrl + "/trade/checkApply/{productId}"   //查询是否购买当前子项目
	this.selectNoPay = uniAppUrl + "/trade/selectPayList"   //查询订单
	this.launchApply = uniAppUrl + "/trade/launchApply/{productCode}"  //下订单
	this.weXin = uniAppUrl + "/pay/weXin/{tradeNo}/{wxCode}" // 下订单
	this.confirm_order = uniAppUrl + "/pay/confirm_order/{kid}/{tradeNo}"  // 0元购买
	this.pay = uniAppUrl + "/pay/jhWx/{tradeNo}"
	this.cancelOrder = uniAppUrl + "/trade/cancelOrder/{tradeNo}"  // 删除
	this.applyRefund = uniAppUrl + "/refund/applyRefund/{tradeNo}"  // 申请退款
	this.cancelApplyRefund = uniAppUrl + "/refund/cancelApplyRefund/{tradeNo}" //取消申请退款
	this.flow_order = uniAppUrl + "/pay/flow_order/{tradeNo}"  //查询支付情况
	this.unbind = uniAppUrl + "/miniUser/unbind/{wxCode}"  //解除绑定
	this.newList = uniAppUrl + "/news/newList"  //banner
	this.newDetail = uniAppUrl + "/news/newDetail/{id}"  //新闻详情
	this.changeTelephone = uniAppUrl + "/appUser/changeTelephone"   //更换手机号
	this.feedback = uniAppUrl + "/appUser/feedback"
	this.getProductDetail = uniAppUrl + "/productApi/getProductDetail/{id}" //获取产品详情
	this.getQuestionUrl = uniAppUrl + "/question/getQuestionUrl"//试卷url解密
}

module.exports = api