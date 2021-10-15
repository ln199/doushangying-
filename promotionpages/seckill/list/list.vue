<template>
	<view :class="themeStyle" :data-theme="themeStyle">
		<view v-show="show">
			<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="seckillId && addonIsExit.seckill" @scroll="scroll">
				<block slot="list">
					<ns-adv keyword="NS_SECKILL"></ns-adv>
					<view class="time-wrap">
						<image :src="$util.img('upload/uniapp/seckill.png')" mode="widthFix"></image>
						<scroll-view :scroll-x="true" class="scroll-wrap" scroll-with-animation :scroll-into-view="'a' + seckillId">
							<view class="time-item" v-for="(item, key) in timeList" :key="key" :id="'a' + item.id" @click="ontabtap(item.id, key)">
								<!-- 								v-if="key >= index && dataList.length > 0" -->
								<view class="span font-size-toolbar" :class="seckillId == item.id ? 'color-base-text' : ''">
									{{ transformSeckillTime(item.seckill_start_time) }}
								</view>
								<view class="em font-size-activity-tag color-sub" :class="seckillId == item.id ? 'color-base-bg active' : ''" v-if="key > index">敬请期待</view>
								<view class="em font-size-activity-tag color-sub" :class="seckillId == item.id ? 'color-base-bg active' : ''" v-if="key == index && !item.isNow">
									即将开始
								</view>
								<view class="em font-size-activity-tag color-sub" :class="seckillId == item.id ? 'color-base-bg active' : ''" v-if="key == index && item.isNow">
									抢购中
								</view>
								<view class="em font-size-activity-tag color-sub" :class="seckillId == item.id ? 'color-base-bg active' : ''" v-if="key < index">已结束</view>
							</view>
						</scroll-view>
					</view>

					<view class="goods-list single-column" v-if="dataList.length" @click="isEnd(seckillIndex < index && timeList[index].isNow)">
						<view class="goods-item margin-bottom" v-for="(item, goodsIndex) in dataList" :key="goodsIndex">
							<view class="goods-img" @click="toGoodsDetail(item.id, index)">
								<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(goodsIndex)"></image>
								<!-- <image :src="$util.img(item.sku_image, {size: 'mid'})" mode="widthFix" @error="imgError(goodsIndex)"></image> -->
								<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
							</view>
							<view class="info-wrap">
								<view class="name-wrap">
									<view class="goods-name" @click="toGoodsDetail(item.id, index)">{{ item.goods_name }}</view>
								</view>
								<view class="lineheight-clear">
									<view class="discount-price">
										<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
										<text class="price color-base-text font-size-toolbar">{{ item.seckill_price }}</text>
									</view>
								</view>
								<view class="pro-info">
									<view class="delete-price font-size-activity-tag color-tip">
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										{{ item.price }}
									</view>
									<view @click="toGoodsDetail(item.id, index)"><button type="primary" size="mini">去抢购</button></view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="!dataList.length && showEmpty" style="z-index: 1 !important;"><ns-empty :fixed="!1" text="该时间段暂无秒杀商品"></ns-empty></view>
				</block>
			</mescroll-uni>
		</view>
		<view class="big-empty" v-show="!show"><ns-empty text="当前活动暂未开启"></ns-empty></view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>
<script>
import globalConfig from '@/common/js/golbalConfig.js';
import list from '../public/js/list.js';
import nsAdv from '@/components/ns-adv/ns-adv.vue';
export default {
	data() {
		return {
			hour: '00',
			minute: '00',
			second: '00',
			ident: false,
			showEmpty: false
		};
	},
	components: {
		nsAdv
	},
	onLoad(data) {
		this.siteId = parseInt(data.site_id) || 0;
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.seckill) {
				this.$util.showToast({
					title: '秒杀未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			} else {
				this.getTimeList();
			}
		});
	},
	mixins: [list, globalConfig],
	onReady() {
		setTimeout(() => {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.time-wrap')
				.boundingClientRect(data => {
					if (data) this.timeTop = data.top;
				})
				.exec();
		}, 500);
	}
};
</script>

<style lang="scss">
@import '../public/css/list.scss';
</style>
