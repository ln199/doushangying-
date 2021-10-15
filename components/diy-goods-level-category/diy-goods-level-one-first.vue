<template>
	<view class="category-level" :style="mainHeight">
		<view class="category-level-box" v-if="cateList.length && isLoadingCate">
			<view class="category-cate-top"><nsSearch :siteId="siteId"></nsSearch></view>
			<scroll-view scroll-y="true" class="category-content" :style="{ height: 'calc(100% - ' + height + ' )' }">
				<view class="category-list">
					<text class="category-item using-hidden" v-for="(item, index) in cateList" :key="index" @click="toListDetail(item.category_id_1)">
						{{ item.short_name ? item.short_name : item.category_name }}
					</text>
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
		}
	}
};
</script>
<style lang="scss">
@import '@/components/diy-goods-level-category/diy-goods-level-category.scss';
.category-content {
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
}
.category-list {
	overflow: hidden;
	line-height: 1;
	padding-top: 10rpx;
}
.category-item {
	overflow: hidden;
	display: inline-block;
	margin: 0 30rpx 30rpx 0;
	padding: 0 20rpx;
	width: 150rpx;
	height: 66rpx;
	text-align: center;
	line-height: 66rpx;
	font-size: $font-size-sub;
	background: $color-bg;
	color: $color-title;
	box-sizing: border-box;
	&:nth-child(3n + 3) {
		margin-right: 0;
	}
}
</style>
