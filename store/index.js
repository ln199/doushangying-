import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Http from '../common/js/http.js'

const store = new Vuex.Store({
	state: {
		tabbarList: {},
		cartNumber: 0, //购物车数量
		wholeSaleNumber: 0, //进货单数量
		themeStyle: '',
		Development: 1,
		addonIsExit: {
			bundling: 0,
			coupon: 0,
			discount: 0,
			fenxiao: 0,
			gift: 0,
			groupbuy: 0,
			manjian: 0,
			memberconsume: 0,
			memberrecharge: 0,
			memberregister: 0,
			membersignin: 0,
			memberwithdraw: 0,
			pintuan: 0,
			pointexchange: 0,
			seckill: 0,
			store: 0,
			topic: 0,
			bargain: 0,
			membercancel: 0,
			servicer: 0
		},
		bottomNavHeight: 0,
		sourceMember: 0, // 来源会员
		authInfo: {}, // 授权信息
		paySource: '',
		token: null,
		diySeckillInterval: null
	},
	mutations: {
		setDevelopment(state, Development) {
			state.Development = Development
		},
		setCartNumber(state, cartNumber) {
			state.cartNumber = cartNumber
		},
		setWholeSaleNumber(state, wholeSaleNumber) {
			state.wholeSaleNumber = wholeSaleNumber
		},
		setThemeStyle(state, ThemeStyle) {
			state.themeStyle = ThemeStyle
		},
		setAddonIsexit(state, addonIsExit) {
			state.addonIsExit = Object.assign(state.addonIsExit, addonIsExit);
		},
		setTabbarList(state, value) {
			state.tabbarList = value;
		},
		setToken(state, value) {
			state.token = value;
		},
		setAuthinfo(state, value) {
			state.authInfo = value;
		},
		setSourceMember(state, value) {
			state.sourceMember = value;
		},
		setPaySource(state, value) {
			state.paySource = value;
		},
		setDiySeckillInterval(state, value) {
			state.diySeckillInterval = value;
		},
		setBottomNavHeight(state, value) {
			state.bottomNavHeight = value;
		}
	},
	actions: {
		init() {
			if (uni.getStorageSync('setThemeStyle')) {
				this.commit('setThemeStyle', uni.getStorageSync('setThemeStyle'));
			}
			if (uni.getStorageSync('memberAddonIsExit')) {
				this.commit('setAddonIsexit', uni.getStorageSync('memberAddonIsExit'));
			}
			return new Promise((resolve, reject) => {
				Http.sendRequest({
					url: '/api/config/init',
					success: res => {
						var data = res.data;
						if (data) {
							this.commit('setCartNumber', data.cart_count);

							this.commit('setWholeSaleNumber', data.wholesale_cart_count);

							this.commit('setThemeStyle', data.style_theme);
							uni.setStorageSync('setThemeStyle', data.style_theme);

							uni.setStorageSync('memberAddonIsExit', data.addon_is_exit);
							this.commit('setAddonIsexit', data.addon_is_exit);

							this.commit('setTabbarList', data.diy_bottom_nav);

							this.commit('setDevelopment', data.development);

							uni.setStorageSync('default_img', JSON.stringify(data.default_img));

							resolve(data);
						}
					}
				});
			})
		},
		//查询购物车数量
		getCartNumber() {
			if (uni.getStorageSync("token")) {
				return new Promise((resolve, reject) => {
					Http.sendRequest({
						url: '/api/cart/count',
						success: res => {
							if (res.code == 0) {
								this.commit('setCartNumber', res.data);
								resolve(res.data);
							}
						}
					});
				})
			} else {
				this.commit('setCartNumber', 0);
			}
		},
		//查询进货单数量
		getWholeSaleNumber() {
			Http.sendRequest({
				url: '/wholesale/api/cart/count',
				success: res => {
					if (res.code == 0) {
						this.commit('setWholeSaleNumber', res.data);
					}
				}
			});
		},
		getThemeStyle() {
			Http.sendRequest({
				url: '/api/diyview/style',
				success: res => {
					if (res.code == 0) {
						this.commit('setThemeStyle', res.data.style_theme);
						uni.setStorageSync('setThemeStyle', res.data.style_theme);
					}
				}
			});
		},
		// 获取插件是否安装
		getAddonIsexit() {
			if (uni.getStorageSync('memberAddonIsExit')) {
				this.commit('setAddonIsexit', uni.getStorageSync('memberAddonIsExit'))
			}
			return new Promise((resolve, reject) => {
				Http.sendRequest({
					url: '/api/addon/addonisexit',
					success: res => {
						if (res.code == 0) {
							uni.setStorageSync('memberAddonIsExit', res.data);
							this.commit('setAddonIsexit', res.data);
							resolve(res.data);
						}
					}
				});
			})

		},
		// 获取默认图
		defaultImg() {
			Http.sendRequest({
				url: '/api/config/defaultimg',
				success: res => {
					let data = res.data;
					if (res.code == 0 && data) {
						uni.setStorageSync('default_img', JSON.stringify(data));
					}
				}
			});
		},
	}
})
export default store
