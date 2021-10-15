<template>
	<view class="action-icon-wrap" @click="clickEvent">
		<!-- #ifdef MP-WEIXIN -->
		<button
			type="default"
			hover-class="none"
			v-if="openType == 'contact'"
			open-type="contact"
			:send-message-title="sendData.title"
			:send-message-path="sendData.path"
			:send-message-img="sendData.img"
		></button>
		<!-- #endif -->
		<view class="iconfont color-title" :class="icon"></view>
		<text>{{ text }}</text>
		<view class="corner-mark color-base-bg" v-if="cornerMark.length" :style="{ background: cornerMarkBg, color: cornerMarkColor }">{{ cornerMark }}</view>
	</view>
</template>

<script>
export default {
	name: 'ns-goods-action-icon',
	props: {
		// 商品底部icon导航icon图标
		icon: {
			type: String,
			default: ''
		},
		// 商品底部icon导航文字
		text: {
			type: String,
			default: ''
		},
		// 角标文字
		cornerMark: {
			type: String,
			default: ''
		},
		// 角标背景色
		cornerMarkBg: {
			type: String,
			default: ''
		},
		// 角标文字颜色
		cornerMarkColor: {
			type: String,
			default: '#fff'
		},
		// 开放能力
		openType: {
			type: String,
			default: ''
		},
		// 发送内容 openType="contact"时有效
		sendData: {
			type: Object,
			default: function() {
				return {
					title: '',
					path: '',
					img: ''
				};
			}
		}
	},
	methods: {
		clickEvent() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss">
.action-icon-wrap {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100rpx;
	min-width: 100rpx;
	text-align: center;
	position: relative;
	margin-right: 6rpx;
}
.action-icon-wrap button {
	width: 100%;
	height: 100%;
	position: absolute;
	border: none;
	z-index: 1;
	padding: 0;
	margin: 0;
	background: none;
	top: 0;
	left: 0;
	opacity: 0;
}

.action-icon-wrap button::after {
	border: none !important;
}

.action-icon-wrap .iconfont {
	margin: 0 auto 10rpx;
	line-height: 1;
	font-size: 36rpx;
}

.action-icon-wrap .corner-mark {
	position: absolute;
	z-index: 99;
	font-size: $font-size-activity-tag;
	top: 4rpx;
	right: 12rpx;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24rpx;
	height: 24rpx;
	padding: 6rpx;
	border-radius: 50%;
}

.action-icon-wrap text {
	font-size: $font-size-tag;
	line-height: 1;
}
</style>
