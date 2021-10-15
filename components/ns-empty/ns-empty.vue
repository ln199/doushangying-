<template>
	<view class="empty" :class="{ fixed: fixed }">
		<view class="empty_img"><image :src="$util.img('upload/uniapp/common-empty.png')" mode="aspectFit"></image></view>
		<view class="color-tip margin-top margin-bottom">{{ text }}</view>
		<button type="primary" size="mini" class="button" @click="goIndex()" v-if="isIndex">{{ emptyBtn.text }}</button>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		text: {
			type: String,
			default: '暂无相关数据'
		},
		isIndex: {
			type: Boolean,
			default: true
		},
		emptyBtn: {
			type: Object,
			default: () => {
				return { text: '去逛逛' };
			}
		},
		fixed: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		goIndex() {
			if (this.emptyBtn.url) {
				this.$util.redirectTo(this.emptyBtn.url, {}, 'redirectTo');
			} else {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			}
		}
	}
};
</script>

<style lang="scss">
.empty {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: $padding;
	box-sizing: border-box;
	justify-content: center;
	.empty_img {
		width: 63%;
		height: 450rpx;

		image {
			width: 100%;
			height: 100%;
			padding-bottom: $padding;
		}
	}
	button {
		min-width: 300rpx;
		margin-top: 100rpx;
		height: 70rpx;
		line-height: 70rpx !important;
		font-size: $font-size-base;
	}
}
.fixed {
	position: fixed;
	left: 0;
	top: 20vh;
}
</style>
