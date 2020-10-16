<template>
	<view class="stPage">
		<view class="st_a"></view>
		<view class="st_b">
			<view class="b_header">
				<image :src="Ts_imgUrl != '' ? Ts_imgUrl : '/static/images/question_list.png'"></image>
			</view>
			<view class="items u-skeleton">
				<view class="item" @click="JumpStudy(item.questionId, item.questionName, item.viewUrl)" v-for="(item, index) in study_task" :key="index">
					<view class="item_a">
						<image style="width: 40rpx;height: 40rpx;" src="/static/images/mine/exer.png"></image>
					</view>
					<view class="item_b">
						<view class="name">{{item.questionName}}</view>
					</view>
					<view class="item_c">
						<text>练习</text>
					</view>
				</view>
				
				<view class="more">
					<u-loadmore :status="status" @loadmore="loadmore()" bgColor="#F8F8F8"/>
				</view>
				<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
				<u-gap height="98" bg-color="#F8F8F8"></u-gap>
			</view>
		</view>
		
		<view class="pay_bts"> 
			<text>{{price == 0 ? '免费' : '¥ ' + price}}</text>
			<view :class="!isOrder ? '' : 'ybuy'" @click="btPay">{{!isOrder ? '立即购买' : '已购买'}}</view>
		</view>
	</view>
</template>

<script>
	import { _request, showToast, _pay } from '@/common/js/request.js'
	import api from '@/common/js/api.js';
	import { isEmptyOrNUll, _throttle } from '@/common/js/tools.js'
	export default {
		data() {
			return {
				id: '',
				study_task: [],
				isOrder: false,
				product: '',
				productCode: '',
				status: 'loadmore',
				loading: true,
				mid: 0,
				pageSize: 10,
				Ts_imgUrl: '',
				price: 0
			};
		},
		onPullDownRefresh() {
			this.mid = 0
			this.getQuestionByProductId(2)
		},
		onLoad(opt) {
			this.id = opt.id
			this.product = opt.title
			this.productCode = opt.productCode
			uni.setNavigationBarTitle({
				title: opt.title
			});
			this.getQuestionByProductId()
			this.getProductDetail()
		},
		onShow() {
			if (uni.getStorageSync('token') != '') {
				this.checkApply(1)
			}
		},
		onReachBottom(){
			if(this.status == 'loading' || this.status == 'nomore') return
			this.status = 'loading';
			this.mid += this.pageSize
			this.getQuestionByProductId(1)
		},
		methods:{
			getProductDetail(){
				// 获取产品详情
				_request(api.getProductDetail, {id: this.id}).then(res => {
					let data = res.resultMap
					this.Ts_imgUrl = data.productImgUrl
					this.price = data.productPrice
				})
			},
			loadmore(){
				this.status = 'loading';
				this.mid += this.pageSize
				this.getQuestionByProductId(1)
			},
			JumpStudy(questionId, taskName, sjUrl){
				this.testJump(this, questionId, taskName, sjUrl)
			},
			testJump: _throttle(async (_this, questionId, taskName, sjUrl) =>{
				_this.isOrder = await _this.checkApply()
				if(!_this.isOrder){
					return
				}
				uni.navigateTo({
					url: '/pages/user/make_a_question/make_a_question?questionId=' + questionId + '&taskName=' + taskName + '&url=' + sjUrl
				});
			}, 300),
			getQuestionByProductId(type = 0){
				_request(api.getQuestionByProductId, {productId: this.id, minId: this.mid, pageSize: this.pageSize}).then(res => {
					if(type == 2){
						this.study_task = res.resultMap
						setTimeout(function () {
							uni.stopPullDownRefresh();
						}, 500);
					}else {
						this.study_task = this.study_task.concat(res.resultMap)
					}
					
					this.loading = false;
					if(this.mid + this.pageSize != res.minId) this.status = 'nomore';
					else this.status = 'loadmore';
				})
			},
			async checkApply(type = 0){
				let data = await _request(api.checkApply, {productId: this.id}, 'POST', true, true)
				
				if(data != ""){
					if(data.resultCode == 200 && data.resultMap == "本产品已报名"){
						this.isOrder = true
						return true
					}else{
						if(type != 1){
							this.showModal()
						}
						this.isOrder = false
						return false
					}
				}else{
					if(type != 1){
						this.showModal()
					}
					this.isOrder = false
					return false
				}
			},
			showModal(){
				let content = '未购买"'+ this.product + '"，是否购买?'
				uni.showModal({
				    title: '提示',
				    content: content,
					confirmText: '购买',
					cancelText: '在看看',
				    success: res => {
				        if (res.confirm) {
							this.toPay(this)
				        } else if (res.cancel) {
				            
				        }
				    }
				});
			},
			btPay(){
				if(this.isOrder){
					return
				}
				this.toPay(this)
			},
			toPay: _throttle(async _this => {
				let data = await _request(api.launchApply, {productCode: _this.productCode}, 'POST', true, true)
				if(data != "" && data.resultCode == '200'){
					data = data.resultMap
					if(data.tradePrice != 0){
						let tradeNo = data.tradeNo
						_pay(tradeNo).then(payData => {
							// _this.getQuestionByProductId(2)
						})
					}else{
						let tradeNo = data.tradeNo
						let kid = data.kid
						let zerodata = await _request(api.confirm_order, {tradeNo, kid}, 'POST', true, true)
						if(zerodata != "" && zerodata.resultCode == 200 && zerodata.resultMap){
							uni.showToast({
								title: '支付成功',
								icon: 'none'
							})
						}else{
							uni.showToast({
								title: '支付失败，err'+ Jzerodata.resultMap,
								icon: 'none'
							})
						}
					}
					
				}else if(data != "" && data.resultCode == '500'){
					uni.showToast({
						title: data.resultMsg,
						icon: 'none'
					})
				}
			}, 300)
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
</style>

<style lang="scss">
	.stPage{
		width: 100%;
		.st_b{
			.b_header{
				image{
					width: 100%;
					height: 100%;
				}
			}
			.items{
				.item{
					display: flex;
					justify-content: space-between;
					padding: 24rpx 28rpx;
					margin: 20rpx 24rpx;
					background-color: #FFFFFF;
					border-radius: 20rpx;
				}
				.item_a{
					width: 60rpx;
					image{
						width: 40rpx;
						border-radius: 10rpx;
						display: block;
						margin: 0 auto;
					}
				}
				.item_b{
					flex: 1;
					display: flex;
					flex-direction: column;
					width: 50%;
					margin-left: 30rpx;
					justify-content: space-between;
					.name{
						width: 100%;
						font-weight: 600;
						font-size: 28rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						color: #282828;
					}
				}
				.item_c{
					display: flex;
					align-items: center;
					color: #57A89D;
					text{
						font-size: 24rpx;
					}
				}
			}
		}
	}
	.pay_bts{
		position: fixed;
		width: 100%;
		height: 98rpx;
		bottom: 0;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		padding-left: 52rpx;
		padding-right: 8rpx;
		justify-content: space-between;
		text{
			color: #F47979;
			font-size: 32rpx;
			font-weight: 600;
		}
		view{
			padding: 16rpx 56rpx;
			background-color: #57A89D;
			color: #FFF;
			border-radius: 50rpx;
			font-size: 32rpx;
			&.ybuy{
				background-color: #b5b5b5;
			}
		}
	}
	.more{
		padding: 20upx 0;
	}
</style>
