<template>
	<view class="wrap" @touchmove.stop.prevent>
		<view class="bannaer">
			<u-swiper :list="swiperList" @click="clickSwiper" name="imgUrl"></u-swiper>
		</view>
		<view class="u-tabs-box">
			<u-tabs-swiper activeColor="#57A89D" ref="tabs" :list="list" name="projectName" :current="current" @change="change" :is-scroll="list.length > 6 ? true : false"
			 swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" @change="changeIndicatorDots">
			<swiper-item class="swiper-item" v-for="(items, index1) in list" :key="index1">
				<view class="swview">
					<hr-pull-load
						@refresh='refresh'
						:height='-1'
						:pullHeight='50'
						:maxHeight='100'
						:lowerThreshold='20'
						:isTab='false'
						ref="myasdas"
					>
						<!-- <view class="bt" @click="testJump(item.id, item.productName, item.productCode)" v-for="(item, index) in items.study_task" :key="index" v-if="isEmptyOrNUll(items.study_task)">{{item.productName}}<text class="my_icon">&#xe639;</text></view> -->
						<view class="bt" @click="testJump(item.id, item.productName, item.productCode)" v-for="(item, index) in items.study_task" :key="index" v-if="isEmptyOrNUll(items.study_task)">
							<view class="o_name">
								<text class="n">{{item.productName}}</text>
								<text class="p">{{item.productPrice == 0 ? "免费" : "¥ " + item.productPrice}}</text>
							</view>
							<text class="my_icon">&#xe639;</text>
						</view>
						<u-empty text="当前没有内容~" mode="list" class="purchased_null" v-if="!isEmptyOrNUll(items.study_task)"></u-empty>
					</hr-pull-load>
				</view>
				
			</swiper-item>
		</swiper>
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
				list: [],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				currPage: 1, // 当前页码
				totalPage: 1, // 总页数
				swiperList: [],
			};
		},
		onLoad() {
			this.newList();
			this.getPlatfrom();
			this.selectNoPay();
		},
		methods: {
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
			refresh(){
				this.getProductByProjectCode(this.list[this.swiperCurrent].projectCode, 1)
			},
			selectNoPay(){
				_request(api.selectNoPay, {status: '0'}, 'POST', true, true).then(res => {
					if(res != "" && res.resultCode == 200){
						let selectNoPayData = res.resultMap[0]
						uni.showModal({
						    title: '提示',
						    content: '您有未支付订单，是否前往支付？',
							confirmText: '前往支付',
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
				_request(api.getAllProject, {}).then(res => {
					let study_task = res.resultMap
					this.getProductByProjectCode(study_task[this.swiperCurrent].projectCode)
					this.list = study_task
				})
			},
			getProductByProjectCode(projectCode, type = 0){
				_request(api.getProductByProjectCode, {projectCode}).then(res => {
					this.$set(this.list[this.swiperCurrent], 'study_task', res.resultMap)
					if(type == 1){
						setTimeout(()=>{
							this.$refs.myasdas[this.swiperCurrent].reSet()
						},500);
					}
				})
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				if(!isEmptyOrNUll(this.list[this.swiperCurrent].study_task)){
					// 有值 return
					return
				}
				this.getProductByProjectCode(this.list[this.swiperCurrent].projectCode)
			},
			changeIndicatorDots(e){
				let index = e.detail.current
				this.swiperCurrent = index;
				if(!isEmptyOrNUll(this.list[index].study_task)){
					// 有值 return
					return
				}
				this.getProductByProjectCode(this.list[index].projectCode)
			},
			transition({ detail: { dx } }) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({ detail: { current } }) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
		}
	};
</script>

<style lang="scss" scoped>
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
	.bt{
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 20upx;
		padding: 10upx 20upx 10upx 0;
		color: #606266;
		font-weight: 500;
		font-size: 28upx;
	}
	.zlistNull{
		height: 100vh;
	}
	.listNull{
		position: relative;
	}
	.swview{
		height: 100%;
	}
	.o_name{
		display: flex;
		flex-direction: column;
	}
	.o_name .p{
		margin-top: 5upx;
		font-size: 34upx;
		margin-left: 5upx;
		font-weight: 500;
		color: red;
	}
</style>