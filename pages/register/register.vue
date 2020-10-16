<template>
	<view class='bind-phone'>
		
		<view class="bpa">
			<view class="a-a">
				<view><image src="../../static/images/mine/logo@2x.png"></image></view>
			</view>
			<view class="a-b">
				<view class="title-my">注册</view>
				<view class="myform">
					<view class="myform-name">手机号</view>
					<input type="text" class="input-phone" v-model="form.telephone" placeholder="请输入手机号码"/>
					<view class="myform-name">验证码</view>
					<view class="input-yzm">
						<input type="text" v-model="form.code" class="input-phone" placeholder="请输入验证码"/>
						<view class="yzmBt" @click="getRegisterCode">{{loginCode}}</view>
					</view>
					<view class="myform-name">密码</view>
					<input type="text" class="input-phone" v-model="form.pwd" placeholder="请输入密码"/>
					
					<button class="bt_bind" @click="register">注 册</button>
					
					<view class="to-register">已有账号 <text @click="tobind">绑定微信</text></view>
					<!-- <button class="login_btn btnNoBorder" @click="toIndex()">
						<text class="inline_block">点击进入</text>
					</button> -->
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
					pwd: "",
					wxCode: uni.getStorageSync('wxCode')
				}
			};
		},
		onLoad(option) {
			uni.hideHomeButton()
		},
		methods:{
			tobind() {
				uni.navigateBack()
			},
			getRegisterCode() {
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
			register() {
				if (this.form.telephone.trim() == "") {
					showToast('请输入手机号！');
					return;
				}
				if (this.form.code.trim() == "") {
					showToast('请输入验证码！');
					return;
				}
				if (this.form.pwd.trim() == "") {
					showToast('请输入密码！');
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
								_request(api.bindLogin, this.form).then(res => {
									if(typeof res.resultMap == "string"){
										showToast('res.resultMap');
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
</style>
