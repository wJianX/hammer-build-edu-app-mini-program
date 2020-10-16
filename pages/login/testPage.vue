<template>
	<view>
		<view class="u-tabs-box">
			<u-navbar :is-back="false" id="myheader">
				<scroll-view class="slot-wrap" scroll-x="true">
					<u-tabs name="projectName" :list="list" :is-scroll="true" :current="current" @change="change" :show-bar="false" :font-size="32" :active-item-style="activeItemStyle" active-color="#FF6633"></u-tabs>
				</scroll-view>
			</u-navbar>
			<scroll-view class="home_content" id="asda" @scroll="scroll" scroll-y="true">
				<u-swiper :list="swiperList" @click="clickSwiper"></u-swiper>
				
				<view class="projects" v-for="(items,indexs) in list" :key="indexs" :ref="indexs">
					<view class="project-name">{{items.projectName}}</view>
					<view class="project-content" v-for="(item,index) in items.study_task" :key="index">
						<view class="p_a">
							<view class="a">{{item.productName}}</view>
							<view class="b">30天有效期</view>
						</view>
						<view class="p_b">
							<view class="a">知识点关键词1  知识点关键词2</view>
							<view class="b">
								<text class="price" v-if="item.productPrice == 0">免费</text>
								<text class="price" v-if="item.productPrice != 0">¥{{item.productPrice}}</text>
								<text>1197人学习</text>
							</view>
						</view>
					</view>
				</view>
				
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { _request, showToast } from '@/common/js/request.js'
	import api from '@/common/js/api.js';
	import { isEmptyOrNUll, _debounce } from '@/common/js/tools.js'
	export default {
		data() {
			return {
				list: [],
				current: 0,
				activeItemStyle: {
					fontSize: '46rpx'
				},
				swiperList: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
				windowHeight: 0,
				headHeight: 0
			};
		},
		onLoad() {
			this.getPlatfrom();
			uni.getSystemInfo({
				success: res => {
					this.windowHeight = res.windowHeight
				}
			})
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#myheader').boundingClientRect(data => {
				this.headHeight = data.height
			}).exec();
		},
		methods: {
			change(index) {
				this.current = index;
			},
			clickSwiper(index){
				console.log(index)
			},
			scroll(e){
				const query = uni.createSelectorQuery().in(this);
				query.selectAll('.projects').boundingClientRect(data => {
					console.log(this.headHeight,this.windowHeight)
					Array.isArray(data) && data.forEach((item, index) => {
						console.log(item)
						
					})
				}).exec();
				// console.log(e)
			},
			getPlatfrom(){
				_request(api.getAllProject, {}).then(res => {
					let study_task = res.resultMap
					
					this.list = study_task
					this.list.forEach(async (item, index) => {
						await this.getProductByProjectCode(item.projectCode, index)
					})
				})
			},
			async getProductByProjectCode(projectCode, index){
				let data = await _request(api.getProductByProjectCode, {projectCode})
				this.$set(this.list[index], 'study_task', data.resultMap)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.u-tabs-box{
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		overflow: hidden;
		width: 100rpx;
	}
	.home_content{
		overflow: hidden;
		flex: 1;
	}
	.projects{
		
		.project-name{
			margin: 20upx 20upx 50upx;
			font-size: 32upx;
			color: #FF6633;
			font-weight: bold;
		}
		.project-content{
			margin: 0 40upx 40upx;
			border-bottom: 1upx solid #5f5f5f;
			.p_a{
				display: flex;
				justify-content: space-between;
				margin-bottom: 20upx;
				.a{
					font-size: 30upx;
					font-weight: bold;
				}
			}
			.p_b{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12upx;
				.b{
					display: flex;
					flex-direction: column;
					align-items: center;
					color: #FF6633;
					.price{
						font-size: 36upx;
						font-weight: bold;
						margin-bottom: 12upx;
					}
				}
			}
		}
	}
	
</style>
