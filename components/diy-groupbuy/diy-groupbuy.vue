<template>
	<view class="diy-groupbuy" v-if="list.length > 0" :data-theme="themeStyle" :style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }">
		<view class="marketing-wrap">
			<image :src="$util.img('/upload/uniapp/bargain/' + value.bgSelect + '.png')" mode="widthFix"></image>
			<view class="marketimg-box">
				<view class="marketimg-box-title">
					<view class="marketimg-box-title-left">
						<image v-if="value.list.imageUrl" :src="$util.img(value.list.imageUrl)" mode="widthFix"></image>
						<text>{{ value.list.title }}</text>
					</view>

					<view class="marketimg-box-title-right" :class="value.bgSelect" @click="$util.redirectTo('/promotionpages/groupbuy/list/list', { site_id: siteId })">
						<text>更多团购</text>
						<text class="iconfont iconright"></text>
					</view>
				</view>

				<view class="marketimg-box-con" v-if="value.changeType == 1">
					<scroll-view class="marketimg-box-con-scroll" :scroll-x="true" :show-scrollbar="false">
						<view class="marketimg-box-con-item" v-for="(dataItem, index) in list" :key="index" @click="toDetail(dataItem)">
							<view class="wrap">
								<view class="img-box"><image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imgError(index)"></image></view>
								<view class="content">
									<view class="title">{{ dataItem.sku_name }}</view>
									<view class="price-box color-base-text">
										￥
										<text class="original-price">{{ dataItem.groupbuy_price }}</text>
									</view>
									<view class="num">￥{{ dataItem.price }}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<view class="marketimg-box-con" v-if="value.changeType == 2">
					<swiper class="marketimg-swiper" style="height: 340rpx;" :autoplay="false">
						<swiper-item class="swiper-item" v-for="index in Math.ceil(list.length / 3)" :key="index">
							<view class="item" style="overflow: hidden;">
								<!-- #ifdef MP-WEIXIN -->
								<block v-for="(dataItem, dataIndex) in list" :key="dataIndex" v-if="dataIndex < (index + 1) * 3 && dataIndex >= index * 3">
									<view
										class="marketimg-box-con-item marketimg-box-con-item_two"
										@click="toDetail(dataItem)"
										v-show="3 * (index - 1) <= dataIndex && dataIndex < 3 * (index - 1) + 3"
									>
										<view class="img-box">
											<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imgError(dataIndex)"></image>
											<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imgError(dataIndex)"></image> -->
										</view>
										<view class="content">
											<view class="title">{{ dataItem.sku_name }}</view>
											<view class="price-box color-base-text">
												￥
												<text class="original-price">{{ dataItem.groupbuy_price }}</text>
											</view>
											<view class="num">￥{{ dataItem.price }}</view>
										</view>
									</view>
								</block>
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								<block v-for="(dataItem, dataIndex) in list" :key="dataIndex" v-if="dataIndex < index * 3 && dataIndex >= (index - 1) * 3">
									<view
										class="marketimg-box-con-item marketimg-box-con-item_two"
										@click="toDetail(dataItem)"
										v-show="3 * (index - 1) <= dataIndex && dataIndex < 3 * (index - 1) + 3"
									>
										<view class="img-box">
											<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imgError(dataIndex)"></image>
											<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imgError(dataIndex)"></image> -->
										</view>
										<view class="content">
											<view class="title">{{ dataItem.sku_name }}</view>
											<view class="price-box color-base-text">
												￥
												<text class="original-price">{{ dataItem.groupbuy_price }}</text>
											</view>
											<view class="num">￥{{ dataItem.price }}</view>
										</view>
									</view>
								</block>
								<!-- #endif -->
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	name: 'diy-groupbuy',
	props: {
		value: {
			type: Object
		},
		siteId: {
			type: [Number, String],
			default: 0
		},
		name: {
			type: String,
			default() {
				return '';
			}
		}
	},
	mixins: [globalConfig],
	data() {
		return {
			list: []
		};
	},
	created() {
		this.getData();
	},
	methods: {
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().default_goods_img;
		},
		getData() {
			var data = {
				page: 1,
				page_size: this.value.goodsCount
			};
			if (this.name == 'DIY_VIEW_CITY_INDEX' && this.siteId) data.website_id = this.siteId;
			else data.site_id = this.siteId;

			if (this.value.sources == 'diy') {
				data.page_size = 0;
				data.goods_id_arr = this.value.goodsId.toString();
			}
			this.$api.sendRequest({
				url: '/groupbuy/api/goods/page',
				data: data,
				success: res => {
					if (res.code == 0) {
						this.list = res.data.list;
					}
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/groupbuy/detail/detail', {
				groupbuy_id: e.groupbuy_id
			});
		},
		imgError(index) {
			this.list[index].goods_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
/deep/.uni-scroll-view ::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

/deep/::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

.diy-groupbuy {
	// padding: 0 30rpx;

	.marketing-wrap {
		background-color: #ffffff;
		border-radius: 10rpx;
		overflow: hidden;
		box-sizing: border-box;
		position: relative;

		> image {
			width: 100%;
			position: absolute;
			top: 0;
			z-index: 1;
		}

		.marketimg-box {
			padding: 30rpx 0;
			position: relative;
			z-index: 2;

			.marketimg-box-title {
				display: flex;
				height: 32rpx;
				line-height: 32rpx;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;

				.marketimg-box-title-left {
					display: flex;
					align-items: center;
					line-height: 32rpx;

					image {
						width: 126rpx;
						margin-right: 20rpx;
					}

					text {
						color: #909399;
					}
				}

				.marketimg-box-title-right {
					display: flex;
					align-items: center;

					text {
						font-size: 24rpx;
					}

					&.red text {
						background: linear-gradient(-55deg, #ff5151 0%, #ff7b91 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}

					&.blue text {
						background: linear-gradient(-55deg, #0ecfd3 0%, #12d0ae 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}

					&.yellow text {
						background: linear-gradient(-55deg, #feb632 0%, #fe6232 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}

					&.violet text {
						background: linear-gradient(-55deg, #627bfd 0%, #8662fd 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
			}
		}

		.marketimg-box-con {
			width: 100%;
			margin-top: 30rpx;
			/* padding: 0 20rpx;
			overflow: hidden;
			box-sizing: border-box; */

			.marketimg-box-con-scroll {
				width: calc(100% - 30rpx);
				margin: 0 10rpx 0 20rpx;
				line-height: 1;
				white-space: nowrap;
			}

			.marketimg-box-con-item {
				display: inline-block;
				width: 33.333%;
				&.marketimg-box-con-item_two {
					width: calc((100% - 40rpx) / 3);
				}
				.wrap {
					margin: 0 20rpx 0 10rpx;
				}

				.img-box {
					width: 188rpx;
					height: 188rpx;
				}

				image {
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}

				.content {
					.title {
						font-size: $font-size-base;
						line-height: $font-size-base;
						margin-top: 20rpx;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.price-box {
						font-size: $font-size-tag;
						font-weight: 600;
						height: 32rpx;
						line-height: 32rpx;
						margin-top: 20rpx;

						text {
							font-size: 32rpx;
						}
					}

					.num {
						font-size: 20rpx;
						line-height: 20rpx;
						color: #909399;
						margin-top: 20rpx;
						text-decoration: line-through;
					}
				}
			}

			.marketimg-swiper {
				width: 100%;

				.swiper-item {
					padding: 0 30rpx;
					box-sizing: border-box;
				}

				.marketimg-box-con-item {
					margin-right: 20rpx;

					&:nth-child(3n + 3) {
						margin-right: 0;
					}
				}
			}
		}
	}
}

.diy-groupbuy-top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 0 0 $padding;
	box-sizing: border-box;

	.seckill-title {
		display: flex;
		align-items: center;

		.left-img {
			width: 50rpx;
			height: 50rpx;
			margin-right: 10rpx;
		}
		.seckill-title-name {
			font-size: $font-size-base;
			font-weight: bold;
			margin-right: $margin-both;
		}

		.seckill-title-time {
			font-size: $font-size-tag;
		}
	}

	.seckill-more {
		font-size: $font-size-tag;
		color: #858585;
		margin-right: 20rpx;
	}

	.seckill-more::after {
		font-family: 'iconfont';
		content: '\e6a3';
		font-size: $font-size-base;
		line-height: 1;
		position: relative;
		top: 0;
		margin-left: 2px;
	}
}
</style>
