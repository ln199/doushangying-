<template>
	<view class="store_detail">
		<!-- 店铺 -->
		<view v-if="storeDetail.store_image" class="shop-info">
			<view class="shop-image"><image :src="$util.img(storeDetail.store_image)" mode="widthFix" /></view>
			<view class="shop-con">
				<view class="info-name">{{ storeDetail.store_name }}</view>
			</view>
		</view>

		<!-- 店铺基础信息 -->
		<view class="store-desc"><view class="desc-title">门店信息</view></view>
		<view class="store-base-info">
			<view class="base-li" v-if="storeDetail.site_name">
				<text>店铺名称</text>
				<text>{{ storeDetail.site_name }}</text>
			</view>
			<view class="base-li" v-if="storeDetail.telphone">
				<text>服务电话</text>
				<text @click="call">{{ storeDetail.telphone }}</text>
			</view>

			<view class="base-li" v-if="storeDetail.open_date">
				<text>营业时间</text>
				<text>{{ storeDetail.open_date }}</text>
			</view>
		</view>

		<!-- 位置信息 -->
		<view class="store-desc" v-if="storeDetail.latitude && storeDetail.longitude"><view class="desc-title">门店位置</view></view>
		<view class="store-base-info" v-if="storeDetail.latitude && storeDetail.longitude">
			<map :latitude="Number(storeDetail.latitude)" :markers="markers" :longitude="Number(storeDetail.longitude)"></map>
			<view class="margin-top">
				<text>{{ storeDetail.full_address }}{{ storeDetail.address }}</text>
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
		<!-- 底部tabBar -->
		<diy-bottom-nav type="shop" :siteId="siteId"></diy-bottom-nav>
	</view>
</template>

<script>
export default {
	data() {
		return {
			storeDetail: [],
			siteId: 0,
			storeId: 0
		};
	},
	computed: {
		markers() {
			let array = [];
			if (this.storeDetail && this.storeDetail.latitude && this.storeDetail.longitude) {
				array.push({
					id: 0,
					latitude: this.storeDetail.latitude,
					longitude: this.storeDetail.longitude,
					iconPath: this.$util.img('upload/uniapp/location.png'),
					width: 25,
					height: 25
				});
			} else {
				array = [];
			}
			return array;
		}
	},
	onLoad(options) {
		if (!options.store_id || !options.site_id) {
			this.$util.redirectTo('/otherpages/shop/index/index', {}, 'redirectTo');
			return;
		}
		this.storeId = options.store_id;
		this.siteId = options.site_id;
		this.getData();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		getData() {
			this.$api.sendRequest({
				url: '/api/store/info',
				data: {
					site_id: this.siteId,
					store_id: this.storeId
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.storeDetail = res.data;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		call() {
			uni.makePhoneCall({
				phoneNumber: this.storeDetail.telphone
			});
		}
	}
};
</script>

<style lang="scss">
.store_detail {
	width: 100%;
	height: 100%;
	background: #f5f5f5;
}

.shop-info {
	width: 100%;
	padding: $padding;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	position: relative;
	box-sizing: border-box;
	background: #ffffff;
}

.shop-image {
	width: 90rpx;
	height: 90rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: $margin-both;

	image {
		width: 100%;
		height: 100%;
	}
}

.shop-con {
	width: calc(80% - 90rpx - 20rpx);
	color: #ffffff;
}

.store-desc {
	display: flex;
	flex-direction: column;
	padding: $padding;
	box-sizing: border-box;
	background: #ffffff;

	.desc-title {
		width: 100%;
		font-size: $font-size-base;
		box-sizing: border-box;
		font-weight: 700;
		line-height: 1;
	}
}

.store-explain {
	background: #ffffff;
	padding: $padding;
	box-sizing: border-box;
	margin-bottom: $margin-updown;
	border-top: 1rpx solid $color-line;

	.explain-li {
		display: inline-block;
		margin-right: $margin-updown;
		margin-bottom: 10rpx;
	}
}

.store-base-info {
	background: #ffffff;
	padding: $padding;
	padding-right: 30rpx;
	box-sizing: border-box;
	margin-bottom: 40rpx;
	border-top: 1rpx solid $color-line;

	.base-title {
		width: 100%;
		height: 70rpx;
		font-size: $font-size-toolbar;
		color: $color-tip;
		padding: 10rpx $padding 0 0;
		box-sizing: border-box;
	}

	.base-li {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		font-size: $font-size-base;
		padding: 10rpx 0;
		box-sizing: border-box;

		.iconfont {
			font-size: $font-size-toolbar;
			color: $color-tip;
		}

		text {
			line-height: 1.1;
		}

		text:nth-child(2) {
			display: inline-block;
			font-size: $font-size-tag;
			max-width: 65%;
		}
	}
}

map {
	width: 100%;
}
</style>
