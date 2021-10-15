<template>
	<view
		class="graphic-nav"
		:style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx', borderRadius: value.navRadius == 'fillet' ? '10rpx' : '0rpx' }"
	>
		<view class="nav-no-scroll">
			<view v-for="(item, index) in value.list" :key="index" class="text-item" :style="{ width: 'calc(100% / ' + value.showType + ')' }" @click="redirectTo(item.link)">
				<view class="text-item-img" v-if="value.selectedTemplate == 'imageNavigation' && item.imageUrl">
					<image v-if="Number(item.imgWidth) >= Number(item.imgHeight)" :src="$util.img(item.imageUrl)" style="width: 70rpx;" mode="widthFix"></image>
					<image v-else :src="$util.img(item.imageUrl)" :style="{ width: (Number(item.imgWidth) / Number(item.imgHeight)) * 70 + 'rpx' }" style="height: 70rpx;"></image>
				</view>

				<text
					class="font-size-sub"
					v-if="item.title"
					:style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)', marginTop: value.selectedTemplate == 'imageNavigation' ? '20rpx' : '' }"
				>
					{{ item.title }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
// 图文导航
export default {
	name: 'diy-graphic-nav',
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
		return { pageWidth: '' };
	},
	created() {
		this.getWidth();
	},
	computed: {
		padding() {
			return this.value.padding == 0 ? 8 : this.value.padding;
		}
	},
	methods: {
		redirectTo(link) {
			if (this.siteId) {
				link.site_id = this.siteId;
			}
			this.$util.diyRedirectTo(link);
		},
		getWidth() {
			var self = this;
			//获取页面可用区域的宽度
			uni.getSystemInfo({
				success: res => {
					this.pageWidth = res.screenWidth;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.graphic-nav {
	overflow: hidden;
	padding: 22rpx 0;
}

.graphic-nav .nav-no-scroll {
	/* padding: 10rpx 0; */
	display: flex;
	flex-wrap: wrap;
	padding: 0 10rpx;
}

.graphic-nav .nav-no-scroll .text-item {
	text-align: center;
	line-height: 1;
	padding: 16rpx 10rpx;
	box-sizing: border-box;
}

.graphic-nav .nav-no-scroll .text-item .text-item-img {
	width: 70rpx;
	height: 70rpx;
	line-height: 70rpx;
	display: inline-block;
}

.graphic-nav .nav-no-scroll .text-item text {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.graphic-nav .nav-scroll {
	white-space: nowrap;
	width: 100%;
}

.graphic-nav .nav-scroll .text-item {
	display: inline-block;
	width: 20%;
	text-align: center;
}

.graphic-nav .nav-scroll .text-item image {
	width: 80%;
}

.graphic-nav .nav-scroll .text-item text {
	display: block;
}

/deep/.uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
}
</style>
