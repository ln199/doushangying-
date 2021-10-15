<template>
	<view :data-theme="themeStyle">
		<scroll-view scroll-y="true" class="detail-container" :class="{ 'safe-area': isIphoneX }">
			<view v-show="action == ''">
				<view class="status-wrap">
					<view class="status-name">{{ detail.refund_status_name }}</view>
					<view class="refund-explain" v-if="detail.refund_status == 1">
						<view class="font-size-tag color-tip">如果商家拒绝，你可重新发起申请</view>
						<view class="font-size-tag color-tip">如果商家同意，将通过申请并退款给你</view>
						<view class="font-size-tag color-tip">如果商家逾期未处理，平台将自动通过申请并退款给你</view>
					</view>
					<view class="refund-explain" v-if="detail.refund_status == 5">
						<view class="font-size-tag color-tip">如果商家确认收货将会退款给你</view>
						<view class="font-size-tag color-tip">如果商家拒绝收货，该次退款将会关闭，你可以重新发起退款</view>
					</view>
				</view>

				<view class="history-wrap" v-if="detail.refund_status==-1&&detail.refund_refuse_reason">
					<view>拒绝原因：<text>{{detail.refund_refuse_reason}}</text></view>
				</view>

				<view class="history-wrap" @click="switchAction('consultrecord')">
					<view>协商记录</view>
					<text class="iconfont iconright"></text>
				</view>

				<view class="refund-address-wrap" v-if="detail.refund_status == 4">
					<text>退货地址：{{ detail.shop_address }}</text>
					<view class="copy" @click="$util.copy(detail.shop_address)">复制</view>
				</view>

				<view class="refund-info">
					<view class="header">退款信息</view>
					<view class="body">
						<!-- 商品信息 -->
						<view class="goods-wrap">
							<view class="goods-img" @click="refundDetail(detail.order_goods_id)">
								<image :src="$util.img(detail.sku_image, { size: 'mid' })" @error="imgError()" mode="aspectFill" :lazy-load="true"></image>
							</view>
							<view class="goods-info">
								<view class="goods-name" @click="refundDetail(detail.order_goods_id)">{{ detail.sku_name }}</view>
								<view class="goods-sub-section">
									<view>
										<text class="refund-price">
											<text>退款：</text>
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											<text>{{ detail.refund_apply_money }}</text>
											<text class="font-size-activity-tag margin-left color-base-text" v-if="detail.refund_delivery_money>0">（含运费￥{{detail.refund_delivery_money }})</text>
										</text>
									</view>
								</view>
							</view>
						</view>
						<!-- 退款信息 -->
						<view class="info">
							<view class="cell">退款方式：{{ detail.refund_type == 1 ? '仅退款' : '退款退货' }}</view>
							<view class="cell">退款原因：{{ detail.refund_reason }}</view>
							<view class="cell">退款金额：{{ $lang('common.currencySymbol') }}{{ detail.refund_apply_money }}</view>
							<view class="cell">退款编号：{{ detail.refund_no }}</view>
							<view class="cell">申请时间：{{ $util.timeStampTurnTime(detail.refund_action_time) }}</view>
							<view class="cell" v-if="detail.refund_time">退款时间：{{ $util.timeStampTurnTime(detail.refund_time) }}</view>
						</view>
					</view>
				</view>

				<view class="operation" :class="{ 'bottom-safe-area': isIphoneX }" v-if="detail.refund_action.length">
					<view class="order-box-btn" v-for="(actionItem, actionIndex) in detail.refund_action" :key="actionIndex" @click="refundAction(actionItem.event)">
						{{ actionItem.title }}
					</view>
					<navigator hover-class="none" class="order-box-btn" :url="'/pages/order/complain/complain?order_goods_id=' + detail.order_goods_id"
					 v-if="detail.complain_action">
						<text>平台维权</text>
					</navigator>
				</view>
			</view>

			<view v-show="action == 'returngoods'">
				<view class="return-goods-container">
					<view class="form-wrap">
						<view class="item">
							<view class="label">物流公司</view>
							<view class="cont">
								<input type="text" value="" placeholder="请输入物流公司" class="input" placeholder-class="input-placeholder color-tip"
								 v-model="formData.refund_delivery_name" />
							</view>
						</view>
						<view class="item">
							<view class="label">物流单号</view>
							<view class="cont">
								<input type="text" value="" placeholder="请输入物流单号" class="input" placeholder-class="input-placeholder color-tip"
								 v-model="formData.refund_delivery_no" />
							</view>
						</view>
						<view class="item">
							<view class="label">物流说明</view>
							<view class="cont">
								<textarea value="" placeholder-class="color-tip font-size-base" :auto-height="true" class="textarea"
								 placeholder="选填" v-model="formData.refund_delivery_remark" />
								</view>
						</view>
					</view>
					<button type="primary" class="sub-btn" @click="refurnGoods">提交</button>
				</view>
			</view>

			<view v-show="action == 'consultrecord'">
				<view class="record-wrap">
					<view class="record-item" :class="logItem.action_way == 1 ? 'buyer' : 'seller'" v-for="(logItem, logIndex) in detail.refund_log_list" :key="logIndex">
						<view class="cont">
							<view class="head">
								<text>{{ logItem.action_way == 1 ? '买家' : '卖家' }}</text>
								<text class="time">{{ $util.timeStampTurnTime(logItem.action_time) }}</text>
							</view>
							<view class="body">
								<text>{{ logItem.action }}</text>
							</view>
						</view>
					</view>
					<view class="empty-box"></view>
				</view>
				<view class="history-bottom" :class="{ 'bottom-safe-area': isIphoneX }">
						<view v-if="kefuConfig.type == 'system' && addonIsExit.servicer" @click="goConnect">
							<text class="iconfont iconziyuan"></text>
							<text>联系客服</text>
						</view>
					<view @click="switchAction('')">返回详情</view>
				</view>
			</view>
		</scroll-view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import refundMethod from '../public/js/refundMethod.js';
import validate from 'common/js/validate.js';
import globalConfig from 'common/js/golbalConfig.js'

export default {
	data() {
		return {
			order_goods_id: '',
			detail: {
				refund_action: []
			},
			isIphoneX: false,
			action: '',
			kefuConfig: {
				weapp: '',
				system: '',
				open: '',
				open_url: ''
			},
			formData: {
				refund_delivery_name: '',
				refund_delivery_no: '',
				refund_delivery_remark: '' 
			},
			isSub: false
		};
	},
	mixins: [refundMethod,globalConfig],
	onLoad(option) {
		if (option.order_goods_id) this.order_goods_id = option.order_goods_id;
		if (option.action) this.action = option.action;
		this.isIphoneX=this.$util.uniappIsIPhoneX()
	},
	computed: {
		// 使用对象展开运算符将此对象混入到外部对象中
		themeStyle(){
			return 'theme-'+this.$store.state.themeStyle
		},
		addonIsExit(){
			return this.$store.state.addonIsExit
		} 
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		
		if (uni.getStorageSync('token')) {
			this.getRefundDetail();
		} else {
			this.$util.redirectTo('/pages/login/login/login', { back: '/otherpages/order/refund_detail/refund_detail?order_goods_id=' + this.order_goods_id });
		}
		this.getKekuConfig();
	},
	methods: {
		//联系客服
		goConnect() {
			if (uni.getStorageSync('token')) {
				let data = {
					site_id:this.detail.site_id,
					order_id:this.detail.order_id,
				};
				this.$util.redirectTo('/otherpages/chat/room/room', data)
				return false;
			} else {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.orderData.sku_id);
				return;
			}
		},
		
		getKekuConfig() {
			this.$api.sendRequest({
				url: '/api/config/servicer',
				success: res => {
					if (res.code == 0) {
						this.kefuConfig = res.data;
						if (this.kefuConfig.system && !this.addonIsExit.servicer) this.kefuConfig.system = 0;
					}
				}
			});
		},
		getRefundDetail() {
			this.$api.sendRequest({
				url: '/api/orderrefund/detail',
				data: {
					order_goods_id: this.order_goods_id
				},
				success: res => {
					if (res.code >= 0) {
						this.detail = res.data;
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
		refundAction(event) {
			switch (event) {
				case 'orderRefundCancel':
					this.cancleRefund(this.detail.order_goods_id, res => {
						if (res.code >= 0) {
							this.$util.showToast({ title: '撤销成功' });
							setTimeout(() => {
								this.$util.redirectTo('/pages/order/list/list');
							}, 1000);
						}
					});
					break;
				case 'orderRefundDelivery':
					this.action = 'returngoods';
					break;
				case 'orderRefundAsk':
					this.$util.redirectTo('/otherpages/order/refund/refund', { order_goods_id: this.detail.order_goods_id });
					break;
			}
		},
		refurnGoods() {
			var rule = [
				{ name: 'refund_delivery_name', checkType: 'required', errorMsg: '请输入物流公司' },
				{ name: 'refund_delivery_no', checkType: 'required', errorMsg: '请输入物流单号' }
			];
			this.formData.order_goods_id = this.order_goods_id;
			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				if (this.isSub) return;
				this.isSub = true;
				this.$api.sendRequest({
					url: '/api/orderrefund/delivery',
					data: this.formData,
					success: res => {
						if (res.code == 0) {
							this.action = '';
							this.getRefundDetail();
						} else {
							this.$util.showToast({ title: res.message });
						}
					}
				});
			} else {
				this.$util.showToast({ title: validate.error });
				return false;
			}
		},
		/**
		 * 切换操作
		 */
		switchAction(action){
			this.action = action;
		},
		imgError() {
			this.detail.sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		refundDetail(id) {
			this.$util.redirectTo('/pages/goods/detail/detail', {
				sku_id: id
			});
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/refund_detail.scss';
</style>
