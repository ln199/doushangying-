<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 选择地址 -->
		<view class="address-box" v-if="orderPaymentData.exchange_info.type == 1">
			<view class="info-wrap" v-if="orderPaymentData.member_address" @click="selectAddress">
				<view class="icon-wrap"><text class="iconfont icondizhi"></text></view>
				<view class="content">
					<text class="name font-size-base">{{ orderPaymentData.member_address.name ? orderPaymentData.member_address.name : '' }}</text>
					<text class="font-size-base">{{ orderPaymentData.member_address.mobile ? orderPaymentData.member_address.mobile : '' }}</text>
					<text class="cell-more iconfont iconright"></text>
					<view class="desc-wrap">
						{{ orderPaymentData.member_address.full_address ? orderPaymentData.member_address.full_address : '' }}
						{{ orderPaymentData.member_address.address ? orderPaymentData.member_address.address : '' }}
					</view>
				</view>
			</view>
			<view class="empty-wrap" v-else @click="selectAddress">
				<view class="icon-wrap"><view class="iconfont icondizhi empty"></view></view>
				<view class="info">请设置收货地址</view>
				<view class="cell-more"><view class="iconfont iconright"></view></view>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body">
				<view class="goods-wrap">
					<block v-if="orderPaymentData.exchange_info.type == 2">
						<view class="goods-img">
							<image
								:src="orderPaymentData.exchange_info.image ? $util.img(orderPaymentData.exchange_info.image) : $util.img('upload/uniapp/point/coupon.png')"
								@error="imgError()"
								mode="aspectFill"
							></image>
						</view>
					</block>
					<block v-else-if="orderPaymentData.exchange_info.type == 3">
						<view class="goods-img">
							<image
								:src="orderPaymentData.exchange_info.image ? $util.img(orderPaymentData.exchange_info.image) : $util.img('upload/uniapp/point/hongbao.png')"
								@error="imgError()"
								mode="aspectFill"
							></image>
						</view>
					</block>
					<block v-else>
						<view class="goods-img"><image :src="$util.img(orderPaymentData.exchange_info.image)" @error="imgError()" mode="aspectFill"></image></view>
					</block>
					<view class="goods-info">
						<view class="goods-name">{{ orderPaymentData.exchange_info.name }}</view>
						<view class="goods-sub-section">
							<view v-if="orderPaymentData.exchange_info.pay_type == 1" class="color-base-text">
								<text class="goods-price">{{ orderPaymentData.exchange_info.point }}</text>
								<text class="unit">积分</text>
								<template v-if="orderPaymentData.exchange_info.price != '0.00'">
									<text class="unit">+{{ $lang('common.currencySymbol') }}</text>
									<text class="goods-price">{{ orderPaymentData.exchange_info.price }}</text>
								</template>
							</view>
							<view>
								<text class="font-size-tag">x</text>
								<text class="font-size-base">{{ orderPaymentData.num }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="site-footer">
				<view class="order-cell">
					<text class="tit">买家留言</text>
					<view class="box"><input type="text" placeholder="留言前建议先与商家协调一致" placeholder-class="color-tip" v-model="orderCreateData.buyer_message" /></view>
				</view>
			</view>
		</view>

		<!-- 金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">所需积分</text>
				<view class="box">
					<text class="money">{{ orderPaymentData.point }}</text>
					<text class="unit">积分</text>
				</view>
			</view>
		</view>

		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<text class="font-size-base color-tip margin-right">共{{ orderPaymentData.goods_num }}件</text>
				<text class="font-size-base">合计：</text>
				<text class="color-base-text money">{{ orderPaymentData.point }}</text>
				<text class="color-base-text unit">积分</text>
				<template v-if="orderPaymentData.exchange_info.pay_type == 1 && orderPaymentData.price != '0.00'">
					<text class="color-base-text unit">+{{ $lang('common.currencySymbol') }}</text>
					<text class="color-base-text money">{{ orderPaymentData.price | moneyFormat }}</text>
				</template>
			</view>
			<view class="submit-btn"><button type="primary" size="mini" @click="openChoosePayment()">提交订单</button></view>
		</view>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="orderPaymentData.price" @confirm="orderCreate"></ns-payment>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import payment from '../public/js/payment.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import nsPayment from '@/components/payment/payment.vue';

export default {
	components: {
		uniPopup,
		nsPayment
	},
	mixins: [payment, globalConfig]
};
</script>

<style lang="scss">
@import './../../../common/css/order_parment.scss';
</style>
<style scoped>
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
>>> .uni-popup__wrapper {
	border-radius: 20rpx 20rpx 0 0;
}
>>> .uni-popup {
	z-index: 8;
}
</style>
