<template>
	<view class="container" :data-theme="themeStyle">
		<template v-if="payInfo.pay_status != undefined">
			<template v-if="payInfo.pay_status">
				<image :src="$util.img('upload/uniapp/pay_success.png')" mode="widthFix" class="result-image"></image>
				<view class="msg">{{ $lang('paymentSuccess') }}</view>
				<view class="pay-amount">
					￥
					<text>{{ payInfo.pay_money }}</text>
				</view>
			</template>
			<template v-else>
				<image :src="$util.img('upload/uniapp/pay_fail.png')" mode="widthFix" class="result-image"></image>
				<view class="msg">{{ $lang('paymentFail') }}</view>
			</template>
			<view class="action">
				<view class="btn" @click="goMemberIndex()">{{ $lang('memberCenter') }}</view>
				<view class="btn go-home color-base-bg color-base-border" @click="goHome()">{{ $lang('goHome') }}</view>
			</view>
			<ns-goods-recommend></ns-goods-recommend>
		</template>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			payInfo: {},
			outTradeNo: '',
			token: null,
			paySource: ''
		};
	},
	mixins: [globalConfig],
	onLoad(option) {
		if (option.code) this.outTradeNo = option.code;
		this.paySource = uni.getStorageSync('paySource');
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if (uni.getStorageSync('token')) this.token = uni.getStorageSync('token');
		this.getPayInfo();
	},
	methods: {
		getPayInfo() {
			this.$api.sendRequest({
				url: '/api/pay/info',
				data: {
					out_trade_no: this.outTradeNo
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.payInfo = res.data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: '未获取到支付信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}, 1000);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		goHome() {
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
		},
		toOrderDetail(id) {
			if (this.payInfo.order_type == 2) {
				this.$util.redirectTo('/pages/order/detail_pickup/detail_pickup', { order_id: id }, 'redirectTo');
			} else if (this.payInfo.order_type == 3) {
				this.$util.redirectTo('/pages/order/detail_local_delivery/detail_local_delivery', { order_id: id }, 'redirectTo');
			} else if (this.payInfo.order_type == 4) {
				this.$util.redirectTo('/pages/order/detail_virtual/detail_virtual', { order_id: id }, 'redirectTo');
			} else {
				this.$util.redirectTo('/pages/order/detail/detail', { order_id: id }, 'redirectTo');
			}
		},
		toRecharge() {
			this.$util.redirectTo('/otherpages/recharge/order_list/order_list', {}, 'redirectTo');
			uni.setStorageSync('paySource', '');
		},
		goMemberIndex() {
			this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
		}
	}
};
</script>

<style lang="scss">
.container {
	padding-top: 94rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.result-image {
		width: 168rpx;
		height: 120rpx;
	}
	.msg {
		font-size: $font-size-toolbar;
		margin-top: 66rpx;
		height: $font-size-toolbar;
		line-height: $font-size-toolbar;
	}
	.pay-amount {
		font-size: 30rpx;
		margin-top: 30rpx;
		font-weight: 600;
		height: 50rpx;
		line-height: 50rpx;

		text {
			font-size: 50rpx;
		}
	}
	.action {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		margin-top: 90rpx;

		.btn {
			font-size: $font-size-base;
			width: 240rpx;
			height: 80rpx;
			line-height: 76rpx;
			text-align: center;
			border-radius: 40rpx;
			border: 1px solid $color-tip;
			box-sizing: border-box;

			&:last-child {
				color: #ffffff;
				margin-left: 100rpx;
			}
		}
	}
}
</style>
