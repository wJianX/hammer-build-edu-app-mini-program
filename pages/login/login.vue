<template>
	<view class='bind-phone'>
		<view class="bpa">
			<view class="a-a">
				<view><image src="../../static/images/mine/logo@2x.png"></image></view>
			</view>
			<view class="a-b">
				<view class="title-my">绑定账号</view>
				<view class="myform">
					<view class="myform-name">手机号</view>
					<input type="text" class="input-phone" v-model="form.telephone" placeholder="请输入手机号码"/>
					<view class="myform-name">验证码</view>
					<view class="input-yzm">
						<input type="text" v-model="form.code" class="input-phone" placeholder="请输入验证码"/>
						<view class="yzmBt" @click="getLoginCode">{{loginCode}}</view>
					</view>
					<button class="bt_bind" @click="login">绑 定</button>
					<view class="to-register">新用户 <text @click="register">注册</text></view>
				</view>
			</view>
			
		</view>
	</view>

</template>

<script>
	import { _request, showToast, delay } from '@/common/js/request.js';
	import { _publicJumpTab } from '@/common/js/tools.js'
	import api from '@/common/js/api.js'
	export default {
		data() {
			return {
				loginCode: "获取验证码",
				disabled: false,
				form: {
					telephone: "",
					code: "",
					v_token: "",
					wxCode: uni.getStorageSync('wxCode')
				},
				redirect: ''
			}
		},
		onLoad(option) {
			this.redirect = option.redirect
		},
		methods: {
			register(){
				uni.navigateTo({
					url: '../register/register'
				})
			},
			toIndex: function() {
				uni.switchTab({
					url: "/pages/tabBar/home/home"
				});
			},
			getLoginCode() {
				if(this.disabled){
					return
				}
				if (this.form.telephone.trim() == "") {
					showToast('请输入手机号！');
					return;
				}
				_request(api.getVerifyCodeLogin, {telephone: this.form.telephone}).then(res => {
					console.log(res)
					this.form.v_token = res.resultMap;
					this.setInter();
				})
			},
			setInter() {
				var countDown = 60;
				this.disabled = true;
				this.loginCode = "短信已发送（" + countDown + "）";
				var timer = setInterval( ()=> {
					countDown--;
					this.loginCode = "短信已发送（" + countDown + "）";
					if (countDown < 1) {
						clearInterval(timer);
						this.loginCode = "获取验证码";
						this.disabled = false;
					}
				}, 1000);
			},
			login: function() {
				this.toLogin();
			},
			toLogin() {
				var that = this;
				if (this.form.telephone.trim() == "") {
					showToast('请输入手机号！');
					return;
				}
				if (this.form.code.trim() == "") {
					showToast('请输入验证码！');
					return;
				}
				// _publicJumpTab('/pages/tabBar/home/home')
				// return
				uni.login({
					success: res => {
						this.form.wxCode = res.code
						
						uni.getUserInfo({
							provider: 'weixin',
							success: infoRes => {
								this.form.encryptedData = infoRes.encryptedData
								this.form.iv = infoRes.iv
								_request(api.bindLogin, this.form, 'POST', true, true).then(res => {
									if(typeof res.resultMsg == "string"){
										console.log(res.resultMap)
										if(res.resultMsg == "该手机号已被注册"){
											showToast('该账户已绑定其他微信号');
										}else{
											showToast(res.resultMsg);
										}
									}else{
										uni.setStorageSync('wxUserInfo', JSON.stringify(infoRes.userInfo))
										uni.setStorageSync('token', res.resultMap.token);
										uni.setStorageSync('userInfo', JSON.stringify(res.resultMap));
										delay(() => {
											_publicJumpTab('/pages/tabBar/home/home')
										}, 1000);
									}
									
								}).catch(err => {
									
								})
								
							}
						})
						
					}
				});
				
			}
		}
	}
</script>

<style>
	page{
		background-color: #57A89D;
	}
	/* base.css */
	.bpa{
		top: calc(50% - var(--status-bar-height) - 20px);
	}
</style>
