<template>
	<view class="category-level" :style="mainHeight">
		<view class="category-level-box" v-if="cateList.length && isLoadingCate">
			<view class="category-cate-top"><nsSearch></nsSearch></view>
			<scroll-view
				scroll-y="true"
				class="category-content"
				:style="{
					height: 'calc(100% - ' + height + ' )'
				}"
			>
				<view class="category-list">
					<view class="category-item" v-for="(item, index) in cateList" :key="index" @click="toListDetail(item.category_id_1, 1)">
						<image v-if="item.image" class="item-img" :src="$util.img(item.image)" @error="cateImgError(index)" mode="aspectFit"></image>
						<image v-else class="item-img" :src="$util.getDefaultImage().default_category_img" mode="aspectFit"></image>
						<text class="using-hidden item-text">{{ item.short_name ? item.short_name : item.category_name }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<ns-empty :isIndex="!1" v-else></ns-empty>
	</view>
</template>

<script>
import nsSearch from '@/components/ns-search/ns-search.vue';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			isLoadingCate: false,
			cateList: [], //分类
			height: 0
		};
	},
	components: {
		nsSearch
	},
	mixins: [globalConfig],
	props: {
		value: {
			type: Object
		},
		categoryHeight: {
			type: [Number, String],
			default: 0
		},
		siteId:{
			type: [Number, String],
			default: 0
		}
	},
	computed: {
		mainHeight() {
			var height = this.categoryHeight ? this.categoryHeight + 'px' : '100%';
			height = 'height:' + height;
			return height;
		}
	},
	created() {
		this.getCategoryList();
	},
	methods: {
		getCategoryList() {
			this.isLoadingCate = false;
			this.$api.sendRequest({
				url: '/api/goodscategory/tree',
				data: {
					level: this.value.level,
					template: this.value.template
				},
				success: res => {
					this.isLoadingCate = true;
					if (res.code != 0) {
						this.$util.showToast({
							title: res.message
						});
						return false;
					}
					if (res.code == 0 && res.data.length) {
						this.cateList = res.data;

						this.$nextTick(function() {
							const query = uni.createSelectorQuery().in(this);
							query
								.select('.category-cate-top')
								.boundingClientRect(data => {
									this.height = data.height + 'px';
								})
								.exec();
						});
					}

					this.$emit('netFinish', true);
				}
			});
		},
		toListDetail(id) {
			let data = {
				category_id: id
			};
			let url = '/pages/goods/list/list';
			if (this.siteId) {
				url = '/otherpages/shop/list/list';
				data.site_id = this.siteId;
			}

			this.$util.redirectTo(url, data);
		},
		cateImgError(index) {
			this.cateList[index].image = this.$util.getDefaultImage().default_category_img;
			this.$forceUpdate();
		}
	}
};
</script>
<style lang="scss">
@import '@/components/diy-goods-level-category/diy-goods-level-category.scss';
.category-content {
	width: 100%;
	padding: 0 24rpx;
	box-sizing: border-box;
	.category-list {
		padding-top: 20rpx;
		overflow: hidden;
	}
	.category-item {
		margin: 0 18rpx 50rpx 0;
		width: calc((100% - 54rpx) / 4);
		padding: 0 20rpx;
		display: inline-block;
		box-sizing: border-box;
		text-align: center;
		line-height: 1;
		font-size: 24rpx;
		&:nth-child(4n + 4) {
			margin-right: 0;
		}

		.item-img {
			width: 114rpx;
			height: 114rpx;
			margin-bottom: 20rpx;
		}
		.item-text {
			font-size: $font-size-sub;
		}
	}
}
</style>
