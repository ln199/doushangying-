<template>
	<view>
		<view @touchmove.prevent.stop>
			<uni-popup ref="auth" :custom="true" :mask-click="false">
				<view class="uni-tip">
					<view class="uni-tip-title">您还未登录</view>
					<view class="uni-tip-content">请先登录之后再进行操作</view>
					<view class="uni-tip-icon"><image :src="$util.img('/upload/uniapp/member/login.png')" mode="widthFix"></image></view>
					<view class="uni-tip-group-button">
						<button type="default" class="uni-tip-button color-title close" @click="close">暂不登录</button>
						<!-- #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU -->
						<button type="primary" open-type="getUserInfo" @getuserinfo="login" class="uni-tip-button">立即登录</button>
						<!-- #endif  -->
						<!-- #ifdef MP-ALIPAY -->
						<button type="primary" open-type="getAuthorize" scope="userInfo" @getAuthorize="login" class="uni-tip-button color-base-bg">立即登录</button>
						<!-- #endif  -->
						<!-- #ifdef H5 -->
						<button type="primary" class="uni-tip-button color-base-bg" @click="login">立即登录</button>
						<!-- #endif  -->
					</view>
				</view>
			</uni-popup>
		</view>

		<bind-mobile ref="bindMobile"></bind-mobile>
		<register-reward ref="registerReward"></register-reward>
	</view>
</template>

<script>
import uniPopup from '../uni-popup/uni-popup.vue';
import Config from 'common/js/config.js';
import bindMobile from '../bind-mobile/bind-mobile.vue';
import registerReward from '../register-reward/register-reward.vue';
import auth from 'common/js/auth.js';

export default {
	mixins: [auth],
	name: 'ns-login',
	components: {
		uniPopup,
		bindMobile,
		registerReward
	},
	data() {
		return {
			url: '',
			registerConfig: {}
		};
	},
	created() {
		this.getRegisterConfig();
	},
	mounted() {
		// #ifdef H5
		if (this.$util.isWeiXin()) {
			const getUrlCode = function() {
				var url = location.search;
				var theRequest = new Object();
				if (url.indexOf('?') != -1) {
					var str = url.substr(1);
					var strs = str.split('&');
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
					}
				}
				return theRequest;
			};
			var urlParams = getUrlCode();
			if (urlParams.source_member) uni.setStorageSync('source_member', urlParams.source_member);
			if (urlParams.code != undefined) {
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
		}
		// #endif
	},
	methods: {
		/**
		 * 获取注册配置
		 */
		getRegisterConfig() {
			this.$api.sendRequest({
				url: '/api/register/config',
				success: res => {
					if (res.code >= 0) {
						this.registerConfig = res.data.value;
					}
				}
			});
		},
		open(url) {
			if (url) this.url = url;
			// #ifndef H5
			this.$refs.auth.open();
			// #endif

			// #ifdef H5
			if (this.$util.isWeiXin()) {
				let authData = uni.getStorageSync('authInfo');
				if (authData && authData.wx_openid && !uni.getStorageSync('loginLock')) {
					this.authLogin(authData);
				} else {
					this.$api.sendRequest({
						url: '/wechat/api/wechat/authcode',
						data: {
							redirect_url: location.href
						},
						success: res => {
							if (res.code >= 0) {
								location.href = res.data;
							} else {
								this.$util.showToast({ title: '公众号配置错误' });
							}
						}
					});
				}
			} else {
				this.$refs.auth.open();
			}
			// #endif
		},
		close() {
			this.$refs.auth.close();
		},
		login(e) {
			if (!uni.getStorageSync('loginLock')) {
				// #ifdef MP
				if (e.detail.errMsg == 'getUserInfo:ok') {
					let basicUserInfo = e.detail.userInfo;
					this.authInfo.nickName = basicUserInfo.nickName;
					this.authInfo.avatarUrl = basicUserInfo.avatarUrl;
					this.getCode(data => {
						if (data) {
							this.authLogin(Object.assign(data,basicUserInfo));
						} else {
							this.$refs.auth.close();
							this.toLogin();
						}
					});
				}
				// #endif

				// #ifndef MP
				this.$refs.auth.close();
				this.toLogin();
				// #endif
			} else {
				this.$refs.auth.close();
				this.toLogin();
			}
		},
		/**
		 * 跳转去登录页
		 */
		toLogin() {
			if (this.url) this.$util.redirectTo('/pages/login/login/login', { back: encodeURIComponent(this.url) });
			else this.$util.redirectTo('/pages/login/login/login');
		},
		/**
		 * 授权登录
		 */
		authLogin(data) {
			uni.showLoading({ title: '登录中' });
			uni.setStorage({
				key: 'authInfo',
				data: data
			});
			if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

			this.$api.sendRequest({
				url: '/api/login/auth',
				data,
				success: res => {
					this.$refs.auth.close();
					if (res.code >= 0) {
						uni.setStorage({
							key: 'token',
							data: res.data.token,
							success: () => {
								uni.removeStorageSync('loginLock');
								uni.removeStorageSync('unbound');
								uni.removeStorageSync('authInfo');
								this.$store.dispatch('getCartNumber');
								this.$store.commit('setToken', res.data.token);

								if (res.data.is_register && this.$refs.registerReward.getReward()) {
									this.$refs.registerReward.open();
								}
							}
						});
						setTimeout(() => {
							uni.hideLoading();
						}, 1000);
					} else if (this.registerConfig.third_party == 1 && this.registerConfig.bind_mobile == 1) {
						uni.hideLoading();
						this.$refs.bindMobile.open();
					} else if (this.registerConfig.third_party == 0) {
						uni.hideLoading();
						this.toLogin();
					} else {
						uni.hideLoading();
						this.$util.showToast({ title: res.message });
					}
				},
				fail: () => {
					uni.hideLoading();
					this.$refs.auth.close();
					this.$util.showToast({ title: '登录失败' });
				}
			});
		}
	}
};
</script>

<style lang="scss">
.uni-tip {
	width: 580rpx;
	background: #fff;
	box-sizing: border-box;
	border-radius: 10rpx;
	overflow: hidden;
	height: initial;
}

.uni-tip-title {
	text-align: center;
	font-weight: bold;
	font-size: $font-size-toolbar;
	color: $color-title;
	padding-top: 50rpx;
}

.uni-tip-content {
	padding: 0 30rpx;
	color: $color-sub;
	font-size: $font-size-base;
	text-align: center;
}

.uni-tip-icon {
	width: 100%;
	text-align: center;
	margin-top: 50rpx;
}

.uni-tip-icon image {
	width: 300rpx;
}

.uni-tip-group-button {
	margin-top: 30rpx;
	line-height: 120rpx;
	display: flex;
	padding: 0 50rpx 50rpx 50rpx;
	justify-content: space-between;
}

.uni-tip-button {
	width: 200rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border: none;
	border-radius: 80rpx;
	padding: 0 !important;
	margin: 0 !important;
	background: #fff;
	font-size: $font-size-base;
}

.uni-tip-group-button .close {
	border: 1px solid #eee;
}

.uni-tip-button:after {
	border: none;
}
</style>
