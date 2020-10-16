<template>
	<view class="u-content">
		<u-parse :html="newLabel"></u-parse>
	</view>
</template>

<script>
	import { _request, showToast, _pay } from '@/common/js/request.js'
	import api from '@/common/js/api.js';
	export default {
		data() {
			return {
				newsId: '',
				newLabel: ''
			};
		},
		onLoad(opt) {
			this.newsId = opt.id
			this.getNews()
		},
		methods:{
			async getNews(){
				let res = await _request(api.newDetail, {id: this.newsId, mid: this.mid, pageSize: this.pageSize}, 'POST', true, true)
				uni.setNavigationBarTitle({
					title: res.resultMap.title
				});
				this.newLabel = await _request(res.resultMap.contextUrl, {}, 'GET')
			}
		}
	}
</script>

<style lang="scss">
	.u-content {
		margin: 20rpx 15rpx;
	}
</style>
