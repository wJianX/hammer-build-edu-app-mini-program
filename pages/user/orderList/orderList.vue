<template>
	<view class="wrap" @touchmove.stop.prevent>
		<view class="u-tabs-box">
			<u-tabs-swiper activeColor="#57A89D" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="list.length > 6 ? true : false" swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" @change="changeIndicatorDots">
			<swiper-item class="swiper-item" v-for="(items, index1) in list" :key="index1">
				<hr-pull-load
					@refresh='refresh'
					:height='-1'
					:pullHeight='50'
					:maxHeight='100'
					:lowerThreshold='20'
					:isTab='false'
					ref="myasdas"
				>
					<view class="orderitem" v-for="(item, index) in items.study_task" v-if="isEmptyOrNUll(items.study_task)" :key="index">
						<view class="order_number">
							<text>{{item.tradeNo}}</text>
							<text class="my_icon">&#xe639;</text>
						</view>
						<view class="order_name">
							<view class="name">
								<text>{{item.productName}}</text>
								<view v-if="isEmptyOrNUll(item.payTime)">{{'付款时间：' + item.payTime}}</view>
							</view>
							<view class="price"> 
								<text v-if="item.tradePrice == 0">免费</text>
								<text v-if="item.tradePrice != 0">¥{{item.tradePrice}}</text>
							</view>
						</view>
						<!-- <view class="actual_price">
							<text class="total_price">总价：¥234.00</text>
							<text>实付：¥234.00</text>
						</view> -->
						<view class="bts">
							<view class="bt delete" v-if="item.tradeStatus == 0" @click="deleteOrder(item.tradeNo)">取消订单</view>
							<view class="bt" v-if="item.tradeStatus == 2 && item.tradePrice > 0 && item.tagExt == -1 && istime(item.payTime)" @click="refund(item.tradeNo)">申请退款</view>
							<view class="bt pay" v-if="item.tradeStatus == 2 && item.tradePrice > 0 && item.tagExt == 0" @click="cancelrefund(item.tradeNo)">取消退款申请</view>
							<view class="bt delete" v-if="item.tradeStatus == 2 && item.tradePrice > 0 && item.tagExt == 0">退款审核中</view>
							<view class="bt pay" v-if="item.tradeStatus == 0" @click="continuePay(item.tradeNo)">继续支付</view>
						</view>
					</view>
					<view v-if="!isEmptyOrNUll(items.study_task)" class="zlistNull">
						<u-empty text="当前没有内容~" mode="order" class="listNull"></u-empty>
					</view>
				</hr-pull-load>
			</swiper-item>
		</swiper>
		
		<u-modal v-model="isShowModal" :title-style="{color: 'red'}" title="申请退款" :show-cancel-button="true" @confirm="confirm" @cancel="isShowModal=false" :mask-close-able="true">
			<view class="slot-content mytextarea">
				<u-input v-model="reason" type="textarea" :clearable="false" :border="true" border-color="#57A89D" placeholder="请输入退款原因"/>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { _request, _pay, showToast } from '@/common/js/request.js'
	import api from '@/common/js/api.js';
	import { isEmptyOrNUll } from '@/common/js/tools.js'
	import hrPullLoad from '@/components/hr-pull-load/hr-pull-load.vue'
	export default {
		components: { hrPullLoad },
		data() {
			return {
				list: [{
						name: '全部',
						status: ''
					},
					{
						name: '待付款',
						status: '0'
					},
					{
						name: '已付款',
						status: '2'
					},
					{
						name: '已退款',
						status: '3'
					}
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				isShowModal: false,
				reason: '',
				tradeNo: ''
			};
		},
		onLoad(opt) {
			this.getSelectNoPay()
		},
		methods: {
			istime(time){
				// 判断是否在本月
				if(!isEmptyOrNUll(time)){
					let data = time.split(' ')[0]
					let date = new Date(data)
					let data_year = date.getFullYear();
					let data_month = date.getMonth() + 1;
					if (data_month >= 1 && data_month <= 9) {
						data_month = "0" + data_month;
					}
					let dataTimer = data_year + data_month
					var currentdate = new Date();
					let current_year = currentdate.getFullYear();
					let current_month = currentdate.getMonth() + 1;
					if (current_month >= 1 && current_month <= 9) {
						current_month = "0" + current_month;
					}
					let currentTimer = current_year + current_month
					if(dataTimer != currentTimer){
						return false
					}else{
						return true
					}
				}else{
					return false
				}
				
			},
			refresh(){
				this.getSelectNoPay(1)
			},
			confirm(tradeNo){
				// 申请退款确认
				_request(api.applyRefund, {tradeNo: this.tradeNo, reason: this.reason}).then(res => {
					if(res != "" && res.resultCode == 200){
						this.isShowModal = false;
						this.reason = ''
						this.dataempty()
						this.getSelectNoPay()
					}
					showToast(res.resultMap)
				})
			},
			dataempty(){
				this.list.map((item, index)=>{
					if(!isEmptyOrNUll(item.study_task)){
						// 有值 return
						item.study_task = []
					}
					return item
				})
			},
			cancelrefund(tradeNo){
				// 取消申请退款
				uni.showModal({
				    title: '提示',
				    content: '是否取消退款申请？',
					confirmText: '确定取消',
					cancelText: '在想想',
				    success: showModalres => {
				        if (showModalres.confirm) {
							_request(api.cancelApplyRefund, {tradeNo}).then(res => {
								this.dataempty()
								this.getSelectNoPay()
								showToast(res.resultMap)
							})
				        } else if (showModalres.cancel) {
							
				        }
				    }
				});
			},
			deleteOrder(tradeNo){
				// 删除未支付订单
				_request(api.cancelOrder, {tradeNo}).then(deres => {
					this.getSelectNoPay()
				})
			},
			refund(tradeNo){
				this.isShowModal = true;
				this.tradeNo = tradeNo
			},
			continuePay(tradeNo){
				// 继续支付
				_pay(tradeNo).then(payData => {
					this.getSelectNoPay()
				})
			},
			isEmptyOrNUll(data) {
				return !isEmptyOrNUll(data);
			},
			getSelectNoPay(type = 0){
				let status = this.list[this.swiperCurrent].status
				let data = status == "" ? {status: ""} : {status}
				_request(api.selectNoPay, data, 'POST', true, true).then(res => {
					if(res != "" && res.resultCode == 200){
						this.$set(this.list[this.swiperCurrent], 'study_task', res.resultMap.reverse())
					}else{
						this.$set(this.list[this.swiperCurrent], 'study_task', [])
					}
					if(type == 1){
						setTimeout(()=>{
							this.$refs.myasdas[this.swiperCurrent].reSet()
						},500);
					}
				})
			},
			reachBottom() {
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				if(!isEmptyOrNUll(this.list[this.swiperCurrent].study_task)){
					// 有值 return
					return
				}
				this.getSelectNoPay()
			},
			changeIndicatorDots(e){
				console.log(111)
				let index = e.detail.current
				this.swiperCurrent = index;
				if(!isEmptyOrNUll(this.list[index].study_task)){
					// 有值 return
					return
				}
				this.getSelectNoPay()
			},
			transition({ detail: { dx } }) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({ detail: { current } }) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	};
</script>

<style>
page {
	/* background-color: #dddddd; */
}
</style>

<style lang="scss" scoped>
	.orderitem{
		border: 1rpx solid #57A89D;
		padding: 10rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
		margin: 25rpx 30rpx 30rpx;
		.order_number{
			display: flex;
			justify-content: start;
			align-items: center;
			text{
				font-size: 28rpx;
				color: #000;
				margin: 0;
			}
			.my_icon{
				font-size: 24rpx;
				margin-left: 10rpx;
			}
		}
		.order_name{
			margin: 28rpx 8rpx 0;
			display: flex;
			align-items: center;
			.name{
				flex: 1;
				text{
					font-weight: bold;
					font-size: 32rpx;
					
					color: #57A89D;
				}
				view{
					font-size: 26rpx;
					margin-left: 4rpx;
					margin-top: 12rpx;
				}
			}
			.price{
				width: 140rpx;
				text-align: right;
				text{
					color: red;
					font-size: 36rpx;
					font-weight: 500;
				}
			}
		}
		.actual_price{
			text-align: right;
			margin: 28rpx 15rpx 20rpx;
			.total_price{
				font-weight: bold;
				margin-right: 8rpx;
			}
			text{
				font-size: 26rpx;
			}
		}
		.bts{
			text-align: right;
			margin: 20rpx 8rpx 10rpx;
			.bt{
				display: inline-block;
				font-size: 24rpx;
				padding: 10rpx 30rpx;
				border: 1rpx solid #bcbcbc;
				border-radius: 30rpx;
				margin-left: 20rpx;
			}
			.delete{
				color: red;
				border: 1rpx solid red;
			}
			.pay{
				color: #1890FF;
				border: 1rpx solid #1890FF;
			}
			.warning{
				color: #ff9900;
				border: 1rpx solid #ff9900;
			}
		}
	}
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}
	.zlistNull{
		height: 100%;
	}
	.listNull{
		position: relative;
	}
	.mytextarea{
		margin: 18rpx 25rpx;
	}
</style>