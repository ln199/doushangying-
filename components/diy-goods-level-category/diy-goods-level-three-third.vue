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
						:class="{ 'active color-base-text color-base-bg-before': index == oneIndex }"
						@click="selectOneCategory(index)"
					>
						{{ item.short_name ? item.short_name : item.category_name }}
					</view>
				</scroll-view>

				<view class="twoScroll">
					<view class="category-cate-top">
						<scroll-view v-if="cateList[oneIndex].child_list && cateList[oneIndex].child_list.length" scroll-x="true" class="three-two-cate">
							<view
								class="three-two-cate-item using-hidden"
								:class="second_index == twoIndex ? 'active color-base-border color-base-text' : ''"
								v-for="(item, second_index) in cateList[oneIndex].child_list"
								:key="second_index"
								@click="selectTwoCategory(second_index)"
							>
								{{ item.category_name }}
							</view>
						</scroll-view>
					</view>
					<scroll-view scroll-y="true" :style="{ height: 'calc(100% - ' + height + ' )' }">
						<image
							class="cate-adv"
							mode="widthFix"
							v-if="cateList[oneIndex].image_adv"
							:src="$util.img(cateList[oneIndex].image_adv)"
							@error="cateList[oneIndex].image_adv = $util.img('/upload/uniapp/default_ad.png')"
						></image>
						<block
							v-if="cateList[oneIndex].child_list && cateList[oneIndex].child_list[twoIndex].child_list && cateList[oneIndex].child_list[twoIndex].child_list.length"
						>
							<view class="twoScroll-goods" v-for="(item, index) in cateList[oneIndex].child_list[twoIndex].child_list" :key="index">
								<text class="twoScroll-goods-title" @click="toListDetail(item.category_id_3)">{{ item.category_name }}</text>
								<view class="twoScroll-list">
									<view class="twoScroll-item-box" v-for="(goods, j) in item.goods_list" :key="j" v-if="item.goods_list" @click="toDetail(goods.sku_id)">
										<image
											class="twoScroll-item-image"
											:src="$util.img(goods.sku_image, { size: 'mid' })"
											@error="threeGoodsImgError(index, j)"
											mode="aspectFill"
										/>
										<view class="goods_detail">
											<view class="goods_name multi-hidden">{{ goods.goods_name }}</view>
											<view class="goods_price">
												<view class="goods-price-box">
													<text class="sale-price color-base-text">
														<text class="price-icon">￥</text>
														{{ showPrice(goods) }}
													</text>
													<image
														v-if="goods.member_price && goods.member_price == showPrice(goods)"
														:src="$util.img('/upload/uniapp/category/menber_icon.png')"
														mode="aspectFit"
													></image>
													<image
														v-else-if="goods.promotion_type == 1"
														:src="$util.img('/upload/uniapp/category/discount_icon.png')"
														mode="aspectFit"
													></image>
												</view>
												<text class="line-price">
													<text class="price-icon">￥</text>
													{{ goods.market_price > 0 ? goods.market_price : goods.price }}
												</text>
												<view :class="goods.goods_spec_format ? 'careBox_more' : 'careBox'" v-if="goods.is_virtual == 0" @click.stop>
													<text v-if="goods.goods_spec_format" @click.stop="getGoodsSkuDetail(goods.sku_id)" class="color-base-bg">选规格</text>
													<block v-else>
														<text class="iconfont iconjianshao color-base-text" v-if="goods.num > 0" @click.stop="cartNumChange('minus', goods)"></text>
														<input :value="goods.num" readonly disabled="disabled" unselectable="on" v-if="goods.num > 0" />
														<text class="iconfont iconadd-fill color-base-text" @click.stop="cartNumChange('add', goods)"></text>
													</block>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						<ns-empty v-else :isIndex="!1" :fixed="!1" text="暂无商品分类"></ns-empty>
					</scroll-view>
				</view>
			</view>
		</view>
		<ns-empty v-else :isIndex="!1" text="暂无商品分类"></ns-empty>
		<ns-goods-sku-category ref="goodSkuNew" @refresh="refreshGoodsSkuDetail"></ns-goods-sku-category>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import nsSearch from '@/components/ns-search/ns-search.vue';
import nsGoodsSkuCategory from '@/components/ns-goods-sku/ns-goods-sku-category.vue';
import nsLoading from '@/components/ns-loading/ns-loading.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import category from '@/components/diy-goods-level-category/diy-goods-level-category.js';
export default {
	data() {
		return {
			height: '',
			cateList: [], //分类
			oneIndex: 0,
			twoIndex: 0,
			threeIndex: [],
			currentRoute: '',
			cartList: [] //购物车
		};
	},
	props: {
		siteId:{
			type: [Number, String],
			default: 0
		}
	},
	components: {
		nsLoading,
		nsSearch,
		nsGoodsSkuCategory
	},
	mixins: [category, globalConfig],
	created() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = '/' + currentPage.route;
		this.getCategoryList();
	},
	methods: {
		getCategoryList() {
			let url = '/api/goodscategory/tree',
				data = {
					level: this.value.level,
					template: this.value.template
				};
			this.isLoadingCate = false;
			this.$api.sendRequest({
				url: url,
				data: data,
				success: res => {
					this.isLoadingCate = true;
					if (res.data.length) {
						this.cateList = res.data;

						for (var i = 0; i < this.cateList.length; i++) {
							if (this.cateList[i].child_list) {
								for (var k = 0; k < this.cateList[i].child_list.length; k++) {
									if (this.cateList[i].child_list[k].child_list) {
										for (var j = 0; j < this.cateList[i].child_list[k].child_list.length; j++) {
											this.cateList[i].child_list[k].child_list[j].goods_list = [];
										}
									}
								}
							}
						}

						this.selectOneCategory();

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
		showPrice(data) {
			let price = parseInt(data.discount_price);
			if (data.member_price && parseInt(data.member_price) < price) price = data.member_price;
			return price;
		},
		async getGoodsList() {
			if (!this.cateList[this.oneIndex] || !this.cateList[this.oneIndex].child_list.length || !this.cateList[this.oneIndex].child_list[this.twoIndex].child_list)
				return false;
			var list = this.cateList[this.oneIndex].child_list[this.twoIndex].child_list;

			for (var i = 0; i < list.length; i++) {
				let data = {
					page: this.page_num,
					page_size: this.page_size,
					category_id: list[i].category_id
				};
				var res = await this.$api.sendRequest({
					url: '/api/goodssku/page',
					data: data,
					async: false
				});
				if (res.code == 0 && res.data && this.cateList[this.oneIndex].child_list[this.twoIndex].child_list[i]) {
					this.cateList[this.oneIndex].child_list[this.twoIndex].child_list[i].goods_list = res.data.list;
					if (res.data.list.length) this.threeIndex.push(i);
				}
			}
			this.getCartData();
			this.$forceUpdate();
			this.$emit('netFinish', true);
		},
		async getCartData(times) {
			if (!uni.getStorageSync('token')) {
				this.$emit('netFinish', true);
				return;
			}

			var res = await this.$api.sendRequest({
				url: '/api/cart/lists',
				async: false
			});
			if (res.code >= 0) {
				this.cartList = res.data;
				var categoryList = this.cateList[this.oneIndex].child_list[this.twoIndex].child_list;
				for (var i = 0; i < categoryList.length; i++) {
					if (this.threeIndex.indexOf(i) != -1) {
						for (var j = 0; j < this.cartList.length; j++) {
							for (var k = 0; k < categoryList[i].goods_list.length; k++) {
								if (this.cartList[j].sku_id == categoryList[i].goods_list[k].sku_id) {
									categoryList[i].goods_list[k].num = this.cartList[j].num;
									categoryList[i].goods_list[k].cart_id = this.cartList[j].cart_id;
									break;
								}
							}
						}
					}
				}
				this.$forceUpdate();
				this.$emit('netFinish', true);
			}
		},
		selectOneCategory(index = 0) {
			this.oneIndex = index;
			this.twoIndex = 0;
			if (this.cateList[this.oneIndex].child_list && this.cateList[this.oneIndex].child_list.length) {
				if (this.cateList[this.oneIndex].child_list[this.twoIndex].child_list && this.cateList[this.oneIndex].child_list[this.twoIndex].child_list) {
					this.getGoodsList();
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
		},
		selectTwoCategory(second_index) {
			this.twoIndex = second_index;
			if (this.cateList[this.oneIndex].child_list[this.twoIndex].child_list && this.cateList[this.oneIndex].child_list[this.twoIndex].child_list) {
				this.getGoodsList();
			}
		},
		threeGoodsImgError(index, goods_index) {
			this.cateList[this.oneIndex].child_list[this.twoIndex].child_list[index].goods_list[goods_index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		toListDetail(id) {
			let url = '/pages/goods/list/list',
				data = {
					category_id: id
				};

			this.$util.redirectTo(url, data);
		}
	}
};
</script>
<style lang="scss">
@import '@/components/diy-goods-level-category/diy-goods-level-category.scss';
.twoScroll-item-box {
	&:nth-last-child(2) {
		border-bottom: 2rpx solid $color-line;
	}
	&:nth-last-child(1) {
		border: 0;
	}
}
.three-two-cate {
	width: 100%;
	padding-bottom: 30rpx;
	box-sizing: border-box;
	line-height: 1;
	white-space: nowrap;

	.three-two-cate-item {
		display: inline-block;
		height: 50rpx;
		line-height: 36rpx;
		margin-right: 20rpx;
		padding: 6rpx 16rpx;
		border: 1px solid $color-disabled;
		box-sizing: border-box;
		border-radius: 45rpx;
		color: $color-title;
		text-align: center;
		font-size: $font-size-tag;
	}
	.three-two-cate-item.active {
		border: 1px solid;
	}
}
.twoScroll-goods {
	.twoScroll-goods-title {
		display: inline-block;
		width: 300rpx;
		font-size: $font-size-sub;
		font-weight: bold;
		color: $color-title;
		margin-bottom: 30rpx;
		margin-top: 20rpx;

		.more {
			color: #8a8a8a;
		}

		.iconfont {
			color: #8a8a8a;
		}
	}
	&:nth-child(1) .twoScroll-goods-title {
		margin-top: 0;
	}
}
.loading-box {
	height: 50px;
}

/* 上拉加载区域 */
.mescroll-upwarp {
	min-height: 60rpx;
	padding: 30rpx 0;
	text-align: center;
	clear: both;
	margin-bottom: 20rpx;
}

/*提示文本 */
.mescroll-upwarp .upwarp-tip,
.mescroll-upwarp .upwarp-nodata {
	display: inline-block;
	font-size: 20rpx;
	color: #b1b1b1;
	vertical-align: middle;
}

.mescroll-upwarp .upwarp-tip {
	margin-left: 16rpx;
}

/*旋转进度条 */
.mescroll-upwarp .upwarp-progress {
	display: inline-block;
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	border: 2rpx solid #b1b1b1;
	border-bottom-color: transparent;
	vertical-align: middle;
}

/* 旋转动画 */
.mescroll-upwarp .mescroll-rotate {
	animation: mescrollUpRotate 0.6s linear infinite;
}

@keyframes mescrollUpRotate {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
