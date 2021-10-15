<template>
	<view class="message">
		<view class="goods-item" v-if="orderInfo.order_goods">
			<view class="goods-box">
				<image :src="$util.img(orderInfo.order_goods ? orderInfo.order_goods[0].sku_image : '')" mode="aspectFill"></image>
				<view class="goods-info">
					<view class="goods-name">{{ orderInfo.order_goods ? orderInfo.order_goods[0].sku_name : '' }}</view>
					<view class="font-size-goods-tag goods-sku">订单状态: <span> {{ orderInfo.order_status_name }}</span></view>
					<view class="font-size-goods-tag goods-sku">
						共{{orderInfo.order_goods.length}}件商品,
						<span>合计￥{{orderInfo.order_money}}</span>
					</view>
				</view>
			</view>
			<view class="footer-box">
				<span class="goods-no">订单号：{{orderInfo.order_no}}</span>
				<span class="goods-btn color-base-bg" v-if="isCanSend" @click="sendMsg('order')">发送</span>
				<span class="goods-btn disabled" v-else>已发送</span>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ns-chat-order',
		props: {
			orderId: {
				type: [Number, String]
			},
			isCanSend: Boolean
		},
		data() {
			return {
				orderInfo: {}
			};
		},
		mounted() {
			this.getGoodsInfo();
		},
		methods: {
			getGoodsInfo() {
				this.$api.sendRequest({
					url: '/api/order/detail',
					data: {
						order_id: this.orderId
					},
					success: res => {
						if (res.code >= 0) {
							this.orderInfo = res.data;
						}
					}
				});
			},
			sendMsg() {
				this.$emit('sendMsg', 'order');
			}
		}
	};
</script>

<style lang="scss">
	.message {
		padding: 13rpx 20rpx;
		box-sizing: border-box;
		width: 100vw;
		position: relative;

		.goods-item {
			width: 100%;
			// height: 220rpx;
			background: #ffffff;
			position: relative;
			border-radius: 20rpx;
			margin: 0 auto;
			padding: $padding;
			box-sizing: border-box;

			.goods-box {
				display: flex;
				align-items: center;
				padding-bottom: $padding;

				image {
					width: 180rpx;
					height: 180rpx;
					min-width: 180rpx;
					border-radius: $border-radius;
				}

				.goods-info {
					width: 100%;
					height: 150rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding-left: 20rpx;
					box-sizing: border-box;

					.goods-name {
						width: 100%;
						line-height: 1.4;
						font-size: $font-size-toolbar;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
						// font-size: $font-size-tag;
						margin-bottom: 10rpx;
					}

					.goods-sku {
						color: $color-sub;

						span {
							padding-left: $padding;
						}
					}

					.goods-bottom {
						display: flex;
						justify-content: space-between;
						align-items: flex-end;

						text {
							line-height: 1;
						}

						.goods-price {
							display: flex;
							align-items: flex-end;
							padding-bottom: 10rpx;
							font-weight: 500;

							.goods-price-sign {
								font-size: 20rpx;
							}
						}

						.goods-option {
							width: 150rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
							border-radius: 50rpx;
							color: #ffffff;
						}
					}
				}
			}

			.footer-box {
				border-top: 2rpx solid;
				border-color: $color-line;
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				padding-top: 15rpx;
				box-sizing: border-box;

				.goods-no {
					color: $color-sub;
					font-size: $font-size-sub;
				}

				.goods-btn {
					width: 150rpx;
					height: 50rpx;
					line-height: 50rpx;
					text-align: center;
					border-radius: 50rpx;
					color: #ffffff;
				}
			}

			.disabled {
				background: #e5e5e5;
			}
		}
	}
</style>
