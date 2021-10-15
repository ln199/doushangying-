<template>
	<view class="container" :data-theme="themeStyle">
		<view class="cancel-wrap">
			<view class="cancel-img"><image :src="$util.img('/upload/uniapp/member/success.png')"></image></view>
			<view class="cancel-title">您已成功注销账号</view>
			<view class="cancel-reason">待下次与您更好的相遇，如需再次使用，请重新注册</view>
			<view class="cancel-btn"><button class="color-base-bg" @click="success">完成</button></view>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			state: ''
		};
	},
	mixins: [globalConfig],
	onLoad(option) {
		// 刷新多语言
		this.$langConfig.refresh();

		if (option.back) this.back = option.back;

		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages/login/login/login');
		} else {
			this.getStatus();
		}
	},
	methods: {
		getStatus() {
			this.$api.sendRequest({
				success: res => {
					if (res.code >= 0) {
						this.state = res.data.state;
						if (res.data.state == 1) {
							uni.setStorageSync('token', '');
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.cancel-wrap {
	padding-top: 84rpx;
	text-align: center;

	.cancel-img {
		width: 100rpx;
		height: 100rpx;
		display: inline-block;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.cancel-title {
		text-align: center;
		font-size: 24rpx;
		line-height: 24rpx;
		margin-top: 30rpx;
	}

	.cancel-reason {
		color: $color-tip;
		font-size: 20rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
		padding: 0 175rpx;
	}

	.cancel-btn {
		width: 100%;
		margin-top: 173rpx;

		button {
			display: inline-block;
			width: 300rpx;
			height: 80rpx;
			font-size: 28rpx;
			line-height: 80rpx;
			margin: 0 15rpx;
			color: #ffffff;
		}
	}
}
</style>
