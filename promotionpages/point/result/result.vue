<template>
	<view class="container" :data-theme="themeStyle">
		<view class="image-wrap">
			<image :src="$util.img('upload/uniapp/pay_success.png')" class="result-image"></image>
		</view>
		<view class="msg">{{ $lang('exchangeSuccess') }}</view>
		<view class="action">
			<view class="btn color-base-border color-base-text" @click="toOrderList()">{{ $lang('see') }}</view>
			<view class="btn go-home color-base-bg" @click="toIndex">{{ $lang('goHome') }}</view>
		</view>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {};
		},
		mixins: [globalConfig],
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		methods: {
			toOrderList() {
				this.$util.redirectTo('/promotionpages/point/order_list/order_list', {}, 'redirectTo');
			},
			toIndex() {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			}
		}
	};
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		background: #fff;

		.image-wrap {
			display: flex;
			justify-content: center;
			padding: 200rpx 0 40rpx 0;

			.result-image {
				width: 166rpx;
				height: 132rpx;
			}
		}

		.msg {
			text-align: center;
			line-height: 1;
			margin-bottom: 50rpx;
			font-size: $font-size-base;
			color: #000;
		}

		.pay-amount {
			color: #999;
			text-align: center;
			line-height: 1;
			margin-bottom: 30rpx;
		}

		.action {
			width: 90%;
			margin: 0 auto;
			text-align: center;
			margin-top: 150rpx;
			display: flex;
			justify-content: space-between;

			.btn {
				width: 310rpx;
				height: 78rpx;
				border: 2rpx solid #ffffff;
				border-radius: 80rpx;
				font-size: $font-size-tag;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.alone {
				margin-left: 0;
				width: 60%;
			}

			.go-home {
				color: #fff;
			}
		}
	}
</style>
