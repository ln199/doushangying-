<template>
	<!-- 当前商品参与的营销活动入口 -->
	<view class="ns-goods-promotion" v-if="goodsPromotion.length">
		<view v-for="(item, index) in goodsPromotion" v-if="promotion != item.promotion_type" :key="index">
			<view v-if="item.promotion_type == 'discount'" class="item" @click="redirectTo('/pages/goods/detail/detail', { sku_id: item.sku_id })">
				<text class="promotion-mark color-base-bg">限时折扣</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'groupbuy'" class="item" @click="redirectTo('/promotionpages/groupbuy/detail/detail', { groupbuy_id: item.groupbuy_id })">
				<!-- <view v-else-if="item.promotion_type == 'groupbuy'" class="item" @click="redirectTo('/promotionpages/groupbuy/detail/detail', { id: item.groupbuy_id })"> -->
				<text class="promotion-mark color-base-bg">团购</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'pintuan'" class="item" @click="redirectTo('/promotionpages/pintuan/detail/detail', { pintuan_id: item.pintuan_id })">
				<text class="promotion-mark color-base-bg">拼团</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'seckill'" class="item" @click="redirectTo('/promotionpages/seckill/detail/detail', { seckill_id: item.id })">
				<text class="promotion-mark color-base-bg">秒杀</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'topic'" class="item" @click="redirectTo('/promotionpages/topics/goods_detail/goods_detail', { id: item.id })">
				<text class="promotion-mark color-base-bg">专题活动</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'bargain'" class="item" @click="redirectTo('/promotionpages/bargain/detail/detail', { bargain_id: item.bargain_id })">
				<text class="promotion-mark color-base-bg">砍价</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-goods-promotion',
	props: {
		promotion: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			goodsPromotion: {
				type: Array
			}
		};
	},
	created() {},
	methods: {
		refresh(goodsPromotion) {
			this.goodsPromotion = goodsPromotion;
		},
		redirectTo(path, param) {
			this.$util.redirectTo(path, param);
		}
	}
};
</script>

<style lang="scss">
.ns-goods-promotion {
	background-color: #fff;
	& > view {
	}
	.item {
		display: flex;
		font-size: $font-size-base;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid $color-line;
		&:last-child {
			border-bottom: none;
		}

		.promotion-mark {
			padding: 6rpx 10rpx;
			margin-right: 16rpx;
			line-height: 1;
			color: #fff;
			border-radius: 6rpx;
			font-size: $font-size-tag;
		}

		.title {
			flex: 1;
			line-height: 1;
		}

		.iconfont {
			color: $color-tip;
			font-size: $font-size-base;
		}

		.img-wrap {
			width: 38rpx;
			height: 38rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
