<template>
	<view class="goods-recommend">
		<view v-if="list.length" :data-theme="themeStyle">
			<view class="goods-recommend-title"><image :src="$util.img('/upload/uniapp/guess-like.png')"></image></view>

			<view class="goods-list double-column">
				<view class="goods-item margin-bottom" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
					<view class="goods-img">
						<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
						<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
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
		</view>
		<view class="circle-box" v-if="showLoading && load"><ns-loading></ns-loading></view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import nsLoading from '@/components/ns-loading/ns-loading.vue';
// 商品推荐
export default {
	name: 'ns-goods-recommend',
	components: {
		nsLoading
	},
	data() {
		return {
			list: [],
			page: 1,
			isAll: !0,
			isClick: true,
			showLoading: false
		};
	},
	mixins: [globalConfig],
	props: {
		isLike: {
			type: Boolean,
			default: true
		},
		size: {
			type: [Number, String],
			default: 10
		},
		auto: {
			type: Boolean,
			default: true
		},
		load: {
			type: Boolean,
			default: true
		}
	},
	mounted() {
		if (this.auto) {
			this.getLikeList();
		}
	},
	methods: {
		init() {
			this.list = [];
			this.page = 1;
			this.isAll = !0;
		},
		toDetail(e) {
			let data = {
				sku_id: e.sku_id
			};
			this.$util.redirectTo('/pages/goods/detail/detail', data);
		},
		getLikeList(size) {
			let that = this;
			if (!this.isClick) return;
			if (!this.isAll) return;
			this.isClick = false;
			if (this.page > 1) this.showLoading = true;
			return new Promise((resolve, reject) => {
				that.$api.sendRequest({
					url: '/api/goodssku/recommend',
					data: {
						page: this.page,
						page_size: this.auto ? this.size : size
					},
					success: res => {
						this.showLoading = false;
						this.isClick = true;
						if (res.code == 0) {
							if (this.page == 1) {
								this.list = [];
							}
							this.list = this.list.concat(res.data.list);
							if (this.list.length == res.data.count) this.isAll = !1;
							this.page += 1;
							resolve(res.data.list);
						}
					}
				});
			});
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().default_goods_img;
		},
		imgError(index) {
			this.list[index].goods_image = this.$util.getDefaultImage().default_goods_img;
		},
		showPrice(data) {
			let price = data.discount_price;
			if (data.member_price && parseFloat(data.member_price) < parseFloat(price)) price = data.member_price;
			return price;
		},
		goodsTag(data) {
			switch (data.recommend_way) {
				case 1:
					return '新品';
					break;
				case 2:
					return '精品';
					break;
				case 3:
					return '推荐';
					break;
				default:
					return '';
			}
		}
	}
};
</script>

<style lang="scss">
.goods-recommend {
	margin-top: 74rpx;
	width: 100vw;

	.goods-recommend-title {
		text-align: center;
		margin-bottom: 30rpx;

		image {
			width: 306rpx;
			height: 62rpx;
		}
	}
}

.hr-view {
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 100%;
	box-sizing: content-box;
	font-size: $font-size-toolbar;
}

.hr-view .hr {
	width: 36%;
	height: 2rpx;
	background: #e5e5e5;
}

.hr-view .title {
	padding: 0 $padding;
}

// 商品列表双列样式
.goods-list.double-column {
	display: flex;
	flex-wrap: wrap;
	margin: 0 $margin-both;

	.goods-item {
		flex: 1;
		position: relative;
		background-color: #fff;
		flex-basis: 48%;
		max-width: calc((100% - 30rpx) / 2);
		margin-right: $margin-both;
		margin-bottom: $margin-updown;
		border-radius: $border-radius;

		&:nth-child(2n) {
			margin-right: 0;
		}

		.goods-img {
			position: relative;
			overflow: hidden;
			padding-top: 100%;
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;

			image {
				width: 100%;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}
		}

		.goods-tag {
			color: #fff;
			line-height: 1;
			padding: 8rpx 16rpx;
			position: absolute;
			border-bottom-right-radius: $border-radius;
			top: 0;
			left: 0;
			font-size: $font-size-goods-tag;
		}

		.goods-tag-img {
			position: absolute;
			border-top-left-radius: $border-radius;
			width: 80rpx;
			height: 80rpx;
			top: 0;
			left: 0;
			z-index: 5;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-wrap {
			padding: 0 26rpx 26rpx 26rpx;
		}

		.goods-name {
			font-size: $font-size-base;
			line-height: 1.3;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			margin-top: 20rpx;
			height: 68rpx;
		}

		.discount-price {
			display: inline-block;
			font-weight: bold;
			line-height: 1;
			margin-top: 16rpx;

			.unit {
				margin-right: 6rpx;
			}
		}

		.pro-info {
			display: flex;
			margin-top: 16rpx;

			.delete-price {
				text-decoration: line-through;
				flex: 1;

				.unit {
					margin-right: 6rpx;
				}
			}

			& > view {
				line-height: 1;

				&:nth-child(2) {
					text-align: right;
				}
			}
		}

		.member-price-tag {
			display: inline-block;
			width: 60rpx;
			line-height: 1;
			margin-left: 6rpx;

			image {
				width: 100%;
			}
		}
	}
}
</style>
