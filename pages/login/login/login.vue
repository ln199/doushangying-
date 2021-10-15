<template>
	<scroll-view scroll-y="true" class="container" :data-theme="themeStyle">
		<view class="header-wrap">
			<view class="title">登录</view>
			<view class="regisiter-agreement">
				<text class="color-tip">还没有账号,</text>
				<text class="color-base-text" @click="toRegister">立即注册</text>
			</view>
		</view>
		<view class="body-wrap">
			<view class="form-wrap">
				<view class="input-wrap" v-show="loginMode == 'mobile'">
					<view class="content">
						<view class="area-code">+86</view>
						<input type="number" placeholder="仅限中国大陆手机号登录" placeholder-class="input-placeholder" class="input" maxlength="11" v-model="formData.mobile" />
					</view>
				</view>
				<view class="input-wrap" v-show="loginMode == 'account'">
					<view class="content"><input type="text" placeholder="请输入账号" placeholder-class="input-placeholder" class="input" v-model="formData.account" /></view>
				</view>
				<view class="input-wrap" v-show="loginMode == 'account'">
					<view class="content">
						<input type="password" placeholder="请输入密码" placeholder-class="input-placeholder" class="input" v-model="formData.password" />
						<view class="align-right" v-show="loginMode == 'account'"><text @click="forgetPassword">忘记密码?</text></view>
					</view>
				</view>
				<view class="input-wrap" v-if="captchaConfig == 1">
					<view class="content">
						<input type="text" placeholder="请输入验证码" placeholder-class="input-placeholder" class="input" v-model="formData.vercode" />
						<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
					</view>
				</view>
				<view class="input-wrap" v-show="loginMode == 'mobile'">
					<view class="content">
						<input type="text" placeholder="请输入动态码" placeholder-class="input-placeholder" class="input" v-model="formData.dynacode" />
						<view class="dynacode" :class="dynacodeData.seconds == 120 ? 'color-base-text' : 'color-tip'" @click="sendMobileCode">{{ dynacodeData.codeText }}</view>
					</view>
				</view>
			</view>
			<view class="login-mode-box">
				<text @click="switchLoginMode" v-show="loginMode == 'mobile' && registerConfig.login.indexOf('username') != -1">使用账号登录</text>
				<text @click="switchLoginMode" v-show="loginMode == 'account' && registerConfig.login.indexOf('mobile') != -1">使用手机号登录</text>
			</view>
			<view class="btn_view">
				<button type="primary" @click="login" class="login-btn color-base-border color-base-bg">登录</button>

				<view @click="authLogin" v-if="isBind" class="auth-login color-base-border"><text class="color-base-text color-base-border">一键授权登录</text></view>
				<!-- #ifdef MP -->
				<button open-type="getPhoneNumber" v-if="!isBind" class="auth-login color-base-border" @getphonenumber="mobileAuthLogin">
					<text class="color-base-text color-base-border">一键授权手机号快捷登录</text>
				</button>
				<!-- #endif -->
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</scroll-view>
</template>

<script>
import validate from 'common/js/validate.js';
import auth from 'common/js/auth.js';
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	data() {
		return {
			loginMode: 'account',
			formData: {
				mobile: '',
				account: '',
				password: '',
				vercode: '',
				dynacode: '',
				key: ''
			},
			captcha: {
				id: '',
				img: ''
			},
			isSub: false, // 提交防重复
			back: '', // 返回页
			redirect: 'redirectTo', // 跳转方式
			openidIsExits: false,
			isBind: false,
			dynacodeData: {
				seconds: 120,
				timer: null,
				codeText: '获取动态码',
				isSend: false
			},
			registerConfig: {
				register: '',
				login: ''
			},
			captchaConfig: 1
		};
	},
	mixins: [auth, globalConfig],
	onLoad(option) {
		if (option.back) this.back = option.back;
		this.getCaptchaConfig();
		// #ifdef H5
		if (this.$util.isWeiXin() && !option.code) {
			let redirect_url = this.$config.h5Domain + '/pages/login/login/login';
			if (this.back) redirect_url += '?back=' + encodeURIComponent(this.back);
			this.$api.sendRequest({
				url: '/wechat/api/wechat/authcode',
				data: {
					redirect_url
				},
				success: res => {
					if (res.code >= 0) {
						location.href = res.data;
					}
				}
			});
		}

		if (uni.getStorageSync('authInfo')) {
			this.authInfo = uni.getStorageSync('authInfo');
			this.checkOpenidIsExits();
		}
		// #endif
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		// #ifdef MP
		this.getCode(authInfo => {
			this.$api.sendRequest({
				url: '/api/login/openidisexits',
				data: authInfo,
				success: res => {
					if (res.code >= 0 && res.data > 0) {
						this.isBind = true;
					}
				}
			});
		});
		// #endif
	},
	async onReady() {
		await this.getRegisterConfig();
		if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
	},
	methods: {
		/**
		 * 获取验证码配置
		 */
		getCaptchaConfig() {
			this.$api.sendRequest({
				url: '/api/config/getCaptchaConfig',
				success: res => {
					if (res.code >= 0) {
						this.captchaConfig = res.data.data.value.shop_reception_login;
						if (this.captchaConfig == 1) this.getCaptcha();
					}
				}
			});
		},
		/**
		 * 获取注册配置
		 */
		async getRegisterConfig() {
			var res = await this.$api.sendRequest({
				url: '/api/register/config',
				async: false
			});
			this.registerConfig = res.data.value;
			if (this.registerConfig.login.indexOf('mobile') != -1) this.loginMode = 'mobile';
			else this.loginMode = 'account';
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		},
		/**
		 * 切换登录方式
		 */
		switchLoginMode() {
			this.loginMode = this.loginMode == 'mobile' ? 'account' : 'mobile';
		},
		/**
		 * 获取验证码
		 */
		getCaptcha() {
			this.$api.sendRequest({
				url: '/api/captcha/captcha',
				data: {
					captcha_id: this.captcha.id
				},
				success: res => {
					if (res.code >= 0) {
						this.captcha = res.data;
						this.captcha.img = this.captcha.img.replace(/\r\n/g, '');
					}
				}
			});
		},
		/**
		 * 去注册
		 */
		toRegister() {
			if (this.back) this.$util.redirectTo('/pages/login/register/register', { back: this.back });
			else this.$util.redirectTo('/pages/login/register/register');
		},
		/**
		 * 忘记密码
		 */
		forgetPassword() {
			if (this.back) this.$util.redirectTo('/otherpages/login/find/find', { back: this.back });
			else this.$util.redirectTo('/otherpages/login/find/find');
		},
		/**
		 * 登录
		 */
		login() {
			if (this.loginMode == 'account') {
				var url = '/api/login/login';
				data = {
					username: this.formData.account,
					password: this.formData.password
				};
			} else {
				var url = '/api/login/mobile',
					data = {
						mobile: this.formData.mobile,
						key: this.formData.key,
						code: this.formData.dynacode
					};
			}
			if (this.captcha.id != '') {
				data.captcha_id = this.captcha.id;
				data.captcha_code = this.formData.vercode;
			}
			if (Object.keys(this.authInfo).length) {
				Object.assign(data, this.authInfo);
			}
			if (this.authInfo.avatarUrl) data.headimg = this.authInfo.avatarUrl;
			if (this.authInfo.nickName) data.nickname = this.authInfo.nickName;

			if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

			if (this.verify(data)) {
				if (this.isSub) return;
				this.isSub = true;
				this.$api.sendRequest({
					url,
					data,
					success: res => {
						if (res.code >= 0) {
							uni.setStorage({
								key: 'token',
								data: res.data.token,
								success: () => {
									uni.removeStorageSync('loginLock');
									uni.removeStorageSync('unbound');
									uni.removeStorageSync('authInfo');
									if (this.back != '') {
										this.$util.redirectTo(decodeURIComponent(this.back), {}, this.redirect);
									} else {
										this.$util.redirectTo('/pages/member/index/index', {}, this.redirect);
									}
								}
							});
						} else {
							this.isSub = false;
							this.getCaptcha();
							this.$util.showToast({ title: res.message });
						}
					},
					fail: res => {
						this.isSub = false;
						this.getCaptcha();
					}
				});
			}
		},
		/**
		 * 登录验证
		 * @param {Object} data
		 */
		verify(data) {
			let rule = [];
			// 手机号验证
			if (this.loginMode == 'mobile') {
				rule = [{ name: 'mobile', checkType: 'required', errorMsg: '请输入手机号' }, { name: 'mobile', checkType: 'phoneno', errorMsg: '请输入正确的手机号' }];
				if (this.captchaConfig == 1) {
					if (this.captcha.id != '') rule.push({ name: 'captcha_code', checkType: 'required', errorMsg: this.$lang('captchaPlaceholder') });
				}
				rule.push({ name: 'code', checkType: 'required', errorMsg: this.$lang('dynacodePlaceholder') });
			}

			// 账号验证
			if (this.loginMode == 'account') {
				rule = [
					{ name: 'username', checkType: 'required', errorMsg: this.$lang('accountPlaceholder') },
					{ name: 'password', checkType: 'required', errorMsg: this.$lang('passwordPlaceholder') }
				];
				if (this.captchaConfig == 1) {
					if (this.captcha.id != '') rule.push({ name: 'captcha_code', checkType: 'required', errorMsg: this.$lang('captchaPlaceholder') });
				}
			}

			var checkRes = validate.check(data, rule);
			if (checkRes) {
				return true;
			} else {
				this.$util.showToast({ title: validate.error });
				return false;
			}
		},
		/**
		 * 授权登录
		 */
		authLogin() {
			if (this.isSub) return;
			this.isSub = true;
			this.$api.sendRequest({
				url: '/api/login/auth',
				data: this.authInfo,
				success: res => {
					if (res.code >= 0) {
						uni.setStorage({
							key: 'token',
							data: res.data.token,
							success: () => {
								uni.removeStorageSync('loginLock');
								uni.removeStorageSync('unbound');
								uni.removeStorageSync('authInfo');
								if (this.back != '') {
									this.$util.redirectTo(decodeURIComponent(this.back), {}, this.redirect);
								} else {
									this.$util.redirectTo('/pages/member/index/index', {}, this.redirect);
								}
							}
						});
					} else {
						this.isSub = false;
						this.$util.showToast({ title: res.message });
					}
				},
				fail: res => {
					this.isSub = false;
					this.$util.showToast({ title: 'request:fail' });
				}
			});
		},
		mobileAuthLogin(e) {
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				var data = {
					iv: e.detail.iv,
					encryptedData: e.detail.encryptedData
				};
				if (Object.keys(this.authInfo).length) {
					Object.assign(data, this.authInfo);
				}
				if (this.authInfo.avatarUrl) data.headimg = this.authInfo.avatarUrl;
				if (this.authInfo.nickName) data.nickname = this.authInfo.nickName;
				if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

				if (this.isSub) return;
				this.isSub = true;

				this.$api.sendRequest({
					url: '/api/tripartite/mobileauth',
					data,
					success: res => {
						if (res.code >= 0) {
							uni.setStorage({
								key: 'token',
								data: res.data.token,
								success: () => {
									uni.removeStorageSync('loginLock');
									uni.removeStorageSync('unbound');
									uni.removeStorageSync('authInfo');
									if (this.back != '') {
										this.$util.redirectTo(decodeURIComponent(this.back), {}, this.redirect);
									} else {
										this.$util.redirectTo('/pages/member/index/index', {}, this.redirect);
									}
								}
							});
						} else {
							this.isSub = false;
							this.$util.showToast({ title: res.message });
						}
					},
					fail: res => {
						this.isSub = false;
						this.$util.showToast({ title: 'request:fail' });
					}
				});
			}
		},
		/**
		 * 发送手机动态码
		 */
		sendMobileCode() {
			if (this.dynacodeData.seconds != 120) return;
			var data = {
				mobile: this.formData.mobile,
				captcha_id: this.captcha.id,
				captcha_code: this.formData.vercode
			};
			var rule = [{ name: 'mobile', checkType: 'required', errorMsg: '请输入手机号' }, { name: 'mobile', checkType: 'phoneno', errorMsg: '请输入正确的手机号' }];
			if (this.captchaConfig == 1) {
				rule.push({ name: 'captcha_code', checkType: 'required', errorMsg: '请输入验证码' });
			}
			var checkRes = validate.check(data, rule);
			if (!checkRes) {
				this.$util.showToast({ title: validate.error });
				return;
			}
			if (this.dynacodeData.isSend) return;
			this.dynacodeData.isSend = true;
			this.$api.sendRequest({
				url: '/api/login/mobileCode',
				data: data,
				success: res => {
					this.dynacodeData.isSend = false;
					if (res.code >= 0) {
						this.formData.key = res.data.key;

						if (this.dynacodeData.seconds == 120 && this.dynacodeData.timer == null) {
							this.dynacodeData.timer = setInterval(() => {
								this.dynacodeData.seconds--;
								this.dynacodeData.codeText = this.dynacodeData.seconds + 's后可重新获取';
							}, 1000);
						}
					} else {
						this.$util.showToast({ title: res.message });
					}
				},
				fail: () => {
					this.$util.showToast({ title: 'request:fail' });
					this.dynacodeData.isSend = false;
				}
			});
		},
		checkOpenidIsExits() {
			if (Object.keys(this.authInfo).length) {
				uni.setStorage({
					key: 'authInfo',
					data: this.authInfo
				});
				this.$api.sendRequest({
					url: '/api/login/openidisexits',
					data: this.authInfo,
					success: res => {
						if (res.code >= 0 && res.data > 0) {
							this.isBind = true;
						}
					}
				});
			}
		}
	},
	watch: {
		'dynacodeData.seconds': {
			handler(newValue, oldValue) {
				if (newValue == 0) {
					clearInterval(this.dynacodeData.timer);
					this.dynacodeData = {
						seconds: 120,
						timer: null,
						codeText: '获取动态码',
						isSend: false
					};
				}
			},
			immediate: true,
			deep: true
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/common.scss';
</style>

<style>
/deep/ uni-toast .uni-simple-toast__text {
	background: red !important;
}
</style>
