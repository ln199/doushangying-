<template>
	<view class="diy-title" :style="{ background: value.backgroundColor }">
		<text class="back iconfont iconback_light" @click="goback()" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }"></text>
		<text class="title" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }">{{ value.title }}</text>
		<text v-if="value.isOpenOperation" class="action" @click="redirectTo(value.rightLink)" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }">
			{{ value.operation_name }}
		</text>
	</view>
</template>

<script>
// 标题
export default {
	name: 'diy-title',
	props: {
		value: {
			type: Object
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {};
	},
	created() {},
	methods: {
		goback() {
			if (this.value.leftLink.wap_url) {
				this.redirectTo(this.value.leftLink);
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		redirectTo(link) {
			if (this.siteId) {
				link.site_id = this.siteId;
			}
			this.$util.diyRedirectTo(link);
		}
	}
};
</script>

<style>
.diy-title {
	position: relative;
	height: 88rpx;
	line-height: 88rpx;
}
.diy-title .back {
	vertical-align: middle;
	position: absolute;
	width: 40rpx;
	left: 20rpx;
}
.diy-title .title {
	display: block;
	text-align: center;
}
.diy-title .action {
	position: absolute;
	right: 40rpx;
	top: 0;
}
</style>
