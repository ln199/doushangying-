<template>
	<view :data-theme="themeStyle" :style="{ backgroundColor: bgColor, backgroundImage: bgImg, minHeight: 'calc(100vh - 55px)' }" class="page_img">
		<!-- #ifndef H5 -->
		<view class="page-header">
			<ns-navbar
				:is-back="!1"
				:background="bgNav"
				:title-color="textNavColor"
				:border-bottom="false"
				:globalS="diyData.global"
				z-index="1001"
				:type="index"
				type="index"
				ref="topNav"
			></ns-navbar>
		</view>
		<!-- #endif -->

		<diy-index-page
			ref="indexPage"
			:value="topIndexValue"
			:minHeight="minHeight"
			:scrollHeight="scrollHeight"
			:scrollTopHeight="scrollTopHeight"
			:bgUrl="bgUrl"
			v-if="topIndexValue"
		>
			<diy-group :diyData="diyData" :siteId="siteId" v-if="diyData.value" :height="scrollTopHeight"></diy-group>
			<view class="padding-bottom"><ns-copyright></ns-copyright></view>
		</diy-index-page>

		<scroll-view scroll-y="true" show-scrollbar="false" :style="{ height: 'calc(100vh - headerHeight - 55px)' }" v-else>
			<view class="bg-index" :style="backgroundUrl">
				<diy-group :diyData="diyData" v-if="diyData.value" :siteId="siteId" :city="city"></diy-group>
				<view class="padding-bottom"><ns-copyright></ns-copyright></view>
			</view>
		</scroll-view>

		<template v-show="diyData.global && diyData.global.popWindow && diyData.global.popWindow.count != -1 && diyData.global.popWindow.imageUrl">
			<view @touchmove.prevent.stop>
				<uni-popup ref="uniPopupWindow" type="center" class="wap-floating" :maskClick="false">
					<view class="image-wrap" v-if="diyData.global && diyData.global.popWindow">
						<image
							:src="$util.img(diyData.global.popWindow.imageUrl)"
							:style="{ height: (480 * diyData.global.popWindow.imgHeight) / diyData.global.popWindow.imgWidth + 'rpx' }"
							@click="redirectTo(diyData.global.popWindow.link)"
						></image>
					</view>
					<text class="iconfont iconroundclose" @click="closePopupWindow"></text>
				</uni-popup>
			</view>
		</template>

		<!-- 站点关闭展示 -->
		<view @touchmove.prevent.stop class="PopWindow">
			<uni-popup ref="uniPopupClose" type="center" class="wap-floating" :maskClick="false">
				<view class="popup-box">
					<view class="close_title margin-top">站点关闭</view>
					<view class="close_content">
						<scroll-view scroll-y="true" class="close_content_box" v-if="webSiteInfo && webSiteInfo.close_reason">{{ webSiteInfo.close_reason }}</scroll-view>
					</view>
				</view>
			</uni-popup>
		</view>

		<!-- 底部tabBar -->
		<view class="tabBar-fill"></view>
		<view class="page-bottom" v-if="openBottomNav"><diy-bottom-nav @callback="callback"></diy-bottom-nav></view>

		<!-- 收藏 -->
		<uni-popup ref="collectPopupWindow" type="top" class="wap-floating wap-floating-collect">
			<view v-if="showTip" class="collectPopupWindow" :style="{ marginTop: collectTop + statusBarHeight + 'px' }">
				<image :src="$util.img('/upload/uniapp/collect2.png')" mode="aspectFit"></image>
				<text @click="closeCollectPopupWindow">我知道了</text>
			</view>
		</uni-popup>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import WxMap from 'common/js/map-wx-jssdk.js';
import diyIndexPage from '@/components/diy-index-page/diy-index-page.vue';
import diyGroup from '@/components/diy-group/diy-group.vue';
import nsNavbar from '@/components/ns-navbar/ns-navbar.vue';
import { Weixin } from 'common/js/wx-jssdk.js';
import globalConfig from '@/common/js/golbalConfig.js';
import nsCopyRight from '@/components/ns-copyright/ns-copyright.vue';
let systemInfo = uni.getSystemInfoSync();
export default {
	components: {
		uniPopup,
		diyBottomNav,
		nsNavbar,
		diyIndexPage,
		diyGroup,
		nsCopyRight
	},
	data() {
		return {
			diyData: {
				global: {
					title: '',
					popWindow: {
						imageUrl: '',
						count: -1,
						link: {}
					}
				}
			},
			navTitle: '',
			webSiteInfo: null,
			memberId: 0,
			id: 0,
			city: '',
			siteId: 0,
			isIphoneX: false,
			pageHeight: '0',
			headerHeight: '0',
			bottomHeight: '0',
			topIndexValue: null,
			statusBarHeight: systemInfo.statusBarHeight,
			collectTop: 44,
			showTip: false,
			mpCollect: false
		};
	},
	mixins: [globalConfig],
	computed: {
		top() {
			let top = 0;
			// #ifndef h5
			top = this.isIphoneX ? 180 : 140;
			// #endif
			// #ifdef H5
			top = 90;
			// #endif
			return top;
		},
		bgColor() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.bgColor;
			}
			return str;
		},
		bgImg() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.topNavbg ? 'url(' + this.$util.img(this.diyData.global.bgUrl) + ')' : this.diyData.global.bgColor;
			}
			return str;
		},
		bgUrl() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.topNavbg ? 'transparent' : this.diyData.global.bgUrl;
			}
			return str;
		},
		bgNav() {
			if (this.diyData.global.topNavColor) {
				return { background: this.diyData.global.topNavColor };
			} else {
				return { background: '#ffffff' };
			}
		},
		backgroundUrl() {
			var str = this.bgUrl ? 'background:' + 'url(' + this.$util.img(this.bgUrl) + ') no-repeat 0 0/100%' : '';
			return str;
		},
		scrollHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(' + this.pageHeight + 'px - ' + this.headerHeight + ' - ' + this.bottomHeight + ')';
			} else {
				return '100vh';
			}
		},
		scrollTopHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(' + this.pageHeight + 'px - ' + this.headerHeight + ' - ' + this.bottomHeight + ' - 80rpx)';
			} else {
				return '100vh';
			}
		},
		textNavColor() {
			if (this.diyData.global.textNavColor) {
				return this.diyData.global.textNavColor;
			} else {
				return '#ffffff';
			}
		},
		openBottomNav() {
			let str = false;
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.openBottomNav;
			}
			return str;
		},
		minHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(100vh - ' + this.headerHeight + ' - ' + this.bottomHeight + ' - 80rpx)';
			} else {
				return '100vh';
			}
		},
		globalS() {
			return this.diyData.global;
		}
	},
	//下拉刷新
	async onPullDownRefresh() {
		await this.getDiyInfo();
	},
	onLoad(data) {
		uni.hideTabBar();
		this.siteId = parseInt(data.site_id) || 0;
		this.isIphoneX = this.$util.uniappIsIPhoneX();

		if (data.web_city) {
			uni.setStorageSync('city', {
				id: data.web_city,
				title: decodeURI(data.title)
			});
		}

		// 如果传入站点id，则清空地址
		if (this.siteId) uni.removeStorageSync('city');

		if (data.source_member) uni.setStorageSync('source_member', data.source_member);

		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('source_member') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
				});
			}
		}
	},
	onHide() {
		// 清除限时秒杀定时器
		this.$store.commit('setDiySeckillInterval', null);
	},
	async onShow() {
		await this.refresh();
		this.getHeight();
		this.$store.commit('setDiySeckillInterval', 1);
	},
	onPageScroll(e) {
		if (this.$refs.topNav) {
			if (e.scrollTop >= 20) {
				this.$refs.topNav.navTopBg();
			} else {
				this.$refs.topNav.unSetnavTopBg();
			}
		}
	},
	methods: {
		callback() {
			if (this.$refs.indexPage) {
				this.$refs.indexPage.initPageIndex();
			}
		},
		async refresh() {
			this.$langConfig.refresh();

			if (uni.getStorageSync('token')) {
				this.getMemberId();
			}

			this.$store.dispatch('defaultImg');
			this.$store.dispatch('getThemeStyle');
			this.getWebSitefo();

			if (uni.getStorageSync('city')) {
				this.city = uni.getStorageSync('city').title;
			} else {
				uni.setStorageSync('city', {
					id: 0,
					title: '全国'
				});
				this.city = '全国';
			}
			await this.getDiyInfo();
		},
		//计算高度
		getHeight() {
			var self = this;
			//获取页面可用区域的高度
			uni.getSystemInfo({
				success: res => {
					this.pageHeight = res.screenHeight;
				}
			});
			// #ifdef MP || APP-PLUS
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.page-header')
					.boundingClientRect(data => {
						this.headerHeight = data.height + 'px';
					})
					.exec();
			});
			// #endif
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.page-bottom')
					.boundingClientRect(data => {
						this.bottomHeight = 55 + 'px';
					})
					.exec();
			});
		},
		async getDiyInfo() {
			let name = 'DIY_VIEW_INDEX';
			let city = uni.getStorageSync('city');
			if (city.id) name = 'DIY_VIEW_CITY_INDEX';
			this.$api.sendRequest({
				url: '/api/diyview/info',
				data: {
					name: name,
					site_id: this.siteId
				},
				async: true,
				success: res => {
					if (res.code != 0 || !res.data) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.diyData = {};
						return;
					}
					let diyDatavalue = res.data;
					//处理后台组件input输入单引号问题 -- 英文状态下
					diyDatavalue.value = diyDatavalue.value.replace(/\@/g, "'");
					if (diyDatavalue.value) {
						this.diyData = JSON.parse(diyDatavalue.value);
						this.$langConfig.title(this.diyData.global.title);
						this.navTitle = this.diyData.global.title;
						this.mpCollect = this.diyData.global.mpCollect;
						if (this.diyData.global.popWindow && this.diyData.global.popWindow.imageUrl) {
							// 弹框形式，首次弹出 1，每次弹出 0
							setTimeout(() => {
								if (this.diyData.global.popWindow.count == 1) {
									var index_popwindow_count = uni.getStorageSync('index_popwindow_count');
									if ((this.$refs.uniPopupWindow && index_popwindow_count == '') || (this.$refs.uniPopupWindow && index_popwindow_count == 1)) {
										this.$refs.uniPopupWindow.open();
										uni.setStorageSync('index_popwindow_count', 1);
									}
								} else if (this.diyData.global.popWindow.count == 0) {
									this.$refs.uniPopupWindow.open();
									uni.setStorageSync('index_popwindow_count', 0);
								}
							}, 500);
						}

						for (var i = 0; i < this.diyData.value.length; i++) {
							if (this.diyData.value[i].controller == 'TopCategory') {
								this.topIndexValue = this.diyData.value[i];
							}
						}

						// #ifdef MP
						//小程序收藏
						if (!uni.getStorageSync('isCollect') && this.diyData.global.mpCollect) {
							this.$refs.collectPopupWindow.open();
							// uni.setStorageSync('isCollect', true);
							// uni.getStorageSync('isCollect',true);
							this.showTip = true;
						}
						// #endif
					}
					uni.stopPullDownRefresh();
					// setTimeout(() => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					// }, 1200);
				},
				fail: res => {
					uni.stopPullDownRefresh();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		closePopupWindow() {
			this.$refs.uniPopupWindow.close();
			uni.setStorageSync('index_popwindow_count', -1);
		},
		closeCollectPopupWindow() {
			this.$refs.collectPopupWindow.close();
			uni.setStorageSync('isCollect', true);
		},
		redirectTo(link) {
			this.$util.diyRedirectTo(link);
		},
		getMemberId() {
			this.$api.sendRequest({
				url: '/api/member/id',
				success: res => {
					if (res.code >= 0) {
						this.memberId = res.data;
					}
				}
			});
		},
		getWebSitefo() {
			this.webSiteInfo = uni.getStorageSync('web_site_info');
			if (this.webSiteInfo) this.webSiteInfo = JSON.parse(this.webSiteInfo);
			this.$api.sendRequest({
				url: '/api/website/info',
				success: res => {
					let data = res.data;
					if (data) {
						this.webSiteInfo = data;
						if (this.webSiteInfo.wap_status) return;
						this.$refs.uniPopupClose.open();
						uni.setStorageSync('web_site_info', JSON.stringify(this.webSiteInfo));
					}
				}
			});
		},
		// #ifdef MP-WEIXIN
		// 分享到微信朋友圈
		onShareTimeline() {
			let query = '';
			if (this.memberId) query = 'source_member=' + this.memberId;
			return {
				title: '',
				query: query,
				imageUrl: ''
			};
		}
		// #endif
	},
	onShareAppMessage(res) {
		var title = '';
		if (this.webSiteInfo) title = this.webSiteInfo.title;
		var path = '/pages/index/index/index';
		var city = uni.getStorageSync('city');

		if (city.id) path += '?name=DIY_VIEW_CITY_INDEX&web_city=' + city.id + '&title=' + encodeURI(city.title);
		if (city.id && this.memberId) {
			path += '&source_member=' + this.memberId;
		} else if (this.memberId) {
			path += '?source_member=' + this.memberId;
		}
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	},
	onReady() {
		// 微信公众号分享
		// #ifdef H5
		if (this.$util.isWeiXin()) {
			this.$api.sendRequest({
				url: '/wechat/api/wechat/share',
				data: {
					url: window.location.href
				},
				success: res => {
					if (res.code == 0) {
						var wxJS = new Weixin();
						wxJS.init(res.data.jssdk_config);

						var shareConfig = res.data.share_config,
							url = this.$config.h5Domain + '/pages/index/index/index';

						var city = uni.getStorageSync('city');
						if (city.id) path += '?name=DIY_VIEW_CITY_INDEX&web_city=' + city.id + '&title=' + encodeURI(city.title);
						if (city.id && this.memberId) {
							path += '&source_member=' + this.memberId;
						} else if (this.memberId) {
							path += '?source_member=' + this.memberId;
						}

						wxJS.setShareData({
							title: shareConfig.shop_param_1 + shareConfig.site_name,
							desc: shareConfig.shop_param_2 + '\r\n' + shareConfig.shop_param_3 + '\r\n' + '收藏热度：★★★★★',
							link: url,
							imgUrl: this.$util.img(shareConfig.site_logo)
						});
					}
				}
			});
		}
		// #endif
	}
};
</script>

<style lang="scss">
.collectPopupWindow {
	position: relative;
	height: 113rpx;
	width: 510rpx;
	margin-left: calc(100% - 530rpx);

	image {
		width: 100%;
		height: 100%;
	}

	text {
		color: #ff4544 !important;
		font-size: 24rpx !important;
		position: absolute;
		top: 48rpx;
		right: 25rpx;
	}
}
.zhezhao {
	width: 100vw;
	height: 100vh;
	background-color: transparent;
}
image {
	max-width: 100% !important;
	max-height: 100% !important;
}
.diy-wrap {
	/* #ifdef H5 */
	height: calc(100vh - 44px);
	/* #endif */
	/* #ifdef MP-WEIXIN */
	height: 100vh;
	/* #endif */
}
.page_img {
	background-size: contain !important;
	background-repeat: no-repeat !important;
}
.bg-index {
	width: 100%;
	height: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
}

.wap-floating {
	.image-wrap {
		width: 480rpx;

		image {
			width: 100%;
			border-radius: 40rpx;
		}
	}

	text {
		display: block;
		font-size: 60rpx;
		color: #ffffff;
		text-align: center;
	}
}

.wap-floating-collect .uni-popup__mask {
	background: transparent;
}

::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}

.popup-box {
	width: 450rpx;
	background: #ffffff;
	border-radius: $border-radius;
	overflow: hidden;

	.close_title {
		width: 100%;
		text-align: center;
		height: 70rpx;
		line-height: 70rpx;
		font-size: $font-size-base;
	}

	.close_content {
		width: 100%;
		max-height: 500rpx;
		padding: $padding;
		box-sizing: border-box;
	}

	.close_content_box {
		width: 100%;
		max-height: 460rpx;
		line-height: 1.3;
	}
}

.noStore-text {
	color: #000000 !important;
}

.isStore-top {
	margin-bottom: 10rpx;
}

.tabBar-fill {
	height: calc(constant(safe-area-inset-bottom) + 56px);
	height: calc(env(safe-area-inset-bottom) + 56px);
}
.keep-on-record {
	text-align: center;
	padding-bottom: 20rpx;
	image {
		width: 150rpx;
		height: 60rpx;
	}
}
/deep/::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
	display: none;
}
</style>

<style scoped>
.wap-floating >>> .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
}

/* .noStore-bg /deep/ .search-box {
	background: #ffffff;
}

.noStore-bg /deep/ .single-graph {
	background: #ffffff;
} */
/deep/ .placeholder {
	height: 0;
}
</style>
