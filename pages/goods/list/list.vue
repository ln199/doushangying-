<template>
	<view class="content" :data-theme="themeStyle">
		<view class="head-wrap">
			<!-- 搜索区域 -->
			<view class="search-wrap uni-flex uni-row">
				<view class="flex-item input-wrap">
					<input class="uni-input" maxlength="50" v-model="keyword" confirm-type="search" @confirm="search()" placeholder="请输入您要搜索的商品" />
					<text class="iconfont iconsousuo1" @click.stop="search()"></text>
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
					<view @click="sortTabClick('screen')" class="iconfont-wrap"><view class="iconfont iconshaixuan color-tip"></view></view>
				</view>
			</view>
		</view>

		<mescroll-uni top="180" ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="goods-list" :class="isList ? 'single-column' : 'double-column'">
					<view class="goods-item margin-bottom" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item)">
						<view class="goods-img"><image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image></view>
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
				<view v-if="goodsList.length == 0 && emptyShow"><ns-empty text="暂无商品"></ns-empty></view>
			</block>
		</mescroll-uni>

		<!-- 筛选弹出框 -->
		<uni-drawer :visible="showScreen" mode="right" @close="showScreen = false" class="screen-wrap">
			<view class="title color-tip">筛选</view>
			<scroll-view scroll-y>
				<!-- 品牌筛选项 -->
				<view class="item-wrap" v-if="brandList.length > 0">
					<view class="label">
						<text>品牌</text>
						<view
							class="iconfont"
							:class="[showBrandMore ? 'iconiconangledown' : 'iconiconangledown-copy']"
							v-if="brandList.length > 1"
							@click="showBrandMore = !showBrandMore"
						></view>
					</view>
					<view class="list">
						<template v-if="showBrandMore">
							<view v-for="(item, index) in brandList" :key="index">
								<uni-tag
									:inverted="true"
									:text="item.brand_name"
									:type="item.brand_id == brandId ? 'primary' : 'default'"
									@click="brandId == item.brand_id ? (brandId = 0) : (brandId = item.brand_id)"
								/>
							</view>
						</template>
						<template v-else>
							<view v-for="(item, index) in brandList" :key="index" v-if="index < 5">
								<uni-tag
									:inverted="true"
									:text="item.brand_name"
									:type="item.brand_id == brandId ? 'primary' : 'default'"
									@click="brandId == item.brand_id ? (brandId = 0) : (brandId = item.brand_id)"
								/>
							</view>
						</template>
					</view>
				</view>

				<!-- 包邮 -->
				<view class="item-wrap">
					<view class="label"><text>是否包邮</text></view>
					<view class="list"><uni-tag :inverted="true" text="包邮" :type="isFreeShipping ? 'primary' : 'default'" @click="isFreeShipping = !isFreeShipping" /></view>
				</view>

				<!-- 经营类型 -->
				<view class="item-wrap">
					<view class="label"><text>经营类型</text></view>
					<view class="list">
						<view><uni-tag :inverted="true" text="平台自营" :type="isOwn === 1 ? 'primary' : 'default'" @click="isOwn === 1 ? (isOwn = 2) : (isOwn = 1)" /></view>
						<view><uni-tag :inverted="true" text="加盟店铺" :type="isOwn === 0 ? 'primary' : 'default'" @click="isOwn === 0 ? (isOwn = 2) : (isOwn = 0)" /></view>
					</view>
				</view>

				<!-- 属性筛选项 -->
				<view class="item-wrap" v-if="attributeList.length > 0">
					<view v-for="(item, index) in attributeList" :key="index">
						<view class="label">
							<text>{{ item.attr_name }}</text>
							<!-- iconiconangledown -->
							<view class="iconfont iconiconangledown-copy" v-if="item.child.length > 3"></view>
						</view>
						<view class="list">
							<view v-for="(child, child_index) in item.child" :key="child_index">
								<uni-tag
									:inverted="true"
									:text="child.attr_value_name"
									:type="isSelectedAttr(item.attr_id, child.attr_value_id) ? 'primary' : 'default'"
									@click="selectedAttr(item.attr_id, child.attr_value_id)"
								/>
							</view>
						</view>
					</view>
				</view>

				<!-- 价格筛选项 -->
				<view class="item-wrap">
					<view class="label"><text>价格区间(元)</text></view>
					<view class="price-wrap">
						<input class="uni-input" type="digit" v-model="minPrice" placeholder="最低价" />
						<view class="h-line"></view>
						<input class="uni-input" type="digit" v-model="maxPrice" placeholder="最高价" />
					</view>
				</view>
				<!-- 分类筛选项 -->
				<view class="category-list-wrap">
					<text class="first">全部分类</text>
					<view class="class-box">
						<view @click="selectedCategory('')" class="list-wrap"><text :class="{ selected: !categoryId, 'color-base-text': !categoryId }">全部</text></view>
						<view @click="selectedCategory(item.category_id)" v-for="(item, index) in categoryList" :key="index" class="list-wrap">
							<text :class="{ selected: item.category_id == categoryId, 'color-base-text': item.category_id == categoryId }">{{ item.category_name }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="footer" :class="{ 'safe-area': isIphoneX }">
				<button type="default" class="footer-box" @click="resetData">重置</button>
				<button type="primary" class="footer-box1" @click="screenData">确定</button>
			</view>
		</uni-drawer>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import list from '../public/js/list.js';
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	components: {
		uniDrawer,
		uniTag
	},
	data() {
		return {};
	},
	mixins: [globalConfig, list]
};
</script>

<style lang="scss">
@import '../public/css/list.scss';
</style>
<style scoped>
>>> .uni-tag--primary.uni-tag--inverted {
	background-color: #f5f5f5 !important;
}
</style>
