<template>
	<view>
		<!-- 1行2个 -->
		<!-- row1-of2 -->

		<!-- 1行3个 -->
		<!-- row1-of3 -->

		<!-- 1行4个 -->
		<!-- row1-of4 -->

		<!-- 2左2右 -->
		<!-- row2-lt-of2-rt -->

		<!-- 1左2右 -->
		<!-- row1-lt-of2-rt -->

		<!-- 1上2下 -->
		<!-- row1-tp-of2-bm -->

		<!-- 1左3右 -->
		<!-- row1-lt-of1-tp-of2-bm -->

		<!-- 自定义 -->
		<!-- custom-rubik-cube -->

		<view v-if="value.selectedTemplate == 'custom-rubik-cube'">
			<view style="position: relative;"><rich-text :nodes="customHtml"></rich-text></view>
		</view>
		<view v-else class="rubik-cube" :style="{ background: value.backgroundColor }">
			<template v-if="value.selectedTemplate == 'row1-lt-of2-rt'">
				<view class="template-left">
					<template v-for="(item, index) in value.list">
						<template v-if="index == 0">
							<view :key="index" :class="['item', value.selectedTemplate]" @click="redirectTo(item.link)" :style="{ padding: value.imageGap + 'rpx' }">
								<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
							</view>
						</template>
					</template>
				</view>

				<view class="template-right">
					<template v-for="(item, index) in value.list">
						<template v-if="index != 0">
							<view :key="index" :class="['item', value.selectedTemplate]" @click="redirectTo(item.link)" :style="{ padding: value.imageGap + 'rpx' }">
								<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
							</view>
						</template>
					</template>
				</view>
			</template>

			<template v-else-if="value.selectedTemplate == 'row1-lt-of1-tp-of2-bm'">
				<view class="template-left" :style="{ paddingRight: value.imageGap + 'rpx' }">
					<template v-for="(item, index) in value.list">
						<template v-if="index == 0">
							<view :key="index" :class="['item', value.selectedTemplate]" @click="redirectTo(item.link)">
								<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
							</view>
						</template>
					</template>
				</view>

				<view class="template-right" :style="{ paddingLeft: value.imageGap + 'rpx' }">
					<view class="template-top" :style="{ paddingBottom: value.imageGap + 'rpx' }">
						<template v-for="(item, index) in value.list">
							<template v-if="index == 1">
								<view :key="index" :class="['item', value.selectedTemplate]" @click="redirectTo(item.link)">
									<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
								</view>
							</template>
						</template>
					</view>
					<view class="template-bottom" :style="{ paddingTop: value.imageGap + 'rpx' }">
						<template v-for="(item, index) in value.list">
							<template v-if="index != 0 && index != 1">
								<view
									:key="index"
									:class="['item', value.selectedTemplate]"
									@click="redirectTo(item.link)"
									:style="{ width: 'calc((100% - ' + value.imageGap * 2 + 'rpx) / 2)' }"
								>
									<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
								</view>
							</template>
						</template>
					</view>
				</view>
			</template>

			<template v-else-if="value.selectedTemplate == 'row1-of3'">
				<view
					:class="['item', value.selectedTemplate]"
					v-for="(item, index) in value.list"
					:key="index"
					@click="redirectTo(item.link)"
					:style="{ width: 'calc((100% - ' + value.imageGap * 2 * 2 + 'rpx) / 3)' }"
				>
					<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
				</view>
			</template>

			<template v-else-if="value.selectedTemplate == 'row1-of4'">
				<view
					:class="['item', value.selectedTemplate]"
					v-for="(item, index) in value.list"
					:key="index"
					@click="redirectTo(item.link)"
					:style="{ width: 'calc((100% - ' + value.imageGap * 2 * 3 + 'rpx) / 4)' }"
				>
					<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
				</view>
			</template>

			<template v-else>
				<view
					:class="['item', value.selectedTemplate]"
					v-for="(item, index) in value.list"
					:key="index"
					@click="redirectTo(item.link)"
					:style="{ padding: value.imageGap + 'rpx' }"
				>
					<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
// 魔方、橱窗
import htmlParser from '@/common/js/html-parser';
export default {
	name: 'diy-rubik-cube',
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
			customHtml: ''
		};
	},
	created() {
		if (this.value.selectedTemplate == 'custom-rubik-cube') {
			this.value.diyHtml = this.value.diyHtml.replace(/&quot;/g, '"');
			this.customHtml = htmlParser(this.value.diyHtml);
		}
	},
	methods: {
		redirectTo(link) {
			if (this.siteId) {
				link.site_id = this.siteId;
			}
			this.$util.diyRedirectTo(link);
		}
	}
};
</script>

<style lang="scss">
.rubik-cube {
	// background: #ffffff;
	overflow: hidden;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	border-radius: 10rpx;
}

.rubik-cube .item {
	// float: left;
	text-align: center;
	line-height: 0;
}

.rubik-cube .item image {
	width: 100%;
	max-width: 100%;
	// max-height: 388rpx;
}

// 一行两个
.rubik-cube .item.row1-of2 {
	width: 50%;
	box-sizing: border-box;
}

.rubik-cube .item.row1-of2:nth-child(1) {
	padding-left: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of2:nth-child(2) {
	padding-right: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

// 一行三个
.rubik-cube .item.row1-of3 {
	width: 33.33%;
	box-sizing: border-box;
}

.rubik-cube .item.row1-of3:nth-child(1) {
	padding-left: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of3:nth-child(2) {
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of3:nth-child(3) {
	padding-right: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

// 一行四个
.rubik-cube .item.row1-of4 {
	width: 25%;
	box-sizing: border-box;
}

.rubik-cube .item.row1-of4:nth-child(1) {
	padding-left: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of4:nth-child(2) {
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of4:nth-child(3) {
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of4:nth-child(4) {
	padding-right: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

// 两左两右
.rubik-cube .item.row2-lt-of2-rt {
	width: 50%;
	display: inline-block;
	box-sizing: border-box;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(1) {
	padding-left: 0 !important;
	padding-top: 0 !important;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(2) {
	padding-right: 0 !important;
	padding-top: 0 !important;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(3) {
	padding-left: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(4) {
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}

// 一左两右
.rubik-cube .template-left,
.rubik-cube .template-right {
	width: 50%;
	box-sizing: border-box;
}

.rubik-cube .item.row1-lt-of2-rt {
	width: 100%;
	box-sizing: border-box;
}

.rubik-cube .template-left .item.row1-lt-of2-rt:nth-child(1) {
	padding-top: 0 !important;
	padding-left: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .template-right .item.row1-lt-of2-rt:nth-child(1) {
	padding-top: 0 !important;
	padding-right: 0 !important;
}

.rubik-cube .template-right .item.row1-lt-of2-rt:nth-child(2) {
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}

// 一上两下
.rubik-cube .item.row1-tp-of2-bm:nth-child(1) {
	width: 100%;
	box-sizing: border-box;
	padding-top: 0 !important;
	padding-left: 0 !important;
	padding-right: 0 !important;
}

.rubik-cube .item.row1-tp-of2-bm:nth-child(2) {
	width: 50%;
	box-sizing: border-box;
	padding-left: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-tp-of2-bm:nth-child(3) {
	width: 50%;
	box-sizing: border-box;
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}

// 一左三右
.rubik-cube .template-left .item.row1-lt-of1-tp-of2-bm {
	width: 100%;
	box-sizing: border-box;
}

.rubik-cube .template-bottom {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
}
</style>
