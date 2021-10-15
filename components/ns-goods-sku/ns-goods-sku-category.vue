<template>
	<view class="goods-sku" @touchmove.prevent.stop>
		<uni-popup ref="skuPopup" type="center" class="sku-layer">
			<view class="sku-content">
				<view class="sku-info" :style="{ height: systemInfo.windowHeight * 1 + 'px' }">
					<view class="header">
						<view class="img-wrap"><image :src="$util.img(goodsDetail.sku_image, { size: 'mid' })" @error="imgError()" /></view>
						<view class="main">
							<view class="goodname">{{ goodsDetail.goods_name }}</view>
							<view class="stock color-tip">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
						</view>
					</view>
					<view class="body-item">
						<scroll-view scroll-y class="wrap">
							<view class="sku-list-wrap" v-for="(item, index) in goodsDetail.goods_spec_format" :key="index">
								<text class="title font-size-tag color-tip">{{ item.spec_name }}</text>
								<view class="sku-list_item">
									<view
										v-for="(item_value, index_value) in item.value"
										:key="index_value"
										:class="{
											selected: item_value['selected'] || skuId == item_value.sku_id,
											disabled: item_value['disabled'] || (!item_value['selected'] && disabled)
										}"
										class="items color-line-border font-size-tag"
										@click="change(item_value.sku_id, item_value.spec_id)"
									>
										<image v-if="item_value.image" :src="$util.img(item_value.image, { size: 'small' })" @error="valueImgError(index, index_value)" />
										<text>{{ item_value.spec_value_name }}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="footer">
						<view class="sku-name font-size-goods-tag">
							<template v-if="goodsDetail.sku_spec_format" class="color-tip">
								已选择：
								<text class="color-tip" v-for="(item, index) in goodsDetail.sku_spec_format" :key="index">
									{{ item.spec_value_name }} {{ index != goodsDetail.sku_spec_format.length - 1 ? '&nbsp;/&nbsp;' : '&nbsp;' }}
								</text>
							</template>
						</view>
						<view class="footer-bottom">
							<view class="footer-left">
								<view class="price-wrap">
									<text class="price color-base-text ">￥{{ goodsDetail.show_price }}</text>
								</view>
							</view>
							<view class="footer-right">
								<view class="change_num" v-if="number > 0">
									<text class="desc iconfont iconjianshao color-base-text" @click="changeNum('-')"></text>
									<input type="number" class="uni-input" @blur="blur" v-model="number" placeholder="0" @input="keyInput(false)" />
									<text class="add iconfont iconadd-fill color-base-text change_hover" @click="changeNum('+')"></text>
								</view>
								<view v-else-if="number == 0 && isLoad">
									<button type="primary" v-if="goodsDetail.stock && goodsDetail.stock != 0" @click="confirm()">加入购物车</button>
									<button type="primary" disabled="true" v-else>确定</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="sku-close iconfont icon2guanbi" @click="closeSkuPopup()"></view>
		</uni-popup>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup-sku-new.vue';
import htmlParser from '@/common/js/html-parser';
// 商品SKU
export default {
	name: 'ns-goods-sku-category',
	components: {
		uniPopup
	},
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		pointLimit: {
			type: [Number, String]
		}
	},
	data() {
		return {
			isIphoneX: false,
			systemInfo: {}, //系统信息
			number: 0,
			btnSwitch: false, //提交按钮防止重复提交
			type: '', //join_cart：加入购物车
			callback: null, //回调
			skuId: 0,
			limitNumber: 0, // 限购
			//是否开启预览，0：不开启，1：开启
			cartData: [], //购物车
			cartIdArr: [],
			goodsDetail: {},
			maxBuy: 0,
			minBuy: 0,
			isLoad: false
		};
	},
	created() {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.systemInfo = uni.getSystemInfoSync();
	},
	watch: {
		pointLimit(newNum, oldNum) {
			this.limitNumber = Number(newNum);
		},
		goodsDetail(newData, oldData) {
			this.skuId = newData.sku_id;
		},
		minBuy(newData, oldData) {
			if (this.minBuy > 1) {
				this.number = Number(this.minBuy);
			}
		}
	},
	methods: {
		show(type, goodsDetail, callback) {
			this.goodsDetail = goodsDetail;
			this.$refs.skuPopup.open();
			this.type = type;
			this.callback = callback;
			this.skuId = this.goodsDetail.sku_id;
			this.maxBuy = this.goodsDetail.max_buy;
			this.minBuy = this.goodsDetail.min_buy;
			this.isLoad = true;
			this.getCartData();
		},
		hide() {
			this.$refs.skuPopup.close();
		},
		change(skuId, spec_id) {
			if (this.disabled) return;
			this.btnSwitch = false;
			this.skuId = skuId;
			// 清空选择
			for (var i = 0; i < this.goodsDetail.goods_spec_format.length; i++) {
				var sku = this.goodsDetail.goods_spec_format[i];
				for (var j = 0; j < sku.value.length; j++) {
					// 排除当前点击的规格值
					if (spec_id == this.goodsDetail.goods_spec_format[i].value[j].spec_id) {
						this.goodsDetail.goods_spec_format[i].value[j].selected = false;
					}
				}
			}

			this.isLoad = true;
			this.getGoodsSkuInfo();
		},
		// 获取普通商品详情
		getGoodsSkuInfo() {
			this.getCartData();
			let res = this.$api.sendRequest({
				url: '/api/goodssku/getInfoForCategory',
				data: {
					sku_id: this.skuId == undefined ? this.goodsDetail.sku_id : this.skuId
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						data.unit = data.unit || '件';
						this.goodsSkuDetail = data;
						this.dealData();
						this.btnSwitch = false;
						var tempInfo = this.goodsSkuDetail;
						tempInfo.num = this.cartData[this.skuId] !== undefined ? this.cartData[this.skuId] : 0;
						this.$emit('refresh', tempInfo);
					} else {
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				},
				fail: res => {
					this.btnSwitch = false;
					this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
				}
			});
		},

		dealData() {
			if (this.goodsSkuDetail.promotion_type == 1) {
				if (this.goodsSkuDetail.member_price && this.goodsSkuDetail.member_price <= this.goodsSkuDetail.price) {
					this.goodsSkuDetail.show_price = this.goodsSkuDetail.member_price;
				} else {
					this.goodsSkuDetail.show_price = this.goodsSkuDetail.discount_price;
				}
			} else {
				if (this.goodsSkuDetail.member_price) {
					this.goodsSkuDetail.show_price = this.goodsSkuDetail.member_price;
				} else {
					this.goodsSkuDetail.show_price = this.goodsSkuDetail.price;
				}
			}

			// 当前商品SKU规格
			if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this.goodsSkuDetail.sku_spec_format);

			// 商品SKU格式
			if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this.goodsSkuDetail.goods_spec_format);

			this.goodsDetail.unit = this.goodsDetail.unit || '件';

			this.keyInput(false);
		},
		changeNum(tag) {
			if (this.goodsDetail.stock == 0) return;

			var stock = this.goodsDetail.stock;
			var min = 1;

			if (this.maxBuy > 0 && this.maxBuy < stock) stock = this.maxBuy;

			if (this.maxBuy > 0 && this.goodsDetail.purchased_num > 0) {
				stock = this.maxBuy - this.goodsDetail.purchased_num;
			}

			if (this.minBuy > 1) {
				min = this.minBuy;
			}
			if (tag == '+') {
				// 加
				if (this.number < stock) {
					this.number++;
				} else {
					if (this.maxBuy > 0 && this.goodsDetail.purchased_num > 0) {
						this.$util.showToast({
							title: '该商品每人限购' + this.maxBuy + this.goodsDetail.unit + '，您已购买了' + this.goodsDetail.purchased_num + this.goodsDetail.unit
						});
						return;
					}
					if (this.maxBuy > 0 && this.number + 1 > this.maxBuy) {
						var diff = this.maxBuy - this.number;
						if (diff > 0) {
							this.$util.showToast({
								title:
									'该商品每人限购' +
									this.maxBuy +
									this.goodsDetail.unit +
									'，购物车已加入了' +
									this.number +
									this.goodsDetail.unit +
									'，还能购买' +
									diff +
									this.goodsDetail.unit
							});
						} else {
							this.$util.showToast({
								title: '该商品每人限购' + this.maxBuy + this.goodsDetail.unit
							});
						}
						return;
					}
				}
			} else if (tag == '-') {
				// 减
				if (this.number > min) {
					this.number -= 1;
				} else {
					this.number = 0;
				}
			}
			if (this.number > this.limitNumber && this.limitNumber) {
				this.number = this.limitNumber;
			}
			if (this.number) {
				this.cartNumChange(this.number, this.cartIdArr[this.skuId]);
			} else {
				this.deleteCart();
			}
		},
		blur() {
			if (!this.number) {
				this.number = 0;
			}
			if (this.number > this.limitNumber && this.limitNumber) {
				this.number = this.limitNumber;
			}
			if (this.maxBuy > 0) {
				let maxBuy = this.maxBuy - this.goodsDetail.purchased_num;
				if (this.number > maxBuy) this.number = maxBuy;
			}
			if (this.number < this.minBuy && this.minBuy > 0) {
				this.number = this.minBuy;
			}

			let newNumber = parseInt(this.number);
			this.number = 0;
			this.isLoad = false;
			setTimeout(() => {
				this.number = newNumber;
				this.cartNumChange(this.number, this.cartIdArr[this.skuId]);
			}, 0);
		},
		//输入数量
		keyInput(flag, callback) {
			setTimeout(() => {
				var stock = this.goodsDetail.stock;

				// 库存为0
				if (this.goodsDetail.stock == 0) {
					this.number = 0;
					return;
				}

				// 防止空
				if (flag && this.number.length == 0) this.number = 1;

				// 防止输入0和负数、非法输入
				if (flag && (this.number <= 0 || isNaN(this.number))) this.number = 1;

				if (this.number > stock) {
					this.number = stock;
				}
				// 商品起售数
				if (this.minBuy > 1 && this.number < this.minBuy) {
					this.number = this.minBuy;
				}

				if (flag) this.number = parseInt(this.number);

				if (callback) callback();
			}, 0);
		},

		//提交
		confirm() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open();
				return;
			}
			this.number = 1;
			//纠正数量
			this.keyInput(true, () => {
				if (this.goodsDetail.stock == 0) {
					this.$util.showToast({
						title: '商品已售罄'
					});
					return;
				}

				if (this.number > this.goodsDetail.stock) {
					this.$util.showToast({
						title: '库存不足'
					});
					return;
				}

				if (this.maxBuy > 0 && this.goodsDetail.purchased_num > 0 && this.number > this.maxBuy - this.goodsDetail.purchased_num) {
					this.$util.showToast({
						title: '该商品每人限购' + this.maxBuy + this.goodsDetail.unit + '，您已购买了' + this.goodsDetail.purchased_num + this.goodsDetail.unit
					});
					return;
				}
				if (this.maxBuy > 0 && this.number > this.maxBuy) {
					var diff = this.maxBuy - this.number;
					if (diff > 0) {
						this.$util.showToast({
							title:
								'该商品每人限购' +
								this.maxBuy +
								this.goodsDetail.unit +
								'，购物车已加入了' +
								this.number +
								this.goodsDetail.unit +
								'，还能购买' +
								diff +
								this.goodsDetail.unit
						});
					} else {
						this.$util.showToast({
							title: '该商品每人限购' + this.maxBuy + this.goodsDetail.unit
						});
					}
					return;
				}

				if (this.btnSwitch) return;
				this.btnSwitch = true;
				this.$api.sendRequest({
					url: '/api/cart/add',
					data: {
						sku_id: this.goodsDetail.sku_id,
						num: this.number
					},
					success: res => {
						var data = res.data;
						if (data > 0) {
							this.getCartData();
							this.getGoodsSkuInfo();

							this.$util.showToast({
								title: '加入购物车成功'
							});
							if (this.callback) this.callback();
						}
						//this.$refs.skuPopup.close();
						this.btnSwitch = false;
					},
					fail: res => {
						this.$refs.skuPopup.close();
						this.btnSwitch = false;
					}
				});
			});
		},
		closeSkuPopup() {
			this.$refs.skuPopup.close();
		},
		imgError() {
			this.goodsDetail.sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		valueImgError(index, index_value) {
			this.goodsDetail.goods_spec_format[index].value[index_value].image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		//获取购物车的信息
		getCartData() {
			this.$api.sendRequest({
				url: '/api/cart/lists',
				success: res => {
					if (res.code >= 0) {
						var skuArr = [];
						var cartArr = [];
						if (res.data.length) {
							for (var index = 0; index < res.data.length; index++) {
								skuArr[res.data[index].sku_id] = res.data[index].num;
								cartArr[res.data[index].sku_id] = res.data[index].cart_id;
							}
						}
						this.cartData = skuArr;
						this.cartIdArr = cartArr;
					}
					this.number = this.cartData[this.skuId] ? this.cartData[this.skuId] : 0;
					this.$forceUpdate();
				}
			});
		},
		/**
		 * 变更购物车数量
		 * @param {Object} params
		 */
		cartNumChange(num, cartid) {
			if (num < 1) num = 1;
			this.modifyFlag = true;
			this.$api.sendRequest({
				url: '/api/cart/edit',
				data: {
					num,
					cart_id: cartid
				},
				success: res => {
					if (res.code >= 0) {
						this.cartData[this.skuId] = num;
						// this.calculationTotalPrice();
						this.$store.dispatch('getCartNumber');
					} else {
						// this.$util.showToast({ title: res.message });
					}
				}
			});
		},
		/**
		 * 删除购物车
		 * @param {Object} siteIndex
		 * @param {Object} cartIndex
		 */
		deleteCart() {
			this.$api.sendRequest({
				url: '/api/cart/delete',
				data: { cart_id: this.cartIdArr[this.skuId] },
				success: res => {
					if (res.code >= 0) {
						this.$store.dispatch('getCartNumber');
						this.getCartData();
					} else {
						// this.$util.showToast({ title: res.message });
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.sku-content {
	background: #ffffff;
	border-radius: 10px;
}
.sku-close {
	color: #fff;
	width: 50rpx;
	text-align: center;
	font-size: 76rpx;
	border-radius: 50%;
	margin: 40rpx auto 0;
}
.sku-layer .sku-info {
	width: 600rpx;
	height: 60vh !important;
	position: relative;
	z-index: 999;
}

.sku-layer .sku-info .header {
	// padding: 30rpx 0 30rpx 300rpx;
	/* #ifdef MP-ALIPAY */
	// padding: 50rpx 0 50rpx 300rpx;
	/* #endif */
	padding: 30rpx;
	display: flex;
	position: relative;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	z-index: 2;
}

.sku-layer .sku-info .header .img-wrap {
	width: 114rpx;
	height: 114rpx;
	margin-right: 20rpx;
	// position: absolute;
	// top: -56rpx;
	/* #ifdef MP-ALIPAY */
	// top: 20rpx;
	/* #endif */
	// left: 20rpx;
	border-radius: 8rpx;
	overflow: hidden;
	border: 1px solid rgba(0, 0, 0, 0.1);
	padding: 2rpx;
	background-color: #fff;
	line-height: 208rpx;
}

.sku-layer .sku-info .header .img-wrap image {
	width: 100%;
	height: 100%;
}

.sku-layer .sku-info .main {
	font-size: 12px;
	line-height: 40rpx;
	flex: 1;
}
.sku-layer .sku-info .main .goodname {
	word-wrap: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-height: 1.3;
}
.footer-left .price {
	word-wrap: break-word;
	font-size: $font-size-toolbar;
}

.sku-layer .sku-info .main .stock {
	margin-top: 20rpx;
	line-height: 1;
	font-size: $font-size-tag;
}

.sku-layer .sku-info .main .sku-name {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	height: 90rpx;
	overflow: hidden;
}

.sku-layer .sku-info .main .sku-name text {
	margin-right: 10rpx;
}

.sku-layer .sku-info .sku-close {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	width: 40rpx;
	height: 80rpx;
	font-size: 50rpx;
}

.sku-layer .body-item {
	padding: 0 30rpx 30rpx 30rpx;
	height: calc(100% - 282rpx);
	box-sizing: border-box;
	overflow: scroll;
}

.sku-layer .body-item .wrap {
	height: calc(100% - 116rpx);
}

.sku-layer .body-item .sku-list-wrap {
}

.sku-layer .body-item .sku-list-wrap .title {
	font-weight: 400;
	padding: 20rpx 0;
	margin: 0;
	display: block;
}
.sku-layer .body-item .sku-list-wrap .sku-list_item {
	display: flex;
	flex-wrap: wrap;
}
.sku-layer .body-item .sku-list-wrap .items {
	text-align: center;
	position: relative;
	display: inline-block;
	border: 1px solid;
	padding: 4rpx 20rpx;
	margin: 0 10rpx 20rpx 0;
	background-color: #fff !important;
	border-radius: 30rpx;
}
.sku-layer .body-item .sku-list-wrap .items.disabled {
	border: 1px dashed;
}
[data-theme='theme-green'] .sku-layer .body-item .sku-list-wrap .items {
	background-color: #fff !important;
}

.sku-layer .body-item .sku-list-wrap .items image {
	height: 48rpx;
	width: 48rpx;
	border-radius: 4rpx;
	margin-right: 10rpx;
	display: inline-block;
	vertical-align: middle;
}

.sku-layer .body-item .number-wrap .number-line {
	padding: 20rpx 0;
	line-height: 72rpx;
}

.sku-layer .body-item .number-wrap .title {
	font-weight: 400;
}

.sku-layer .body-item .number-wrap .limit-txt {
}

.sku-layer .body-item .number-wrap .number {
	height: 72rpx;
	border-radius: 6rpx;
	float: right;
}

.sku-layer .body-item .number-wrap .number button {
	display: inline-block;
	line-height: 64rpx;
	height: 68rpx;
	width: 60rpx;
	font-size: 48rpx;
	box-sizing: content-box;
	border: 1px solid;
	padding: 0;
	margin: 0;
	border-radius: 0;
}

.sku-layer .body-item .number-wrap .number button.decrease {
	border-right: 1px solid #fff !important;
}

.sku-layer .body-item .number-wrap .number button.increase {
	border-left: 1px solid #fff !important;
}

.sku-layer .body-item .number-wrap .number button:after {
	border-radius: 0;
	border: none;
}

.sku-layer .body-item .number-wrap .number input {
	display: inline-block;
	line-height: 64rpx;
	height: 68rpx;
	width: 72rpx;
	text-align: center;
	font-weight: 700;
	border: 1px solid;
	margin: 0;
	padding: 0;
	vertical-align: top;
}

.sku-layer .footer {
	width: calc(100% - 60rpx);
	position: absolute;
	bottom: 26rpx;
	color: #fff;
	z-index: 1;
	border-top: 1rpx solid $color-line;
	padding: 30rpx 30rpx 0;
	background-color: #fff;

	// button {
	// 	width: 100%;
	// }
}
.sku-layer .footer .footer-bottom {
	margin-top: 24rpx;
	display: flex;
	justify-content: be;
	align-items: center;
	.footer-left {
		flex: 1;
	}
	.footer-right {
		width: 119px;
		text-align: right;
		height: 43px;
	}
	.footer-right button {
		margin: 0;
		width: 210rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
	}
}

.position-bottom {
	bottom: 98rpx !important;
}
// 数量加减样式
.change_num {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.change_num > text {
	font-size: 48rpx;
}
.change_num input {
	width: 70rpx;
	height: 36rpx;
	line-height: 36rpx;
	text-align: center;
}
/deep/ .uni-popup__wrapper {
	background: transparent !important;
}
/deep/ .sku-layer .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: transparent !important;
}
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: transparent !important;
}
</style>

<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
