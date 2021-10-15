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
						:class="{ 'active color-base-bg-before color-base-text': item.category_id_1 == oneCategoryId }"
						@click="selectOneCategory(item.category_id_1, index)"
					>
						{{ item.short_name ? item.short_name : item.category_name }}
					</view>
				</scroll-view>
				<view class="twoScroll" @scrolltolower="getGoodsList()">
					<view class="category-cate-top">
						<scroll-view scroll-x="true" class="three-two-cate" v-if="twoCateList.length">
							<text
								class="three-two-cate-item using-hidden"
								:class="twoCateSelected == -1 || twoCateSelected == 1 ? 'active color-base-border color-base-text' : ''"
								@click="twoCateSelected = 1"
							>
								全部
							</text>
							<text
								class="three-two-cate-item using-hidden"
								:class="index == TwoCategoryIndex && !twoCateSelected ? 'active color-base-border color-base-text' : ''"
								v-for="(item, index) in twoCateList"
								:key="index"
								@click="selectTwoCategory(item.category_id_2, index)"
							>
								{{ item.category_name }}
							</text>
						</scroll-view>
					</view>
					<scroll-view scroll-y="true" :style="{ height: 'calc(100% - ' + height + ' )' }" @scrolltolower="getGoodsList()">
						<image
							class="cate-adv"
							v-if="categoryAdvImage"
							@error="categoryAdvImage = $util.img('/upload/uniapp/default_ad.png')"
							:src="$util.img(categoryAdvImage)"
							mode="aspectFill"
						></image>
						<view class="twoScroll-item-box" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item.sku_id)">
							<image class="twoScroll-item-image" :src="$util.img(item.sku_image, { size: 'mid' })" @error="goodsImgError(index)" mode="widthFix" />

							<view class="goods_detail">
								<view class="goods_name multi-hidden">{{ item.goods_name }}</view>
								<view class="goods_price">
									<view class="goods-price-box">
										<text class="sale-price color-base-text">
											<text class="price-icon">￥</text>
											{{ showPrice(item) }}
										</text>
										<image
											v-if="item.member_price && item.member_price == showPrice(item)"
											:src="$util.img('/upload/uniapp/category/menber_icon.png')"
											mode="aspectFit"
										></image>
										<image v-else-if="item.promotion_type == 1" :src="$util.img('/upload/uniapp/category/discount_icon.png')" mode="aspectFit"></image>
									</view>
									<text class="line-price">
										<text class="price-icon">￥</text>
										{{ item.market_price > 0 ? item.market_price : item.price }}
									</text>
									<view :class="item.goods_spec_format ? 'careBox_more' : 'careBox'" v-if="item.is_virtual == 0" @click.stop>
										<text v-if="item.goods_spec_format" @click.stop="getGoodsSkuDetail(item.sku_id)" class="color-base-bg">选规格</text>
										<block v-else>
											<text class="iconfont iconjianshao color-base-text" v-if="item.num > 0" @click.stop="cartNumChange('minus', item)"></text>
											<input :value="item.num" readonly disabled="disabled" unselectable="on" v-if="item.num > 0" @click.stop />
											<text class="iconfont iconadd-fill color-base-text" @click.stop="cartNumChange('add', item)"></text>
										</block>
									</view>
								</view>
							</view>
						</view>

						<!-- 加载中 -->
						<view class="mescroll-upwarp" v-show="isLoading"><ns-loading></ns-loading></view>

						<ns-empty v-if="!twoCateList.length" :isIndex="!1" :fixed="!1" text="暂无商品分类"></ns-empty>
						<ns-empty v-if="isAll && goodsList.length == 0 && twoCateList.length" :isIndex="!1" :fixed="!1" text="该分类下暂无商品"></ns-empty>
					</scroll-view>
				</view>
			</view>
		</view>
		<ns-empty v-else :isIndex="!1" text="暂无商品分类"></ns-empty>

		<!-- 加载中 -->
		<view class="mescroll-upwarp" v-show="!isLoadingCate"><ns-loading></ns-loading></view>

		<ns-goods-sku-category ref="goodSkuNew" :goods-detail="goodsSkuDetail" @refresh="refreshGoodsSkuDetail"></ns-goods-sku-category>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import nsGoodsSkuCategory from '@/components/ns-goods-sku/ns-goods-sku-category.vue';
import nsLoading from '@/components/ns-loading/ns-loading.vue';
import nsSearch from '@/components/ns-search/ns-search.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import category from '@/components/diy-goods-level-category/diy-goods-level-category.js';
export default {
	data() {
		return {
			height: '',
			cateList: [], //分类
			oneCategoryId: 0, //当前分类菜单的id
			categoryAdvImage: '',
			cartList: [], //购物车
			twoCateList: [],
			currentRoute: '',
			TwoCategoryId: 0,
			TwoCategoryIndex: 0,
			twoCateSelected: 1
		};
	},
	components: {
		nsLoading,
		nsSearch,
		nsGoodsSkuCategory
	},
	props: {
		siteId:{
			type: [Number, String],
			default: 0
		}
	},
	mixins: [category, globalConfig],
	created() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = '/' + currentPage.route;
		this.getCategoryList();
	},
	watch: {
		twoCateSelected: function(newQuestion, oldQuestion) {
			if (newQuestion == 1) {
				this.page_num = 1;
				this.isAll = false;
				this.isNetwork = true;
				this.goodsList = [];
				this.getGoodsList();
			}
		}
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
						this.oneCategoryId = res.data[0].category_id_1;

						if (res.data[0].child_list) {
							this.twoCateList = res.data[0].child_list;
							if (res.data[0].child_list[0]) this.TwoCategoryId = res.data[0].child_list[0].category_id_2;
							this.getGoodsList();
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
		showPrice(data) {
			let price = data.discount_price;
			if (data.member_price && data.member_price < price) price = data.member_price;
			return price;
		},
		getGoodsList() {
			let levelId = 0;
			if (this.twoCateSelected) {
				levelId = this.oneCategoryId;
			} else {
				levelId = this.TwoCategoryId ? this.TwoCategoryId : this.oneCategoryId;
			}
			if (!this.isNetwork || this.isAll) return;

			this.isNetwork = 0;
			this.isLoading = true;

			let data = {
				page: this.page_num,
				page_size: this.page_size
			};
			if (this.siteId) {
				data.shop_category_id = levelId;
			} else {
				data.category_id = levelId;
			}

			this.$api.sendRequest({
				url: '/api/goodssku/page',
				data: data,
				success: res => {
					this.isNetwork = 1;
					this.isLoading = false;

					if (res.code == 0 && res.data) {
						let newArr = res.data.list.length ? res.data.list : [];
						for (let i in newArr) {
							newArr[i]['sku_image'] = newArr[i]['goods_image'].split(',')[0];
						}

						//设置列表数据
						if (this.page_num == 1) this.goodsList = []; //如果是第一页需手动制空列表
						this.goodsList = this.goodsList.concat(newArr); //追加新数1据
						++this.page_num;

						if (this.goodsList.length == res.data.count) this.isAll = true;
						this.getCartData();
					}

					this.$emit('netFinish', true);
				}
			});
		},
		getCartData() {
			if (!uni.getStorageSync('token')) {
				this.$emit('netFinish', true);
				return;
			}

			this.$api.sendRequest({
				url: '/api/cart/lists',
				success: res => {
					if (res.code >= 0) {
						this.cartList = res.data;

						for (let goods_index in this.goodsList) {
							let goods_item = this.goodsList[goods_index],
								sku_id = goods_item.sku_id,
								num = 0,
								cart_id = '';

							for (let cart_index in this.cartList) {
								let cart_item = this.cartList[cart_index];
								if (sku_id == cart_item.sku_id) {
									num += cart_item.num;
									cart_id = cart_item.cart_id;
								}
							}
							goods_item.num = num;
							goods_item.cart_id = cart_id;

							if (typeof goods_item.num === 'undefined' || goods_item.num === null) {
								goods_item.num = 0;
							}
						}
						this.$forceUpdate();
						this.$emit('netFinish', true);
					}
				}
			});
		},
		selectOneCategory(onecateId, index) {
			this.twoCateSelected = -1;
			this.oneCategoryId = onecateId;
			this.categoryAdvImage = this.cateList[index].image_adv;

			this.page_num = 1;
			this.isAll = false;
			this.isNetwork = true;
			this.goodsList = [];

			this.twoCateList = this.cateList[index].child_list ? this.cateList[index].child_list : [];
			if (this.twoCateList.length) {
				this.TwoCategoryId = this.twoCateList[0].category_id_2;
				this.TwoCategoryIndex = 0;

				this.getGoodsList();
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
		selectTwoCategory(twoCateId, index) {
			this.twoCateSelected = 0;
			this.TwoCategoryId = twoCateId;
			this.TwoCategoryIndex = index;

			this.page_num = 1;
			this.isAll = false;
			this.isNetwork = true;
			this.goodsList = [];
			this.getGoodsList();
		}
	}
};
</script>
<style lang="scss">
@import '@/components/diy-goods-level-category/diy-goods-level-category.scss';
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
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
