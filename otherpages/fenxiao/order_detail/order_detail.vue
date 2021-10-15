<template>
	<view :data-theme="themeStyle">
		<view class="order-detail">
			<view class="order-detail-box">
				<view class="header">
					<view class="title ns-bg-before"><text>订单明细</text></view>
					<text class="color-base-text" v-if="orderData.is_refund == 1">已退款</text>
					<text class="color-base-text" v-else-if="orderData.is_settlement == 1">已结算</text>
					<text class="color-base-text" v-else>待结算</text>
				</view>
				<view class="detail-body">
					<view class="detail-body-box">
						<view class="goods-image"><image :src="$util.img(orderData.sku_image, { size: 'mid' })" @error="imgError(goodsIndex)" mode="aspectFill"></image></view>
						<view class="order-info">
							<view class="goods-name">{{ orderData.sku_name }}</view>
							<view class="goods-sub-section margin-top">
								<view>
									<text class="goods-price">
										<text class="unit">￥</text>
										<text>{{ orderData.price }}</text>
									</text>
								</view>
								<view>
									<text>
										<text class="iconfont iconclose"></text>
										{{ orderData.num }}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="detail-content">
					<view class="order-info-item">
						<text class="tit">订单号：</text>
						<text>{{ orderData.order_no }}</text>
					</view>
					<view class="order-info-item">
						<text class="tit">分佣层级：</text>
						<text>{{ orderData.commission_level }}</text>
					</view>
					<view class="order-info-item">
						<text class="tit">{{ fenxiaoWords.account }}：</text>
						<text class="color-base-text">￥{{ orderData.commission }}</text>
					</view>
				</view>
				<view class="detail-footer">
					<text>
						<text>共{{ orderData.num }}件商品</text>
					</text>
					<text>
						<text>合计：</text>
						<text class="color-base-text">￥{{ orderData.real_goods_money }}</text>
					</text>
				</view>
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import fenxiaoWords from 'common/js/fenxiao-words.js';
export default {
	data() {
		return {
			isIphoneX: false,
			orderId: 0,
			orderData: {
				action: []
			}
		};
	},
	onLoad(option) {
		if (option.id) {
			this.orderId = option.id;
		} else {
			uni.navigateBack({
				delta: 1
			});
		}
	},
	mixins: [fenxiaoWords, globalConfig],
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.isIphoneX = this.$util.uniappIsIPhoneX();

		if (!this.addonIsExit.fenxiao) {
			this.$util.showToast({
				title: '分销未开启',
				mask: true
			});
			setTimeout(() => {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			}, 1000);
		} else {
			this.getFenxiaoWrods();
			if (uni.getStorageSync('token')) {
				this.getOrderData();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/pages/order/detail/detail?order_id=' + this.orderId
				});
			}
		}
	},
	methods: {
		getOrderData() {
			this.$api.sendRequest({
				url: '/fenxiao/api/order/info',
				data: {
					fenxiao_order_id: this.orderId
				},
				success: res => {
					if (res.code >= 0) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.orderData = res.data;
					} else {
						this.$util.showToast({
							title: '未获取到订单信息！',
							success: () => {
								setTimeout(() => {
									this.$util.redirectTo('/otherpages/fenxiao/order/order', {}, 'redirectTo');
								}, 1000);
							}
						});
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		imgError(index) {
			this.orderData.order_goods[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
.order-detail {
	width: 100%;
	padding: 0 $padding;
	box-sizing: border-box;
	margin-top: $margin-updown;

	.order-detail-box {
		width: 100%;
		height: 100%;
		padding-top: $padding;
		box-sizing: border-box;
		background: #ffffff;
		border-radius: $border-radius;

		.header {
			width: 100%;
			height: 70rpx;
			padding: 0 $padding;
			border-bottom: 1rpx solid $color-line;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;

			.title {
				padding-left: 15rpx;
				display: inline-block;
				position: relative;
				line-height: 1;
				font-weight: 600;
			}

			.title::before {
				content: '';
				display: block;
				width: 4rpx;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				border-radius: 6rpx;
			}
		}

		.detail-body {
			width: 100%;
			padding: $padding;
			box-sizing: border-box;
			border-bottom: 1rpx solid $color-line;

			.detail-body-box {
				width: 100%;
				height: 100%;
				display: flex;

				.goods-image {
					width: 180rpx;
					height: 180rpx;
					border-radius: $border-radius;

					image {
						width: 100%;
						height: 100%;
						border: 1rpx solid $color-line;
						border-radius: $border-radius;
					}
				}

				.order-info {
					width: calc(100% - 200rpx);
					height: 180rpx;
					padding-left: $padding;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.goods-name {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						line-height: 1.5;
						font-size: 28rpx;
					}

					.goods-sub-section {
						width: 100%;
						line-height: 1.3;
						display: flex;

						.goods-price {
							font-weight: 700;
							font-size: 15px;
						}

						.unit {
							font-weight: normal;
							font-size: 24rpx;
							margin-right: 2rpx;
						}

						view {
							flex: 1;
							line-height: 1.3;

							&:last-of-type {
								text-align: right;

								.iconfont {
									line-height: 1;
									font-size: 26rpx;
								}
							}
						}
					}
				}
			}
		}

		.detail-content {
			width: 100%;
			padding: $padding;
			box-sizing: border-box;
			border-bottom: 1rpx solid $color-line;

			text {
				font-size: $font-size-tag;
			}

			.order-info-item .tit {
				display: inline-block;
				width: 200rpx;
				color: $color-tip;
			}
		}

		.detail-footer {
			width: 100%;
			height: 100rpx;
			padding: $padding;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}

.order-money-detail {
	width: 100%;
	padding: 0 $padding;
	box-sizing: border-box;
	margin-top: $margin-updown;

	.order-money-detail-box {
		width: 100%;
		height: 100%;
		padding-top: $padding;
		box-sizing: border-box;
		background: #ffffff;
		border-radius: $border-radius;

		.header {
			width: 100%;
			height: 70rpx;
			padding: 0 $padding;
			border-bottom: 1rpx solid $color-line;
			display: flex;
			align-items: center;
			box-sizing: border-box;

			.title {
				padding-left: 15rpx;
				display: inline-block;
				position: relative;
				line-height: 1;
				font-weight: 600;
			}

			.title::before {
				content: '';
				display: block;
				width: 4rpx;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				border-radius: 6rpx;
			}
		}

		.money-detail-body {
			width: 100%;
			padding: $padding;
			box-sizing: border-box;

			.order-cell {
				display: flex;
				margin: 10rpx 0;
				align-items: center;
				background: #fff;
				line-height: 40rpx;

				.tit {
					text-align: left;
					display: inline-block;
					width: 200rpx;
				}

				.box {
					flex: 1;
					line-height: inherit;

					.textarea {
						height: 40rpx;
					}
				}

				.iconfont {
					color: #bbb;
					font-size: 28rpx;
				}

				.order-pay {
					padding: 0;

					text {
						display: inline-block;
						margin-left: 6rpx;
					}
				}

				text {
					color: $color-tip;
					font-size: $font-size-tag;
				}
			}
		}
	}
}
</style>
