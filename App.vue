<script>
import auth from 'common/js/auth.js';
import config from 'common/js/config.js';
export default {
	mixins: [auth],
	onLaunch(data) {
		if (uni.getStorageSync('baseUrl') != config.baseUrl) {
			uni.clearStorageSync();
		}
		uni.setStorageSync('baseUrl', config.baseUrl);

		// #ifdef MP
		const updateManager = uni.getUpdateManager();
		updateManager.onCheckForUpdate(function(res) {
			// 请求完新版本信息的回调
		});

		updateManager.onUpdateReady(function(res) {
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});
		});

		updateManager.onUpdateFailed(function(res) {
			// 新的版本下载失败
		});
		// #endif

		uni.getLocation({
			type: 'gcj02',
			success: res => {
				let obj = uni.getStorageSync('location');
				if (obj) {
					let a = this.$util.getDistance(obj.latitude, obj.longitude, res.latitude, res.longitude);
					if (a > 20) {
						uni.removeStorageSync('store');
					}
				}
				uni.setStorage({
					key: 'location',
					data: {
						latitude: res.latitude,
						longitude: res.longitude
					}
				});
			}
		});

		//判断是否支持 获取本地位置
		// #ifdef H5
		if (navigator.geolocation) {
			var n = navigator.geolocation.getCurrentPosition(function(res) {
				console.log(res); // 需要的坐标地址就在res中
			});
		} else {
			console.log('该浏览器不支持定位');
		}

		// #endif

		// #ifdef H5
		if (uni.getSystemInfoSync().platform == 'ios') {
			uni.setStorageSync('initUrl', location.href);
		}
		// #endif

		uni.onNetworkStatusChange(function(res) {
			if (!res.isConnected) {
				uni.showModal({
					title: '网络失去链接',
					content: '请检查网络链接',
					showCancel: false
				});
			}
		});
	},
	onShow: function() {
		this.$store.dispatch('init');

		// 自动登录
		if (!uni.getStorageSync('token') && !uni.getStorageSync('loginLock') && !uni.getStorageSync('unbound')) {
			// #ifdef H5
			if (this.$util.isWeiXin()) {
				this.$util.getUrlCode(urlParams => {
					if (urlParams.source_member) uni.setStorageSync('source_member', urlParams.source_member);
					if (urlParams.code == undefined) {
						this.$api.sendRequest({
							url: '/wechat/api/wechat/authcode',
							data: {
								redirect_url: location.href
							},
							success: res => {
								if (res.code >= 0) {
									location.href = res.data;
								}
							}
						});
					} else {
						this.$api.sendRequest({
							url: '/wechat/api/wechat/authcodetoopenid',
							data: {
								code: urlParams.code
							},
							success: res => {
								if (res.code >= 0) {
									let data = {};
									if (res.data.openid) data.wx_openid = res.data.openid;
									if (res.data.unionid) data.wx_unionid = res.data.unionid;
									if (res.data.userinfo) Object.assign(data, res.data.userinfo);
									this.authLogin(data);
								}
							}
						});
					}
				});
			}
			// #endif
		}
	},
	onHide: function() {
		this.$store.dispatch('getThemeStyle');
	},
	methods: {
		/**
		 * 授权登录
		 */
		authLogin(data) {
			uni.setStorage({
				key: 'authInfo',
				data: data
			});

			if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

			this.$api.sendRequest({
				url: '/api/login/auth',
				data,
				success: res => {
					if (res.code >= 0) {
						uni.setStorage({
							key: 'token',
							data: res.data.token,
							success: () => {
								this.$store.dispatch('getCartNumber');
								this.$store.commit('setToken', res.data.token);
							}
						});
					} else {
						uni.setStorage({
							key: 'unbound',
							data: 1,
							success: () => {}
						});
					}
				}
			});
		}
	}
};
</script>
<style lang="scss">
@import url('/common/css/iconfont.css');
@import './common/css/main.scss';
/* #ifdef H5 */
uni-page[data-page='otherpages/index/city/city'] {
	overflow: hidden !important;
}
/* #endif */
</style>
