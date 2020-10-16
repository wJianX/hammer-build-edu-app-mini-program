<template>
	<view class="u-skeleton">
		<view class="st_a"></view>
		<view class="st_b">
			<view class="b_header">
				<u-swiper :list="swiperList" @click="clickSwiper" name="imgUrl" height="288"></u-swiper>
			</view>
		</view>
		
		<view>
			<view class="myItems" @click="testJump(item.id, item.productName, item.productCode)" v-for="(item, index) in study_task" :key="index" v-if="isEmptyOrNUll(study_task)">
				<view class="item_a">
					<image style="width: 40rpx;height: 40rpx;" :src="items.projectCode == 'slry' ? '/static/images/mine/cert3.png' : '/static/images/mine/cert8.png'"></image>
				</view>
				<view class="item_b">
					<view class="name">{{item.productName}}</view>
					<view class="center">
						<view class="details">
							<view class="detail">{{item.introduce}}</view>
						</view>
						<!-- <view class="price">{{item.productPrice == 0 ? "免费" : "¥ " + item.productPrice}}</view> -->
					</view>
					
					<!-- <view class="peples">
						<text></text>
						<text class="tov">有效期30天</text>
					</view> -->
				</view>
				<view class="item_c">
					<view class="price">{{item.productPrice == 0 ? "免费" : "¥ " + item.productPrice}}</view>
					<text class="tov">有效期30天</text>
				</view>
			</view>
			<view class="more">
				<u-loadmore :status="status" @loadmore="loadmore()" bgColor="#F8F8F8"/>
			</view>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import { _request, showToast, _pay } from '@/common/js/request.js'
	import api from '@/common/js/api.js';
	import { isEmptyOrNUll, _publicJump } from '@/common/js/tools.js'
	
	import hrPullLoad from '@/components/hr-pull-load/hr-pull-load.vue'
	export default {
		components: { hrPullLoad },
		data() {
			return {
				study_task: [],
				swiperList: [],
				status: 'loadmore',
				loading: true,
				mid: 0,
				pageSize: 10
			};
		},
		onLoad() {
			this.newList();
			this.getPlatfrom();
		},
		onShareAppMessage() {},
		onShareTimeline() {},
		onShow() {
			if (uni.getStorageSync('token') != '') {
				this.selectNoPay();
			}
		},
		onPullDownRefresh() {
			this.mid = 0
			this.newList();
			this.getProductByProjectCode(2)
		},
		onReachBottom(){
			if(this.status == 'loading' || this.status == 'nomore') return
			this.status = 'loading';
			this.mid += this.pageSize
			this.getProductByProjectCode(1)
		},
		methods: {
			loadmore(){
				this.status = 'loading';
				this.mid += this.pageSize
				this.getProductByProjectCode(1)
			},
			newList(){
				_request(api.newList, {}, 'POST', true, true).then(res => {
					this.swiperList = res.resultMap
				})
			},
			clickSwiper(index){
				console.log(index)
				let id = this.swiperList[index].id
				uni.navigateTo({
					url: '../../home/newDetail/newDetail?id=' + id
				})
			},
			selectNoPay(){
				_request(api.selectNoPay, {status: '0'}, 'POST', true, true).then(res => {
					if(res != "" && res.resultCode == 200){
						let selectNoPayData = res.resultMap[0]
						uni.showModal({
						    title: '提示',
						    content: '您有未支付订单，是否前往管理？',
							confirmText: '前往管理',
							cancelText: '稍后',
						    success: showModalres => {
						        if (showModalres.confirm) {
									// _pay(selectNoPayData.tradeNo).then(payData => {})
									uni.navigateTo({
										url: '/pages/user/orderList/orderList'
									})
						        } else if (showModalres.cancel) {
									
						        }
						    }
						});
					}
				})
			},
			isEmptyOrNUll(data) {
				return !isEmptyOrNUll(data);
			},
			testJump(id, title, productCode){
				
				uni.navigateTo({
					url: '/pages/home/study_task/study_task?id=' + id + '&title=' + title + '&productCode=' + productCode
				})
			},
			// 页面数据
			getPlatfrom() {
				this.getProductByProjectCode()
			},
			getProductByProjectCode(type = 0){
				
				_request(api.getProductByProjectCode, {projectCode: 'xcgwry', minId: this.mid, pageSize: this.pageSize}).then(res => {
					if(type == 2){
						this.study_task = res.resultMap
						setTimeout(function () {
							uni.stopPullDownRefresh();
						}, 500);
					}else{
						this.study_task = this.study_task.concat(res.resultMap)
					}
					this.loading = false;
					if(this.mid + this.pageSize != res.minId) this.status = 'nomore';
					else this.status = 'loadmore';
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
<style lang="scss" scoped>
	.myItems{
		display: flex;
		justify-content: space-between;
		padding: 24rpx 28rpx;
		margin: 20rpx 24rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		
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
				margin-bottom: 24.32rpx;
				color: #282828;
			}
			.details{
				display: flex;
				justify-content: start;
				margin-bottom: 8rpx;
				.detail{
					margin-right: 16rpx;
					font-size: 24rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					padding: 8rpx 16rpx;
					border-radius: 6rpx;
					background-color: #E3F0EE;
					color: #464646;
				}
			}
			.center{
				display: flex;
				justify-content: space-between;
				.price{
					color: #FB8884;
					font-size: 32rpx;
					font-weight: 600;
				}
			}
			.peples{
				flex: 1;
				display: flex;
				justify-content: space-between;
				font-size: 22rpx;
				color: #838383;
				.tov{
					color: #FB8884;
				}
			}
		}
		.item_c{
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: #57A89D;
			font-size: 28rpx;
			font-weight: 600;
			align-items: flex-end;
			.price{
				color: #FB8884;
				font-size: 32rpx;
				font-weight: 600;
				margin-bottom: 10rpx;
			}
			.tov{
				color: #FB8884;
				font-size: 22rpx;
			}
		}
	}
	.more{
		padding: 20upx 0;
	}
</style>