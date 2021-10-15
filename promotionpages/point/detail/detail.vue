<template>
	<view class="point-detail" :class="themeStyle">
		<view class="detail-top">
			<!-- <block v-if="pointInfo.type == 1">
				<image class="adv-pic" :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imgError()" mode="widthFix"></image>
				<image class="adv-pic" :src="$util.img('upload/uniapp/point/gift.png')" v-else mode="widthFix"></image>
			</block>
			<block v-if="pointInfo.type == 2">
				<image class="adv-pic" :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imgError()" mode="widthFix"></image>
				<image class="adv-pic" :src="$util.img('upload/uniapp/point/coupon.png')" v-else mode="widthFix"></image>
			</block>
			<block v-if="pointInfo.type == 3">
				<image
					class="adv-pic"
					:src="pointInfo.image ? $util.img(pointInfo.image) : $util.img('upload/uniapp/point/hongbao.png')"
					@error="imgError($util.img('upload/uniapp/point/hongbao.png'))"
					mode="aspectFit"
				></image>
			</block> -->
			<view class="goods-media">
				<view class="goods-img show">
					<swiper class="swiper">
						<swiper-item :item-id="'goods_id_' + pointInfo.type">
							<view class="item" v-if="pointInfo.type == 2">
								<image
									class="adv-pic"
									:src="pointInfo.image ? $util.img(pointInfo.image) : $util.img('upload/uniapp/point/coupon.png')"
									@error="imgError()"
									mode="aspectFit"
								></image>
							</view>
							<view class="item" v-else-if="pointInfo.type == 3">
								<image
									class="adv-pic"
									:src="pointInfo.image ? $util.img(pointInfo.image) : $util.img('upload/uniapp/point/hongbao.png')"
									@error="imgError()"
									mode="aspectFit"
								></image>
							</view>
							<view class="item" v-else><image class="adv-pic" :src="$util.img(pointInfo.image)" @error="imgError()" mode="aspectFit"></image></view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="group-wrap padding-top">
				<view class="goods-module-wrap">
					<text class="price-symbol color-base-text">{{ pointInfo.point }}积分</text>
					<text class="point-num" v-if="pointInfo.price > 0">+￥{{ pointInfo.price }}</text>
					<text class="point-num">+￥{{ pointInfo.price }}</text>
					<view class="follow-and-share">
						<text class="color-tip">库存:{{ pointInfo.stock }}</text>
					</view>
				</view>
				<view class="goods-module-wrap info">
					<text class="sku-name-wrap">{{ pointInfo.name }}</text>
				</view>
				<view class="coupon-desc" v-if="pointInfo.type == 2">
					<view class="color-tip">{{ pointInfo.at_least == 0 ? '无门槛优惠券' : '满' + pointInfo.at_least + '减' + pointInfo.money }}</view>
					<view class="time color-tip">
						有效期：{{ pointInfo.validity_type == 1 ? '领取之日起' + pointInfo.fixed_term + '天内有效' : $util.timeStampTurnTime(pointInfo.end_time) + '到期' }}
					</view>
				</view>
			</view>
			<!-- <view class="detail-desc">
				<view class="desc-point color-base-text">
					<view class="desc-point-left color-base-text">
						<view class="desc-point-left-con color-base-text">
							<text class="point-num">{{ pointInfo.point }}</text>
							<text>积分</text>
							<text class="point-num" v-if="pointInfo.price>0">+￥{{ pointInfo.price }}</text>
						</view>
						<view class="margin-left desc-point-left-oldPrice">
							<text>￥</text>
							<text>{{ pointInfo.market_price }}</text>
						</view>
					</view>
					<view class="desc-point-right color-base-text-gary">
						<text>库存:</text>
						<text class="point-num">{{ pointInfo.stock }}</text>
					</view>
				</view>
				<view class="desc-name">{{ pointInfo.name }}</view>
			</view> -->
		</view>

		<!-- 详情 -->
		<view class="goods-detail-tab">
			<view class="detail-tab"><view class="tab-item">兑换详情</view></view>

			<view class="detail-content">
				<view class="detail-content-item">
					<view class="goods-details" v-if="pointInfo.content"><rich-text :nodes="pointInfo.content"></rich-text></view>
					<view class="goods-details active" v-else>暂无兑换详情！</view>
				</view>
			</view>
		</view>

		<!-- <view class="detail-content">
			<view class="content-title">
				<text v-if="pointInfo.type == 1">礼品详情</text>
				<text v-else-if="pointInfo.type == 2">优惠券详情</text>
				<text v-else>红包详情</text>
			</view>
			<rich-text :nodes="pointInfo.content"></rich-text>
		</view> -->
		<view class="detail-swap" @click="login()" v-if="!isLogin"><button type="primary" class="btn-disabled">登录之后方可兑换</button></view>
		<view class="detail-swap" @click="makeSure()" v-else>
			<button type="primary" :class="Max == 0 ? 'btn-disabled' : ''">{{ isLogin ? '兑换' : '登录之后方可兑换' }}</button>
		</view>
		<!-- 弹出规则 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="pointPopup" type="bottom">
				<view class="tips-layer">
					<view class="tips-layer-info">
						<view class="info-img">
							<block v-if="pointInfo.type == 1">
								<image :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imgError()"></image>
								<image :src="$util.img('upload/uniapp/point/gift.png')" v-else></image>
							</block>
							<block v-if="pointInfo.type == 2">
								<image :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imgError()"></image>
								<image :src="$util.img('upload/uniapp/point/coupon.png')" v-else></image>
							</block>
							<block v-if="pointInfo.type == 3">
								<image :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imgError()"></image>
								<image :src="$util.img('upload/uniapp/point/hongbao.png')" v-else></image>
							</block>
						</view>
						<view class="info-desc">
							<view class="desc-name">{{ pointInfo.name }}</view>
							<view class="desc-con">
								<text>库存:</text>
								<text class="color-base-text">{{ pointInfo.stock }}</text>
							</view>
							<view class="desc-con">
								<text>积分:</text>
								<text class="color-base-text">{{ pointInfo.point }}</text>
							</view>
						</view>
					</view>
					<view class="tips-layer-item">
						<text>兑换数量</text>
						<uni-number-box :min="1" :max="Max" :value="number" @change="numChange($event, {})"></uni-number-box>
					</view>
					<view class="footer"><button type="primary" @click="confirm()">确定</button></view>

					<view class="close iconfont iconroundclose" @click="close()"></view>
				</view>
			</uni-popup>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
import htmlParser from '@/common/js/html-parser';
export default {
	components: {
		uniPopup,
		uniNumberBox
	},
	data() {
		return {
			id: 0,
			pointInfo: {
				image: ''
			},
			isLogin: false,
			Max: 0, //最大兑换数量
			number: 1
		};
	},
	onLoad(options) {
		if (uni.getStorageSync('token')) {
			this.isLogin = true;
		}
		if (options.id) {
			this.id = options.id;
		} else {
			this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
		}
		this.getPointInfo();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if (uni.getStorageSync('token')) {
			this.isLogin = true;
		}
	},
	computed: {
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		}
	},
	methods: {
		//获取该详情
		getPointInfo() {
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/detail',
				data: {
					id: this.id
				},
				success: res => {
					this.$refs.loadingCover.hide();
					if (res.code == 0 && res.data) {
						if (res.data.type == 2 && !res.data.platformcoupon_type_id) {
							this.$util.showToast({
								title: '该礼品已过期'
							});
							setTimeout(() => {
								this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
							}, 1000);
							return;
						} else if (res.data.type == 1 && !res.data.gift_id) {
							this.$util.showToast({
								title: '该优惠券已过期'
							});
							setTimeout(() => {
								this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
							}, 1000);
							return;
						} else {
							this.pointInfo = res.data;
							if (this.pointInfo.content) this.pointInfo.content = htmlParser(this.pointInfo.content);
							uni.setNavigationBarTitle({
								title: this.pointInfo.name
							});
							let save = this.pointInfo.type == 2 ? this.pointInfo.count : this.pointInfo.stock;
							let point = this.pointInfo.point;
							this.Max = save;
						}
					} else {
						this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
					}
				}
			});
		},
		// 打开积分说明弹出层
		openPointPopup() {
			this.$refs.pointPopup.open();
		},
		close() {
			this.$refs.pointPopup.close();
		},
		numChange(num, params) {
			if (num < 1) num = 1;
			this.number = num;
		},
		//确认兑换后执行操作
		confirm() {
			var data = {
				id: this.id,
				num: this.number
			};

			uni.setStorage({
				key: 'exchangeOrderCreateData',
				data: data,
				success: () => {
					if (!uni.getStorageSync('token')) {
						this.$refs.login.open('/promotionpages/point/payment/payment');
						return;
					}
					this.$util.redirectTo('/promotionpages/point/payment/payment');
				}
			});
		},
		//登录
		login() {
			this.$refs.login.open('/promotionpages/point/detail/detail?id=' + this.id);
		},
		//点击去兑换
		makeSure() {
			if (this.Max > 0) {
				// this.openPointPopup();
				this.confirm();
			} else {
				this.$util.showToast({
					title: '库存不足'
				});
			}
		},
		imgError() {
			let imageUrl = '';
			if (this.pointInfo.type == 1) {
				imageUrl = this.$util.img('upload/uniapp/point/gift.png');
			} else if (this.pointInfo.type == 2) {
				imageUrl = this.$util.img('upload/uniapp/point/coupon.png');
			} else if (this.pointInfo.type == 3) {
				imageUrl = this.$util.img('upload/uniapp/point/hongbao.png');
			} else {
				imageUrl = this.$util.getDefaultImage().default_goods_img;
			}
			this.pointInfo.image = imageUrl;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
@import './../../../common/css/goods_detail.scss';
@import '../public/css/detail.scss';
.goods-module-wrap {
	.point-num {
		vertical-align: text-top;
	}
}
.detail-swap {
	box-sizing: border-box;
	background: #ffffff;
	position: fixed;
	left: 0;
	bottom: 0rpx;
	width: 100%;
	padding: 20rpx 0;
	padding-bottom: calc(20rpx + constant(safe-area-inset-bottom)) !important;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom)) !important;

	button {
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 80rpx;
	}
}
.goods-detail-tab .goods-details {
	padding: 20rpx 30rpx 140rpx;
	padding-bottom: calc(140rpx + constant(safe-area-inset-bottom)) !important;
	padding-bottom: calc(140rpx + env(safe-area-inset-bottom)) !important;
}
.goods-detail-tab .goods-details.active {
	width: auto;
}
</style>
