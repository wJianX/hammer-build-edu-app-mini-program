<template>
	<view class="feedBack">
		<view class="ppBack"></view>
		<view class="ppContent">
			<u-input v-model="form.text" type="textarea" :clearable='false' border='true' border-color="#57A89D" placeholder="请输入您反馈的内容" height="350" />
			<view class="u-demo-area">
				<u-toast ref="uToast"></u-toast>
				<view class="pre-box" v-if="!showUploadList">
					<view class="pre-item" v-for="(item, index) in lists" :key="index">
						<image class="pre-item-image" :src="item.url" mode="aspectFill"></image>
						<view class="u-delete-icon" @tap.stop="deleteItem(index)">
							<u-icon name="close" size="20" color="#ffffff"></u-icon>
						</view>
						<u-line-progress v-if="item.progress > 0 && !item.error" :show-percent="false" height="16" class="u-progress"
						 :percent="item.progress"></u-line-progress>
					</view>
				</view>
				<u-upload ref="uUpload" :custom-btn="customBtn" :size-type="['compressed']" @on-remove="onremove" @on-choose-complete="choosecomplete" :show-upload-list="showUploadList" :action="action" :auto-upload="autoUpload" :file-list="fileList" :deletable="deletable" :max-count="maxCount" @on-list-change="onListChange">
					<view v-if="customBtn" slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
						<u-icon name="photo" size="60" :color="$u.color['lightColor']"></u-icon>
					</view>
				</u-upload>
				
				<helang-compress ref="helangCompress"></helang-compress>
			</view>
			<view class="form">
				<view class="input-yzm">
					<u-input v-model="form.code" :clearable='false' border='true' border-color="#57A89D" placeholder="请输入验证码"/>
					<!-- <input type="text" v-model="form.code" class="input-phone" placeholder="请输入验证码"/> -->
					<view class="yzmBt" @click="getFeedBackCode">{{loginCode}}</view>
				</view>
			</view>
			
			<view class="fb_bt">
				<u-button type="primary" @click="fbSbmit">提 交</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { _request, showToast, delay } from '@/common/js/request.js';
	import api from '@/common/js/api.js'
	import helangCompress from '@/components/helang-compress/helang-compress';
	// import lrz from '@/common/js/lrz.all.bundle.js'
	export default {
		components: {
			helangCompress
		},
		data() {
			return {
				loginCode: "获取验证码",
				form: {
					code: "",
					v_token: "",
					text: "",
					picture: ""
				},
				disabled: false,
				action: 'http://www.tp5.com',
				// 预置上传列表
				fileList: [],
				showUploadList: true,
				customBtn: false,
				autoUpload: false,
				deletable: true,
				maxCount: 1,
				lists: [], // 组件内部的文件列表
			};
		},
		methods: {
			getFeedBackCode() {
				if(this.disabled){
					return
				}
				_request(api.getVerifyCodeFeedBack, {}).then(res => {
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
			deleteItem(index) {
				this.$refs.uUpload.remove(index);
			},
			onListChange(lists) {
				// console.log('onListChange', lists);
				this.lists = lists;
			},
			onremove(index, lists, name){
				// 移除图片时触发
				this.form.picture = ""
			},
			fbSbmit(){
				if (this.form.text.trim() == "" && this.form.picture.trim() == "") {
					showToast('内容或图片必须选填一个！');
					return;
				}
				if (this.form.code.trim() == "") {
					showToast('请输入验证码！');
					return;
				}
				console.log(this.form)
				_request(api.feedback, this.form).then(res => {
					showToast('反馈成功！');
					this.form = {
						code: "",
						v_token: "",
						text: "",
						picture: ""
					}
					uni.navigateBack()
				})
			},
			choosecomplete(lists, name){
				let _this = this
				lists.forEach(async (item, index) => {
					let data = await this.$refs.helangCompress.compress({
						src:item.url,
						maxSize:800,
						fileType:'jpg',
						quality:0.85
					})
					
					uni.getFileSystemManager().readFile({
						filePath: data, //选择图片返回的相对路径
						encoding: 'base64', //编码格式
						success: res => { //成功的回调
							console.log(res);
							this.form.picture = res.data
							//let base64 = 'data:image/jpeg;base64,' + res.data //不加上这串字符，在页面无法显示的哦
						},fail: (e) => {
							console.log("图片转换失败");
						}
					})
				})
			}
		}
	}
</script>
<style>
	page{
		background-color: #F8F8F8;
	}
</style>

<style lang="scss" scoped>
	.ppContent{
		padding: 30rpx 40rpx;
		box-sizing: border-box;
	}
	.u-demo-area{
		margin-top: 10rpx;
	}
	.pre-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.u-progress {
		position: absolute;
		bottom: 10rpx;
		left: 8rpx;
		right: 8rpx;
		z-index: 9;
		width: auto;
	}
	.form{
		margin: 30rpx 0;
	}
	.fb_bt{
		margin-top: 60rpx;
	}
</style>
