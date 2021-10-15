<template>
	<view class="order-container" :data-theme="themeStyle">
		<block v-if="addonIsExit.pointexchange">
			<mescroll-uni ref="mescroll" @getData="getListData">
				<block slot="list">
					<block v-if="orderList.length">
						<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex" @click="detail(orderItem)">
							<view class="order-header">
								<text class="color-tip font-size-tag">{{ orderItem.order_no }}</text>
								<text class="color-base-text font-size-tag status">
									{{ orderItem.order_status == 0 ? '待支付' : orderItem.order_status == 1 ? '已完成' : orderItem.order_status == -1 ? '已关闭' : '' }}
								</text>
							</view>
							<view class="order-body">
								<block v-if="orderItem.type == 2">
									<image
										:src="$util.img(orderItem.exchange_image) ? $util.img(orderItem.exchange_image) : $util.img('upload/uniapp/point/coupon.png')"
										@error="imgError(orderIndex)"
										mode="aspectFill"
										:lazy-load="true"
									></image>
								</block>
								<block v-else-if="orderItem.type == 3">
									<image
										:src="$util.img(orderItem.exchange_image) ? $util.img(orderItem.exchange_image) : $util.img('upload/uniapp/point/hongbao.png')"
										@error="imgError(orderIndex)"
										mode="aspectFill"
										:lazy-load="true"
									></image>
								</block>
								<block v-else><image :src="$util.img(orderItem.exchange_image)" @error="imgError(orderIndex)" mode="aspectFill" :lazy-load="true"></image></block>
								<view class="goods-name">
									<view class="name">{{ orderItem.exchange_name }}</view>
									<!-- <view class="guig">规格规格</view> -->
									<view class="num color-tip">
										<text class="iconfont iconclose"></text>
										{{ orderItem.num }}
									</view>
								</view>
								<view class="goods-total">-{{ orderItem.point }}积分</view>
							</view>
							<view class="order-footer" v-if="orderItem.order_status == 0 && orderItem.type == 1">
								<view class="order-opection" @click.stop="orderClose(orderItem.order_id, orderIndex)"><view class="order-box-btn font-size-tag">关闭</view></view>
								<view class="order-opection" @click.stop="openChoosePayment(orderItem.out_trade_no, orderItem.price)">
									<view class="order-box-btn color-base-border color-base-text font-size-tag">支付</view>
								</view>
							</view>
						</view>
					</block>
					<block v-if="showEmpty && !orderList.length"><ns-empty :isIndex="!1" text="暂无积分兑换数据"></ns-empty></block>
				</block>
			</mescroll-uni>
		</block>
		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="payMoney" @confirm="orderPay"></ns-payment>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import nsPayment from '@/components/payment/payment.vue';
export default {
	data() {
		return {
			orderList: [],
			showEmpty: false,
			payMoney: 0,
			outTradeNo: ''
		};
	},
	components: {
		nsPayment
	},
	onLoad() {},
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
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
				if (!uni.getStorageSync('token')) {
					this.$util.redirectTo('/pages/login/login/login', {
						back: '/promotionpages/point/order_list/order_list'
					});
				}
			}
		});
	},
	mixins: [globalConfig],
	methods: {
		getListData(mescroll) {
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/pointexchange/api/order/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size
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
					if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
					this.orderList = this.orderList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		orderClose(order_id, index) {
			uni.showModal({
				title: '提示',
				content: '确定关闭此次兑换？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/pointexchange/api/order/close',
							data: {
								order_id: order_id
							},
							success: res => {
								if (res.code >= 0) {
									this.orderList[index].order_status = -1;
									this.$util.showToast({
										title: '关闭成功'
									});
									this.$forceUpdate();
								}
							}
						});
					}
				}
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment(out_trade_no, price) {
			this.outTradeNo = out_trade_no;
			this.payMoney = parseFloat(price);
			this.$refs.choosePaymentPopup.open();
		},
		orderPay() {
			this.$refs.choosePaymentPopup.getPayInfo(this.outTradeNo);
		},
		detail(item) {
			if (item.type == 1 && item.relate_order_id) {
				switch (item.delivery_type) {
					case 'store':
						this.$util.redirectTo('/pages/order/detail_pickup/detail_pickup', {
							order_id: item.relate_order_id
						});
						break;
					case 'local':
						this.$util.redirectTo('/pages/order/detail_local_delivery/detail_local_delivery', {
							order_id: item.relate_order_id
						});
						break;
					default:
						this.$util.redirectTo('/pages/order/detail/detail', {
							order_id: item.relate_order_id
						});
				}
			} else {
				this.$util.redirectTo('/pages/order/detail_point/detail_point', {
					order_id: item.order_id
				});
			}
		},
		imgError(index) {
			this.orderList[index].exchange_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
/deep/ .fixed {
	position: relative;
	top: 0;
}

/deep/ .empty {
	padding-top: 0 !important;
}

.cart-empty {
	padding-top: 154px !important;
}

.order-container {
	width: 100vw;
	height: 100vh;
}

.align-right {
	text-align: right;
}

.order-item {
	margin: 20rpx 30rpx;
	padding: 30rpx;
	box-sizing: border-box;
	border-radius: 10rpx;
	display: flex;
	flex-direction: column;
	line-height: 1;
	margin-top: 18rpx;
	background-color: #fff;

	.order-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		font-size: $font-size-base;
		border-bottom: 1px solid #e3e3e3;
		padding-bottom: 20rpx;

		& > view {
			flex: 1;

			&.status {
				font-weight: 500;
			}
		}
	}

	.order-body {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 30rpx 0 0;
		box-sizing: border-box;

		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 5rpx;
			align-self: flex-start;
			margin-top: 10rpx;
		}

		.goods-name {
			width: 60%;
			// height: 96rpx;
			display: flex;
			font-weight: 500;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			line-height: 1.2;

			.name {
				font-size: $font-size-base;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				line-height: 1.5;
			}

			.guig {
				font-size: $font-size-activity-tag;
				line-height: 1;
				margin-top: 13rpx;
				color: #838383;
			}

			.num {
				font-size: $font-size-activity-tag;
				line-height: 1;
				margin-top: 13rpx;

				text {
					font-size: $font-size-activity-tag;
					color: $color-tip;
					line-height: 1;
				}
			}
		}

		.goods-total {
			flex: 1;
			font-size: $font-size-tag;
			color: #000;
			font-weight: 500;
			text-align: right;
		}
	}

	.order-footer {
		text-align: right;
		margin-top: 30rpx;
		padding-top: 30rpx;
		border-top: 1px solid #f1f1f1;

		.order-opection {
			display: inline-block;

			.order-box-btn {
				width: 100rpx;
				height: 44rpx;
				line-height: 40rpx;
				padding: 0;
				text-align: center;
			}
		}
	}
}

.empty {
	padding-top: 200rpx;
	text-align: center;

	.empty-image {
		width: 180rpx;
		height: 180rpx;
	}
}
</style>
