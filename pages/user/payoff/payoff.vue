<template>
	<view class="payoff">
		<u-navbar back-text="返回" :customBack="onBack" title="处理中..."></u-navbar>
		<view class="payoff_a" v-show="!show">
			<image src="../../../static/images/mine/payoff.png"></image>
			<view class="a_text">下单成功，<text style="color: red;" v-if="!isApp">{{time}}</text>秒后自动跳转至正在使用页面。</view>
			
			<view class="bts" v-if="!isApp">
				<u-button type="primary" @click="jumpTo(1)" :custom-style="customStyle">进入我的题库</u-button>
			</view>
			<view class="bts" v-if="isApp">
				<u-button type="primary" open-type="launchApp" app-parameter="wechat" binderror="launchAppError" :custom-style="customStyle">返回APP</u-button>
			</view>
			<view class="bts">
				<u-button @click="jumpTo(2)" type="primary" :custom-style="custom1Style">返回现场岗位</u-button>
			</view>
		</view>
		<u-modal v-model="show" :zoom="false" :show-title="false" :show-confirm-button="false">
			<view class="slot-content">
				<u-loading mode="flower" size="70"></u-loading>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { _request } from '@/common/js/request.js'
	import api from '@/common/js/api.js';
	export default {
		data() {
			return {
				time: 10,
				customStyle: {
					backgroundColor: '#464646',
					color: '#57A89D'
				},
				custom1Style: {
					color: '#464646',
					backgroundColor: '#ffffff',
					border: '1rpx solid #57A89D',
				},
				show: true,
				isApp: false
			};
		},
		onLoad(opt) {
			console.log(opt.tradeNo)
			this.isApp = opt.isApp
			this.payoff(opt.tradeNo)
			// this.setInter()
		},
		methods:{
			async payoff(tradeNo){
				try{
					let fodata = await _request(api.flow_order, {tradeNo}, 'POST', false)
					if(fodata.resultCode == 200){
						fodata = fodata.resultMap
						let zerodata = await _request(api.confirm_order, {tradeNo: fodata.tradeNo, kid: fodata.kid}, 'POST', false, true)
						this.setInter()
						this.show = false
						if(zerodata != "" && zerodata.resultCode == 200 && zerodata.resultMap){
							// showToast('下单成功')
						}else{
							uni.showToast({
								title: '下单失败，err'+ JSON.stringify(zerodata.resultMap),
								icon: 'none'
							})
						}
					}
				}catch(err){
					this.show = false
					console.log(err)
					uni.showToast({
						title: err,
						icon: 'none'
					})
				}
				
			},
			setInter(){
				if(this.isApp){
					return
				}
				var timer = setInterval(()=>{
					this.time -= 1
					if(this.time < 1){
						clearInterval(timer);
						this.onBack()
					}
				},1000)
			},
			jumpTo(to){
				switch(to){
					case 1:
						uni.switchTab({ url: '../../tabBar/purchased/purchased'})
					break;
					case 2:
						uni.switchTab({ url: '../../tabBar/home/home'})
					break;
				}
			},
			onBack(){
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				// uni.navigateBack({
				// 	success: function() {
				// 		beforePage.onLoad(); // 执行前一个页面的onLoad方法
				// 	}
				// });
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.u-drawer-content-visible.u-drawer-center{
		background-color: #FFFFFF;
	}
	.slot-content{
		text-align: center;
	}
	.payoff{
		position: relative;
		width: 100%;
		height: 100vh;
	}
	.payoff_a{
		width: 100%;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		text-align: center;
		&>image{
			width: 200upx;
			height: 200upx;
			margin-bottom: 60upx;
		}
		.a_text{
			margin-bottom: 60upx;
			font-size: 32upx;
			color: #646464;
			text{
				font-weight: 600;
			}
		}
		.bts{
			margin: 30upx 60upx 0;
		}
	}
</style>
