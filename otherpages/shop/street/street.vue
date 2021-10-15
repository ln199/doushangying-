<template>
	<view :data-theme="themeStyle">
		<view class="content" :class="iphoneX?'active':''">
			<view class="head-wrap">
				<view class="search-wrap uni-flex uni-row">
					<view class="flex-item input-wrap">
						<input class="uni-input" maxlength="50" v-model="keyword" confirm-type="search" @confirm="search()" placeholder="请输入您要搜索的店铺" />
						<text class="iconfont iconIcon_search" @click.stop="search()"></text>
					</view>
				</view>

				<view class="sort-wrap">
					<view class="comprehensive-wrap" :class="{ 'color-base-text': orderType === '' }" @click="sortTabClick('')">
						<text :class="{ 'color-base-text': orderType === '' }">{{ $lang('all') }}</text>
					</view>
					<view :class="{ 'color-base-text': orderType === 'shop_sales' }" @click="sortTabClick('shop_sales')">{{ $lang('sale') }}</view>
					<view :class="{ 'color-base-text': orderType === 'shop_desccredit' }" @click="sortTabClick('shop_desccredit')">{{ $lang('desccredit') }}</view>
				</view>
			</view>

			<mescroll-uni top="180" ref="mescroll" @getData="getShopList">
				<block slot="list">
					<view>
						<view v-if="shopList.length" class="line">

						</view>
						<view @click="jump('/otherpages/shop/index/index?site_id=' + item.site_id)" class="shop-box" v-for="(item, index) in shopList"
						 :key="index">
							<view class="avatar">
								<image v-if="item.avatar" :src="$util.img(item.avatar)" @error="imgError(index)" mode="aspectFit"></image>
								<image v-else :src="$util.getDefaultImage().default_shop_img" mode="aspectFit" />
							</view>
							<view class="shop-desc">
								<view class="name-box">
									<view class="shop-name">
										{{ item.site_name }}
									</view>
									<text class="color-tip" style="font-size: 22rpx;">{{ $lang('distance') }}{{ item.distance|distance }}</text>
								</view>
								<view class="rate-box">
									<image class="icon-star margin-right" :src="$util.img('upload/uniapp/start.png')" mode=""></image>
									<view class="score">{{item.composite_score}}{{ $lang('score') }}</view>
								</view>
								<view class="shop-content color-tip margin-top">
									<view class="shop-content-left">
										<text>{{ $lang('main') }}：{{ item.category_name }}</text><text style="margin-left: 31rpx;">有{{ item.sub_num }}人关注</text>
									</view>
								</view>
							</view>
						</view>
						<view class="empty" v-if="!shopList.length">
							<ns-empty text="当前街上没有店铺哦"></ns-empty>
						</view>
					</view>
				</block>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
			<!-- 底部tabBar -->
			<diy-bottom-nav></diy-bottom-nav>
		</view>
	</view>

</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import street from '../public/js/street.js';
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	import sxRate from '@/components/sx-rate/index.vue'

	export default {
		components: {
			diyBottomNav,
			sxRate
		},
		data() {
			return {};
		},
		computed: {
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			},
			starColor() {
				return this.$store.state.baseColor
			}
		},
		mixins: [street, globalConfig],
		filters: {
			distance(distance) {
				if (distance < 1000) return distance + 'm';
				else return (distance / 1000).toFixed(2) + 'km';
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/street.scss';
</style>

<style lang="scss">
	/deep/ .uni-scroll-view-content {
		background: #ffffff;
	}

	.content /deep/ .mescroll-upwarp {
		padding-bottom: 150rpx;
	}

	.content.active /deep/ .mescroll-upwarp {
		padding-bottom: 220rpx;
	}
</style>
