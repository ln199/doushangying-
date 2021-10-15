<template>
	<view :class="themeStyle" :data-theme="themeStyle">
		<view>
			<view class="combo-package">
				<view class="combo-package-list">
					<view class="combo-package-content">
						<view class="combo-package-name color-title">{{ combo.bl_name }}</view>
						<view v-for="(item, index) in combo.bundling_goods" :key="index" class="goods-info" @click="toGoodsDetail(item.sku_id)">
							<view class="goods-img">
								<view class="img-wrap"><image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imgError(index)" mode="aspectFit" /></view>
							</view>
							<view class="data-info">
								<view class="goods-name">{{ item.sku_name }}</view>
								<view class="price-wrap">
									<text class="unit color-base-text">{{ $lang('common.currencySymbol') }}</text>
									<text class="price color-base-text">{{ item.price }}</text>
									<text class="num">x1</text>
								</view>
								<view class="stock-tips color-base-text" v-if="item.stock < num">
									库存不足，剩余：{{ item.stock }}
									<block v-if="item.unit">{{ item.unit }}</block>
									<block v-else>件</block>
								</view>
							</view>
						</view>
						<!-- <view
							hover-class="none"
							v-for="(item, index) in combo.bundling_goods"
							:key="index"
							class="goods-info"
							@click="toGoodsDetail(item.sku_id)"
						>
							<view class="goods-img">
								<view class="img-wrap"><image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imgError(index)" mode="aspectFit" /></view>
							</view>
							<view class="data-info">
								<view class="goods-name">{{ item.sku_name }}</view>
								<view class="price-wrap">
									<text class="uni-bold color-base-text">{{ $lang('common.currencySymbol') }} {{ item.price }}</text>
									<text class="num">x1</text>
								</view>
								<view class="stock-tips color-base-text" v-show="item.stock < num">
									{{ $lang('stock') }}：{{ item.stock }}
									<block v-if="item.unit">{{ item.unit }}</block>
									<block v-else>{{ $lang('num') }}</block>
								</view>
							</view>
						</view> -->
					</view>
				</view>

				<view class="footer padding-bottom">
					<view class="price-wrap">
						<text class="label">套餐价：</text>
						<text class="unit color-base-text">{{ $lang('common.currencySymbol') }}</text>
						<text class="price color-base-text">{{ packagePrice }}</text>
						<!-- <text class="info-num">为您节省：{{ $lang('common.currencySymbol') }} {{ saveThePrice }}</text> -->
					</view>
					<button class="footer-btn" v-if="isDisabled" type="primary" @click="comboBuy()" size="mini">立即购买</button>
					<button class="footer-btn" v-else disabled>立即购买</button>
				</view>

				<!-- <view class="footer padding-bottom">
					<view class="combo-package-info padding-bottom">
						<view class="num">
							<text>{{ $lang('shopNum') }}：</text>
							<input class="uni-input" type="number" v-model="num" @input="numberChange(false)" />
						</view>
						<view class="color-base-text uni-bold font-size-toolbar">
							<text class="package-price color-title">{{ $lang('price') }}：</text>
							<text>{{ $lang('common.currencySymbol') }} {{ packagePrice }}</text>
						</view>
						<view class="font-size-tag">
							<text class="save-the-price">{{ $lang('saveThePrice') }}：{{ $lang('common.currencySymbol') }} {{ saveThePrice }}</text>
						</view>
					</view>
					<view class="button">
						<button type="primary" size="mini" :class="!isDisabled ? '' : 'btn-disabled'" @click="comboBuy()">{{ $lang('shopping') }}</button>
					</view>
				</view> -->
			</view>

			<loading-cover ref="loadingCover"></loading-cover>
			<ns-login ref="login"></ns-login>
		</view>
	</view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	components: {
		uniNumberBox
	},
	data() {
		return {
			num: 1, //购买数量
			blId: 0, //商品id
			combo: [],
			packagePrice: [], //套餐价
			// packagePrice: 0, //套餐价
			saveThePrice: 0, //节省价格
			isDisabled: false, //按钮失效
			isGoodSale: false
		};
	},
	mixins: [globalConfig],
	onLoad(e) {
		this.blId = e.bl_id || 0;
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.bundling) {
				this.$util.showToast({
					title: '组合套餐未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			} else {
				this.getList();
			}
		});
	},
	onHide() {
		this.btnSwitch = true;
	},
	computed: {
		//vueX页面主题
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		}
	},
	methods: {
		// 获取套餐列表
		getList() {
			var that = this;
			this.$api.sendRequest({
				url: '/bundling/api/bundling/detail',
				data: {
					bl_id: this.blId
				},
				success: res => {
					if (res.data) {
						this.combo = res.data;
						this.numberChange();
					} else {
						this.$util.showToast({ title: res.message });
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toGoodsDetail(id) {
			this.$util.redirectTo('/pages/goods/detail/detail', { sku_id: id });
		},
		numberChange(flag, callback) {
			setTimeout(() => {
				var disabledCount = 0;

				// 防止空
				if (flag && this.num.length == 0) {
					this.num = 1;
					disabledCount++;
				}

				// 防止输入0和负数、非法输入
				if (flag && (this.num <= 0 || isNaN(this.num))) {
					this.number = 1;
					disabledCount++;
				}

				if (flag) this.num = parseInt(this.num);

				var price = 0;
				for (var i = 0; i < this.combo.bundling_goods.length; i++) {
					price += parseFloat(this.combo.bundling_goods[i].price);
					//检测库存
					if (this.combo.bundling_goods[i].stock < this.num) disabledCount++;
				}
				this.isDisabled = !(disabledCount > 0);
				this.saveThePrice = ((price - this.combo.bl_price) * this.num).toFixed(2);
				this.packagePrice = (this.combo.bl_price * this.num).toFixed(2);
				if (callback) callback();
			}, 0);
		},
		// 套餐立即购买点击
		async comboBuy() {
			if (!this.isDisabled) return;
			var that = this;
			var tiptext = '';
			for (var index in this.combo.bundling_goods) {
				if (this.combo.bundling_goods[index].goods_state == 0) {
					tiptext = tiptext + ',' + this.combo.bundling_goods[index].sku_name;
				}
			}
			if (tiptext.substr(1)) {
				that.$util.showToast({ title: tiptext.substr(1) + '已下架' });
				return;
			}

			setTimeout(function() {
				//纠正数量
				that.numberChange(true, () => {
					if (!uni.getStorageSync('token')) {
						that.$refs.login.open('/promotionpages/combo/detail/detail?bl_id=' + that.blId);
						return;
					}

					if (that.btnSwitch == false) return;

					that.btnSwitch = false;

					var data = {
						bl_id: that.blId,
						num: that.num
					};

					uni.setStorage({
						key: 'comboOrderCreateData',
						data: data,
						success: () => {
							that.$util.redirectTo('/promotionpages/combo/payment/payment');
							that.btnSwitch = false;
						}
					});
				});
			}, 1000);
		},
		imgError(index) {
			this.combo.bundling_goods[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	},
	onShareAppMessage(res) {
		var title = '购买套餐，优惠多多哦';
		var path = '/promotionpages/combo/detail/detail?bl_id=' + this.blId;
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
.combo-package {
	border-radius: $border-radius;
	margin: 20rpx 30rpx;
	margin-bottom: 160rpx;
	background: #ffffff;
	padding-bottom: 160rpx;

	&.combo-iphonex {
		margin-bottom: 230rpx;
	}

	.combo-package-content {
		// padding-bottom: 40rpx;

		.combo-package-name {
			padding: 20rpx 30rpx;
		}

		.goods-info {
			overflow: hidden;
			padding: $padding 30rpx;
			border-radius: $border-radius;

			.goods-img {
				display: inline-block;
				width: 30%;
				text-align: center;
				line-height: 100%;
				float: left;

				.img-wrap {
					display: inline-block;
					width: 180rpx;
					height: 180rpx;
					text-align: center;
					border-radius: $border-radius;

					image {
						height: 100%;
						width: 100%;
						vertical-align: middle;
					}
				}
			}

			.data-info {
				display: inline-block;
				width: 66%;
				float: left;
				position: relative;
				margin-left: 20rpx;
				height: 180rpx;

				.goods-name {
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					display: -webkit-box;
					line-height: 150%;
					// margin-bottom: 20rpx;
				}
				.stock-tips {
					position: absolute;
					width: 100%;
					bottom: 50rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-size: $font-size-tag;
				}

				.price-wrap {
					height: 50rpx;
					line-height: 50rpx;
					position: absolute;
					width: 100%;
					bottom: 0;
					.unit {
						font-weight: bold;
						font-size: $font-size-tag;
						margin-right: 4rpx;
					}
					.price {
						font-weight: bold;
						font-size: $font-size-toolbar;
					}

					.num {
						float: right;
					}
				}
			}
		}
	}
	.footer {
		width: 100%;
		background: #fff;
		display: flex;
		justify-content: space-between;
		padding: 20rpx 24rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;

		.price-wrap {
			flex: 1;
			text-align: right;
			vertical-align: middle;
			line-height: 70rpx;
			margin-right: 30rpx;
			.label {
				font-size: $font-size-base;
			}
			.unit {
				font-weight: bold;
				font-size: $font-size-tag;
				margin-right: 4rpx;
			}
			.price {
				font-weight: bold;
				font-size: $font-size-toolbar;
			}
			.info-num {
				font-size: $font-size-activity-tag;
				color: $color-tip;
				line-height: 1;
				margin-top: 12rpx;
			}
		}

		.footer-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 70rpx;
			line-height: 70rpx;
		}
	}
	.padding-bottom {
		padding-bottom: 80rpx;
	}
}
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
