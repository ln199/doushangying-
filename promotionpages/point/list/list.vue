<template>
	<view class="point-wrap" :data-theme="themeStyle">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExit.pointexchange">
			<block slot="list">
				<view class="head-wrap color-base-bg">
					<image :src="$util.img('upload/uniapp/point/point_bg.png')" mode="widthFix"></image>
					<view class="wrap" :class="{ 'no-login': !token }">
						<view v-if="!token" @click="login">
							<view class="lineheight-clear"><text class="font-size-toolbar login-btn">立即登录</text></view>
							<view class="lineheight-clear"><text class="font-size-tag">登录后查看我的积分</text></view>
						</view>
						<view v-else class="member-wrap">
							<view class="headimg">
								<image
									:src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().default_headimg"
									mode="aspectFill"
									@error="memberInfo.headimg = $util.getDefaultImage().default_headimg"
								></image>
							</view>
							<text class="point">{{ point }}</text>
							<text class="point-name">积分</text>
							<view class="rule">
								<text class="iconfont iconwenhao"></text>
								<text class="font-size-tag" @click="openPointPopup()">兑换规则</text>
							</view>
						</view>
						<view class="action-wrap" v-if="token">
							<view @click="jumpPage('/otherpages/member/point/point')">
								积分明细
								<text class="iconfont iconright"></text>
							</view>
							<view class="split"></view>
							<view @click="jumpPage('/promotionpages/point/order_list/order_list')">
								兑换记录
								<text class="iconfont iconright"></text>
							</view>
						</view>
					</view>
				</view>

				<view class="body-wrap" :class="{ 'no-login': !token }">
					<view class="point-exchange-wrap" v-if="couponList.length > 0">
						<view class="type-wrap">
							<text class="type-name">积分换券</text>
							<view></view>
							<text class="type-sub">更多好券，帮你省钱</text>
						</view>

						<view class="list-wrap">
							<view class="list-wrap-scroll">
								<view class="list-wrap-item coupon-list-wrap-item" v-for="(couponItem, couponIndex) in couponList" :key="couponIndex" @click="toDetail(couponItem)">
									<view class="img-box"><image :src="$util.img('upload/uniapp/point/coupon_bg1.png')" @error="imgError(couponIndex)"></image></view>
									<view class="content">
										<view class="coupon" :style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/point/coupon_bg1.png') + ')' }">
											<view class="coupon_left color-line-border">
												<view class="price color-base-text">
													<block v-if="couponItem.coupon_type == 'reward'">
														<text>￥</text>
														{{ parseFloat(couponItem.money) }}
													</block>
													<block v-else-if="couponItem.coupon_type == 'discount'">{{ parseFloat(couponItem.discount) }}折</block>
													<block v-else>{{ parseFloat(couponItem.money) }}元</block>
												</view>
												<view class="coupon_condition font-size-activity-tag color-base-text">
													{{ couponItem.at_least == 0 ? '无门槛优惠券' : '满' + parseFloat(couponItem.at_least).toFixed(0) + '可用' }}
												</view>
												<view class="coupon_type font-size-activity-tag color-base-text">{{ couponItem.goods_type == 2 ? '指定券' : '全场券' }}</view>
											</view>
											<view class="coupon_right" style="min-width: 70px;">
												<view class="coupon_num color-base-text font-size-tag disFlex">
													<text class="textOve width35">{{ couponItem.point }}</text>
													积分
												</view>
												<view class="coupon_btn color-base-text margin-top">兑换</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="point-exchange-wrap" v-if="hongbaoList.length > 0">
						<view class="type-wrap">
							<text class="type-name">积分换红包</text>
							<view></view>
							<text class="type-sub">红包在手，省钱有道</text>
						</view>

						<view class="list-wrap">
							<view
								class="list-wrap-item hongbao-list-wrap-item"
								v-for="(hongbaoItem, hongbaoIndex) in hongbaoList"
								:key="hongbaoIndex"
								@click="toDetail(hongbaoItem)"
							>
								<view class="img-box"><image :src="$util.img('upload/uniapp/point/hongbao_bg.png')"></image></view>
								<view class="content">
									<view class="coupon hongbao">
										<view class="coupon_left">
											<view class="price ">
												<text>￥</text>
												{{ parseFloat(hongbaoItem.balance).toFixed(0) }}
											</view>
											<!-- <view class="coupon_condition font-size-activity-tag">{{ hongbaoItem.name }}</view> -->
											<view class="coupon_condition font-size-activity-tag">
												<text>{{ hongbaoItem.point }}</text>
												<text class="paddL_2">积分</text>
											</view>
										</view>
										<view class="coupon_right flex">
											<!-- <view class="coupon_num  font-size-tag disFlex"><text class="textOve">{{ hongbaoItem.point }}</text><text class="paddL_2">积分</text></view> -->
											<view class="coupon_btn">兑换</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="point-exchange-wrap" v-if="goodsList.length > 0">
						<view class="type-wrap">
							<text class="type-name">积分换好物</text>
							<view></view>
							<text class="type-sub">积累积分，兑换好物</text>
						</view>

						<view class="list-wrap">
							<view class="goods-list double-column" v-if="goodsList.length">
								<view class="goods-item margin-bottom" v-for="(item, index) in goodsList" :key="index">
									<view class="goods-img" @click="toDetail(item)"><image :src="goodsImg(item)" mode="widthFix" @error="imgError(index)"></image></view>
									<view class="info-wrap">
										<view class="name-wrap">
											<view class="goods-name" @click="toDetail(item)">{{ item.name }}</view>
										</view>
										<view class="lineheight-clear">
											<view class="discount-price">
												<text class="unit color-base-text">{{ item.point }}</text>
												<text class="unit color-base-text font-size-tag">积分</text>
												<block v-if="item.price > 0 && item.pay_type > 0">
													<text class="unit color-base-text font-size-tag">+</text>
													<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
													<text class="price color-base-text font-size-toolbar">{{ item.price }}</text>
												</block>
											</view>
										</view>
										<view class="pro-info">
											<view class="font-size-activity-tag color-tip">库存{{ item.stock }}</view>
											<view class="sale font-size-activity-tag color-tip" @click="toDetail(item)">
												<!-- <button type="primary" size="mini">立即兑换</button> -->
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view><ns-empty text="暂无数据" :isIndex="!1" :fixed="!1"></ns-empty></view>
			</block>
		</mescroll-uni>

		<!-- 弹出规则 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="pointPopup" type="bottom">
				<view class="tips-layer">
					<view class="head" @click="closePointPopup()">
						<view class="title">积分说明</view>
						<text class="iconfont iconclose"></text>
					</view>
					<view class="body">
						<view class="detail margin-bottom">
							<view class="tip">积分的获取</view>
							<view class="font-size-base">1、积分可在注册、签到、分享、消费、充值时获得。</view>
							<view class="font-size-base">2、在购买部分商品时可获得积分。</view>
							<view class="tip">积分的使用</view>
							<view class="font-size-base">1、积分可用于兑换积分中心的商品。</view>
							<view class="font-size-base">2、积分可在参与某些活动时使用。</view>
							<view class="font-size-base">3、积分不得转让，出售，不设有效期。</view>
							<view class="tip">积分的查询</view>
							<view class="font-size-base">1、积分可在会员中心中查询具体数额以及明细。</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	components: {
		uniPopup
	},
	data() {
		return {
			mescroll: null,
			categoryList: [
				{
					id: 1,
					name: '积分换好物'
				},
				{
					id: 2,
					name: '积分换券'
				},
				{
					id: 3,
					name: '积分换红包'
				}
			],
			selectCategoryId: 1,
			goodsList: [],
			couponList: [],
			hongbaoList: [],
			isLogin: false,
			point: 0,
			siteId: 0,
			token: null,
			isloading: false,
			memberInfo: {
				headimg: ''
			},
			signState: 1 // 签到是否开启
		};
	},
	onLoad(options) {
		if (options.site_id) {
			this.siteId = options.site_id;
		}
	},
	mixins: [globalConfig],
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.pointexchange) {
				this.$util.showToast({
					title: '积分商城未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			} else {
				if (uni.getStorageSync('token')) this.getMemberInfo();
				this.getCouponList();
				this.getHongbaoList();
				this.getSignState();
			}
		});
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getMemberInfo();
			}
		}
	},
	methods: {
		// 签到是否开启
		getSignState() {
			this.$api.sendRequest({
				url: '/api/membersignin/getSignStatus',
				success: res => {
					if (res.code == 0) {
						this.signState = res.data.is_use;
					}
				}
			});
		},
		// 打开积分说明弹出层
		openPointPopup() {
			this.$refs.pointPopup.open();
		},
		closePointPopup() {
			this.$refs.pointPopup.close();
		},
		jumpPage(url) {
			this.$util.redirectTo(url);
		},
		//获取积分商品详情
		getData(mescroll) {
			this.mescroll = mescroll;
			this.isloading = true;
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					type: 1,
					site_id: this.siteId
				},
				success: res => {
					this.isloading = false;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					this.isloading = false;
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 优惠券
		getCouponList() {
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/page',
				data: {
					page_size: 0,
					type: 2
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.couponList = res.data.list;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 红包
		getHongbaoList() {
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/page',
				data: {
					page_size: 0,
					type: 3
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.hongbaoList = res.data.list;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//获取积分商品详情
		// getData(mescroll) {
		// 	// this.mescroll = mescroll;
		// 	this.$api.sendRequest({
		// 		url: '/pointexchange/api/goods/page',
		// 		data: {
		// 			page_size: mescroll.size,
		// 			page: mescroll.num,
		// 			type: 1
		// 		},
		// 		success: res => {
		// 			let newArr = [];
		// 			let msg = res.message;
		// 			if (res.code == 0 && res.data) {
		// 				newArr = res.data.list;
		// 			} else {
		// 				this.$util.showToast({
		// 					title: msg
		// 				});
		// 			}
		// 			mescroll.endSuccess(newArr.length);
		// 			//设置列表数据
		// 			if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
		// 			this.goodsList = this.goodsList.concat(newArr); //追加新数据
		// 			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		// 		},
		// 		fail() {
		// 			//联网失败的回调
		// 			mescroll.endErr();
		// 			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		// 		}
		// 	});
		// },
		//跳转至详情页面
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/point/detail/detail', {
				id: e.id
			});
		},
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code >= 0) {
						this.token = uni.getStorageSync('token');
						this.memberInfo = res.data;
						this.getAccountInfo();
					} else {
						this.token = null;
					}
				}
			});
		},
		//获取个人
		getAccountInfo() {
			this.$api.sendRequest({
				url: '/api/memberaccount/info',
				data: {
					account_type: 'point'
				},
				success: res => {
					if (res.code == 0 && res.data) {
						if (!isNaN(parseFloat(res.data.point))) {
							this.point = parseFloat(res.data.point).toFixed(0);
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		//跳转至登录页面
		login() {
			this.$refs.login.open('/promotionpages/point/list/list');
		},
		imgError(index) {
			this.goodsList[index].image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		goodsImg(data) {
			switch (data.type) {
				case 1:
					return this.$util.img(data.image.split(',')[0]);
					break;
				case 2:
					return data.image ? this.$util.img(data.image) : this.$util.img('upload/uniapp/point/coupon.png');
					break;
				case 3:
					return data.image ? this.$util.img(data.image) : this.$util.img('upload/uniapp/point/hongbao.png');
					break;
			}
		}
	},
	onShareAppMessage(res) {
		var title = '积分兑换，好礼带回家哦';
		var path = '/promotionpages/point/list/list';
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
@import '../public/css/list.scss';
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
.textOve {
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: normal;
	padding-left: 3px;
}
.width35 {
	width: 35px;
}
.width34 {
	width: 34px;
}
.paddL_2 {
	padding-left: -2px;
}
.disFlex {
	display: flex;
}
</style>
