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
						:class="{ 'active color-base-text color-base-bg-before': index == oneIndex }"
						@click="selectOneCategory(index)"
					>
						{{ item.short_name ? item.short_name : item.category_name }}
					</view>
				</scroll-view>
				<view class="twoScroll">
					<view class="category-cate-top"></view>
					<template v-show="!isLoading">
						<scroll-view scroll-y="true" :style="{ height: 'calc(100% - ' + height + ' )' }" @scrolltolower="getGoodsList()">
							<image
								class="cate-adv"
								v-if="cateList[oneIndex].image_adv"
								@error="cateList[oneIndex].image_adv = $util.img('/upload/uniapp/default_ad.png')"
								:src="$util.img(cateList[oneIndex].image_adv)"
								mode="widthFix"
							></image>
							<block v-for="(item, index) in goodsList" :key="index">
								<view class="twoScroll-item-box" @click="toDetail(item.sku_id)">
									<image class="twoScroll-item-image" :src="$util.img(item.sku_image, { size: 'mid' })" @error="goodsImgError(index)" mode="aspectFill" />
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
													<text v-if="item.num > 0" class="iconfont iconjianshao color-base-text" @click.stop="cartNumChange('minus', item)"></text>
													<input v-if="item.num > 0" :value="item.num" readonly disabled="disabled" unselectable="on" />
													<text class="iconfont iconadd-fill color-base-text" @click.stop="cartNumChange('add', item)"></text>
												</block>
											</view>
										</view>
									</view>
								</view>
							</block>

							<!-- 加载中 -->
							<view class="mescroll-upwarp" v-show="false"><ns-loading></ns-loading></view>
							<ns-empty v-if="isAll && goodsList.length == 0" :isIndex="!1" :fixed="!1" text="该分类下暂无商品"></ns-empty>
						</scroll-view>
					</template>
				</view>
			</view>
		</view>
		<ns-empty :isIndex="!1" v-else></ns-empty>

		<!-- 加载中 -->
		<view class="mescroll-upwarp" v-show="!isLoadingCate"><ns-loading></ns-loading></view>
		<ns-goods-sku-category ref="goodSkuNew" @refresh="refreshGoodsSkuDetail"></ns-goods-sku-category>

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
	components: {
		nsLoading,
		nsGoodsSkuCategory,
		nsSearch
	},
	data() {
		return {
			height: '',
			oneIndex: 0,
			cartList: [], //购物车
			cateList: [], //分类
			oneCategoryId: 0, //当前分类菜单的id
			categoryAdvImage: '',
			currentRoute: ''
		};
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
	methods: {
		getCategoryList() {
			let url = '/api/goodscategory/tree',
				data = {
					level: this.value.level,
					template: this.value.template
				};
			if(this.siteId){
				data.site_id=this.siteId;
				url = "/api/shopgoodscategory/tree";
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
						this.getGoodsList();

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
			if (!this.isNetwork || this.isAll) return;

			this.isNetwork = 0;
			this.isLoading = true;

			let data = {
				page: this.page_num,
				page_size: this.page_size
			};
			if (this.siteId) {
				data.shop_category_id = this.cateList[this.oneIndex].category_id_1;
			} else {
				data.category_id = this.cateList[this.oneIndex].category_id_1;
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
		selectOneCategory(index) {
			this.oneIndex = index;

			this.page_num = 1;
			this.isAll = false;
			this.isNetwork = true;
			this.goodsList = [];
			this.getGoodsList();

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
/* 上拉加载区域 */
.mescroll-upwarp {
	margin-top: 35vh;
}
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
