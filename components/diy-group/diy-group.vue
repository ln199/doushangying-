<template>
	<view class="diy-group">
		<view v-for="(item, index) in diyData.value" :key="index">
			<!-- 文本 -->
			<template v-if="item.controller == 'Text'">
				<diy-text :value="item" :siteId="siteId"></diy-text>
			</template>

			<!-- 文本导航 -->
			<!-- <template v-if="item.controller == 'TextNav'">
				<diy-text-nav :value="item" :siteId="siteId"></diy-text-nav>
			</template> -->

			<!-- 公告 -->
			<template v-if="item.controller == 'Notice'">
				<diy-notice :value="item" :siteId="siteId"></diy-notice>
			</template>

			<!-- 图文导航 -->
			<template v-if="item.controller == 'GraphicNav'">
				<diy-graphic-nav :value="item" :siteId="siteId"></diy-graphic-nav>
			</template>

			<!-- 图片广告 -->
			<template v-if="item.controller == 'ImageAds'">
				<diy-img-ads :value="item" :siteId="siteId"></diy-img-ads>
			</template>

			<!-- 搜索 -->
			<template v-if="item.controller == 'Search'">
				<diy-search :value="item" :siteId="siteId" :city="city"></diy-search>
			</template>

			<!-- 顶部标题 -->
			<!-- 	<template v-if="item.controller == 'Title'">
				<diy-title :value="item" :siteId="siteId"></diy-title>
			</template> -->

			<!-- 富文本 -->
			<template v-if="item.controller == 'RichText'">
				<diy-rich-text :value="item"></diy-rich-text>
			</template>

			<!-- 辅助线 -->
			<template v-if="item.controller == 'HorzLine'">
				<diy-horz-line :value="item"></diy-horz-line>
			</template>

			<!-- 辅助空白 -->
			<template v-if="item.controller == 'HorzBlank'">
				<diy-horz-blank :value="item"></diy-horz-blank>
			</template>

			<!-- 平台/店铺优惠券 -->
			<template v-if="(item.controller == 'AdminPlatformCoupon' && addonIsExit.platformcoupon) || (item.controller == 'ShopCoupon' && addonIsExit.coupon)">
				<diy-coupon :value="item" :siteId="siteId"></diy-coupon>
			</template>

			<!-- 商品列表 -->
			<template v-if="item.controller == 'GoodsList'">
				<diy-goods-list :value="item" :siteId="siteId" :name="name"></diy-goods-list>
			</template>

			<!-- 魔方、橱窗 -->
			<template v-if="item.controller == 'RubikCube'">
				<diy-rubik-cube :value="item" :siteId="siteId"></diy-rubik-cube>
			</template>

			<!-- 视频 -->
			<template v-if="item.controller == 'Video'">
				<diy-video :value="item"></diy-video>
			</template>

			<!-- 秒杀 -->
			<template v-if="item.controller == 'Seckill' && addonIsExit.seckill">
				<diy-seckill :value="item" :siteId="siteId" :name="name"></diy-seckill>
			</template>

			<!-- 拼团 -->
			<template v-if="item.controller == 'Pintuan' && addonIsExit.pintuan">
				<diy-pintuan :value="item" :siteId="siteId" :name="name"></diy-pintuan>
			</template>

			<!-- 团购 -->
			<template v-if="item.controller == 'Groupbuy' && addonIsExit.groupbuy">
				<diy-groupbuy :value="item" :siteId="siteId" :name="name"></diy-groupbuy>
			</template>

			<!-- 砍价 -->
			<template v-if="item.controller == 'Bargain' && addonIsExit.bargain">
				<diy-bargain :value="item" :siteId="siteId" :name="name"></diy-bargain>
			</template>

			<!-- 店铺笔记 -->
			<template v-if="item.controller == 'Notes' && addonIsExit.notes">
				<diy-notes :value="item" :siteId="siteId"></diy-notes>
			</template>

			<!-- 商品分类 -->
			<template v-if="item.controller == 'GoodsCategory'">
				<diy-goods-level-category :value="item" :bottom="scrollHeight" :siteId="siteId"></diy-goods-level-category>
			</template>

			<!-- 浮动按钮 -->
			<template v-if="item.controller == 'FloatBtn'">
				<diy-float-btn :value="item" :siteId="siteId"></diy-float-btn>
			</template>

			<!-- 小程序直播 -->
			<!-- #ifdef MP-WEIXIN -->
			<template v-if="item.controller == 'LiveInfo'">
				<diy-live :value="item" :siteId="siteId"></diy-live>
			</template>
			<!-- #endif -->

			<!-- 分销商品 -->
			<template v-if="item.controller == 'FenxiaoGoodsList'">
				<diy-fenxiao-goods-list :value="item"></diy-fenxiao-goods-list>
			</template>

			<!-- 批发 -->
			<template v-if="item.controller == 'Wholesale' && addonIsExit.wholesale">
				<diy-whole-sale :value="item" :siteId="siteId" :name="name"></diy-whole-sale>
			</template>

			<!-- 切换分站 -->
			<template v-if="item.controller == 'CutCity'">
				<diy-city :value="item"></diy-city>
			</template>
			
			<template v-if="siteId">
				<!-- 店铺信息 -->
				<template v-if="item.controller == 'ShopInfo'">
					<diy-shop-info :value="item" :siteId="siteId" :type="1"></diy-shop-info>
				</template>

				<!-- 店内搜索 -->
				<template v-if="item.controller == 'ShopSearch'">
					<diy-shop-search :value="item" :siteId="siteId"></diy-shop-search>
				</template>

				<!-- 店铺排行榜 -->
				<!-- <template v-if="item.controller == 'RankList'">
					<diy-shop-rank-list :value="item" :siteId="siteId"></diy-shop-rank-list>
				</template> -->

				<!-- 门店列表 -->
				<template v-if="item.controller == 'ShopStore'">
					<diy-shop-store :value="item" :siteId="siteId"></diy-shop-store>
				</template>
				
			</template>
		</view>
	</view>
</template>

<script>
import diyFloatBtn from '@/components/diy-float-btn/diy-float-btn';
import diyHorzBlank from '@/components/diy-horz-blank/diy-horz-blank.vue';
import diyHorzLine from '@/components/diy-horz-line/diy-horz-line.vue';
import diyCoupon from '@/components/diy-coupon/diy-coupon.vue';
import diyCity from '@/components/diy-city/diy-city.vue';
import diyGoodsList from '@/components/diy-goods-list/diy-goods-list.vue';
import diyImgAds from '@/components/diy-img-ads/diy-img-ads.vue';
import diyGraphicNav from '@/components/diy-graphic-nav/diy-graphic-nav.vue';
import diyNotice from '@/components/diy-notice/diy-notice.vue';
import diyRichText from '@/components/diy-rich-text/diy-rich-text.vue';
import diyRubikCube from '@/components/diy-rubik-cube/diy-rubik-cube';
import diySearch from '@/components/diy-search/diy-search.vue';
// import diyTextNav from '@/components/diy-text-nav/diy-text-nav.vue';
// import diyTitle from '@/components/diy-title/diy-title.vue';
import diyVideo from '@/components/diy-video/diy-video.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import diyNotes from '@/components/diy-notes/diy-notes.vue';
import diySeckill from '@/components/diy-seckill/diy-seckill.vue';
import diyBargain from '@/components/diy-bargain/diy-bargain.vue';
import diyPintuan from '@/components/diy-pintuan/diy-pintuan.vue';
import diyGroupBuy from '@/components/diy-groupbuy/diy-groupbuy.vue';
import diyGoodsLevelCategory from '@/components/diy-goods-level-category/diy-goods-level-category.vue';
import diyLive from '@/components/diy-live/diy-live.vue';
import diyWholeSale from '@/components/diy-wholesale/diy-wholesale.vue';
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	components: {
		diyCity,
		diyHorzBlank,
		diyHorzLine,
		diyCoupon,
		diyGoodsList,
		diyImgAds,
		diyGraphicNav,
		diyNotice,
		diyRichText,
		diyRubikCube,
		diySearch,
		// diyTextNav,
		// diyTitle,
		diyVideo,
		diyBargain,
		uniPopup,
		diySeckill,
		diyPintuan,
		diyGroupBuy,
		diyGoodsLevelCategory,
		diyLive,
		diyWholeSale,
		diyFloatBtn,
		diyNotes
	},
	props: {
		diyData: {
			type: [Array, Object]
		},
		siteId: {
			type: [String, Number],
			default: 0
		},
		height: {
			type: String,
			default() {
				return '100vh';
			}
		},
		scrollHeight: {
			type: String,
			default() {
				return '100vh';
			}
		},
		city: {
			type: String
		},
		name: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {};
	},
	mixins: [globalConfig],
	computed: {
		bgColor() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.bgColor;
			}
			return str;
		},
		bgUrl() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.bgUrl;
			}
			return str;
		},
		bgNav() {
			if (this.bgUrl) {
				return { background: 'url(' + this.$util.img(this.bgUrl) + ') no-repeat 0 0/100%' };
			} else if (this.bgColor) {
				return { background: this.bgColor };
			} else {
				return { background: '#ffffff' };
			}
		}
	}
};
</script>

<style lang="scss">
.diy-group {
	width: 100%;
}
</style>
