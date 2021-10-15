<template>
	<view class="container" :data-theme="themeStyle">
		<view class="cancel-wrap">
			<view class="cancel-img"><image :src="$util.img('/upload/uniapp/member/refuse.png')"></image></view>
			<view class="cancel-title">您的申请已拒绝</view>
			<view class="cancel-reason">拒绝理由：{{ reason }}</view>
			<view class="cancel-btn">
				<button type="primary" @click="toIndex">返回</button>
				<button class="color-base-bg" @click="apply">重新申请</button>
			</view>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			reason: ''
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
				url: '/membercancel/api/membercancel/info',
				success: res => {
					if (res.code >= 0) {
						this.reason = res.data.reason;
					}
				}
			});
		},
		toIndex() {
			this.$util.redirectTo('/pages/member/index/index');
		},
		apply() {
			this.$util.redirectTo('/otherpages/member/cancellation/cancellation');
		}
	}
};
</script>

<style lang="scss" scoped>
.cancel-wrap {
	padding-top: 300rpx;
	text-align: center;

	.cancel-img {
		width: 150rpx;
		height: 150rpx;
		display: inline-block;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.cancel-title {
		text-align: center;
		font-size: 32rpx;
		line-height: 32rpx;
		margin-top: 30rpx;
	}

	.cancel-reason {
		color: $color-tip;
		font-size: 28rpx;
		line-height: 50rpx;
		margin-top: 20rpx;
		padding: 0 75rpx;
	}

	.cancel-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin-top: 173rpx;

		button {
			width: 300rpx;
			height: 84rpx;
			font-size: 28rpx;
			line-height: 84rpx;
			margin: 0 15rpx;
			border-radius: 84rpx;
		}

		button[type='primary'] {
			background-color: unset !important;
			color: $color-title;
			border: 2rpx solid #dddddd;
		}

		button:nth-child(2) {
			color: #ffffff;
		}
	}
}
</style>
