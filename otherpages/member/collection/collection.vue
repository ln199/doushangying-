<template>
	<view :data-theme="themeStyle">
		<view class="page">
			<view class="list_cate">
				<view class="cate">
					<view class="cate_list" :class="selectGoodsId == item.id ? 'active color-base-bg' : ''" v-for="(item, index) in goodsCategory"
					 :key="index" @click="goodsCateChange(item.id)">
						{{ item.name }}
					</view>
				</view>
				<view class="opec">
					<view class="edit">
						<text class="edit_con" v-if="!isEdit" @click="edit" :class="{ 'color-disabled-bg': collectionList.length <= 0, 'color-base-bg': collectionList.length > 0 }">
							编辑
						</text>
						<text class="edit_con color-base-bg" v-else @click="edit">完成</text>
					</view>
				</view>
			</view>

			<mescroll-uni ref="mescroll" @getData="getData" top="100" class="member-point" :size="8" @listenRefresh="listenRefresh">
				<block slot="list">
					<view class="goods_list">
						<block v-if="collectionList.length > 0 && selectGoodsId == 0" v-for="(goodItem, index_good) in collectionList"
						 :key="index_good">
							<view class="goods_li margin-top" @click.stop="toDetail(goodItem.sku_id)">
								<view class="pic">
									<image :src="$util.img(goodItem.sku_image, { size: 'mid' })" mode="aspectFill" @error="goodsImgError(index_good)"></image>
								</view>
								<view class="goods_info">
									<view class="goods_name font-size-base">{{ goodItem.goods_name }}</view>
									<view class="goods_opection">
										<view class="left color-base-text lineheight-clear">
											<text class="symbol">￥</text>
											<text class="price">{{ goodItem.sku_price }}</text>
										</view>
										<view class="right">
											<view class="cars" @click.stop="deleteItem(goodItem.goods_id)">
												<view class="icon iconfont iconicon7"></view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						<block v-if="collectionList.length > 0 && selectGoodsId == 1">
							<view @click.stop="toShopDetail(item.site_id)" class="shop_li" v-for="(item, index) in collectionList" :key="index">
								<view class="shop-info">
									<view class="shop-image">
										<image v-if="item.logo" :src="$util.img(item.logo)" @error="imgError(index)" mode="widthFix" />
										<image v-else :src="$util.getDefaultImage().default_shop_img" mode="widthFix" />
									</view>
									<view class="shop-con">
										<view class="info-top">
											<view class="info-name">
												{{ item.site_name }}
												<text class="iconfont icongengduo"></text>
											</view>
										</view>
										<view class="info-desc">
											<view class="desc-star">
												{{ $lang('allPoint') }}：
												<text>{{ item.composite_score }}</text>
											</view>
											<text class="fans">{{ $lang('num') }}：{{ item.sub_num }}</text>
										</view>
									</view>
									<navigator hover-class="none" :url="'/otherpages/shop/index/index?site_id=' + item.site_id" class="info-follow color-base-bg"
									 v-if="!isEdit">
										<text>{{ $lang('shop') }}</text>
									</navigator>
									<view class="info-follow active" v-if="isEdit" @click.stop @click="unfollow(item.site_id)">
										<view class="icon iconfont iconicon7"></view>
									</view>
								</view>
								<view class="shop-desc font-size-tag " :class="{ empty: !item.seo_description }">
									{{ item.seo_description ? item.seo_description : '暂无简介' }}
								</view>
							</view>
						</block>
					</view>
					<!-- 第一个列表为空时 -->
					<view v-if="collectionList.length == 0 && selectGoodsId == 0 && isShowEmpty" class="empty">
						<ns-empty text="您当前没有关注的商品哦" :fixed="!1" :isIndex="!1"></ns-empty>
					</view>
					<view v-if="collectionList.length == 0 && selectGoodsId == 1 && isShowEmpty" class="empty">
						<ns-empty text="您当前没有关注的店铺哦" :fixed="!1" :isIndex="!1"></ns-empty>
					</view>
					<ns-goods-recommend ref="goodsRecommend" :auto="!1" :load="!1"></ns-goods-recommend>
				</block>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
</template>

<script>
	import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
	import collection from '../public/js/collection.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {
			nsGoodsRecommend
		},
		mixins: [collection, globalConfig],
		data() {
			return {};
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		}
	};
</script>

<style lang="scss">
	@import '../public/css/collection';
</style>
