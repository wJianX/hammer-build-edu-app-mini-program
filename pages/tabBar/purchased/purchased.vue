<template>
	<view class="purchasedPage">
		<view class="ppBack"></view>
		<view class="ppContent">
			<view class="myItems" @click="testJump(item.productId, item.productName, item.productCode)" v-for="(item, index) in study_task" :key="index" v-if="study_task.length > 0">
				<view class="item_a">
					<image style="width: 40rpx;height: 40rpx;" :src="items.projectCode == 'slry' ? '/static/images/mine/cert3.png' : '/static/images/mine/cert8.png'"></image>
				</view>
				<view class="item_b">
					<view class="name">{{item.productName}}</view>
					<view class="details">
						<view class="detail">{{item.introduce}}</view>
					</view>
					<view class="timer">{{item.endStudyTime | timer}}</view>
				</view>
				<view class="item_c">
					<text>进入</text>
				</view>
			</view>
			<view class="isNull" v-if="study_task.length == 0">
				<view>
					<image src="/static/images/mine/undraw_empty.png" mode="widthFix"></image>
					<view>您还没有已购课程，去题库看看吧～</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import { _request } from '@/common/js/request.js'
	import api from '@/common/js/api.js';
	import { isEmptyOrNUll } from '@/common/js/tools.js'
	export default {
		data() {
			return {
				study_task: []
			};
		},
		onLoad() {
			
		},
		onShow() {
			this.getPurchased()
		},
		onPullDownRefresh() {
			this.getPurchased('pull')
		},
		filters:{
			timer(time){
				// console.log(time)
				// 判断是否在本月
				if(!isEmptyOrNUll(time)){
					let data = time.split(' ')[0]
					let date = new Date(data)
					let data_year = date.getFullYear();
					let data_month = date.getMonth() + 1;
					let data_date = date.getDate()
					let dataTimer = data_year + "年" + data_month + "月" + data_date + "日到期"
					return dataTimer
				}else{
					return time
				}
				
			}
		},
		methods:{
			getPurchased(type = ''){
				_request(api.selectNoPay, {status: '2'}, 'POST', true, true).then(res => {
					if(res != "" && res.resultCode == 200){
						this.study_task = res.resultMap.reverse()
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 500);
				})
			},
			testJump(id, title, productCode){
				console.log(id, title, productCode)
				uni.navigateTo({
					url: '/pages/home/study_task/study_task?id=' + id + '&title=' + title + '&productCode=' + productCode
				})
			}
		}
	}
</script>


<style lang="scss">
	page{
		background-color: #F8F8F8;
	}
	.purchasedPage{
		height: 100vh;
		
	}
	
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
			.timer{
				font-size: 22rpx;
				color: #FB8884;
				
			}
		}
		.item_c{
			display: flex;
			align-items: center;
			color: #57A89D;
			font-size: 28rpx;
			font-weight: 600;
		}
	}
	.isNull{
		height: calc(100vh - 28px);
		position: relative;
		&>view{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			width: 100%;
			image{
				width: 320rpx;
				height: 320rpx;
				margin-bottom: 54rpx;
			}
			view{
				color: #838383;
				font-size: 32rpx;
			}
		}
	}
</style>
