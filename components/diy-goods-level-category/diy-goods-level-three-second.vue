<template>
	<view class="category-level">
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
						<view class="cate-right-box" v-for="(item, index) in twoCateList" :key="index">
							<view class="title using-hidden" @click="toListDetail(item.category_id_2)">{{ item.category_name }}</view>
							<view class="cate-goods-list">
								<view class="cate-goods-item" v-for="(i, j) in item.child_list" :key="j" @click="toListDetail(i.category_id_3)">
									<image v-if="i.image" class="goods-pic" :src="$util.img(i.image)" @error="threeCateImgError(index, j)" mode="aspectFit"></image>
									<image v-else class="goods-pic" :src="$util.getDefaultImage().default_category_img" mode="aspectFit"></image>
									<view class="goods-name using-hidden">{{ i.category_name }}</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<ns-empty v-else :isIndex="!1" :fixed="!1" text="暂无商品分类"></ns-empty>
				</view>
			</view>
		</view>
		<ns-empty :isIndex="!1" v-else text="暂无商品分类"></ns-empty>
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
			threeCateList: [], //三级分类
			height: 0,
			oneCategoryId: 0,
			TwoCategoryId: 0,
			threeCategoryId: 0
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
		siteId:{
			type: [Number, String],
			default: 0
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
						this.categoryAdvImage = this.cateList[0].image_adv;
						this.oneCategoryId = this.cateList[0].category_id_1;

						if (res.data[0].child_list) {
							this.twoCateList = res.data[0].child_list;
							if (res.data[0].child_list[0]) {
								this.TwoCategoryId = res.data[0].child_list[0].category_id_2;
								this.threeCateList = res.data[0].child_list[0].child_list ? res.data[0].child_list[0].child_list : [];
							}
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
			let url = '/pages/goods/list/list',
				data = {
					category_id: id
				};

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
		},
		threeCateImgError(index,j) {
			this.twoCateList[index].child_list[j].image = this.$util.getDefaultImage().default_category_img;
			this.$forceUpdate();
		}
	}
};
</script>
<style lang="scss">
@import '@/components/diy-goods-level-category/diy-goods-level-category.scss';
.cate-right-box {
	.title {
		display: block;
		width: 300rpx;
		font-size: 30rpx;
		font-size: $font-size-sub;
		font-weight: bold;
		margin-bottom: 30rpx;
		margin-top: 20rpx;
	}
	.cate-goods-list {
		padding: 0 34rpx;
		overflow: hidden;
		.cate-goods-item {
			margin: 0 60rpx 40rpx 0;
			width: 114rpx;
			display: inline-block;
			text-align: center;
			line-height: 1;
			&:nth-child(3n) {
				margin-right: 0;
			}
			.goods-pic {
				width: 114rpx;
				height: 114rpx;
				margin-bottom: 20rpx;
			}
			.goods-name {
				font-size: $font-size-sub;
				color: $color-title;
			}
		}
	}
}
</style>
