<template>
	<view class="detail-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 订单状态 -->
		<view class="status-wrap color-base-bg" :style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/order/status-wrap-bg.png') + ')' }">
			<view class="order-status-left">
				<image :src="$util.img(action.icon)"></image>
				<view class="status-name">
					<view>{{ orderData.order_status_name }}</view>
				</view>
			</view>
		</view>

		<view class="virtual-mobile-wrap" v-if="!orderData.virtual_goods">
			<view class="font-size-base">预留手机</view>
			<view class="color-tip font-size-tag">{{ orderData.mobile }}</view>
		</view>

		<view class="verify-code-wrap" :style="orderData.virtual_goods ? 'margin-top: -69rpx;' : ''" v-else>
			<view class="wrap">
				<text class="font-size-base">核销码：</text>
				<text class="font-size-base">{{ orderData.virtual_code }}</text>
				<view class="copy" @click="$util.copy(orderData.virtual_code)">复制</view>
			</view>
			<block v-if="orderData.virtual_goods.is_veirfy">
				<view class="wrap">
					<text class="font-size-base">核销状态：</text>
					<text class="font-size-base">已核销</text>
				</view>
				<view class="wrap">
					<text class="font-size-base">核销时间：</text>
					<text class="font-size-base">{{ $util.timeStampTurnTime(orderData.virtual_goods.verify_time) }}</text>
				</view>
			</block>
			<view class="hr"></view>
			<view class="code">
				<image :src="$util.img(orderData.virtualgoods)"></image>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-header" @click="toShopDetail(orderData.site_id)">
				<view class="iconfont icondianpu"></view>
				<text class="site-name">{{ orderData.site_name }}</text>
				<view class="iconfont iconright"></view>
			</view>
			<view class="site-body">
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderData.order_goods" :key="goodsIndex">
					<view class="goods-img" @click="goDetail(goodsItem.sku_id)">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imgError(goodsIndex)" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view @click="goDetail(goodsItem.sku_id)" class="goods-name">{{ goodsItem.sku_name }}</view>
						<view class="sku" v-if="goodsItem.sku_spec_format">
							<view class="goods-spec">
								<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
									{{ x.spec_value_name }} {{ i < goodsItem.sku_spec_format.length - 1 ? '; ' : '' }}
								</block>
							</view>
						</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price color-base-text">
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									<text class="font-size-base">{{ goodsItem.price }}</text>
								</text>
							</view>
							<view>
								<text class="font-size-base">
									<text class="iconfont iconclose"></text>
									{{ goodsItem.num }}
								</text>
							</view>
						</view>
						<view class="goods-action" v-if="orderData.is_enable_refund">
							<view @click="goRefund(goodsItem.order_goods_id)" v-if="goodsItem.refund_status == 0 || goodsItem.refund_status == -1">
								<view class="order-box-btn">退款</view>
							</view>
							<view @click="goRefundDetail(goodsItem.order_goods_id)" v-else>
								<view class="order-box-btn">查看退款</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单概况 -->
		<view class="order-summary">
			<view class="order-cell">
				<text class="tit">订单编号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.order_no }}</text>
					<view class="copy" @click="$util.copy(orderData.order_no)">复制</view>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">订单交易号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.out_trade_no }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">创建时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.close_time > 0">
				<text class="tit">关闭时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.close_time) }}</text>
				</view>
			</view>
			<block v-if="orderData.pay_status > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">支付方式：</text>
					<view class="box">
						<text class="color-title">{{ orderData.pay_type_name }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">支付时间：</text>
					<view class="box">
						<text class="color-title">{{ $util.timeStampTurnTime(orderData.pay_time) }}</text>
					</view>
				</view>
			</block>
			<view class="order-cell" v-if="orderData.buyer_message != ''">
				<text class="tit">买家留言：</text>
				<view class="box">
					<text class="color-title">{{ orderData.buyer_message }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_type_name != ''">
				<text class="tit">活动优惠：</text>
				<view class="box">
					<text class="color-title">{{ orderData.promotion_type_name }}</text>
				</view>
			</view>
			<!-- 联系客服 -->
			<view class="kefu">
				<view v-if="kefuConfig.type == 'system'" @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</view>
			</view>
		</view>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box align-right">
					<text class="color-title">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						{{ orderData.goods_money }}
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_money > 0">
				<text class="tit">
					税费
					<text class="color-base-text">({{ orderData.invoice_rate }}%)</text>
				</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_delivery_money > 0">
				<text class="tit">发票邮寄费</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_delivery_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.adjust_money != 0">
				<text class="tit">订单调整</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator" v-if="orderData.adjust_money < 0">-</text>
						<text class="operator" v-else>+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.adjust_money | abs }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.promotion_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.coupon_money > 0">
				<text class="tit">店铺优惠券</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.coupon_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.platform_coupon_total_money > 0">
				<text class="tit">平台优惠券</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.platform_coupon_total_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.balance_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell">
				<view class="box align-right">
					<text>实付金额：</text>
					<text class="color-base-text">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text class="font-size-base">{{ orderData.pay_money }}</text>
					</text>
				</view>
			</view>

			<view class="order-action" :class="{ 'bottom-safe-area': isIphoneX }" v-if="orderData.action.length > 0">
				<view class="order-box-btn white" v-if="evaluateConfig.evaluate_status == 1 && orderData.is_evaluate == 1" @click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
				<view class="order-box-btn" :class="operationItem.action == 'orderPay' ? 'color-base-bg color-base-border' : 'white'"
				 v-for="(operationItem, operationIndex) in orderData.action" :key="operationIndex" @click="operation(operationItem.action)">
					{{ operationItem.title }}
				</view>
			</view>
			<view class="order-action" :class="{ 'bottom-safe-area': isIphoneX }" v-else-if="orderData.action.length == 0 && orderData.is_evaluate == 1 && evaluateConfig.evaluate_status == 1">
				<view class="order-box-btn white" @click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
			</view>
		</view>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="orderData.pay_money" @confirm="pay"></ns-payment>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import orderMethod from '../public/js/orderMethod.js';
	import nsPayment from '@/components/payment/payment.vue';

	export default {
		data() {
			return {
				isIphoneX: false,
				orderId: 0,
				orderData: {
					action: [],
					virtual_goods: {
						is_veirfy: 0
					}
				},
				action: {
					icon: ''
				},
				kefuConfig: {
					weapp: '',
					system: '',
					open: '',
					open_url: ''
				},
				evaluateConfig: {
					evaluate_audit: 1,
					evaluate_show: 0,
					evaluate_status: 1
				}
			};
		},
		mixins: [globalConfig, orderMethod],
		components: {
			nsPayment
		},
		onLoad(option) {
			if (option.order_id) this.orderId = option.order_id;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			this.isIphoneX = this.$util.uniappIsIPhoneX();

			if (uni.getStorageSync('token')) {
				this.getEvaluateConfig();
				this.getOrderData();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/pages/order/detail_virtual/detail_virtual?order_id=' + this.orderId
				});
			}
			this.getKekuConfig();
		},
		methods: {
			//联系客服
			goConnect() {
				if (uni.getStorageSync('token')) {
					let data = {
						order_id: this.orderId,
						site_id: this.orderData.site_id
					};
					this.$util.redirectTo('/otherpages/chat/room/room', data)
					return false;
				} else {
					this.$refs.login.open('/pages/goods/detail_virtual/detail_virtual?sku_id=' + this.orderData.sku_id);
					return;
				}
			},
			getKekuConfig() {
				this.$api.sendRequest({
					url: '/api/config/servicer',
					success: res => {
						if (res.code == 0) {
							this.kefuConfig = res.data;
							if (this.kefuConfig.system && !this.addonIsExit.servicer) this.kefuConfig.system = 0;
						}
					}
				});
			},
			goDetail(id) {
				this.$util.redirectTo('/pages/goods/detail/detail', {
					sku_id: id
				});
			},
			goRefund(id) {
				this.$util.redirectTo('/otherpages/order/refund/refund', {
					order_goods_id: id
				});
			},
			goRefundDetail(id) {
				this.$util.redirectTo('/otherpages/order/refund_detail/refund_detail', {
					order_goods_id: id
				});
			},
			getOrderData() {
				this.$api.sendRequest({
					url: '/api/order/detail',
					data: {
						order_id: this.orderId
					},
					success: res => {
						uni.stopPullDownRefresh();
						if (res.code >= 0) {
							this.orderData = res.data;
							this.orderData.order_goods.forEach(v => {
								if (v.sku_spec_format) {
									v.sku_spec_format = JSON.parse(v.sku_spec_format);
								} else {
									v.sku_spec_format = [];
								}
							});
							this.action = JSON.parse(res.data.order_status_action);
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: '未获取到订单信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/order/list/list');
							}, 1000);
						}
					},
					fail: res => {
						uni.stopPullDownRefresh();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh() {
				this.getOrderData();
			},
			operation(action) {
				switch (action) {
					case 'orderPay': // 支付
						this.orderPay(this.orderData);
						break;
					case 'orderClose': //关闭
						this.orderClose(this.orderData.order_id, () => {
							this.getOrderData();
						});
						break;
					case 'memberOrderEvaluation': //评价
						this.$util.redirectTo('/otherpages/order/evaluate/evaluate', {
							order_id: this.orderData.order_id
						});
						break;
				}
			},
			imgError(index) {
				this.orderData.order_goods[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
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
			// 显示选择支付方式弹框
			openChoosePayment() {
				this.$refs.choosePaymentPopup.open();
			},
			toShopDetail(e) {
				this.$util.redirectTo('/otherpages/shop/index/index', {
					site_id: e
				});
			}
		},
		filters: {
			abs(value) {
				return Math.abs(parseFloat(value)).toFixed(2);
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/detail.scss';
</style>
