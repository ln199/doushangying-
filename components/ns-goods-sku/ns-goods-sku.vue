<template>
	<view class="goods-sku" @touchmove.prevent.stop>
		<uni-popup ref="skuPopup" type="bottom" class="sku-layer">
			<view class="sku-info" :style="{ height: systemInfo.windowHeight * 1 + 'px' }">
				<view class="header">
					<block v-if="type == 'point' && goodsDetail.type && goodsDetail.type != 1">
						<view class="img-wrap" v-if="goodsDetail.type == 2">
							<image :src="goodsDetail.image ? $util.img(goodsDetail.image) : $util.img('upload/uniapp/point/coupon.png')" mode="aspectFit" />
						</view>
						<view class="img-wrap" v-if="goodsDetail.type == 3">
							<image :src="goodsDetail.image ? $util.img(goodsDetail.image) : $util.img('upload/uniapp/point/hongbao.png')" mode="aspectFit" />
						</view>
					</block>
					<view v-else class="img-wrap"><image :src="$util.img(goodsDetail.sku_image, { size: 'mid' })" @error="imgError()" mode="aspectFit" /></view>

					<view class="main">
						<block v-if="type == 'point'">
							<block v-if="goodsDetail.type == 1">
								<view class="price-wrap">
									<text class="price color-base-text font-size-toolbar">{{ goodsDetail.point }}积分</text>
									<block v-if="goodsDetail.exchange_price != '0.00' && goodsDetail.pay_type > 0">
										<text class="unit color-base-text font-size-tag">+</text>
										<text class="price color-base-text font-size-toolbar">{{ $lang('common.currencySymbol') }}{{ goodsDetail.exchange_price }}</text>
									</block>
								</view>
								<view class="stock">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
							</block>
							<block v-else>
								<view class="price-wrap">
									<view class="price font-size-toolbar">{{ goodsDetail.name }}</view>
								</view>
								<view class="stock" style="height: auto;">
									积分：
									<text class="color-base-text">{{ goodsDetail.point }}</text>
								</view>
								<view class="stock">
									库存：
									<text class="color-base-text">{{ goodsDetail.stock }}{{ goodsDetail.unit }}</text>
								</view>
							</block>
						</block>
						<block v-else-if="type == 'wholesale_join_cart' || type == 'wholesale_buy_now'">
							<view class="wholesale-item" v-for="(priceItem, index) in goodsDetail.price_array" :key="index">
								<view class="price-wrap">
									<text class="unit color-base-text font-size-tag">￥</text>
									<text class="price color-base-text font-size-toolbar margin-right">{{ priceItem.price }}</text>
									<text class="start-number">{{ priceItem.num }}{{ goodsDetail.unit }}起批</text>
								</view>
							</view>
							<view class="stock">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
						</block>
						<block v-else>
							<view class="price-wrap">
								<text class="unit color-base-text font-size-tag">￥</text>
								<text class="price color-base-text font-size-toolbar">{{ goodsDetail.show_price }}</text>
							</view>
							<view class="stock">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
						</block>

						<view class="sku-name font-size-tag" v-if="goodsDetail.sku_spec_format">
							<text class="color-tip">已选规格：</text>
							<text v-for="(item, index) in goodsDetail.sku_spec_format" :key="index" class="spec-value">{{ item.spec_value_name }}</text>
						</view>
					</view>

					<view class="sku-close iconfont iconclose" @click="closeSkuPopup()"></view>
				</view>

				<view class="body-item">
					<scroll-view scroll-y class="wrap">
						<view class="sku-list-wrap" v-for="(item, index) in goodsDetail.goods_spec_format" :key="index">
							<text class="title font-size-base">{{ item.spec_name }}</text>
							<view
								v-for="(item_value, index_value) in item.value"
								:key="index_value"
								:class="{
									selected: item_value['selected'] || skuId == item_value.sku_id,
									disabled: item_value['disabled'] || (!item_value['selected'] && disabled)
								}"
								class="items"
								@click="change(item_value.sku_id, item_value.spec_id)"
							>
								<image v-if="item_value.image" :src="$util.img(item_value.image, { size: 'small' })" @error="valueImgError(index, index_value)" />
								<text>{{ item_value.spec_value_name }}</text>
							</view>
						</view>

						<view class="number-wrap">
							<view class="number-line">
								<text class="title font-size-base" v-if="type == 'point'">兑换数量</text>
								<text class="title font-size-base" v-else>购买数量</text>
								<text class="limit-txt color-base-text" v-if="limitNumber > 0">(每人限购{{ limitNumber }}{{ goodsDetail.unit }})</text>
								<text class="limit-txt color-base-text" v-if="minNumber > 0">({{ minNumber }}件起购)</text>
								<text v-if="maxBuy > 0 && minBuy > 1" class="limit-txt color-base-text">
									({{ minBuy }}{{ goodsDetail.unit }}起售，限购{{ maxBuy }}{{ goodsDetail.unit }})
								</text>
								<text v-else-if="maxBuy > 0" class="limit-txt color-base-text">(限购{{ maxBuy }}{{ goodsDetail.unit }})</text>
								<text v-else-if="minBuy > 1" class="limit-txt color-base-text">({{ minBuy }}{{ goodsDetail.unit }}起售)</text>
								<view class="number">
									<button type="default" class="decrease color-line-border" @click="changeNum('-')">-</button>
									<input
										type="number"
										class="uni-input color-line-border font-size-goods-tag"
										@blur="blur"
										v-model="number"
										placeholder="0"
										@input="keyInput(false)"
									/>
									<button type="default" class="increase color-line-border" @click="changeNum('+')">+</button>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<block v-if="type == 'wholesale_buy_now' || type == 'wholesale_join_cart'">
					<view class="footer">
						<!-- <button type="primary" v-if="type == 'wholesale_join_cart' && goodsDetail.stock >= number && number >= minNumber">加入进货单</button> -->
						<button type="primary"  @click="confirm()" v-if="goodsDetail.stock && goodsDetail.stock != 0 && (goodsDetail.stock >= minNumber)">确定</button>
						<button type="primary" v-else disabled="true">库存不足</button>
					</view>
				</block>
				<block v-else>
					<view class="footer" @click="confirm()">
						<!-- <button type="primary" v-if="type == 'wholesale_join_cart' && goodsDetail.stock >= number && number >= minNumber">加入进货单</button> -->
						<button type="primary" v-if="goodsDetail.stock && goodsDetail.stock != 0">确定</button>
						<button type="primary" v-else disabled="true">库存不足</button>
					</view>
				</block>
				
			</view>
		</uni-popup>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup-sku.vue';
import htmlParser from '@/common/js/html-parser';
// 商品SKU
export default {
	name: 'ns-goods-sku',
	components: {
		uniPopup
	},
	props: {
		goodsDetail: {
			type: Object,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		},
		pointLimit: {
			type: [Number, String]
		},
		maxBuy: {
			type: Number,
			default: 0
		},
		minBuy: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			isIphoneX: false,
			systemInfo: {}, //系统信息
			number: 1,
			btnSwitch: false, //提交按钮防止重复提交
			type: '', //join_cart：加入购物车，buy_now：立即购买
			callback: null, //回调
			skuId: 0,
			pintuanId: 0, // 拼团id
			limitNumber: 0, // 限购
			minNumber: 0,
			//是否开启预览，0：不开启，1：开启
			preview: 0,
			cartNumber: 0 // 购物车中商品存在的数量
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
		show(type, callback) {
			this.callback = callback;
			this.$refs.skuPopup.open(callback);
			this.type = type;
			this.skuId = this.goodsDetail.sku_id;
			this.preview = this.goodsDetail.preview || 0;
			if (this.type == 'pintuan' && this.goodsDetail.pintuan_id) {
				this.limitNumber = this.goodsDetail.buy_num;
			} else if (this.type == 'groupbuy' && this.goodsDetail.groupbuy_id) {
				this.number = this.goodsDetail.buy_num;
				this.minNumber = this.goodsDetail.buy_num;
			} else if (this.type == 'bargain' && this.goodsDetail.bargain_id) {
				this.number = 1;
				this.minNumber = 1;
			} else if ((this.type == 'wholesale_join_cart' || this.type == 'wholesale_buy_now') && this.goodsDetail.wholesale_sku_id) {
				this.number = this.goodsDetail.min_num;
				this.minNumber = this.goodsDetail.min_num;
			}
			if (this.type == 'join_cart') this.getCartData();
			this.$forceUpdate();
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
			if (this.goodsDetail.pintuan_id) {
				this.getPintuanGoodsSkuInfo();
			} else if (this.goodsDetail.groupbuy_id) {
				this.getGroupbuyGoodsSkuInfo();
			} else if (this.goodsDetail.bargain_id) {
				this.getBargainGoodsSkuInfo();
			} else if (this.goodsDetail.seckill_id) {
				this.getSeckillGoodsSkuInfo();
			} else if (this.goodsDetail.topic_id) {
				this.getTopicsGoodsSkuInfo();
			} else if (this.goodsDetail.exchange_id) {
				this.getPointGoodsSkuInfo();
			} else if (this.goodsDetail.wholesale_sku_id) {
				this.getWholeSaleGoodsSkuInfo();
			} else {
				this.getGoodsSkuInfo();
			}
		},
		// 获取普通商品详情
		getGoodsSkuInfo() {
			let res = this.$api.sendRequest({
				url: '/api/goodssku/info',
				data: {
					sku_id: this.skuId
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						data.unit = data.unit || '件';
						this.goodsSkuDetail = data;
						this.dealData();

						// 限时折扣
						if (this.goodsSkuDetail.promotion_type == 1) {
							this.goodsSkuDetail.discountTimeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
						}

						if (this.goodsSkuDetail.promotion_type == 1 && this.goodsSkuDetail.discountTimeMachine) {
							this.goodsSkuDetail.show_price = this.goodsSkuDetail.discount_price;
						} else {
							this.goodsSkuDetail.show_price = this.goodsSkuDetail.price;
						}

						this.btnSwitch = false;
						this.$emit('refresh', this.goodsSkuDetail);
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
		// 获取拼团商品详情
		getPintuanGoodsSkuInfo() {
			let res = this.$api.sendRequest({
				url: '/pintuan/api/goods/info',
				data: {
					sku_id: this.skuId,
					pintuan_id: this.goodsDetail.pintuan_id
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						if (data.type == 'again') {
							this.skuId = data.sku_id;
							this.getPintuanGoodsSkuInfo();
							return;
						}
						data.unit = data.unit || '件';
						this.goodsSkuDetail = data;
						this.dealData();
						//每次请求重新渲染sku
						// this.goodsDetail.goods_spec_format = this.goodsSkuDetail.sku_spec_format;

						this.goodsSkuDetail.show_price = this.goodsDetail.group_id == 0 ? this.goodsSkuDetail.promotion_price : this.goodsSkuDetail.pintuan_price;
						this.goodsSkuDetail.save_price =
							this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

						//拼团倒计时
						if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
							this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
						} else {
							this.$util.showToast({
								title: '活动已结束'
							});
							setTimeout(() => {
								this.$util.redirectTo(
									'/pages/goods/detail/detail',
									{
										sku_id: this.goodsSkuDetail.sku_id
									},
									'redirectTo'
								);
							}, 1000);
						}
						this.btnSwitch = false;
						this.$emit('refresh', this.goodsSkuDetail);
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
		// 获取砍价商品详情
		getBargainGoodsSkuInfo() {
			let res = this.$api.sendRequest({
				url: '/bargain/api/goods/info',
				data: {
					sku_id: this.skuId,
					bargain_id: this.goodsDetail.bargain_id
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						if (data.type == 'again') {
							this.skuId = data.sku_id;
							this.getBargainGoodsSkuInfo();
							return;
						}
						data.unit = data.unit || '件';
						this.goodsSkuDetail = data;
						this.dealData();
						this.goodsSkuDetail.show_price = this.goodsDetail.bargain_id > 0 ? this.goodsSkuDetail.floor_price : this.goodsSkuDetail.price;
						this.goodsSkuDetail.stock = this.goodsSkuDetail.bargain_stock; //砍价库存
						this.goodsSkuDetail.save_price =
							this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

						//团购倒计时
						if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
							this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
						} else {
							this.$util.showToast({
								title: '活动已结束'
							});
							setTimeout(() => {
								this.$util.redirectTo(
									'/pages/goods/detail/detail',
									{
										sku_id: this.goodsSkuDetail.sku_id
									},
									'redirectTo'
								);
							}, 1000);
						}
						this.btnSwitch = false;
						this.$emit('refresh', this.goodsSkuDetail);
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
		// 获取专题商品详情
		getTopicsGoodsSkuInfo() {
			let res = this.$api.sendRequest({
				url: '/topic/api/topicgoods/info',
				data: {
					sku_id: this.skuId,
					topic_id: this.goodsDetail.topic_id
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						if (data.type == 'again') {
							this.skuId = data.sku_id;
							this.getTopicsGoodsSkuInfo();
							return;
						}
						data.unit = data.unit || '件';
						this.goodsSkuDetail = data.goods_sku_detail;
						this.dealData();
						this.goodsSkuDetail.show_price = this.goodsDetail.topic_id > 0 ? this.goodsSkuDetail.topic_price : this.goodsSkuDetail.price;
						this.goodsSkuDetail.save_price =
							this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

						//团购倒计时
						if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
							this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
						} else {
							this.$util.showToast({
								title: '活动已结束'
							});
							setTimeout(() => {
								this.$util.redirectTo(
									'/pages/goods/detail/detail',
									{
										sku_id: this.goodsSkuDetail.sku_id
									},
									'redirectTo'
								);
							}, 1000);
						}
						this.btnSwitch = false;
						this.$emit('refresh', this.goodsSkuDetail);
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
		// 获取团购商品详情
		getGroupbuyGoodsSkuInfo() {
			let res = this.$api.sendRequest({
				url: '/groupbuy/api/goods/info',
				data: {
					sku_id: this.skuId,
					groupbuy_id: this.goodsDetail.groupbuy_id
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						data.unit = data.unit || '件';
						this.goodsSkuDetail = data;
						this.dealData();
						this.goodsSkuDetail.show_price = this.goodsDetail.groupbuy_price;
						this.goodsSkuDetail.save_price =
							this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

						//团购倒计时
						if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
							this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
						} else {
							this.$util.showToast({
								title: '活动已结束'
							});
							setTimeout(() => {
								this.$util.redirectTo(
									'/pages/goods/detail/detail',
									{
										sku_id: this.goodsSkuDetail.sku_id
									},
									'redirectTo'
								);
							}, 1000);
						}

						this.btnSwitch = false;
						this.$emit('refresh', this.goodsSkuDetail);
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
		// 获取秒杀商品详情
		getSeckillGoodsSkuInfo() {
			let res = this.$api.sendRequest({
				url: '/seckill/api/seckillgoods/info',
				data: {
					sku_id: this.skuId,
					seckill_id: this.goodsDetail.seckill_id
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						if (data.type == 'again') {
							this.skuId = data.sku_id;
							this.getSeckillGoodsSkuInfo();
							return;
						}
						data.unit = data.unit || '件';
						this.goodsSkuDetail = data.goods_sku_detail;
						this.dealData();

						this.goodsSkuDetail.show_price = this.goodsSkuDetail.seckill_price;

						this.goodsSkuDetail.price - this.goodsSkuDetail.show_price > 0 ? (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

						//秒杀倒计时
						if (this.goodsSkuDetail.end_time - res.timestamp > 0) {
							this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
						} else {
							this.$util.showToast({
								title: '活动已结束'
							});
							setTimeout(() => {
								this.$util.redirectTo(
									'/pages/goods/detail/detail',
									{
										sku_id: this.goodsSkuDetail.sku_id
									},
									'redirectTo'
								);
							}, 1000);
						}

						this.btnSwitch = false;
						this.$emit('refresh', this.goodsSkuDetail);
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
		// 获取积分商城详情
		getPointGoodsSkuInfo() {
			let res = this.$api.sendRequest({
				url: '/pointexchange/api/goods/info',
				data: {
					sku_id: this.skuId,
					exchange_id: this.goodsDetail.exchange_id
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						if (data.type == 'again') {
							this.skuId = data.sku_id;
							this.getPointGoodsSkuInfo();
							return;
						}
						data.unit = data.unit || '件';
						this.goodsSkuDetail = data;
						this.dealData();
						this.btnSwitch = false;
						this.$emit('refresh', this.goodsSkuDetail);
					} else {
						this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
					}
				},
				fail: res => {
					this.btnSwitch = false;
					this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
				}
			});
		},
		// 获取批发商品详情
		getWholeSaleGoodsSkuInfo() {
			let res = this.$api.sendRequest({
				url: '/wholesale/api/goods/info',
				data: {
					sku_id: this.skuId
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						data.unit = data.unit || '件';
						this.goodsSkuDetail = data;
						this.number = this.goodsSkuDetail.min_num;
						this.minNumber = this.goodsSkuDetail.min_num;
						this.dealData();
						this.btnSwitch = false;
						this.$emit('refresh', this.goodsSkuDetail);
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

		dealData(item = this.goodsSkuDetail) {
			if (item.sku_images) item.sku_images = item.sku_images.split(',');
			else item.sku_images = [];

			// 多规格时合并主图
			if (item.goods_spec_format && item.goods_image) {
				item.goods_image = item.goods_image.split(',');
				item.sku_images = item.sku_images.concat(item.goods_image);
			}

			// 当前商品SKU规格
			if (item.sku_spec_format) item.sku_spec_format = JSON.parse(item.sku_spec_format);

			// 商品属性
			if (item.goods_attr_format) {
				let goods_attr_format = JSON.parse(item.goods_attr_format);
				item.goods_attr_format = this.$util.unique(goods_attr_format, 'attr_id');
				for (var i = 0; i < item.goods_attr_format.length; i++) {
					for (var j = 0; j < goods_attr_format.length; j++) {
						if (item.goods_attr_format[i].attr_id == goods_attr_format[j].attr_id && item.goods_attr_format[i].attr_value_id != goods_attr_format[j].attr_value_id) {
							item.goods_attr_format[i].attr_value_name += '、' + goods_attr_format[j].attr_value_name;
						}
					}
				}
			}

			// 商品SKU格式
			if (item.goods_spec_format) item.goods_spec_format = JSON.parse(item.goods_spec_format);

			// 商品详情
			// if (item.goods_content && this.type != 'point') item.goods_content = htmlParser(item.goods_content);

			// if (item.content && this.type == 'point') item.content = htmlParser(item.content);

			this.goodsDetail.unit = this.goodsDetail.unit || '件';

			this.keyInput(true);

			this.$langConfig.title(item.goods_name);
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

			if (this.type == 'pintuan' && this.goodsDetail.pintuan_id) {
				//限购数量大于库存总数取库存
				if (this.goodsDetail.buy_num > this.goodsDetail.stock) {
					stock = this.goodsDetail.stock;
				} else {
					stock = this.goodsDetail.buy_num;
				}
				// min = stock;
			} else if (this.type == 'groupbuy' && this.goodsDetail.groupbuy_id) {
				//限购数量大于库存总数取库存
				if (this.goodsDetail.buy_num > this.goodsDetail.stock) {
					stock = this.goodsDetail.stock;
				} else {
					stock = this.goodsDetail.stock;
				}
				//最低购买数量
				min = this.goodsDetail.buy_num;
			} else if (this.type == 'seckill' && this.goodsDetail.seckill_id && this.goodsDetail.num > 0 && this.goodsDetail.num < this.goodsDetail.stock) {
				//限购数量小于库存总数取库存
				stock = this.goodsDetail.num;
			} else if (this.type == 'bargain' && this.goodsDetail.bargain_id) {
				stock = 1;
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
					if (this.maxBuy > 0 && this.cartNumber > 0 && this.cartNumber + this.number > this.maxBuy) {
						var diff = this.maxBuy - this.cartNumber;
						if (diff > 0) {
							this.$util.showToast({
								title:
									'该商品每人限购' +
									this.maxBuy +
									this.goodsDetail.unit +
									'，购物车已加入了' +
									this.cartNumber +
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
					if (this.type == 'seckill' && this.goodsDetail.seckill_id && this.goodsDetail.num > 0) {
						this.$util.showToast({
							title: '该商品每人限购' + this.goodsDetail.num + this.goodsDetail.unit
						});
						return;
					}
				}
			} else if (tag == '-') {
				// 减
				if (this.number > min) {
					this.number -= 1;
				} else {
					if (this.minBuy > 1) {
						this.$util.showToast({
							title: '该商品' + this.minBuy + this.goodsDetail.unit + '起售'
						});
					}
					return;
				}
			}
			if (this.number > this.limitNumber && this.limitNumber) {
				this.number = this.limitNumber;
			}
		},
		blur() {
			if (!this.number) {
				this.number = 0;
			}
			if (this.number > this.limitNumber && this.limitNumber) {
				this.number = this.limitNumber;
			}
			if (this.number < this.minNumber && this.minNumber) {
				this.number = this.minNumber;
			}

			if (this.maxBuy > 0 && this.number > this.maxBuy) {
				this.number = this.maxBuy;
			}

			if (this.maxBuy > 0 && this.goodsDetail.purchased_num > 0) {
				let maxBuy = this.maxBuy - this.goodsDetail.purchased_num;
				if (this.number > maxBuy) this.number = maxBuy;
			}
			if (this.number < this.minBuy && this.minBuy > 0) {
				this.number = this.minBuy;
			}

			let newNumber = parseInt(this.number);
			this.number = 0;
			setTimeout(() => {
				this.number = newNumber;
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

				if (this.type == 'pintuan' && this.goodsDetail.pintuan_id && this.number > this.goodsDetail.buy_num) {
					//限购数量大于库存总数取库存
					this.number = this.goodsDetail.buy_num;
				} else if (this.type == 'groupbuy' && this.goodsDetail.groupbuy_id && this.number < this.goodsDetail.buy_num) {
					//最低购买数量
					this.number = this.goodsDetail.buy_num;
				} else if (this.type == 'seckill' && this.goodsDetail.seckill_id && this.goodsDetail.max_buy > 0 && this.number > this.goodsDetail.max_buy) {
					//限购数量大于库存总数取库存
					this.number = this.goodsDetail.max_buy;
				} else if (this.type == 'bargain' && this.goodsDetail.bargain_id) {
					// 砍价
					this.number = 1;
				} else if (this.number > stock) {
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
			// 删除待付款物流方式缓存
			uni.removeStorageSync('delivery');
			if (this.preview) {
				this.$util.showToast({
					title: '预览商品无法购买'
				});
				return;
			}

			if (!uni.getStorageSync('token')) {
				this.$refs.login.open();
				return;
			}

			//纠正数量
			this.keyInput(true, () => {
				if (this.goodsDetail.stock == 0) {
					this.$util.showToast({
						title: '商品已售罄'
					});
					return;
				}

				if (this.number.length == 0 || this.number == 0) {
					this.$util.showToast({
						title: '购买数量不能为0'
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
				if (this.maxBuy > 0 && this.cartNumber > 0 && this.cartNumber + this.number > this.maxBuy) {
					var diff = this.maxBuy - this.cartNumber;
					if (diff > 0) {
						this.$util.showToast({
							title:
								'该商品每人限购' +
								this.maxBuy +
								this.goodsDetail.unit +
								'，购物车已加入了' +
								this.cartNumber +
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

				if (this.type == 'join_cart') {
					this.$api.sendRequest({
						url: '/api/cart/add',
						data: {
							site_id: this.goodsDetail.site_id,
							sku_id: this.skuId,
							num: this.number
						},
						success: res => {
							var data = res.data;
							if (data > 0) {
								this.$util.showToast({
									title: '加入购物车成功'
								});
								if (this.callback) this.callback();
							}
							this.$refs.skuPopup.close();
							this.btnSwitch = false;
						},
						fail: res => {
							this.$refs.skuPopup.close();
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'buy_now') {
					var data = {
						sku_id: this.skuId,
						num: this.number
					};

					uni.setStorage({
						key: 'orderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/pages/order/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'seckill') {
					// 秒杀
					var data = {
						seckill_id: this.goodsDetail.seckill_id,
						num: this.number,
						sku_id: this.skuId
					};

					uni.setStorage({
						key: 'seckillOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/seckill/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'pintuan') {
					// 拼团
					var data = {
						pintuan_goods_id: this.goodsDetail.id,
						group_id: this.goodsDetail.group_id,
						num: this.number
					};

					uni.setStorage({
						key: 'pintuanOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/pintuan/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'topic') {
					// 专题
					var data = {
						topic_goods_id: this.goodsDetail.id,
						num: this.number
					};

					uni.setStorage({
						key: 'topicOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/topics/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'groupbuy') {
					// 团购
					var data = {
						groupbuy_id: this.goodsDetail.groupbuy_id,
						sku_id: this.skuId,
						num: this.number
					};

					uni.setStorage({
						key: 'groupbuyOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/groupbuy/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'presale') {
					// 预售
					var data = {
						presale_id: this.goodsDetail.presale_id,
						sku_id: this.skuId,
						num: this.number
					};
					uni.setStorage({
						key: 'presaleOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/presale/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'bargain') {
					// 砍价
					this.$api.sendRequest({
						url: '/bargain/api/bargain/launch',
						data: {
							id: this.goodsDetail.id
						},
						success: res => {
							this.btnSwitch = false;
							if (res.code == 0) {
								this.$util.redirectTo(
									'/promotionpages/bargain/launch/launch',
									{
										id: res.data
									},
									'redirectTo'
								);
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						}
					});
				} else if (this.type == 'point') {
					// 积分兑换
					var data = {
						id: this.goodsDetail.exchange_id,
						sku_id: this.skuId,
						num: this.number
					};
					uni.setStorage({
						key: 'exchangeOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/point/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'wholesale_join_cart') {
					// 批发·加入进货单
					this.$api.sendRequest({
						url: '/wholesale/api/cart/add',
						data: {
							site_id: this.goodsDetail.site_id,
							sku_id: this.skuId,
							num: this.number
						},
						success: res => {
							var data = res.data;
							if (data > 0) {
								this.$util.showToast({
									title: '加入进货单成功'
								});
								if (this.callback) this.callback();
								this.$store.dispatch('getWholeSaleNumber');
							}
							this.$refs.skuPopup.close();
							this.btnSwitch = false;
						},
						fail: res => {
							this.$refs.skuPopup.close();
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'wholesale_buy_now') {
					// 批发·立即购买
					var data = {
						sku_id: this.skuId,
						num: this.number
					};

					uni.setStorage({
						key: 'wholesaleOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/wholesale/payment/payment');
							this.btnSwitch = false;
						}
					});
				}
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
		// 获取购物车数据
		getCartData() {
			this.$api.sendRequest({
				url: '/api/cart/goodslists',
				success: res => {
					if (res.code >= 0) {
						var data = res.data;
						for (var i = 0; i < data.length; i++) {
							if (data[i].sku_id == this.goodsDetail.sku_id) {
								this.cartNumber = data[i].num;
								break;
							}
						}
					}
				}
			});
		}
	}
};
</script>
<style lang="scss">
.sku-layer .sku-info {
	height: 75vh !important;
	position: relative;
	z-index: 999;
}

.sku-layer .sku-info .header {
	padding: 30rpx 30rpx 20rpx 210rpx;
	position: relative;
	border-bottom: 1px solid $color-line;
	min-height: 170rpx;
}

.sku-layer .sku-info .header .img-wrap {
	width: 160rpx;
	height: 160rpx;
	position: absolute;
	left: 20rpx;
	border-radius: $border-radius;
	overflow: hidden;
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
	padding-right: 40rpx;

	.price-wrap {
		font-weight: bold;

		.unit {
			margin-right: 4rpx;
		}
	}

	.stock {
		font-size: $font-size-tag;
		color: $color-tip;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		height: 70rpx;
		overflow: hidden;
	}
	.wholesale-item {
		.price-wrap {
			line-height: 1.4;
		}
		.stock {
			height: 40rpx;
		}
		.start-number {
			font-weight: normal;
		}
	}
}

.sku-layer .sku-info .main .price {
	word-wrap: break-word;
}

.sku-layer .sku-info .main .sku-name {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
	height: 42rpx;

	.spec-value {
		&::after {
			content: '/';
		}

		&:last-child {
			&::after {
				content: '';
			}
		}
	}
}

.sku-layer .sku-info .sku-close {
	position: absolute;
	top: 20rpx;
	right: 40rpx;
	width: 40rpx;
	height: 80rpx;
	font-size: 40rpx;
}

.sku-layer .body-item {
	padding: 0 30rpx;
	height: calc(100% - 330rpx);
	box-sizing: border-box;
	overflow: scroll;
}

.sku-layer .body-item .wrap {
	height: calc(100% - 116rpx);
}

.sku-layer .body-item .sku-list-wrap {
	padding-bottom: 20rpx;
}

.sku-layer .body-item .sku-list-wrap .title {
	padding: 20rpx 0;
	display: block;
}

.sku-layer .body-item .sku-list-wrap .items {
	position: relative;
	display: inline-block;
	border: 1px solid $color-line;
	padding: 4rpx 30rpx;
	border-radius: 40rpx;
	margin: 0 20rpx 20rpx 0;
	background-color: #fff;
	font-size: $font-size-tag;
}

.sku-layer .body-item .sku-list-wrap .items.disabled {
	border: 1px dashed;
}

.sku-layer .body-item .sku-list-wrap .items image {
	height: 44rpx;
	width: 44rpx;
	border-radius: $border-radius;
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
	display: flex;
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
	border: 1px solid $color-line;
	padding: 0;
	margin: 0;
	border-radius: 0;
	background-color: #fff !important;
}

.sku-layer .body-item .number-wrap .number button.decrease {
	border-right-width: 0 !important;
}

.sku-layer .body-item .number-wrap .number button.increase {
	border-left: 0 !important;
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
	background-color: $color-bg !important;
}

.sku-layer .footer {
	height: 100rpx;
	width: 100%;
	position: absolute;
	bottom: 80rpx;
	color: #fff;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: flex-start;

	button {
		width: 100%;
		height: 80rpx;
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
