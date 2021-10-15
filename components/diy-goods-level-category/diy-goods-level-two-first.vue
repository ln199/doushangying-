<template>
	<view class="category-level" :style="mainHeight">
		<view class="category-level-box" v-if="cateList.length && isLoadingCate">
			<nsSearch :siteId="siteId"></nsSearch>
			<view class="category-goods">
				<scroll-view scroll-y="true" class="oneScroll">
					<view
						class="oneScroll-item using-hidden"
						v-for="(item, index) in cateList"
						:key="index"
						:class="{ 'active color-base-text color-base-bg-before': item.category_id_1 == oneCategoryId }"
						@click="selectOneCategory(item.category_id_1, index)"
					>
						{{ item.short_name ? item.short_name : item.category_name }}
					</view>
				</scroll-view>
				<view class="twoScroll">
					<view class="category-cate-top"></view>
					<scroll-view scroll-y="true" :style="{ height: 'calc(100% - ' + height + ' )' }" v-if="twoCateList.length">
						<image
							class="cate-adv"
							v-if="categoryAdvImage"
							:src="$util.img(categoryAdvImage)"
							@error="categoryAdvImage = $util.img('/upload/uniapp/default_ad.png')"
							mode="widthFix"
						></image>
						<view class="twoScroll-list">
							<text class="twoScroll-item using-hidden" v-for="(item, index) in twoCateList" :key="index" @click="toListDetail(item.category_id_2)">
								{{ item.short_name ? item.short_name : item.category_name }}
							</text>
						</view>
					</scroll-view>
					<ns-empty v-else :isIndex="!1" :fixed="!1" text="暂无商品分类"></ns-empty>
				</view>
			</view>
		</view>
		<ns-empty v-else :isIndex="!1"></ns-empty>
	</view>
</template>

<script>
import nsSearch from '@/components/ns-search/ns-search.vue';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			isLoadingCate: false,
			categoryAdvImage: '', //广告位
			cateList: [], //所有分类
			twoCateList: [], //二级分类
			height: 0,
			oneCategoryId: 0
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
			let url = '/api/goodscategory/tree',
				data = {
					level: this.value.level,
					template: this.value.template
				};
			if (this.siteId) {
				data.site_id = this.siteId;
				url = '/api/shopgoodscategory/tree';
			}
			this.isLoadingCate = false;
			this.$api.sendRequest({
				url: url,
				data: data,
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
						this.categoryAdvImage = this.cateList[0].image_adv;
						this.oneCategoryId = this.cateList[0].category_id_1;

						if (res.data[0].child_list) {
							this.twoCateList = res.data[0].child_list;
							if (res.data[0].child_list[0] != undefined) this.TwoCategoryId = res.data[0].child_list[0].category_id_2;
						}

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
		selectOneCategory(onecateId, index) {
			this.oneCategoryId = onecateId;
			this.categoryAdvImage = this.cateList[index].image_adv;

			this.twoCateList = this.cateList[index].child_list ? this.cateList[index].child_list : [];
			if (this.twoCateList.length) {
				this.TwoCategoryId = this.twoCateList[0].category_id_2;
				this.TwoCategoryIndex = 0;
			} else {
				this.TwoCategoryId = 0;
			}

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
	}
};
</script>
<style lang="scss">
@import '@/components/diy-goods-level-category/diy-goods-level-category.scss';
.twoScroll-list {
	overflow: hidden;
	.twoScroll-item {
		margin: 0 24rpx 20rpx 0;
		display: inline-block;
		width: 160rpx;
		height: 66rpx;
		padding: 0 20rpx;
		font-size: $font-size-sub;
		line-height: 66rpx;
		text-align: center;
		background: $color-bg;
		box-sizing: border-box;
		&:nth-child(3n + 3) {
			margin-right: 0;
		}
	}
}
</style>
