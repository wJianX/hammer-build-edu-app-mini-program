<template>
	<view class="my">
		<view class="st_a"></view>
		<view class="st_b">
			<u-toast ref="uToast" />
			<view class="b_header">
				<view>
					<image :src="wxUserInfo.avatarUrl == null ? '/static/images/mine/mineTou.png' : wxUserInfo.avatarUrl"></image> 
					<text v-if="isEmptyOrNUll(token)">Hi，{{ wxUserInfo.nickName }}</text>
					<text v-else @click="login">点击登录</text>
				</view>
			</view>
			<view class="mineItems">
				<view class="m-item" @click="orderList(1)">
					<view class="a">
						<image class="mineVersionImg" src="/static/images/mine/myOrder.png"></image>
						<text class="mineItemText">我的订单</text>
					</view>
					<view class="b"><image src="/static/images/mine/right.png"></image></view>
				</view>
				<view class="m-item" @click="orderList(2)">
					<view class="a">
						<image class="mineVersionImg" src="/static/images/mine/genghuanshoujihao-copy.png"></image>
						<text class="mineItemText">更换手机号</text>
					</view>
					<view class="b"><image src="/static/images/mine/right.png"></image></view>
				</view>
				<view class="m-item" @click="orderList(3)">
					<view class="a">
						<image class="mineVersionImg" src="/static/images/mine/Feedback.png"></image>
						<text class="mineItemText">意见反馈</text>
					</view>
					<view class="b"><image src="/static/images/mine/right.png"></image></view>
				</view>
				<view class="m-item" @click="deletBind">
					<view class="a">
						<image class="mineVersionImg" src="/static/images/mine/Artboard.png"></image>
						<text class="mineItemText">解除绑定</text>
					</view>
					<view class="b"><image src="/static/images/mine/right.png"></image></view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import { _request, showToast, delay, _getWxCode, _getUserInfo, _login } from '@/common/js/request.js'
import api from '@/common/js/api.js'
import { isEmptyOrNUll } from '@/common/js/tools.js'
export default {
	data() {
		return {
			version: '1.0.0',
			wxUserInfo: {},// uni.getStorageSync('wxUserInfo')
			token: ''
		};
	},
	onShow: function() {
		this.wxUserInfo = uni.getStorageSync('wxUserInfo') != "" ? JSON.parse(uni.getStorageSync('wxUserInfo')) : ""
		this.token = uni.getStorageSync('token')
	},
	onLoad: function() {
	},
	methods: {
		login(){
			_login('user').then(res => {
				this.wxUserInfo = uni.getStorageSync('wxUserInfo') != "" ? JSON.parse(uni.getStorageSync('wxUserInfo')) : ""
			})
		},
		isEmptyOrNUll(data) {
			return !isEmptyOrNUll(data);
		},
		orderList(num) {
			if (this.token != '') {
				let url = '';
				switch(num){
					case 1:
						// 我的订单
						url = '/pages/user/orderList/orderList';
						break;
					case 2:
						// 更换手机号
						url = '../../user/replace_phone/replace_phone'
						break;
					case 3:
						// 意见反馈 
						url = '../../user/feedback/feedback'
						break;
				}
				uni.navigateTo({
					url: url,
					animationType: ['zoom-fade-out', 'fade-in', 'slide-in-top', 'slide-in-bottom', 'zoom-out'][Math.floor(Math.random() * 5)]
				});
			} else {
				this.$refs.uToast.show({
					title: '未登录',
					type: 'error',
					icon: false
				})
			}
		},
		getMyInfo() {
			_request(api.uniGetUserInfo, {}).then(res => {
				this.user = res.resultMap;
			})
		},
		loginOut() {
			uni.clearStorageSync();
			this.backLogin();
		},
		backLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			});
		},
		deletBind(){
			if (this.token == '') {
				this.$refs.uToast.show({
					title: '未登录',
					type: 'error',
					icon: false
				})
				return
			}
			uni.showModal({
				title: '提示',
				content: '是否解除微信与账号的绑定',
				confirmText: '解除',
				confirmColor: '#ff0000',
				success: async showModalres => {
				    if (showModalres.confirm) {
						let wxCode = await _getWxCode()
						let data = await _getUserInfo()
						data.wxCode = wxCode
						let res = await _request(api.unbind, data)
						showToast(res.resultMap)
						if(res.resultCode == 200){
							this.loginOut()
						}
				    } else if (showModalres.cancel) {
						
				    }
				}
			})
		}
	}
};
</script> 
<style>
	page{
		background-color: #F8F8F8;
	}
</style>
<style scoped>
	.st_a{
		height: 230rpx;
		background-color: #57A89D;
	}
	.st_b{
		background-color: #F8F8F8;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		margin-top: -60rpx;
		min-height: 200rpx;
		position: relative;
		padding-top: 105rpx;
		width: 100%;
	}
	.b_header{
		position: absolute;
		width: 702rpx;
		top: -140rpx;
		left: 24rpx;
		background-color: #FFFFFF;
		height: 200rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 60rpx;
		padding-right: 60rpx;
	}
	
	.b_header>view{
		display: flex;
		align-items: center;
	}
	.b_header>view image{
		width: 100rpx;
		height: 100rpx;
		border: 2rpx dashed #d0d0d0;
	}
	.b_header>view>text{
		font-size: 38upx;
		font-weight: 500;
		margin-left: 50upx;
	}
	.mineItems{
		background-color: #FFF;
		padding: 0 30rpx;
		border-radius: 20rpx;
		margin: 0 24rpx;
	}
	.mineItems>view{
		border-bottom: 1upx solid rgb(238, 238, 238);
	}
	.mineItems>view:last-child{
		border: none;
	}
	.mineVersionImg {
		width: 35rpx;
		height: 37rpx;
		margin-right: 20upx;
	}
	.m-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28upx 10upx;
	}
	.m-item .a {
		display: flex;
		align-items: center;
	}
	.m-item .b{
		display: flex;
		align-items: center;
	}
	.m-item .b image{
		width: 32rpx;
		height: 32rpx;
	}
</style>