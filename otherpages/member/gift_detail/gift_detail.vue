<template>
	<view class="order-container" :data-theme="themeStyle">
		<view class="address-wrap">
			<view class="icon">
				<view class="iconfont icondizhi"></view>
			</view>
			<view class="address-info">
				<view class="info">
					<text>收货人：{{ orderData.member_name }}</text>
					<text>{{ orderData.mobile }}</text>
				</view>
				<view class="detail">
					<text>收货地址：{{ orderData.full_address }}</text>
				</view>
			</view>
		</view>

		<view class="order-item">
			<view class="order-body">
				<view class="goods-wrap">
					<view class="goods-img">
						<image :src="$util.img(orderData.gift_image)" v-if="orderData.gift_image" @error="imgError()" mode="aspectFill" :lazy-load="true"></image>
						<image :src="$util.img('upload/uniapp/point/gift.png')" v-else  mode="aspectFill" :lazy-load="true"></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{ orderData.gift_name }}</view>
						<view class="goods-sub-section">
							<view>
								<text class="iconfont iconclose"></text>
								{{ orderData.num }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="order-summary">
			<view class="order-cell">
				<text class="tit">创建时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">配送状态：</text>
				<view class="box">
					<text class="color-title">{{ orderData.express_status == 0 ? '未配送' : '已配送' }}</text>
				</view>
			</view>
			<block v-if="orderData.express_status > 0">
				<view class="order-cell">
					<text class="tit">物流公司：</text>
					<view class="box">
						<text class="color-title">{{ orderData.express_company_name }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">物流编号：</text>
					<view class="box">
						<text class="color-title">{{ orderData.express_no }}</text>
					</view>
				</view>
			</block>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				orderData: {},
				orderId: 0
			};
		},
		mixins: [globalConfig],
		onLoad(option) {
			if (option.id) this.orderId = option.id;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
			} else {
				this.getOrderData();
			}
		},
		methods: {
			getOrderData() {
				this.$api.sendRequest({
					url: '/gift/api/giftorder/info',
					data: {
						order_id: this.orderId
					},
					success: res => {
						if (res.code >= 0) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							this.orderData = res.data;
						} else {
							this.$util.showToast({
								title: '未获取到礼品订单信息！',
								success: () => {
									setTimeout(() => {
										this.$util.redirectTo('/otherpages/member/gift/gift');
									}, 1000);
								}
							});
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
			imgError() {
				this.orderData.gift_image = this.$util.img('upload/uniapp/point/gift.png');
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/gift_detail';
</style>
