<template>
	<view class="progress"><view class="progress-bar color-base-bg" ref="progress" :style="{ width: progress + '%' }"></view></view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		progress: {
			type: [Number, String],
			default: 10
		}
	}
};
</script>

<style lang="scss">
.progress {
	height: 12rpx;
	overflow: hidden;
	background-color: #ccc;
	border-radius: 8rpx;
}

.progress-bar {
	float: left;
	height: 100%;
	font-size: $font-size-tag;
	line-height: 20px;
	color: #fff;
	text-align: center;
	transition: width 0.6s ease;
}
</style>
