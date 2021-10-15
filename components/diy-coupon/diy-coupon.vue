<template>
	<view v-if="computedCouponList.length > 0" :style="{ marginTop: value.marginTop * 2 + 'rpx' }">
		<template v-if="value.style == '1'">
			<view class="coupon-style-one">
				<!-- <view class="coupon-style-one-title">
					<image :src="$util.img('/upload/uniapp/coupon/coupon_title.png')" mode="widthFix"></image>
					<text>更多优惠等你来</text>
				</view> -->

				<scroll-view class="coupon-all" :scroll-x="true" :show-scrollbar="false">
					<view class="coupon-box" v-for="(item, index) in computedCouponList" :key="index">
						<view class="coupon-list">
							<!-- <view class="color-base-bg coupon-bg" :style="'-webkit-mask-box-image: url(' + $util.img('/upload/uniapp/coupon/coupon.png') + ')'"></view> -->
							<image :src="$util.img('/upload/uniapp/coupon/style1-bg.png')" mode="widthFix" style="width: 220rpx;"></image>
							<view class="coupon">
								<view class="coupon-info" @click="couponTap(item, index)">
									<view class="coupon-num" v-if="!item.discount || item.discount == '0.00'">
										<text class="font-size-tag coupon-sign">￥</text>
										<text class="coupon-size">{{ Number(item.money) }}</text>
									</view>
									<view class="coupon-num" v-else>
										<text class="coupon-size">{{ Number(item.discount) }}</text>
										<text class="font-size-tag coupon-sign">折</text>
									</view>
									<view class="coupon-type">
										<text v-if="item.at_least > 0" class="">满{{ Number(item.at_least) }}元可用</text>
										<text v-else class="">无门槛优惠券</text>
									</view>
								</view>
								<view class="coupon-get" v-if="item.useState == 0" @click="receiveCoupon(item, index)">
									<view class="">立</view>
									<view class="">即</view>
									<view class="">领</view>
									<view class="">取</view>
								</view>
								<view class="coupon-get" v-if="item.useState == 1" @click="couponTap(item, index)">
									<view class="">去</view>
									<view class="">使</view>
									<view class="">用</view>
								</view>
								<view class="coupon-get" v-if="item.useState == 2" @click="couponTap(item, index)">
									<view class="">去</view>
									<view class="">使</view>
									<view class="">用</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</template>

		<template v-if="value.style == '2'">
			<scroll-view class="coupon-all" :scroll-x="true" :show-scrollbar="false">
				<view class="coupon-box" v-for="(item, index) in computedCouponList" :key="index">
					<view class="coupon-list">
						<!-- <view class="color-base-bg coupon-bg" :style="'-webkit-mask-box-image: url(' + $util.img('/upload/uniapp/coupon/coupon.png') + ')'"></view> -->
						<image :src="$util.img('/upload/uniapp/coupon/' + themeStyleScore + '_coupon.png')" mode="widthFix" style="width: 256rpx;"></image>
						<view class="coupon">
							<view class="coupon-info" @click="couponTap(item, index)">
								<view class="coupon-num" v-if="!item.discount || item.discount == '0.00'">
									<text class="font-size-tag coupon-sign color-base-text">￥</text>
									<text class="coupon-size color-base-text">{{ Number(item.money) }}</text>
								</view>
								<view class="coupon-num" v-else>
									<text class="coupon-size color-base-text">{{ Number(item.discount) }}</text>
									<text class="font-size-tag coupon-sign color-base-text">折</text>
								</view>
								<view class="coupon-type">
									<text v-if="item.at_least > 0" class="color-base-text">满{{ Number(item.at_least) }}元可用</text>
									<text v-else class="color-base-text">无门槛优惠券</text>
								</view>
							</view>
							<view class="coupon-get" v-if="item.useState == 0" @click="receiveCoupon(item, index)">
								<view class="color-base-text">领</view>
								<view class="color-base-text">取</view>
							</view>
							<view class="coupon-get" v-if="item.useState == 1" @click="couponTap(item, index)">
								<view class="color-base-text">去</view>
								<view class="color-base-text">使</view>
								<view class="color-base-text">用</view>
							</view>
							<view class="coupon-get" v-if="item.useState == 2" @click="couponTap(item, index)">
								<view class="color-base-text">去</view>
								<view class="color-base-text">使</view>
								<view class="color-base-text">用</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</template>

		<template v-if="value.style == '3'">
			<scroll-view :scroll-x="true" class="coupon-shu ns-pages-goods-category-category" :data-theme="themeStyle" :show-scrollbar="false">
				<view
					class="shu-item"
					v-for="(item, index) in computedCouponList"
					:key="index"
					:style="'background-image:url(' + $util.img('/upload/uniapp/coupon/coupon_shu.png') + ')'"
					@click="couponTap(item, index)"
				>
					<view class="item-num" v-if="!item.discount || item.discount == '0.00'">
						<text class="coupon-sign color-base-text font-size-tag">￥</text>
						<text class="coupon-size color-base-text">{{ Number(item.money) }}</text>
					</view>
					<view class="item-num" v-else>
						<text class="coupon-size color-base-text">{{ Number(item.discount) }}</text>
						<text class="font-size-tag coupon-sign color-base-text">折</text>
					</view>
					<view class="item-type">
						<text v-if="item.at_least > 0" class="color-base-text">满{{ Number(item.at_least) }}元可用</text>
						<text v-else class="color-base-text">无门槛优惠券</text>
						<view class="item-text" v-if="item.goods_type == 1">所有商品可用</view>
						<view class="item-text" v-if="item.goods_type !== 1">指定商品可用</view>
					</view>
					<view class="item-btn color-base-bg">
						<text v-if="item.useState == 0" @click.stop="receiveCoupon(item, index)">领取</text>
						<text v-if="item.useState == 1" @click.stop="couponTap(item, index)">去使用</text>
						<text v-if="item.useState == 2" @click.stop="couponTap(item, index)">去使用</text>
					</view>
				</view>
			</scroll-view>
		</template>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
// 优惠券
export default {
	name: 'diy-coupon',
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	mixins: [globalConfig],
	data() {
		return {
			token: '',
			couponList: [],
			isHave: true,
			couponBtnSwitch: false,
			couponTab: 1 //优惠券类型   0.店铺优惠券     1.平台优惠券
		};
	},
	created() {
		this.getCanReceiveCouponQuery();
	},
	computed: {
		computedCouponList() {
			var list = [];
			this.couponList.filter(function(item) {
				if (item.count != item.lead_count) list.push(item);
			});
			return list;
		}
	},
	methods: {
		couponTap(item, index) {
			if (item.count == item.lead_count) {
				this.$util.showToast({
					title: '该优惠券已抢光'
				});
				return;
			}
			if (item.useState == 0) this.receiveCoupon(item, index);
			else this.toGoodList(item);
		},
		//获取优惠券列表
		getCanReceiveCouponQuery() {
			this.couponTab = this.siteId ? 0 : 1;
			var url;
			if (this.couponTab == 0) {
				url = '/coupon/api/coupon/typepagelists';
			} else {
				url = '/platformcoupon/api/platformcoupon/typepagelists';
			}
			var coupon_type_id_arr = '';
			if(this.value.sources == "diy"){
				coupon_type_id_arr = 0;
				if(this.value.couponIds){ 
					coupon_type_id_arr = this.value.couponIds.split(",");
				}
			}
			this.$api.sendRequest({
				url: url,
				data: {
					page: 1,
					page_size: 10,
					site_id: this.siteId,
					coupon_type_id_arr: this.value.couponIds
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						this.couponList = data.list;
						this.couponList.forEach(v => {
							v.useState = 0;
						});
					}
				}
			});
		},
		// 领取优惠券
		receiveCoupon(item, index) {
			if (this.couponBtnSwitch) return;
			this.couponBtnSwitch = true;
			let token = uni.getStorageSync('token');
			if (token != '') {
				var url,
					data = {
						site_id: item.site_id,
						get_type: 2
					};
				if (this.couponTab == 0) {
					url = '/coupon/api/coupon/receive';
					data.coupon_type_id = item.coupon_type_id;
				} else {
					url = '/platformcoupon/api/platformcoupon/receive';
					data.platformcoupon_type_id = item.platformcoupon_type_id;
				}
				this.$api.sendRequest({
					url,
					data,
					success: res => {
						var data = res.data;
						let msg = res.message;
						if (res.code == 0) {
							msg = '领取成功';
						}
						let list = this.couponList;
						if (this.couponTab == 0) {
							if (res.data.is_exist == 1) {
								for (let i = 0; i < list.length; i++) {
									if (list[i].coupon_type_id == item.coupon_type_id) {
										list[i].useState = 1;
									}
								}
							} else {
								for (let i = 0; i < list.length; i++) {
									if (list[i].coupon_type_id == item.coupon_type_id) {
										list[i].useState = 2;
									}
								}
							}
						} else {
							if (res.data.is_exist == 1) {
								for (let i = 0; i < list.length; i++) {
									if (list[i].platformcoupon_type_id == item.platformcoupon_type_id) {
										list[i].useState = 1;
									}
								}
							} else {
								for (let i = 0; i < list.length; i++) {
									if (list[i].platformcoupon_type_id == item.platformcoupon_type_id) {
										list[i].useState = 2;
									}
								}
							}
						}

						this.$util.showToast({
							title: msg
						});
						this.couponBtnSwitch = false;
						this.$forceUpdate();
					},
					fail: res => {
						this.couponBtnSwitch = false;
					}
				});
			} else {
				this.couponBtnSwitch = false;
				this.$util.redirectTo('/pages/login/login/login');
			}
		},
		toGoodList(item) {
			if (this.couponTab == 0) {
				if (item.goods_type != 1) {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						couponId: item.coupon_type_id,
						site_id: item.site_id
					});
				} else {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						site_id: item.site_id
					});
				}
			} else {
				if (item.use_scenario != 1) {
					this.$util.redirectTo('/pages/goods/list/list', {
						platformcouponTypeId: item.platformcoupon_type_id
					});
				} else {
					this.$util.redirectTo('/pages/goods/list/list', {});
				}
			}
		}
	}
};
</script>

<style lang="scss">
/deep/.uni-scroll-view ::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

/deep/::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

// 风格一
.coupon-style-one {
	padding: 30rpx;
	// background-color: #FFDADA;
	background-color: #ffffff;
	border-radius: 10rpx;

	.ns-data-theme-red {
		color: #ff4544;
	}

	.coupon-style-one-title {
		display: flex;
		align-items: center;
		padding: 0 30rpx;

		image {
			width: 157rpx;
		}

		text {
			font-size: $font-size-base;
			line-height: 28rpx;
			margin-left: 20rpx;
			color: #909399;
		}
	}

	.coupon-all {
		// margin-top: 30rpx;

		.coupon-box {
			margin-right: 20rpx;
		}

		.coupon-box:first-child {
			// margin-left: 30rpx;
		}

		.coupon-box:last-child {
			margin-right: 0;
		}

		.coupon-list {
			height: 116rpx;
			position: relative;

			image {
				width: 220rpx;
			}

			.coupon {
				width: 220rpx;
				height: 116rpx;
			}

			.coupon-info {
				position: absolute;
				top: 0;
				width: 150rpx;
				padding: 0;
				text-align: center;

				.coupon-num {
					height: 40rpx;
					color: #ffffff;
				}

				.coupon-size {
					font-size: 40rpx;
					line-height: 1;
					color: #ffffff;
				}

				.coupon-type {
					margin-top: 8rpx;
					color: #ffffff;

					text {
						font-size: 20rpx;
						line-height: 1;
					}
				}
			}

			.coupon-get {
				position: absolute;
				right: 0;
				top: 0;
				padding: 12rpx 0;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				view {
					font-size: 24rpx;
					line-height: 24rpx;
					color: #ffffff;
				}
			}
		}
	}
}

/* 样式一 */
.coupon-all {
	width: 100%;
	flex-direction: row;
	white-space: nowrap;
	box-sizing: border-box;
	line-height: 1;
}

.coupon-box {
	display: inline-block;
	margin-right: $margin-both;
	position: relative;
}
.coupon-list {
	position: relative;
}
.coupon-bg {
	width: 254rpx;
	height: 114rpx;
}
.coupon {
	width: 254rpx;
	height: 114rpx;
	border-radius: $border-radius;
	overflow: hidden;
	display: flex;
	justify-content: space-between;
	position: absolute;
	left: 0;
	top: 0;
	.coupon-info {
		width: 71%;
		height: 100%;
		padding: 10rpx 15rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.coupon-type {
			color: #ffffff;
			font-size: $font-size-activity-tag;
			text-align: center;
			overflow: hidden;
			white-space: nowrap;
		}

		.coupon-num {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			margin-bottom: 10rpx;

			.coupon-sign {
				margin-bottom: 4rpx;
			}

			.coupon-size {
				font-size: 40rpx;
			}

			text {
				line-height: 1;
				color: #ffffff;
			}
		}
	}

	.coupon-get {
		width: 26%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		view {
			line-height: 1.2;
			color: #ffffff;
			font-size: $font-size-tag;
		}
	}
}

.coupon-shu {
	width: 702rpx;
	height: 294rpx;
	margin: 0 auto;
	padding: 24rpx;
	box-sizing: border-box;
	border-radius: 10rpx;
	flex-direction: row;
	white-space: nowrap;
	.shu-item {
		width: 202rpx;
		height: 294rpx;
		display: inline-block;
		margin-right: 24rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: 0 -48rpx;
		border-radius: 10rpx;
		overflow: hidden;
		.item-num {
			line-height: 1;
			margin-top: 35rpx;
			width: 100%;
			text-align: center;
			.coupon-size {
				font-size: 40rpx;
			}
		}
	}
	.item-type {
		line-height: 1;
		margin-top: 22rpx;
		width: 100%;
		text-align: center;
		font-size: $font-size-goods-tag;
		.item-text {
			font-size: $font-size-goods-tag;
			color: #838383;
			width: 100%;
			text-align: center;
			line-height: 1;
			margin-top: 15rpx;
		}
	}

	.item-btn {
		width: 120rpx;
		height: 46rpx;
		line-height: 1;
		color: #fff;
		border-radius: 23rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		margin-top: 22rpx;
	}
}
</style>
<style scoped>
.coupon-all >>> .uni-scroll-view::-webkit-scrollbar {
	display: none;
}
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>