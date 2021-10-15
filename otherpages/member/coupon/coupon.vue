<template>
	<view :class="isIphoneX ? 'iphone-x' : ''" v-if="addonIsExit.coupon" :data-theme="themeStyle">
		<view class="cf-container color-line-border">
			<view class="tab">
				<view @click="changeType(1)"><text :class="couponType == 1 ? 'color-base-text active color-base-border-bottom' : ''">店铺优惠劵</text></view>
				<view @click="changeType(2)"><text :class="couponType == 2 ? 'color-base-text active color-base-border-bottom' : ''">平台优惠劵</text></view>
			</view>
		</view>
		<view class="tabs-box">
			<view class="status-tab color-base-border">
				<view class="color-base-border" :class="state == 1 ? 'active color-base-bg ' : 'color-base-text'" @click="changeState(1)">未使用</view>
				<view class="color-base-border" :class="state == 2 ? 'active color-base-bg color-base-border' : 'color-base-text'" @click="changeState(2)">已使用</view>
				<view class="color-base-border" :class="state == 3 ? 'active color-base-bg' : 'color-base-text'" @click="changeState(3)">已过期</view>
			</view>
		</view>
		<mescroll-uni ref="mescroll" top="180" @getData="getMemberCounponList">
			<block slot="list">
				<view class="coupon-listone">
					<view class="item" v-for="(item, index) in list" :key="index" @click="toGoodsList(item)" :style="{ backgroundColor: item.state == 1 ? '#FFF2F0' : '#F2F2F2' }">
						<view
							class="item-base"
							:style="{
								backgroundImage: 'url(' + $util.img(item.state == 1 ? '/upload/uniapp/coupon/bg_lingqu.png' : '/upload/uniapp/coupon/bg_lingqu_gary.png') + ')'
							}"
						>
							<view>
								<view class="use_price " v-if="item.type == 'reward' || !item.discount" :class="{ disabled: item.state != 1 }">
									<text>￥</text>
									{{ parseInt(item.money) }}
								</view>
								<view class="use_price" v-else-if="item.type == 'discount'" :class="{ disabled: item.state != 1 }">
									{{ parseFloat(item.discount) }}
									<text>折</text>
								</view>
								<view class="use_condition font-size-tag" v-if="item.at_least > 0" :class="{ disabled: item.state != 1 }">满{{ item.at_least }}元可用</view>
								<view class="use_condition font-size-tag" v-else :class="{ disabled: item.state != 1 }">无门槛优惠券</view>
								<block v-if="couponType == 1">
									<view class="use_condition font-size-tag margin_top_none" v-if="item.goods_type == 1" :class="{ disabled: item.state != 1 }">全场商品</view>
									<view class="use_condition font-size-tag margin_top_none" v-else :class="{ disabled: item.state != 1 }">指定商品</view>
								</block>
								<block v-if="couponType == 2">
									<view class="use_condition font-size-tag margin_top_none" v-if="item.use_scenario == 1" :class="{ disabled: item.state != 1 }">全场店铺</view>
									<view class="use_condition font-size-tag margin_top_none" v-else :class="{ disabled: item.state != 1 }">指定店铺</view>
								</block>
							</view>
						</view>
						<view class="item-info">
							<view class="use_title">
								<view class="title">{{ couponType == 1 ? item.coupon_name : item.platformcoupon_name }}</view>
								<view v-if="couponType == 1 && item.site_name" class="title font-size-tag color-disabled">{{ item.site_name }}</view>
								<view class="max_price" v-if="item.discount_limit && item.discount_limit != '0.00'">(最大优惠{{ item.discount_limit }}元)</view>
							</view>
							<view class="use_time" v-if="item.validity_type">有效期：领取之日起{{ item.fixed_term }}日内有效</view>
							<view class="use_time" v-else>有效期：{{ $util.timeStampTurnTime(item.end_time) }}</view>
						</view>
						<view class="item-btn">
							<view class="tag" v-if="item.state == 1">去使用</view>
							<view class="tag disabled" v-if="item.state == 2">已使用</view>
							<view class="tag disabled" v-if="item.state == 3">已过期</view>
						</view>
					</view>
				</view>
				<view v-if="!list.length && showEmpty" class="margin-top cart-empty" :fixed="!1"><ns-empty :isIndex="false" text="暂无优惠券"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			couponType: 1, //优惠券类型   0，店铺优惠券   1.平台优惠券
			type: '',
			state: 1,
			list: [],
			isIphoneX: false, //判断手机是否是iphoneX以上
			showEmpty: false,
			emptyBtn: {
				text: '去领取',
				url: '/otherpages/goods/coupon/coupon'
			},
			text: '您还没有优惠券哦'
		};
	},
	mixins: [globalConfig],
	onLoad(data) {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.coupon) {
				this.$util.showToast({
					title: '优惠券未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/member/index/index', {}, 'redirectTo');
				}, 1000);
			} else {
				if (!uni.getStorageSync('token')) {
					let pageRouter = getCurrentPages();
					let data = pageRouter[pageRouter.length - 1].options;
					let back = pageRouter[pageRouter.length - 1].route;
					data.back = back;
					this.$util.redirectTo('/pages/login/login/login', data);
				}
				if (this.$refs.mescroll) this.$refs.mescroll.refresh(false);
			}
		});
	},
	methods: {
		//优惠券类型
		changeType(index) {
			this.list = [];
			this.couponType = index;
			this.$refs.mescroll.refresh(false);
		},
		//切换状态
		changeState(state) {
			this.list = [];
			this.state = state;
			this.$refs.mescroll.refresh(false);
			if (this.state == 1) {
				this.text = '您还没有优惠券哦';
			} else if (this.state == 2) {
				this.text = '您还没有使用过优惠券哦';
			} else {
				this.text = '您还没有过期优惠券哦';
			}
		},
		//获取商品列表
		getMemberCounponList(mescroll) {
			this.showEmpty = false;
			var url = this.couponType == 1 ? '/coupon/api/coupon/memberpage' : '/platformcoupon/api/platformcoupon/memberpage';
			this.$api.sendRequest({
				url,
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					state: this.state,
					is_own: this.type
				},
				success: res => {
					this.showEmpty = true;
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
					if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toGoodsList(item) {
			if (this.state != 1) return;
			if (this.couponType == 1) {
				if (item.goods_type != 1) {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						couponId: item.coupon_type_id,
						site_id: item.site_id,
						coupon: item.coupon_type_id
					});
				} else {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						site_id: item.site_id,
						coupon: item.coupon_type_id
					});
				}
			} else {
				if (item.use_scenario != 1) {
					this.$util.redirectTo('/pages/goods/list/list', {
						platformcouponTypeId: item.platformcoupon_type_id,
						coupon: item.coupon_type_id
					});
				} else {
					this.$util.redirectTo('/pages/goods/list/list', {
						coupon: item.coupon_type_id
					});
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.cf-container {
	background: #fff;
	overflow: hidden;
	border-bottom: 2rpx solid;
	padding: 10rpx 0;
}

.tab {
	display: flex;
	justify-content: center;

	> view {
		text-align: center;
		width: 40%;

		text {
			display: inline-block;
			line-height: 66rpx;
		}
	}

	.active {
		border-bottom: 4rpx solid;
	}
}

.tabs-box {
	overflow: hidden;
}

.status-tab {
	border: 2rpx solid;
	margin: 20rpx auto 0;
	display: flex;
	align-items: center;
	width: 600rpx;
	border-radius: 100rpx;
	overflow: hidden;
	height: 62rpx;

	view {
		width: 200rpx;
		text-align: center;
		color: #838383;
		line-height: 80rpx;
		height: 80rpx;

		&.active {
			color: #fff;
			border: 2rpx solid;
		}

		&:not(:last-of-type) {
			border-right: 2rpx solid;
		}
	}
}

.active {
	border-bottom: 4rpx solid;
}

.coupon-listone {
	margin: 0 30rpx;

	.item {
		display: flex;
		background-color: #fff2f0;
		background-size: 100% 100%;
		border-radius: 20rpx;
		align-items: stretch;
		margin-top: $padding;
		overflow: hidden;

		.item-base {
			position: relative;
			width: 197rpx;
			min-width: 197rpx;
			text-align: center;
			background-image: linear-gradient(to right top, #fc6831, #ff4544);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			padding: 38rpx 10rpx 38rpx 18rpx;

			> view {
				width: calc(100%);
				height: auto;
				position: relative;
				top: 50%;
				transform: translate(0, -50%);
			}

			.use_price {
				font-size: 60rpx;
				line-height: 1;
				color: #fff;

				text {
					font-size: $font-size-toolbar;
				}

				&.disabled {
					color: $color-tip;
				}
			}

			.use_condition {
				color: #fff;
				margin-top: $padding;

				&.margin_top_none {
					margin-top: 0;
				}

				&.disabled {
					color: $color-tip;
				}
			}

			&::after {
				position: absolute;
				content: '';
				background-color: #f8f8f8;
				left: 0;
				top: 50%;
				transform: translate(0, -50%);
				height: 30rpx;
				width: 15rpx;
				border-radius: 0 15px 15px 0;
			}
		}

		.item-btn {
			position: relative;
			width: 160rpx;
			min-width: 160rpx;
			align-self: center;

			view {
				width: 100rpx;
				height: 50rpx;
				border-radius: 50rpx;
				line-height: 50rpx;
				margin: auto;
				text-align: center;
				background-image: linear-gradient(to right, #fc6831, #ff4544);
				color: #fff;
				font-size: $font-size-tag;

				&.disabled {
					background: $color-line !important;
					color: $color-tip !important;
				}
			}

			&::after {
				position: absolute;
				content: '';
				background-color: #f8f8f8;
				right: 0;
				top: 50%;
				transform: translate(0, -50%);
				height: 30rpx;
				width: 15rpx;
				border-radius: 30rpx 0 0 30rpx;
			}
		}

		.item-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: $padding;
			overflow: hidden;
			background-repeat-x: no-repeat;
			background-repeat-y: repeat;

			.use_time {
				padding: $padding 0;
				border-top: 1px dashed #cccccc;
				font-size: $font-size-activity-tag;
				color: #909399;
			}

			.use_title {
				font-size: $font-size-base;
				font-weight: 500;
				padding: $padding 0;

				.title {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.max_price {
					font-weight: 400;
					font-size: $font-size-tag;
				}
			}
		}
	}
}
</style>
