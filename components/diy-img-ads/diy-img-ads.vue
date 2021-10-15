<template>
	<view>
		<view class="single-graph">
			<view v-if="value.selectedTemplate == 'carousel-posters'" :style="{ marginTop: value.marginTop * 2 + 'rpx' }" class="swiper-box">
				<!-- 					 -->
				<swiper
					class="swiper"
					autoplay="true"
					:indicator-dots="isDots"
					indicator-color="rgba(130, 130, 130, .5)"
					circular="true"
					indicator-active-color="#ffffff"
					:class="{ 'ns-indicator-dots': value.carouselChangeStyle == 'line' }"
					:style="{ height: (pageWidth - 30) / swiperRate + 1 + 'px' }"
				>
					<swiper-item class="swiper-item" v-for="(item, index) in value.list" :key="index" v-if="item.imageUrl" @click="redirectTo(item.link)">
						<view class="item" :style="{ borderRadius: value.imageRadius == 'right-angle' ? '' : '10rpx' }" style="overflow: hidden;">
							<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
							<!-- <text v-if="item.title">{{ item.title }}</text> -->
						</view>
					</swiper-item>
				</swiper>

				<!-- <view class="swiper-list">
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-list-cell-db">指示点</view>
						<switch :checked="indicatorDots" @change="changeIndicatorDots" />
					</view>
				</view> -->
			</view>

			<!-- 垂直排列 -->
			<view v-else-if="value.selectedTemplate == 'vertically'" class="vertically-images">
				<view
					class="item"
					v-for="(item, index) in value.list"
					:key="index"
					style="overflow: hidden;"
					:style="{
						marginBottom: index + 1 != value.list.length ? value.imageClearance * 2 + 'rpx' : '0',
						padding: '0 ' + value.padding * 2 + 'rpx',
						borderRadius: value.imageRadius == 'right-angle' ? '' : '10rpx'
					}"
					@click="redirectTo(item.link)"
				>
					<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
					<!-- <text v-if="item.title">{{ item.title }}</text> -->
				</view>
			</view>

			<!-- 单图 -->
			<view
				v-else-if="value.selectedTemplate == 'single-graph' && value.list"
				class="item"
				style="width: 100%; overflow: hidden; text-align: center;"
				@click="redirectTo(value.list[0].link)"
				:style="{ borderRadius: value.imageRadius == 'right-angle' ? '' : '10rpx', marginTop: value.marginTop * 2 + 'rpx' }"
			>
				<image v-if="value.list[0].imgWidth > pageWidth - 30" :src="$util.img(value.list[0].imageUrl)" style="width: 100%;max-width:100%" mode="widthFix"></image>
				<image
					v-else
					:src="$util.img(value.list[0].imageUrl)"
					:style="{ width: value.list[0].imgWidth * 2 + 'rpx' }"
					mode="widthFix"
					style="width: 100%;max-width:100%"
				></image>
			</view>

			<!-- 横向滑动 -->
			<scroll-view scroll-x="true" v-else-if="value.selectedTemplate == 'horizontal-sliding'" class="horizontal-sliding">
				<view
					class="item active"
					v-for="(item, index) in value.list"
					:key="index"
					style="overflow: hidden;"
					:style="{
						marginRight: value.imageClearance * 2 + 'rpx',
						borderRadius: value.imageRadius == 'right-angle' ? '' : '10rpx',
						marginTop: value.marginTop * 2 + 'rpx'
					}"
					@click="redirectTo(item.link)"
				>
					<image :src="$util.img(item.imageUrl)" :style="{ width: (item.imgWidth / item.imgHeight) * 330 + 'rpx' }"></image>
					<!-- <text v-if="item.title">{{ item.title }}</text> -->
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'diy-img-ads',
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
		return {
			isDots: true,
			pageWidth: 0,
			swiperRate: 0
		};
	},
	created() {
		this.getWidth();
		this.getSwiperRate();
	},
	methods: {
		redirectTo(link) {
			if (this.siteId) {
				link.site_id = this.siteId;
			}
			this.$util.diyRedirectTo(link);
		},
		getWidth() {
			uni.getSystemInfo({
				success: res => {
					this.pageWidth = res.screenWidth;
				}
			});
		},
		getSwiperRate() {
			var rate = 0,
				rate1 = 0,
				rate2 = 0;
			var data = this.value.list;
			for (var i = 0; i < data.length; i++) {
				rate1 = (data[i].imgWidth / data[i].imgHeight).toFixed(2);

				if (data.length >= 2 && i < data.length - 1) {
					rate2 = (data[i + 1].imgWidth / data[i + 1].imgHeight).toFixed(2);

					if (rate1 <= rate2) {
						rate = rate1;
					} else {
						rate = rate2;
					}
				} else {
					rate = rate1;
				}
			}
			this.swiperRate = rate;
		}
	}
};
</script>

<style lang="scss" scoped>
.single-graph {
	width: 100%;
	line-height: 0;
	display: flex;
	justify-content: center;
	flex-direction: column;
	// background-color: #fff;
	align-items: center;
}

.single-graph text {
	background: rgba(0, 0, 0, 0.3);
	position: absolute;
	bottom: 0;
	color: #ffffff;
	font-size: $font-size-tag;
	width: 100%;
	left: 0;
	line-height: 40rpx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	padding: 0 10rpx;
	box-sizing: border-box;
}

.item.active text {
	background: rgba(0, 0, 0, 0.3);
	position: absolute;
	bottom: 0;
	color: #ffffff;
	font-size: $font-size-tag;
	width: 100%;
	left: 0;
	line-height: 40rpx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	padding: 0 10rpx;
	text-align: center;
}
.swiper-box {
	max-height: 330rpx;
	overflow: hidden;
}

.swiper {
	width: 690rpx;
	// height: 325rpx;
	margin: 0 auto;
	// border-radius: 10rpx;
	overflow: hidden;
	// background-color: #fff;
}

.swiper-item {
	width: 100%;
	height: auto !important;
	display: flex;
	justify-content: center;
	flex-direction: column;

	.item {
		width: 100%;
		height: auto;
		text-align: center;
		position: relative;
		// border-radius: 10rpx;
		overflow: hidden;

		image {
			height: 0;
			display: block;
			width: 100%;
			max-width: 100%;
			height: auto;
		}
	}
}

.vertically-images {
	width: 100%;

	view {
		height: auto;
		position: relative;

		image {
			height: 0;
			display: block;
			width: 100%;
			height: auto;
		}

		text {
			bottom: 0;
			box-sizing: border-box;
			text-align: center;
		}
	}
}

.horizontal-sliding {
	overflow-x: scroll;
	white-space: nowrap;
}

.horizontal-sliding::-webkit-scrollbar {
	display: none;
}

.horizontal-sliding .item {
	display: inline-block;
	// width: 100%;
	vertical-align: middle;
	height: 330rpx;
	position: relative;

	&:last-child {
		margin-right: 0 !important;
	}

	image {
		height: 330rpx;
	}
}

/deep/.uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
}

.swiper /deep/ .uni-swiper-dots-horizontal {
	bottom: 25rpx;
}

.swiper.ns-indicator-dots /deep/ .uni-swiper-dot {
	width: 20rpx;
	height: 6rpx;
	border-radius: 6rpx;
}
</style>
