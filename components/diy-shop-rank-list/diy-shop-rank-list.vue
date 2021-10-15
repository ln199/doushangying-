<template>
	<view class="diy-shop-rank-list" v-if="goodsList.length > 0">
		<view class="diy-shop-rank-list-top">
			<view class="shop-rank-list-title"><text class="shop-rank-list-title-name">排行榜</text></view>
		</view>
		<scroll-view scroll-x="true" class="swiper">
			<navigator hover-class="none" :url="'/pages/goods/detail/detail?sku_id=' + item.sku_id" class="swiper-item" v-for="(item, index) in goodsList" :key="index">
				<view class="swiper-item-box">
					<view class="goods_pic"><image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imgError(index)" mode="widthFix"></image></view>
					<view class="item-content">
						<view class="item-name">{{ item.goods_name }}</view>
						<view class="item-com">{{ item.sale_num }}人购买</view>
						<view class="item-price color-base-text">￥{{ item.discount_price }}</view>
					</view>
				</view>
			</navigator>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'diy-shop-rank-list',
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			index: 0,
			goodsList: []
		};
	},
	created() {
		this.getGoodsList();
	},
	methods: {
		change(e) {
			this.index = e.detail.current;
		},
		getGoodsList() {
			var data = {
				page: 1,
				page_size: this.value.goodsCount,
				site_id: this.siteId
			};

			if (this.value.goodsId) {
				data.page_size = 0;
				data.goods_id_arr = this.value.goodsId.toString();
			} else if (this.value.categoryId) {
				data.category_id = this.value.categoryId;
				data.category_level = this.value.categoryLevel;
			}
			this.$api.sendRequest({
				url: '/api/goodssku/page',
				data: data,
				success: res => {
					let data = res.data;
					if (data.count) this.goodsList = data.list;
				}
			});
		},
		imgError(index) {
			this.goodsList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
.diy-shop-rank-list {
	width: 100%;
	padding: $padding;
	box-sizing: border-box;
	background: #fff;
}

.diy-shop-rank-list-top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 54rpx;

	.shop-rank-list-title {
		display: flex;
		align-items: center;

		.shop-rank-list-title-name {
			font-size: $font-size-base;
			font-weight: bold;
			margin-right: $margin-both;
		}

		.shop-rank-list-title-time {
			font-size: $font-size-tag;
		}
	}
}

.swiper {
	width: 100%;
	margin-top: 10rpx;
	white-space: nowrap;
}

.swiper-item {
	width: 224rpx;
	height: 100%;
	background: #ffffff;
	border-radius: $border-radius;
	position: relative;
	margin-right: $margin-both;
	display: inline-block;
	overflow: hidden;
	box-sizing: border-box;
	box-shadow: #ccc 0 0 8rpx;
	margin-top: 8rpx;
	margin-left: 8rpx;

	.swiper-item-box {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	.goods_pic {
		width: 224rpx;
		height: 224rpx;
		overflow: hidden;
	}

	image {
		width: 98%;
	}

	.item-content {
		width: 100%;
		// height: 95rpx;
		padding: 10rpx $padding;
		box-sizing: border-box;

		.item-name {
			width: 100%;
			line-height: 1.2;
			font-size: $font-size-tag;
			font-weight: 600;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.item-com {
			font-size: $font-size-tag;
			color: $color-tip;
		}

		.item-price {
			font-size: $font-size-base;
			line-height: 1.3;
		}
	}
}
</style>
