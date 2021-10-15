export default {
	data() {
		return {
			authInfo: {}
		}
	},
	methods: {
		/**
		 * 获取用户登录凭证code
		 */
		getCode(callback) {
			this.getUserInfo();
			// 微信小程序
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				timeout: 3000,
				success: res => {
					if (res.code) {
						this.$api.sendRequest({
							url: '/weapp/api/weapp/authcodetoopenid',
							data: {
								code: res.code
							},
							success: res => {
								if (res.code >= 0) {
									if (res.data.openid) this.authInfo.weapp_openid = res.data.openid;
									if (res.data.unionid) this.authInfo.wx_unionid = res.data.unionid;
									typeof callback == 'function' && callback(this.authInfo);
								} else {
									this.$util.showToast({
										title: '小程序配置错误'
									});
								}
							}
						})
					}
				},
				fail: () => {
					this.$util.showToast({
						title: '请求失败'
					});
				}
			})
			// #endif
			// 支付宝小程序
			// #ifdef MP-ALIPAY
			uni.login({
				scopes: 'auth_base',
				success: res => {
					if (res.authCode) {}
				}
			})
			// #endif
			// 头条小程序
			// #ifdef MP-TOUTIAO
			uni.login({
				success: res => {
					if (res.code) {}
				}
			})
			// #endif
			// 百度小程序
			// #ifdef MP-BAIDU
			uni.login({
				success: res => {
					if (res.code) {}
				}
			})
			// #endif
		},
		/**
		 * 获取第三方用户基础信息
		 */
		getUserInfo() {
			// #ifdef MP
			uni.getUserInfo({
				success: res => {
					if (res.errMsg == 'getUserInfo:ok') {
						if (res.userInfo.nickName) this.authInfo.nickName = res.userInfo.nickName;
						if (res.userInfo.avatarUrl) this.authInfo.avatarUrl = res.userInfo.avatarUrl;
					}
				}
			});
			// #endif
		},
		/**
		 * 获取到openid之后的操作
		 */
		handleAuthInfo() {
			try {
				// 检测openid是否绑定
				this.checkOpenidIsExits();
			} catch (e) {}
		}
	},
	onLoad(option) {
		if (option.code && this.$util.isWeiXin()) {
			this.$api.sendRequest({
				url: '/wechat/api/wechat/authcodetoopenid',
				data: {
					code: option.code
				},
				success: res => {
					if (res.code >= 0) {
						if (res.data.openid) this.authInfo.wx_openid = res.data.openid;
						if (res.data.unionid) this.authInfo.wx_unionid = res.data.unionid;
						Object.assign(this.authInfo, res.data.userinfo);

						this.handleAuthInfo();
					}
				}
			})
		}
	}

}
