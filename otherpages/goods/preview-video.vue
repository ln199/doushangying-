<template>
	<view class="video">
		<view class="close"><text class="iconfont iconclose" @click="$util.goBack()"></text></view>
		<view class="video_view"><video :src="$util.img(video_url)" objectFit="scale-down" :poster="$util.img(video_img)" autoplay="true"></video></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			video_url: '',
			video_img: ''
		};
	},
	onLoad(option) {
		if (option.video_url) {
			this.video_url = decodeURIComponent(option.video_url);
		}
		if (option.video_img) {
			this.video_img = decodeURIComponent(option.video_img);
		}
	},
	methods: {}
};
</script>

<style lang="scss">
.video {
	background-color: #000000;
	height: 100vh;
	.close {
		padding-top: 60rpx;
		color: #fff;
		.iconclose {
			margin-left: 30rpx;
			font-size: 50rpx;
		}
	}
}
.video_view {
	height: 100vw;
	width: 100vw;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	video {
		width: 100%;
		height: 100%;
	}
}
</style>
