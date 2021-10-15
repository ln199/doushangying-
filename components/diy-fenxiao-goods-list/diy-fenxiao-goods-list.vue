<template>
	<view :data-theme="themeStyle" class="diy-fenxiao" v-if="list.length" :style="{ backgroundColor: value.backgroundColor, padding: value.padding * 2 + 'rpx 0' }">
		<view class="diy-fenxiao-top">
			<view class="fenxiao-title">
				<image class="left-img" :src="$util.img(value.list.imageUrl)" v-if="value.list.imageUrl"></image>
				<text class="fenxiao-title-name" :style="{ color: value.titleTextColor }">{{ value.list.title }}</text>
			</view>
			<view class="fenxiao-more" @click="toMore()" :style="{ color: value.moreTextColor }">{{ value.listMore.title }}</view>
		</view>

		<view
			class="fenxiao-list"
			:class="value.style == 1 ? 'single-column' : value.style == 2 ? 'double-column' : 'style-three'"
			:data-theme="themeStyle"
			:style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }"
		>
			<view class="goods-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
				<view class="goods-img">
					<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
					<view class="goods-tag-img" v-if="value.goodsTag == 'diy'"><image :src="$util.img(value.tagImg.imageUrl)" mode=""></image></view>
				</view>
				<view class="info-wrap">
					<view class="name-wrap">
						<view class="goods-name">{{ item.goods_name }}</view>
					</view>
					<view v-if="value.style != 3" class="price-commission color-base-border">
						<text class="ident color-base-bg">佣</text>
						<text class="price color-base-text">{{ $lang('common.currencySymbol') }}{{ item.commission_money }}</text>
					</view>
					<view v-if="value.style == 3" class="price-commission color-base-border">
						<text class="iconfont iconfenxiang3 color-base-text"></text>
						<text class="ident color-base-text">赚</text>
						<text class="price color-base-text">{{ $lang('common.currencySymbol') }}{{ item.commission_money }}</text>
					</view>
					<view class="lineheight-clear">
						<view class="discount-price">
							<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
							<text class="price color-base-text font-size-toolbar">{{ item.discount_price }}</text>
						</view>
						<text class="lineation-price" v-if="value.style == 3">{{ $lang('common.currencySymbol') }}{{ item.price }}</text>
					</view>
					<view class="sale color-base-bg" v-if="item.is_collect == 0" @click.stop="followGoods(item, index)">关注</view>
					<view class="sale color-base-bg" v-if="item.is_collect == 1" @click.stop="delFollowTip(item, index)">取消关注</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	name: 'diy-fenxiao-goods-list',
	props: {
		value: {
			type: Object
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			list: [],
			currentRoute: ''
		};
	},
	mixins: [globalConfig],
	created() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = '/' + currentPage.route;
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo(
				'/pages/login/login/login',
				{
					back: this.currentRoute
				},
				'redirectTo'
			);
		}
		this.getData();
	},
	methods: {
		//页面跳转
		toDetail(e) {
			this.$util.redirectTo('/pages/goods/detail/detail', { sku_id: e.sku_id });
		},
		//关注
		followGoods(e, index) {
			let goods_id = e.goods_id;
			let sku_id = e.sku_id;
			let site_id = e.site_id;
			this.$api.sendRequest({
				url: '/fenxiao/api/goodscollect/add',
				data: {
					goods_id: goods_id,
					sku_id: sku_id,
					site_id: site_id
				},
				success: res => {
					if (res.code >= 0) {
						this.$util.showToast({ title: '关注成功' });
						this.list[index].is_collect = 1;
						this.list[index].collect_id = res.data;
					}
					this.$forceUpdate();
				}
			});
		},
		//取消关注
		delFollowTip(e, index) {
			uni.showModal({
				title: '提示',
				content: '确认取消关注该商品吗',
				success: res => {
					if (res.confirm) {
						this.delFollow(e.collect_id, index);
					}
				}
			});
		},
		delFollow(e, f) {
			this.$api.sendRequest({
				url: '/fenxiao/api/goodscollect/delete',
				data: {
					collect_id: e
				},
				success: res => {
					let msg = '';
					if (res.code == 0) {
						msg = '取消成功';
					} else {
						msg = res.message;
					}
					this.$util.showToast({
						title: msg
					});

					let arr = this.list;
					arr[f].is_collect = 0;
					this.list = arr;
					this.$forceUpdate();
				}
			});
		},
		toMore() {
			this.$util.redirectTo('/otherpages/fenxiao/goods_list/goods_list');
		},
		getData() {
			var data = {
				page: 1,
				page_size: this.value.goodsCount,
				site_id: this.siteId
			};
			if (this.value.sources == 'diy') {
				data.page_size = 0;
				data.goods_id_arr = this.value.goodsId.toString();
			}
			this.$api.sendRequest({
				url: '/fenxiao/api/goods/page',
				data: data,
				success: res => {
					if (res.code == 0) {
						this.list = res.data.list;
					}
				}
			});
		},
		imgError(index) {
			this.list[index].goods_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().default_goods_img;
		}
	}
};
</script>

<style lang="scss">
.diy-fenxiao {
	width: 100%;
	padding: $padding $padding;
	box-sizing: border-box;
}

.diy-fenxiao-top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	// padding: 0 30rpx;
	box-sizing: border-box;

	.fenxiao-title {
		display: flex;
		align-items: center;

		.left-img {
			width: 50rpx;
			height: 50rpx;
			margin-right: 10rpx;
		}
		.fenxiao-title-name {
			font-size: $font-size-base;
			font-weight: bold;
			margin-right: $margin-both;
		}

		.fenxiao-title-time {
			font-size: $font-size-tag;
		}
	}

	.fenxiao-more {
		font-size: $font-size-tag;
	}

	.fenxiao-more::after {
		font-family: 'iconfont';
		content: '\eb93';
		font-size: $font-size-base;

		line-height: 1;
		position: relative;
		top: 2rpx;
		margin-left: 4rpx;
	}
}
.fenxiao-list {
	// padding: 0 30rpx;
}

// 商品列表单列样式
.fenxiao-list.single-column {
	.goods-item {
		padding: 30rpx;
		background: #fff;
		border-radius: $border-radius;
		display: flex;
		position: relative;
		margin-top: 20rpx;

		&.first-child {
			margin-top: 0;
		}

		.goods-img {
			width: 200rpx;
			height: 200rpx;
			overflow: hidden;
			border-radius: $border-radius;
			margin-right: 20rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.goods-tag {
			color: #fff;
			line-height: 1;
			padding: 8rpx 12rpx;
			position: absolute;
			border-top-left-radius: $border-radius;
			border-bottom-right-radius: $border-radius;
			top: 26rpx;
			left: 26rpx;
			font-size: $font-size-goods-tag;
		}

		.goods-tag-img {
			position: absolute;
			border-top-left-radius: $border-radius;
			width: 80rpx;
			height: 80rpx;
			top: 26rpx;
			left: 26rpx;
			z-index: 5;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-wrap {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: baseline;
		}
		.price-commission {
			display: flex;
			border: 2rpx solid;
			height: 38rpx;
			align-items: center;
			border-radius: 4rpx;
			font-size: $font-size-tag;
			.ident {
				padding: 0 10rpx;
				color: #fff;
			}
			.price {
				margin: 0 6rpx;
			}
		}

		.name-wrap {
			flex: 1;
		}

		.goods-name {
			font-size: $font-size-base;
			line-height: 42rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.introduction {
			line-height: 1;
			margin-top: 10rpx;
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
		.lineation-price {
			margin-top: 4rpx;
			color: $color-tip;
			font-size: $font-size-tag;
			text-decoration: line-through;
			margin-left: 10rpx;
		}
		.sale {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 126rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			font-size: $font-size-tag;
			color: #fff;
			border-radius: 50rpx;
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
// 商品列表样式三
.fenxiao-list.style-three {
	.goods-item {
		padding: 30rpx;
		background: #fff;
		border-radius: $border-radius;
		display: flex;
		position: relative;
		margin-top: 20rpx;

		&.first-child {
			margin-top: 0;
		}

		.goods-img {
			width: 200rpx;
			height: 200rpx;
			overflow: hidden;
			border-radius: $border-radius;
			margin-right: 20rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.goods-tag {
			color: #fff;
			line-height: 1;
			padding: 8rpx 12rpx;
			position: absolute;
			border-top-left-radius: $border-radius;
			border-bottom-right-radius: $border-radius;
			top: 26rpx;
			left: 26rpx;
			font-size: $font-size-goods-tag;
		}

		.lineheight-clear {
			display: flex;
			flex-direction: column;
			line-height: 1;
		}
		.goods-tag-img {
			position: absolute;
			border-top-left-radius: $border-radius;
			width: 80rpx;
			height: 80rpx;
			top: 26rpx;
			left: 26rpx;
			z-index: 5;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-wrap {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: baseline;
		}
		.price-commission {
			display: flex;
			border: 2rpx solid;
			height: 32rpx;
			align-items: center;
			border-radius: 4rpx;
			margin-top: 8rpx;
			font-size: $font-size-tag;
			.price {
				margin-right: 6rpx;
			}
		}

		.name-wrap {
			flex: 1;
		}

		.goods-name {
			font-size: $font-size-base;
			line-height: 42rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.introduction {
			line-height: 1;
			margin-top: 10rpx;
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
		.lineation-price {
			margin-top: 4rpx;
			color: $color-tip;
			font-size: $font-size-tag;
			text-decoration: line-through;
		}
		.sale {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 126rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			font-size: $font-size-tag;
			color: #fff;
			border-radius: 50rpx;
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
// 商品列表双列样式
.fenxiao-list.double-column {
	display: flex;
	flex-wrap: wrap;
	margin-top: 20rpx;
	// margin: 0 $margin-both;

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
		.sale {
			position: absolute;
			bottom: 22rpx;
			right: 20rpx;
			width: 126rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			font-size: $font-size-tag;
			color: #fff;
			border-radius: 50rpx;
		}

		.goods-img {
			overflow: hidden;
			position: relative;
			height: 0;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
			width: 330rpx;
			height: 330rpx;

			image {
				width: 100%;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}
		}

		.price-commission {
			margin-top: 20rpx;
			display: flex;
			border: 2rpx solid;
			height: 32rpx;
			align-items: center;
			border-radius: 4rpx;
			font-size: $font-size-tag;
			.ident {
				padding: 0 10rpx;
				color: #fff;
				height: 32rpx;
				line-height: 32rpx;
			}
			.price {
				margin: 0 6rpx;
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
			display: flex;
			flex-direction: column;
			align-items: baseline;
			padding: 0 20rpx 20rpx;
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
			line-height: 1;
			margin-top: 16rpx;
			display: flex;
			align-items: center;

			.unit {
				margin-right: 6rpx;
			}
			.price {
				width: 160rpx;
				display: block;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		.lineation-price {
			margin-top: 4rpx;
			color: $color-tip;
			font-size: $font-size-tag;
			text-decoration: line-through;
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
