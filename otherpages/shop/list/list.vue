<template>
	<view :data-theme="themeStyle">
		<view class="content">
			<view class="head-wrap">
				<!-- 搜索区域 -->
				<view class="search-wrap uni-flex uni-row">

					<view class="flex-item input-wrap">
						<input class="uni-input" maxlength="50" v-model="keyword" confirm-type="search" @confirm="search()" placeholder="请输入您要搜索的商品" />
						<text class="iconfont iconsousuo2" @click.stop="search()"></text>
					</view>
				</view>

				<!-- 排序 -->
				<view class="sort-wrap">
					<view class="comprehensive-wrap" :class="{ 'color-base-text': orderType === '' }" @click="sortTabClick('')">
						<text :class="{ 'color-base-text': orderType === '' }">综合</text>
					</view>
					<view :class="{ 'color-base-text': orderType === 'sale_num' }" @click="sortTabClick('sale_num')">销量</view>
					<view class="price-wrap" @click="sortTabClick('discount_price')">
						<text :class="{ 'color-base-text': orderType === 'discount_price' }">价格</text>
						<view class="iconfont-wrap">
							<view class="iconfont iconshangsanjiao-copy" :class="{ 'color-base-text': priceOrder === 'asc' && orderType === 'discount_price' }"></view>
							<view class="iconfont iconsanjiao" :class="{ 'color-base-text': priceOrder === 'desc' && orderType === 'discount_price' }"></view>
						</view>
					</view>
					<view :class="{ 'color-base-text': orderType === 'screen' }" class="screen-wrap">
						<view class="iconfont font-size-base" :class="{ iconapps: isList, iconlist1: !isList }" @click="changeListStyle()"></view>
						<text style="padding: 0 14rpx; color: #E3E3E3;">|</text>
						<text @click="sortTabClick('screen')">筛选</text>
						<view @click="sortTabClick('screen')" class="iconfont-wrap">
							<view class="iconfont iconshaixuan color-tip"></view>
						</view>
					</view>
				</view>
			</view>

			<mescroll-uni top="190" ref="mescroll" @getData="getGoodsList" v-if="network">
				<block slot="list">
					<view class="goods-list" :class="isList ? 'single-column' : 'double-column'">
						<view class="goods-item margin-bottom" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item)">
							<view class="goods-img">
								<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
							</view>
							<view class="info-wrap">
								<view class="name-wrap">
									<view class="goods-name">{{ item.goods_name }}</view>
								</view>
								<view class="pro-info">
									<view class="delete-price font-size-activity-tag color-tip">
										<block>
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											{{ item.market_price > 0 ? item.market_price : item.price }}
										</block>
									</view>
									<view class="sale font-size-activity-tag color-tip">已售{{ item.sale_num }}{{ item.unit ? item.unit : '件' }}</view>
								</view>
								<view class="lineheight-clear">
									<view class="discount-price">
										<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
										<text class="price color-base-text font-size-toolbar">{{ showPrice(item) }}</text>
									</view>
									<view class="member-price-tag" v-if="item.member_price && item.member_price == showPrice(item)">
										<image :src="$util.img('upload/uniapp/index/VIP.png')" mode="widthFix"></image>
									</view>
									<view class="member-price-tag" v-else-if="item.promotion_type == 1">
										<image :src="$util.img('upload/uniapp/index/discount.png')" mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="goodsList.length == 0 && emptyShow">
						<ns-empty text="暂无商品" :siteId="siteId"></ns-empty>
					</view>
				</block>
			</mescroll-uni>

			<!-- 商品分类弹出框 -->
			<uni-drawer :visible="showCategory" mode="left" @close="showCategory = false">
				<scroll-view scroll-y class="category-list-wrap">
					<view>
						<text class="first" @click="selectedCategory(0, 0)" :class="{ selected: categoryId == 0 }">全部分类</text>
						<view v-for="(item, index) in categoryList" :key="index" class="list-wrap">
							<text class="first" @click="selectedCategory(item.category_id, item.level)" :class="{ selected: item.category_id == categoryId }">
								{{ item.category_name }}
							</text>
							<view class="third" v-if="item.child_list != ''">
								<view v-for="(third_item, third_index) in item.child_list" :key="third_index">
									<uni-tag :inverted="true" :text="third_item.category_name" :type="third_item.category_id == categoryId ? 'primary' : 'default'"
									 @click="selectedCategory(third_item.category_id, third_item.level)" />
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</uni-drawer>

			<!-- 筛选弹出框 -->
			<uni-drawer :visible="showScreen" mode="right" @close="showScreen = false" class="screen-wrap">
				<view class="title color-tip">筛选</view>
				<scroll-view scroll-y>
					<!-- 品牌筛选项 -->
					<view class="item-wrap" v-if="brandList.length > 0">
						<view class="label">
							<text>品牌</text>
							<view class="iconfont" :class="[showBrandMore ? 'iconiconangledown' : 'iconiconangledown-copy']" v-if="brandList.length > 1"
							 @click="showBrandMore = !showBrandMore"></view>
						</view>
						<view class="list">
							<template v-if="showBrandMore">
								<view v-for="(item, index) in brandList" :key="index">
									<uni-tag :inverted="true" :text="item.brand_name" :type="item.brand_id == brandId ? 'primary' : 'default'"
									 @click="brandId == item.brand_id ? (brandId = 0) : (brandId = item.brand_id)" />
								</view>
							</template>
							<template v-else>
								<view v-for="(item, index) in brandList" :key="index" v-if="index < 5">
									<uni-tag :inverted="true" :text="item.brand_name" :type="item.brand_id == brandId ? 'primary' : 'default'"
									 @click="brandId == item.brand_id ? (brandId = 0) : (brandId = item.brand_id)" />
								</view>
							</template>
						</view>
					</view>

					<!-- 包邮 -->
					<view class="item-wrap">
						<view class="label"><text>是否包邮</text></view>
						<view class="list">
							<uni-tag :inverted="true" text="包邮" :type="isFreeShipping > 0 ? 'primary' : 'default'" @click="isFreeShipping = isFreeShipping > 0 ? 0 : 1" />
						</view>
					</view>

					<!-- 属性筛选项 -->
					<view class="item-wrap" v-if="attributeList.length > 0">
						<view v-for="(item, index) in attributeList" :key="index">
							<view class="label">
								<text>{{ item.attr_name }}</text>
								<view class="iconfont iconiconangledown-copy" v-if="item.child.length > 3"></view>
							</view>
							<view class="list">
								<view v-for="(child, child_index) in item.child" :key="child_index">
									<uni-tag :inverted="true" :text="child.attr_value_name" :type="isSelectedAttr(item.attr_id, child.attr_value_id) ? 'primary' : 'default'"
									 @click="selectedAttr(item.attr_id, child.attr_value_id)" />
								</view>
							</view>
						</view>
					</view>

					<!-- 价格筛选项 -->
					<view class="item-wrap">
						<view class="label"><text>价格区间(元)</text></view>
						<view class="price-wrap">
							<input class="uni-input" type="digit" v-model="minPrice" placeholder="最低价" />
							<text class="color-tip">——</text>
							<input class="uni-input" type="digit" v-model="maxPrice" placeholder="最高价" />
						</view>
					</view>

					<!-- 分类筛选项 -->
					<view class="item-wrap">
						<view class="label"><text>分类</text></view>
						<view class="list">
							<view>
								<uni-tag :inverted="true" text="全部" :type="categoryId == '' ? 'primary' : 'default'" @click="categoryId = ''" />
							</view>
							<view v-for="(item, index) in categoryList" :key="index">
								<uni-tag :inverted="true" :text="item.category_name" :type="item.category_id == categoryId ? 'primary' : 'default'"
								 @click="selectedCategory(item.category_id, item.level)" />
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="footer safe-area">
					<view class="footer-box" @click="showScreen = false">取消</view>
					<view class="footer-box1 color-base-bg" @click="screenData">确定</view>
				</view>
			</uni-drawer>

			<!-- 底部tabBar -->
			<diy-bottom-nav type="shop" :siteId="siteId"></diy-bottom-nav>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
	import uniTag from '@/components/uni-tag/uni-tag.vue';
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	import list from '../public/js/list.js';

	export default {
		components: {
			uniDrawer,
			uniTag,
			diyBottomNav
		},
		computed: {
			addonIsExit() {
				return this.$store.state.addonIsExit;
			}
		},
		data() {
			return {};
		},
		mixins: [list, globalConfig]
	};
</script>

<style lang="scss">
	@import '../public/css/list.scss';
</style>
<style lang="scss">
	/deep/ .mescroll-uni-warp scroll-view {
		padding-bottom: 110rpx !important;
	}

	.active /deep/ .mescroll-uni-warp scroll-view {
		padding-bottom: 178rpx !important;
	}
</style>
