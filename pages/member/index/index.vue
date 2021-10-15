<template>
	<view :data-theme="themeStyle">
		<view class="container">
			<view class="member-container">
				<view class="user-section ns-gradient-pages-member-index-index" :data-theme="defaultInfo.topStyle == 'default' ? themeStyle : ''"
				 :style="defaultBgColor">
					<!-- #ifdef APP-PLUS -->
					<view class="free"></view>
					<!-- #endif -->
					<view class="bg-img">
						<image :src="defaultBgImg" mode="widthFix"></image>
					</view>
					<view class="user-section-box">
						<view class="user-info-box" v-if="token">
							<view @click="$util.redirectTo('/pages/member/info/info')" class="user-head">
								<image :src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().default_headimg" mode="aspectFill"
								 @error="memberInfo.headimg = $util.getDefaultImage().default_headimg"></image>
							</view>
							<view class="user-box">
								<text class="user-title" :style="defaultTextColor">{{ memberInfo.nickname }}</text>
								<view v-if="memberInfo.member_level_name" @click="$util.redirectTo('/otherpages/member/level/level')" class="user-label">
									<text>{{ memberInfo.member_level_name }}</text>
								</view>
							</view>
						</view>
						<view class="user-info-box no-log" v-if="!token" @click="redirectToLink('/pages/member/index/index')">
							<view class="user-head">
								<image :src="$util.getDefaultImage().default_headimg"></image>
							</view>
							<view class="user-box">
								<text class="user-title" :style="defaultTextColor">{{ $lang('login') }}</text>
								<text class="user-desc" :style="defaultTextColor">{{ $lang('loginTpis') }}</text>
							</view>
						</view>
						<view @click="redirectToLink('/pages/member/info/info')" class="user-set" v-if="token">
							<view :style="defaultTextColor" class="iconfont iconshezhi"></view>
						</view>
						<view class="member-sction">
							<view class="sction-item" @click="redirectToLink('/otherpages/member/balance/balance')">
								<text class="num" :style="defaultTextColor">{{ (parseFloat(memberInfo.balance) + parseFloat(memberInfo.balance_money)).toFixed(2) }}</text>
								<text class="sction-item-name" :style="defaultTextColor">{{ $lang('balance') }}</text>
							</view>
							<view class="line"></view>
							<view class="sction-item" @click="redirectToLink('/otherpages/member/point/point')">
								<text class="num" :style="defaultTextColor">{{ parseInt(memberInfo.point) }}</text>
								<text class="sction-item-name" :style="defaultTextColor">{{ $lang('point') }}</text>
							</view>
							<view class="line"></view>
							<view class="sction-item" @click="redirectToLink('/otherpages/member/coupon/coupon')">
								<text class="num" :style="defaultTextColor">{{ couponNum }}</text>
								<text class="sction-item-name" :style="defaultTextColor">{{ $lang('coupon') }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="member-body">
					<!-- 订单模块 -->
					<view class="order-section">
						<view class="order-head" @click="redirectToLink('/pages/order/list/list')">
							<text class="order-tit">{{ $lang('allOrders') }}</text>
							<text class="order-tip">{{ $lang('seeAllOrders') }}</text>
							<text class="order-more iconfont iconright"></text>
						</view>
						<view class="order-body">
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitpay')">
								<view class="order-icon">
									<text v-if="orderNum.waitPay > 99" class="order-num color-base-bg">99+</text>
									<text v-else-if="orderNum.waitPay > 0" class="order-num color-base-bg">{{ orderNum.waitPay }}</text>
									<image :src="$util.img('upload/uniapp/member/index/order/default_order_1.png')" mode="aspectFit"></image>
								</view>
								<text class="order-name">{{ $lang('waitPay') }}</text>
							</view>
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitsend')">
								<view class="order-icon">
									<text v-if="orderNum.readyDelivery > 99" class="order-num color-base-bg">99+</text>
									<text v-else-if="orderNum.readyDelivery > 0" class="order-num color-base-bg">{{ orderNum.readyDelivery }}</text>
									<image :src="$util.img('upload/uniapp/member/index/order/default_order_2.png')" mode="aspectFit"></image>
								</view>
								<text class="order-name">{{ $lang('readyDelivery') }}</text>
							</view>
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitconfirm')">
								<view class="order-icon">
									<text v-if="orderNum.waitDelivery > 99" class="order-num color-base-bg">99+</text>
									<text v-else-if="orderNum.waitDelivery > 0" class="order-num color-base-bg">{{ orderNum.waitDelivery }}</text>
									<image :src="$util.img('upload/uniapp/member/index/order/default_order_3.png')" mode="aspectFit"></image>
								</view>
								<text class="order-name">{{ $lang('waitDelivery') }}</text>
							</view>
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitrate')">
								<view class="order-icon">
									<block v-if="evaluateConfig.evaluate_status == 1">
										<text v-if="orderNum.waitEvaluate > 99" class="order-num color-base-bg">99+</text>
										<text v-else-if="orderNum.waitEvaluate > 0" class="order-num color-base-bg">{{ orderNum.waitEvaluate }}</text>
									</block>
									<image :src="$util.img('upload/uniapp/member/index/order/default_order_4.png')" mode="aspectFit"></image>
								</view>
								<text class="order-name">{{ $lang('waitEvaluate') }}</text>
							</view>
							<view class="order-item" @click="redirectToLink('/pages/order/activist/activist')">
								<view class="order-icon">
									<text v-if="orderNum.refunding > 99" class="order-num color-base-bg">99+</text>
									<text v-else-if="orderNum.refunding > 0" class="order-num color-base-bg">{{ orderNum.refunding }}</text>
									<image :src="$util.img('upload/uniapp/member/index/order/default_order_5.png')" mode="aspectFit"></image>
								</view>
								<text class="order-name">{{ $lang('refunding') }}</text>
							</view>
						</view>
					</view>

					<view v-if="defaultInfo.level == 1" class="member-level" :class="{ 'no-default-level': defaultInfo.menuStyle != 'palace' && defaultInfo.topStyle != 'default' }"
					 @click="jumpLevel()">
						<view class="member">
							<image :src="$util.img('upload/uniapp/member/index/member.png')" mode="aspectFit"></image>
						</view>
						<view class="member-level-box">
							<view class="img-wrap">
								<image class="img-v" :src="$util.img('upload/uniapp/member/index/v.png')" mode="aspectFit"></image>
								<text class="font-size-tag" v-if="token">{{ memberInfo.member_level_name }}</text>
								<text class="font-size-goods-tag" v-else>登录查看权益</text>
							</view>
							<text class="memeber-tit">
								<text class="member-title">会员等级更多权益</text>
								<text class="iconfont iconright font-size-goods-tag"></text>
							</text>
						</view>
					</view>

					<!-- 常用功能模块 -->
					<view class="example-body" :style="{ background: defaultInfo.topStyle == 'default' || defaultInfo.menuStyle == 'palace' ? '#fff' : '#f7f7f7' }">
						<view class="example-body-head" :class="{ 'example-tit-palace': defaultInfo.menuStyle != 'palace' && defaultInfo.topStyle != 'default' }">
							<text class="example-tit">常用工具</text>
						</view>
						<template v-if="defaultInfo.menuStyle == 'palace'">
							<uni-grid :column="4" :show-border="false" :square="false">
								<block v-for="(item, index) in defaultInfo.menuList" :key="index">
									<view @click="redirectToLink(item.url)" v-if="menuIsShow(item)">
										<block v-if="item.tag == 'servicer'">


										</block>
										<block v-else>
											<uni-grid-item>
												<image class="image" :src="$util.img(item.img)" mode="aspectFill" />
												<text class="text">{{ item.text }}</text>
												<!-- <text class="text" v-if="item.tag=='fenxiao'">{{ fenxiaoWords.concept + '中心' }}</text> -->
											</uni-grid-item>
										</block>
									</view>
								</block>
							</uni-grid>
						</template>
						<view v-if="defaultInfo.menuStyle == 'list'" class="list-style">
							<block v-for="(item, index) in defaultInfo.menuList" :key="index">
								<view class="list-style-item" :class="defaultInfo.insertGap == 0 ? 'no-interval' : 'interval'" @click="redirectToLink(item.url)"
								 v-if="menuIsShow(item)">
									<block v-if="item.tag == 'servicer'">
										<!-- 客服 -->

									</block>
									<block v-else>
										<image class="image" :src="$util.img(item.img)" mode="aspectFill" />
										<text class="text">{{ item.text }}</text>
										<text class="iconfont iconright"></text>
										<!-- <text class="text" v-if="item.tag=='fenxiao'">{{ fenxiaoWords.concept + '中心' }}</text> -->
									</block>
								</view>
							</block>
						</view>
					</view>
				</view>
				<view class="padding-bottom">
					<ns-copyright></ns-copyright>
				</view>

				<ns-login ref="login"></ns-login>
				<loading-cover ref="loadingCover"></loading-cover>
				<!-- 底部tabBar -->
				<diy-bottom-nav type="shop"></diy-bottom-nav>
			</view>
		</view>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
	</view>
</template>

<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue';
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	import toTop from '@/components/toTop/toTop.vue';
	import scroll from '@/common/js/scroll-view.js';
	import nsCopyRight from '@/components/ns-copyright/ns-copyright.vue';
	import fenxiaoWords from 'common/js/fenxiao-words.js';
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		components: {
			uniGrid,
			uniGridItem,
			diyBottomNav,
			toTop,
			nsCopyRight
		},
		data() {
			return {
				token: '',
				memberInfo: {
					balance: 0,
					balance_money: 0,
					point: 0
				},
				couponNum: 0,
				orderNum: {
					waitPay: 0, //待付款
					readyDelivery: 0, //待发货
					waitDelivery: 0, //待收货
					waitEvaluate: 0, // 待评价
					refunding: 0 // 退款中
				},
				isVerification: true,
				copyrightLoad: 0,
				bottom_info: {},
				authInfo: {
					is_verifier: false
				},

				shopTop: false,
				scrollTop: 0,
				shopConfig: null,
				promoterInfo: null,
				withdrawConfig: null,
				fenxiaoBasicsConfig: null,
				defaultInfo: {
					topStyle: 'default',
					bgColor: '#ff454f',
					textColor: '#fff',
					bgImg: '',
					menuList: [],
					insertGap: '0',
					menuStyle: 'palace',
					level: 1
				},
				signState: 1, // 签到是否开启
				evaluateConfig: {
					evaluate_audit: 1,
					evaluate_show: 0,
					evaluate_status: 1
				}
			};
		},
		mixins: [scroll, fenxiaoWords, globalConfig],
		onLoad() {
			uni.hideTabBar();
			if (this.addonIsExit.memberwithdraw) {
				this.getWithdrawConfig();
			}
			if (this.addonIsExit.fenxiao) {
				this.getFenxiaoBasicsConfig();
			}
			this.getEvaluateConfig();
		},
		computed: {
			storeToken() {
				return this.$store.state.token;
			},
			defaultBgColor() {
				var val = '';
				if (this.defaultInfo.topStyle != 'default') {
					val = 'background:' + this.defaultInfo.bgColor;
				}
				return val;
			},
			defaultBgImg() {
				var defaultImg = '';
				if (this.defaultInfo.topStyle != 'default') {
					defaultImg = this.defaultInfo.bgImg ? this.$util.img(this.defaultInfo.bgImg) : '';
				} else {
					defaultImg = this.$util.img('upload/uniapp/member/index/member_bg.png');
				}
				return defaultImg;
			},
			defaultTextColor() {
				var textColor = '';
				if (this.defaultInfo.topStyle != 'default') {
					textColor = 'color:' + this.defaultInfo.textColor + ' !important';
				}
				return textColor;
			}
		},
		watch: {
			storeToken: async function(nVal, oVal) {
				if (this.addonIsExit.membersignin) {
					await this.getSignState();
				}
				await this.getMemberInfo();
				this.getOrderNum();
				this.getCouponNum();
				this.checkIsVerifier();
			}
		},
		async onReady() {
			if (this.addonIsExit.membersignin) {
				await this.getSignState();
			}
			await this.getDefaultInfo();
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		},
		async onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			this.token = uni.getStorageSync('token');

			if (uni.getStorageSync('userInfo')) {
				this.memberInfo = uni.getStorageSync('userInfo');
			}

			if (uni.getStorageSync('authInfo')) {
				this.authInfo = uni.getStorageSync('authInfo');
			}

			if (this.token) {
				if (this.addonIsExit.membersignin) {
					await this.getSignState();
				}
				await this.getMemberInfo();
				this.getOrderNum();
				this.getCouponNum();
				this.checkIsVerifier();
				// if (this.addonIsExit.memberwithdraw) {
				// 	this.getWithdrawConfig();
				// }
				// if (this.addonIsExit.fenxiao) {
				// 	this.getFenxiaoBasicsConfig();
				// }
			} else {
				this.initInfo();
			}
			this.$forceUpdate();
		},
		methods: {
			// 签到是否开启
			async getSignState() {
				var res = await this.$api.sendRequest({
					url: '/api/membersignin/getSignStatus',
					async: false
				});
				if (res.code == 0) {
					this.signState = res.data.is_use;
				}
			},
			async getDefaultInfo() {
				var res = await this.$api.sendRequest({
					url: '/api/diyview/memberindex',
					async: false
				});
				if (res.code == 0) {
					this.defaultInfo.topStyle = res.data.topStyle;
					this.defaultInfo.bgColor = res.data.bgColor;
					this.defaultInfo.textColor = res.data.textColor;
					this.defaultInfo.bgImg = res.data.bgImg;
					this.defaultInfo.menuStyle = res.data.menuStyle;
					this.defaultInfo.menuList = res.data.menuList;
					this.defaultInfo.insertGap = res.data.insertGap;
					this.defaultInfo.level = res.data.level || 1;
				}
			},
			redirectToLink(url) {
				if (!uni.getStorageSync('token')) {
					this.$refs.login.open(url);
				} else {
					this.$util.redirectTo(url);
				}
			},
			initInfo() {
				this.token = '';
				this.memberInfo = {
					balance: '0.00',
					balance_money: '0.00',
					point: 0
				};
				this.couponNum = 0;
				this.orderNum = {
					waitPay: 0, //待付款
					readyDelivery: 0, //待发货
					waitDelivery: 0, //待收货
					waitEvaluate: 0, // 待评价
					refunding: 0 // 退款中
				};
				this.authInfo = {
					is_verifier: false
				};
				uni.stopPullDownRefresh();
			},
			// 获取会员基础信息
			async getMemberInfo() {
				let res = await this.$api.sendRequest({
					url: '/api/member/info',
					async: false
				});
				if (res.code >= 0 && res.data) {
					this.token = uni.getStorageSync('token');
					this.memberInfo = res.data;
					uni.setStorageSync('userInfo', this.memberInfo);
				} else {
					this.token = '';
					this.initInfo();
					uni.removeStorageSync('token');
					uni.removeStorageSync('userInfo');
				}
				uni.stopPullDownRefresh();
			},
			// 下拉刷新
			onPullDownRefresh() {
				if (uni.getStorageSync('token')) this.getMemberInfo();
				else this.initInfo();
			},
			// 订单数量
			getOrderNum() {
				this.$api.sendRequest({
					url: '/api/order/num',
					data: {
						order_status: 'waitpay,waitsend,waitconfirm,waitrate,refunding'
					},
					success: res => {
						if (res.code == 0) {
							this.orderNum.waitPay = res.data.waitpay;
							this.orderNum.readyDelivery = res.data.waitsend;
							this.orderNum.waitDelivery = res.data.waitconfirm;
							this.orderNum.waitEvaluate = res.data.waitrate;
							this.orderNum.refunding = res.data.refunding;
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			// 优惠券数量
			getCouponNum() {
				this.$api.sendRequest({
					url: '/api/member/couponnum',
					success: res => {
						if (res.code == 0) {
							this.couponNum = res.data;
						}
					}
				});
			},
			checkIsVerifier() {
				this.$api.sendRequest({
					url: '/api/verify/checkisverifier',
					success: res => {
						this.authInfo.is_verifier = res.code == 0;
						uni.setStorageSync('authInfo', this.authInfo);
						this.$forceUpdate();
					}
				});
			},
			jumpLevel() {
				if (uni.getStorageSync('token')) {
					this.$util.redirectTo('/otherpages/member/level/level');
				} else {
					this.$refs.login.open('/pages/member/index/index');
				}
			},
			/**
			 * 获取余额提现配置
			 */
			getWithdrawConfig() {
				this.$api.sendRequest({
					url: '/api/memberwithdraw/config',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.withdrawConfig = res.data;
							this.$forceUpdate();
						}
					}
				});
			},
			/**
			 * 获取分销基本配置
			 */
			getFenxiaoBasicsConfig() {
				this.$api.sendRequest({
					url: '/fenxiao/api/config/basics',
					success: res => {
						if (res.code >= 0) {
							this.fenxiaoBasicsConfig = res.data;
							this.$forceUpdate();
						}
					}
				});
			},
			getEvaluateConfig() {
				this.$api.sendRequest({
					url: '/api/goodsevaluate/config',
					success: res => {
						if (res.code == 0) {
							var data = res.data;
							this.evaluateConfig = data;
						}
					}
				});
			},
			menuIsShow(data) {
				switch (data.tag) {
					case 'fenxiao':
						return this.addonIsExit.fenxiao == 1 && this.fenxiaoBasicsConfig && this.fenxiaoBasicsConfig.level > 0;
						break;
					case 'memberwithdraw':
						return this.withdrawConfig && this.withdrawConfig.is_use == 1;
						break;
					case 'membersignin':
						return this.signState == 1;
						break;
					case 'verifier':
						return this.authInfo.is_verifier;
						break;
					default:
						return true;
				}
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/index.scss';

	/deep/.uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
	}
</style>
<style scoped>
	/deep/ .reward-popup .uni-popup__wrapper-box {
		background: none !important;
		max-width: unset !important;
		max-height: unset !important;
	}
</style>
