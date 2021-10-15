<template>
	<view :data-theme="themeStyle">
		<scroll-view scroll-y="true" class="refund-container">
			<view class="goods-wrap">
				<view class="goods-img">
					<image
						:src="$util.img(refund_data.order_goods_info.sku_image, { size: 'mid' })"
						@error="refund_data.order_goods_info.sku_image = $util.getDefaultImage().default_goods_img"
						mode="aspectFill"
						:lazy-load="true"
					></image>
				</view>
				<view class="goods-info">
					<view class="goods-name">{{ refund_data.order_goods_info.sku_name }}</view>
				</view>
			</view>

			<view class="refund-option" v-show="!refund_type">
				<view class="option-item" @click="selectRefundType(1)">
					<view>
						<text>退款无需退货</text>
						<text class="font-size-tag color-title">没收到货，或与卖家协商同意无需退货只退款</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="option-item" @click="selectRefundType(2)" v-if="refund_data.refund_type.length == 2">
					<view>
						<text>退货退款</text>
						<text class="font-size-tag color-title">已收到货，需退还收到的货物</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
			</view>

			<view v-show="refund_type">
				<view class="refund-form">
					<view class="item-wrap" @click="openPopup('refundReasonPopup')">
						<view class="label">退款原因：</view>
						<view class="cont">
							<text class="color-title" v-if="!refund_reason.length">请选择</text>
							<text class="color-title" v-else>{{ refund_reason }}</text>
						</view>
						<text class="iconfont iconright"></text>
					</view>
					<view class="item-wrap">
						<view class="label">退款金额：</view>
						<view class="cont color-base-text">{{ $lang('common.currencySymbol') }}{{ refund_data.refund_money }}<text class="font-size-activity-tag margin-left" v-if="refund_data.refund_delivery_money>0">（含运费￥{{refund_data.refund_delivery_money }})</text></view>
					</view>
					<view class="item-wrap"><view class="label active">退款说明</view></view>

					<!-- #ifdef MP-WEIXIN -->
					<textarea
						v-if="!showText"
						class="newText"
						value=""
						placeholder="请输入退款说明(选填)"
						placeholder-class="color-title font-size-base"
						:auto-height="true"
						v-model="refund_remark"
					/>
					<!-- #endif -->
					<!-- #ifdef H5 || APP-PLUS -->
					<textarea
						class="newText"
						value=""
						placeholder="请输入退款说明(选填)"
						@blur="textBlur()"
						placeholder-class="color-title font-size-base"
						:auto-height="true"
						v-model="refund_remark"
					/>
					<!-- #endif -->
				</view>

				<!-- 	<view class="sub-btn color-base-bg" :class="{ 'safe-area': isIphoneX }" @click="submit">{{ $lang('common.submit') }}</view> -->
				<view class="sub-btn" :class="{ 'safe-area': isIphoneX }" @click="submit">
					<button type="primary">{{ $lang('common.submit') }}</button>
				</view>
			</view>

			<uni-popup ref="refundReasonPopup" type="bottom" @change="change()">
				<view class="refund-reason-popup popup">
					<view class="popup-header">
						<view><text class="tit">退款原因</text></view>
						<view class="align-right" @click="closePopup('refundReasonPopup')"><text class="iconfont iconguanbi color-title"></text></view>
					</view>
					<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
						<view class="reason-list">
							<view class="item" v-for="(item, index) in refund_data.refund_reason_type" :key="index" @click="changeReason(item)">
								<view class="reason">{{ item }}</view>
								<view class="iconfont" :class="refund_reason == item ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view>
							</view>
						</view>
					</scroll-view>
					<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
						<view class="confirm-btn color-base-bg" @click="closePopup('refundReasonPopup')">确定</view>
					</view>
				</view>
			</uni-popup>
		</scroll-view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	components: {
		uniPopup
	},
	mixins: [globalConfig],
	data() {
		return {
			order_goods_id: '',
			refund_type: '',
			refund_reason: '',
			refund_remark: '',
			isIphoneX: false,
			refund_data: {
				refund_type: [],
				order_goods_info: {
					sku_image: ''
				}
			},
			isSub: false,
			showText: false //是否展示退款说明，解决原生小程序textarea层级过高  popup不能遮挡的问题
		};
	},
	onLoad(option) {
		if (option.order_goods_id) this.order_goods_id = option.order_goods_id;
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		if (uni.getStorageSync('token')) {
			this.getRefundData();
		} else {
			this.$util.redirectTo('/pages/login/login/login', { back: '/otherpages/order/refund/refund?order_goods_id=' + this.order_goods_id });
		}
	},
	methods: {
		/**
		 * 显示弹出层
		 * @param {Object} ref
		 */
		openPopup(ref) {
			this.$refs[ref].open();
		},
		/**
		 * 关闭弹出层
		 * @param {Object} ref
		 */
		closePopup(ref) {
			this.$refs[ref].close();
		},
		textBlur() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
		},
		/**
		 * 选择退款方式
		 * @param {Object} type
		 */
		selectRefundType(type) {
			this.refund_type = type;
		},
		getRefundData() {
			this.$api.sendRequest({
				url: '/api/orderrefund/refundData',
				data: {
					order_goods_id: this.order_goods_id
				},
				success: res => {
					if (res.code >= 0) {
						this.refund_data = res.data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({ title: '未获取到该订单项退款信息' });
						setTimeout(() => {
							this.$util.redirectTo('/pages/order/list/list');
						}, 1000);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		submit() {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;
				this.$api.sendRequest({
					url: '/api/orderrefund/refund',
					data: {
						order_goods_id: this.order_goods_id,
						refund_type: this.refund_type,
						refund_reason: this.refund_reason,
						refund_remark: this.refund_remark
					},
					success: res => {
						this.$util.showToast({ title: res.message });
						if (res.code >= 0) {
							this.$util.redirectTo('/pages/order/activist/activist');
						} else {
							this.isSub = false;
						}
					},
					fail: res => {
						this.isSub = false;
					}
				});
			}
		},
		verify() {
			if (this.refund_reason == '') {
				this.$util.showToast({ title: '请选择退款原因' });
				return false;
			}
			return true;
		},
		changeReason(refund_reason) {
			this.refund_reason = refund_reason;
		},
		change(e) {
			if (e) this.showText = e.show;
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/refund.scss';
</style>
<style scoped>
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
</style>
