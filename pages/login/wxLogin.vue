<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isCanUse">
			<view>
				<view class="header"><image src="../../static/wx_login.png"></image></view>
				<view class="content">
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>

				<button class="bottom" type="primary" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">授权登录</button>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import { _request, showToast } from '@/common/js/request.js'
import api from '@/common/js/api.js';
import { _publicJumpTab } from '@/common/js/tools.js'
export default {
	data() {
		return {
			nickName: null,
			avatarUrl: null,
			wxCode: '',
			isCanUse: uni.getStorageSync('isCanUse') //默认为true
		}; 
	},
	onLoad() {
		//默认加载
		uni.hideHomeButton()
		this.login();
		// uni.removeStorageSync('token')
	},
	methods: {
		//第一授权获取用户信息===》按钮触发
		wxGetUserInfo() {
			uni.getUserInfo({
				provider: 'weixin',
				success: infoRes => {
					try {
						uni.setStorageSync('isCanUse', true); //记录是否第一次授权  false:表示不是第一次授权
						_request(api.getToken, { wxCode: this.wxCode, encryptedData: infoRes.encryptedData, iv: infoRes.iv }).then(data => {
							if(typeof data.resultMap == "string"){
								uni.redirectTo({
								    url: '/pages/login/login'
								});
							}else{
								uni.setStorageSync('wxUserInfo', JSON.stringify(infoRes.userInfo))
								uni.setStorageSync('token', data.resultMap.token)
								uni.setStorageSync('userInfo', JSON.stringify(data.resultMap))
								uni.switchTab({
									url: "/pages/tabBar/home/home"
								});
							}
						});
					} catch (e) {
						console.error(e)
					}
				},
				fail(res) {
					console.log(res)
				}
			});
		}, 
		//登录
		login() {
			uni.login({
				success: res => {
					console.log(res)
					uni.setStorageSync('wxCode', res.code)
					this.wxCode = res.code
				},
				fail(res) {
					console.log(res)
				}
			});
		}
	}
};
</script>

<style>
.header {
	margin: 90rpx 0 90rpx 50rpx;
	border-bottom: 1px solid #ccc;
	text-align: center;
	width: 650rpx;
	height: 300rpx;
	line-height: 450rpx;
}

.header image {
	width: 200rpx;
	height: 200rpx;
}

.content {
	margin-left: 50rpx;
	margin-bottom: 90rpx;
}

.content text {
	display: block;
	color: #9d9d9d;
	margin-top: 40rpx;
}

.bottom {
	border-radius: 80rpx;
	margin: 70rpx 50rpx;
	font-size: 35rpx;
}
</style>
