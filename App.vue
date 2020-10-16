<script>
	import { _request, delay, _login } from '@/common/js/request.js'
	import api from '@/common/js/api.js'
	import { isEmptyOrNUll } from '@/common/js/tools.js'
	export default {
		onLaunch: function() {
			
			// 获取小程序更新机制兼容
			// uni.removeStorageSync('isCanUse')
			_login('app')
			
			if (uni.canIUse('getUpdateManager')) { 
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									if (res.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate();
									}
								}
							})
						});
						updateManager.onUpdateFailed(function() {
							// 新的版本下载失败
							uni.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
							});
						});
					}
				})
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}
		},
		globalData: {
			isIphoneX: false
		},
		onShow: function() {
			// 隐藏小房子
			uni.hideHomeButton()
			
			var that = this;
			uni.getSystemInfo({
				success: res => {
					// console.log('手机信息res'+res.model)
					let modelmes = res.model;
					if (modelmes.indexOf('iPhone X') != -1 || modelmes.indexOf('iPhone XR') != -1 || modelmes.indexOf('iPhone XS Max') != -1 || modelmes.indexOf('iPhone XS') != -1 || modelmes.indexOf('iPhone 11') != -1) {
						that.$options.globalData.isIphoneX = true;
					}
				}
			});
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
	@import './common/css/base.css';
	@font-face {
	  font-family: 'iconfont';  /* project id 1812954 */
	  src: url('https://at.alicdn.com/t/font_1812954_kwrt9f804wo.eot');
	  src: url('https://at.alicdn.com/t/font_1812954_kwrt9f804wo.eot?#iefix') format('embedded-opentype'),
	  url('https://at.alicdn.com/t/font_1812954_kwrt9f804wo.woff2') format('woff2'),
	  url('https://at.alicdn.com/t/font_1812954_kwrt9f804wo.woff') format('woff'),
	  url('https://at.alicdn.com/t/font_1812954_kwrt9f804wo.ttf') format('truetype'),
	  url('https://at.alicdn.com/t/font_1812954_kwrt9f804wo.svg#iconfont') format('svg');
	}
	.my_icon {
		font-family: iconfont;
		margin: 10upx;
		color: #57A89D;
	}
</style>
