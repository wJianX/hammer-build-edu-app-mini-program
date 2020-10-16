const showToast = (message) => {
	setTimeout(() => {
		uni.showToast({ title: message, duration: 1000, icon: 'none' });
	}, 0)
}

const delay = (func, time) => {
	setTimeout(() => { if (func != null) func(); }, time);
}

const _request = (url, data, method = 'POST', Loading = true, JumpTost = false) => {
	for (let k in data) {
		if (url.indexOf("{" + k + "}") != -1) {
			url = url.replace("{" + k + "}", data[k] + "");
		}
	}
	if(Loading){
		uni.showLoading({ title: "加载中", mask: true });
	}
	let header = {
		'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8", //此处如果使用application/json 会遇到post发送参数失败的问题
		'token': uni.getStorageSync('token')
	};
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method,
			header,
			data,
			success(res) {
				if(Loading){
					uni.hideLoading();
				}
				if(method == "GET"){
					resolve(res.data)
					return
				}
				if (res.data.resultCode == 401) {
					uni.clearStorageSync();
					showToast('请登录')
					uni.switchTab({
						url: "/pages/tabBar/user/user"
					});
					return
				}
				if(method == "POST"){
					if (res.data.resultCode == 500) {
						if(!JumpTost){
							setTimeout(() => { uni.showToast({ title: res.data.resultMsg + "", icon: "none", duration: 2000 }) }, 0)
						}else{
							resolve(res.data)
						}
					}
				}
				if (res.data.resultCode == 200) {
					resolve(res.data)
				}
				if (res.data.resultCode == null) {
					reject(res.data)
				}
			},
			fail(err) {
				if(Loading){
					uni.hideLoading();
				}
				console.error(err)
				showToast(JSON.stringify(err))
			},
			complete() {
				//	console.log(url + "请求结束");
			}
		});
	})
}

/**
 * 统一支付函数
 * 
 * */
import api from '@/common/js/api.js';
function _pay(tradeNo, isApp = false){
	return new Promise((resolve, reject) => {
		uni.login({
			success: async wxres => {
				uni.showLoading({ title: "下订单中...", mask: true });
				let wxdata = await _request(api.weXin, {tradeNo, wxCode: wxres.code}, 'POST', false)
				uni.hideLoading();
				if(wxdata != "" && wxdata.resultCode == '200'){
					wxdata = wxdata.resultMap
					if(Object.prototype.toString.call(wxdata) !== '[object Object]'){
						showToast(wxdata)
						return
					}
					uni.requestPayment({
					    provider: 'wxpay',
					    timeStamp: wxdata.timeStamp,
					    nonceStr: wxdata.nonceStr,
					    package: wxdata.package,
					    signType: wxdata.signType,
					    paySign: wxdata.paySign,
					    success(res) {
							uni.navigateTo({
								url:'/pages/user/payoff/payoff?tradeNo=' + tradeNo + '&isApp=' + isApp 
							})
							resolve(res)
					    },
					    fail(err) {
							console.error(JSON.stringify(err))
							if(err.errMsg == "requestPayment:fail cancel"){
								showToast('取消支付')
							}else{
								uni.showToast({
									title: '支付失败，err'+ JSON.stringify(err),
									icon: 'none'
								})
							}
							
					    }
					});
				}else{
					showToast(wxdata.resultMap)
				}
			}
		})
	})
}

function _getWxCode() {
	return new Promise((resolve, reject) => {
		uni.login({
			success(wxres){
				resolve(wxres.code)
			}
		})
	})
}

function _getUserInfo() {
	return new Promise((resolve, reject) => {
		uni.getUserInfo({
			provider: 'weixin',
			success(infoRes) {
				resolve({encryptedData: infoRes.encryptedData, iv: infoRes.iv})
			}
		})
	})
}

/**
 * 统一登录接口
 * 
 * */
 function _login(_from){
	return new Promise((resolve, reject)=>{
		let isCanUse = uni.getStorageSync('isCanUse')
		if(isCanUse){
			uni.login({
				success: res => {
					uni.setStorageSync('wxCode', res.code)
					uni.getUserInfo({
						provider: 'weixin',
						success: infoRes => {
							console.log(infoRes)
							_request(api.getToken, { wxCode: res.code, encryptedData: infoRes.encryptedData, iv: infoRes.iv } ).then(data => {
								// console.log(data)
								if(typeof data.resultMap == "string"){
									if(_from == 'app'){
										uni.removeStorageSync('token')
										uni.removeStorageSync('userInfo')
										uni.removeStorageSync('wxUserInfo')
									}else if(_from == 'user'){
										uni.navigateTo({
											url: '/pages/login/login'
										});
									}
								}else{
									uni.setStorageSync('wxUserInfo', JSON.stringify(infoRes.userInfo))
									uni.setStorageSync('token', data.resultMap.token)
									uni.setStorageSync('userInfo', JSON.stringify(data.resultMap))
									resolve()
								}
							})
						}
					})
					
				}
			})
		}else{
			if(_from == 'app'){
				uni.removeStorageSync('token')
				uni.removeStorageSync('userInfo')
				uni.removeStorageSync('wxUserInfo')
			}else if(_from == 'user'){
				uni.navigateTo({
				    url: '/pages/login/wxLogin'
				});
			}
			
		}
	})
}

module.exports = {
	showToast,
	delay,
	_request,
	_pay,
	_getWxCode,
	_getUserInfo,
	_login
}
