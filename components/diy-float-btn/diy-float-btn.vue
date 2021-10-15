<template>
	<view class="float-btn left_top" v-if="value.bottomPosition == 1" :style="{ top: navHeight + statusBarHeight + parseInt(value.btnBottom) + 'px !important' }">
		<view class="item" :key="index" v-for="(item, index) in value.list" @click.stop="redirectTo(item.link)">
			<image :src="$util.img(item.imageUrl)" mode="aspectFit"></image>
		</view>
	</view>
	<view class="float-btn right_top" v-else-if="value.bottomPosition == 2" :style="{ top: navHeight + statusBarHeight + parseInt(value.btnBottom) + 'px !important' }">
		<view class="item" :key="index" v-for="(item, index) in value.list" @click.stop="redirectTo(item.link)">
			<image :src="$util.img(item.imageUrl)" mode="aspectFit"></image>
		</view>
	</view>
	<view class="float-btn left_bottom" v-else-if="value.bottomPosition == 3" :style="{ bottom: 100 + parseInt(value.btnBottom) + 'px !important' }">
		<view class="item" :key="index" v-for="(item, index) in value.list" @click.stop="redirectTo(item.link)">
			<image :src="$util.img(item.imageUrl)" mode="aspectFit"></image>
		</view>
	</view>
	<view class="float-btn right_bottom" v-else-if="value.bottomPosition == 4" :style="{ bottom: 100 + parseInt(value.btnBottom) + 'px !important' }">
		<view class="item" :key="index" v-for="(item, index) in value.list" @click.stop="redirectTo(item.link)">
			<image :src="$util.img(item.imageUrl)" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
	name: 'diy-float-btn',
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			navHeight: 0,
			statusBarHeight: systemInfo.statusBarHeight
		};
	},
	created() {
		this.navHeight = this.navbarHeight();
	},
	methods: {
		redirectTo(link) {
			if (this.siteId) {
				link.site_id = this.siteId;
			}
			this.$util.diyRedirectTo(link);
		},
		// 转换字符数值为真正的数值
		navbarHeight() {
			// #ifdef APP-PLUS || H5
			return 54;
			// #endif
			// #ifdef MP
			// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
			// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
			// return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
			let height = systemInfo.platform == 'ios' ? 54 : 58;
			return height;
			// #endif
		}
	}
};
</script>

<style lang="scss">
.float-btn {
	position: fixed;
	bottom: 20%;
	right: 40rpx;
	z-index: 999;
	&.right_top {
		top: 100rpx;
		right: 30rpx;
	}
	&.left_top {
		top: 100rpx;
		left: 30rpx;
	}
	&.right_bottom {
		bottom: 200rpx;
		right: 30rpx;
		padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
		padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
	}
	&.left_bottom {
		bottom: 200rpx;
		left: 30rpx;
		padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
		padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
	}
	.item {
		margin-bottom: 20rpx;
		width: 80rpx;
		height: 80rpx;
		&:last-child {
			margin-bottom: 0;
		}
		image {
			width: 100%;
			height: 100%;
			// box-shadow: 0 0 4rpx rgba(0, 0, 0, 0.2);
			// background-color: #fff;
		}
	}
}
</style>
