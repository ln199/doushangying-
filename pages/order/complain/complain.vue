<template>
	<view :data-theme="themeStyle">
		<block v-if="!complainData.complain_info || action == 'apply'">
			<view class="goods-wrap">
				<view class="goods-img">
					<image
						:src="$util.img(complainData.order_goods_info.sku_image, { size: 'mid' })"
						@error="complainData.order_goods_info.sku_image = $util.getDefaultImage().default_goods_img"
						mode="aspectFill"
						:lazy-load="true"
					></image>
				</view>
				<view class="goods-info">
					<view class="goods-name">{{ complainData.order_goods_info.sku_name }}</view>
				</view>
			</view>

			<view class="refund-form">
				<view class="item-wrap" @click="openPopup('refundReasonPopup')">
					<view class="label">退款原因</view>
					<view class="cont">
						<text class="color-tip" v-if="!complain_reason.length">请选择</text>
						<text class="color-tip" v-else>{{ complain_reason }}</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="item-wrap">
					<view class="label">退款金额</view>
					<view class="cont color-base-text">{{ $lang('common.currencySymbol') }}{{ complainData.refund_money }}</view>
				</view>
				<view class="item-wrap"><view class="label">退款说明</view></view>
				<!-- #ifdef MP-WEIXIN -->
				<textarea
					v-if="!showText"
					class="newText"
					value=""
					placeholder="请输入退款说明(选填)"
					placeholder-class="color-tip font-size-base"
					:auto-height="true"
					v-model="complain_remark"
				/>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<textarea
					class="newText"
					value=""
					placeholder="请输入退款说明(选填)"
					@blur="textBlur()"
					placeholder-class="color-tip font-size-base"
					:auto-height="true"
					v-model="complain_remark"
				/>
				<!-- #endif -->
			</view>
			<view class="sub-btn safe-area" @click="submit">
				<button type="primary">{{ $lang('common.submit') }}</button>
			</view>

			<uni-popup ref="refundReasonPopup" type="bottom" @change="change($event)">
				<view class="refund-reason-popup popup">
					<view class="popup-header">
						<view><text class="tit">退款原因</text></view>
						<view class="align-right" @click="closePopup('refundReasonPopup')"><text class="iconfont iconguanbi color-tip"></text></view>
					</view>
					<scroll-view scroll-y="true" class="popup-body">
						<view class="reason-list">
							<view class="item" v-for="(item, index) in complainData.refund_reason_type" :key="index" @click="changeReason(item)">
								<view class="reason">{{ item }}</view>
								<view class="iconfont" :class="complain_reason == item ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view>
							</view>
						</view>
					</scroll-view>
					<view class="popup-footer"><view class="confirm-btn color-base-bg" @click="closePopup('refundReasonPopup')">确定</view></view>
				</view>
			</uni-popup>
		</block>

		<block v-else>
			<view v-show="action == ''">
				<view class="status-wrap">
					<view class="status-name">{{ detail.complain_status_name }}</view>
				</view>
				<view class="history-wrap" v-if="detail.complain_status == -1 && detail.complain_refuse_reason">
					<view>
						<text>{{ '拒绝原因：' + detail.complain_refuse_reason }}</text>
					</view>
				</view>

				<view class="history-wrap" @click="switchAction('consultrecord')">
					<view>协商记录</view>
					<text class="iconfont iconright"></text>
				</view>

				<view class="refund-info">
					<view class="header">退款信息</view>
					<view class="body">
						<!-- 商品信息 -->
						<view class="goods-wrap">
							<view class="goods-img" @click="refundDetail(detail.order_goods_id)">
								<image
									:src="$util.img(detail.sku_image, { size: 'mid' })"
									@error="detail.sku_image = $util.getDefaultImage().default_goods_img"
									mode="aspectFill"
									:lazy-load="true"
								/>
							</view>
							<view class="goods-info">
								<view class="goods-name" @click="refundDetail(detail.order_goods_id)">{{ detail.sku_name }}</view>
								<view class="goods-sub-section">
									<view>
										<text class="refund-price">
											<text>退款：</text>
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											<text>{{ detail.complain_apply_money }}</text>
										</text>
									</view>
								</view>
							</view>
						</view>
						<!-- 退款信息 -->
						<view class="info">
							<view class="cell">退款原因：{{ detail.complain_reason }}</view>
							<view class="cell">退款金额：{{ $lang('common.currencySymbol') }}{{ detail.complain_apply_money }}</view>
							<view class="cell">退款编号：{{ detail.complain_no }}</view>
							<view class="cell">申请时间：{{ $util.timeStampTurnTime(detail.complain_apply_time) }}</view>
							<view class="cell" v-if="detail.complain_time">退款时间：{{ $util.timeStampTurnTime(detail.complain_time) }}</view>
						</view>
					</view>
				</view>

				<view class="footer-operation bottom-safe-area" v-if="detail.complain_action.length">
					<view
						class="operation-btn color-base-bg white"
						v-for="(actionItem, actionIndex) in detail.complain_action"
						:key="actionIndex"
						@click="refundAction(actionItem.event)"
					>
						{{ actionItem.title }}
					</view>
				</view>
			</view>

			<view v-show="action == 'consultrecord'">
				<view class="record-wrap">
					<view
						class="record-item"
						:class="{ buyer: logItem.action_way == 1, seller: logItem.action_way == 2, platform: logItem.action_way == 3 }"
						v-for="(logItem, logIndex) in detail.refund_log_list"
						:key="logIndex"
					>
						<view class="cont">
							<view class="head">
								<text v-if="logItem.action_way == 1">买家</text>
								<text v-else-if="logItem.action_way == 2">卖家</text>
								<text v-else-if="logItem.action_way == 3">平台</text>
								<text class="time">{{ $util.timeStampTurnTime(logItem.action_time) }}</text>
							</view>
							<view class="body">
								<text>{{ logItem.action }}</text>
							</view>
						</view>
					</view>
					<view class="empty-box"></view>
				</view>
				<view class="history-bottom bottom-safe-area">
					<block v-if="addonIsExit.servicer">
						<!-- #ifdef MP-WEIXIN -->
						<button type="default" hover-class="none" open-type="contact"></button>
						<!-- #endif -->
						<view>
							<text class="iconfont iconziyuan"></text>
							<text>联系客服</text>
						</view>
					</block>
					<block v-else>
						<view @click="goConnect">
							<text class="iconfont iconziyuan"></text>
							<text>联系客服</text>
						</view>
					</block>
					<view @click="switchAction('')">返回详情</view>
				</view>
			</view>
		</block>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import globalConfig from 'common/js/golbalConfig.js';

export default {
	components: {
		uniPopup
	},
	data() {
		return {
			complainData: {
				order_goods_info: {
					sku_image: '',
					sku_name: ''
				}
			},
			detail: {
				sku_image: ''
			},
			complain_reason: '',
			complain_remark: '',
			action: '',
			showText: false //是否展示退款说明，解决原生小程序textarea层级过高  popup不能遮挡的问题
		};
	},
	mixins: [globalConfig],
	onLoad(option) {
		if (option.order_goods_id) this.order_goods_id = option.order_goods_id;
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		if (uni.getStorageSync('token')) {
			this.getComplainData();
		} else {
			this.$util.redirectTo('/pages/login/login/login', { back: '/pages/order/complain/complain?order_goods_id=' + this.order_goods_id });
		}
	},
	computed: {
		good_image() {
			if (this.complainData.order_goods_info.sku_image) {
				return this.$util.img(this.complainData.order_goods_info.sku_image, { size: 'mid' });
			} else {
				return this.$util.getDefaultImage().default_goods_img;
			}
		}
	},
	methods: {
		//联系客服
		goConnect() {
			let that = this;
			if (uni.getStorageSync('token')) {
				let data = {
					site_id: that.shopInfo.site_id,
					sku_id: that.goodsSkuDetail.sku_id
				};
				that.$util.redirectTo('/otherpages/chat/room/room', data);
			} else {
				that.$util.redirectTo('/pages/login/login/login');
			}
		},
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
		getComplainData() {
			this.$api.sendRequest({
				url: '/api/ordercomplain/detail',
				data: {
					order_goods_id: this.order_goods_id
				},
				success: res => {
					if (res.code >= 0) {
						this.complainData = res.data;
						this.detail = this.complainData.complain_info;
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
					url: '/api/ordercomplain/complain',
					data: {
						order_goods_id: this.order_goods_id,
						complain_reason: this.complain_reason,
						complain_remark: this.complain_remark
					},
					success: res => {
						this.$util.showToast({ title: res.message });
						if (res.code >= 0) {
							this.getComplainData();
							this.$forceUpdate();
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
			if (this.complain_reason == '') {
				this.$util.showToast({ title: '请选择退款原因' });
				return false;
			}
			return true;
		},
		changeReason(complain_reason) {
			this.complain_reason = complain_reason;
		},
		/**
		 * 切换操作
		 */
		switchAction(action) {
			this.action = action;
		},
		refundAction(event) {
			switch (event) {
				case 'complainCancel':
					uni.showModal({
						content: '是否撤销本次维权?',
						cancelText: '暂不撤销',
						cancelColor: '#898989',
						success: res => {
							if (res.confirm) {
								this.$api.sendRequest({
									url: '/api/ordercomplain/cancel',
									data: {
										order_goods_id: this.order_goods_id
									},
									success: res => {
										if (res.code >= 0) {
											this.$util.showToast({ title: '撤销成功' });
											setTimeout(() => {
												this.$util.redirectTo('/pages/order/list/list');
											}, 1000);
										}
									}
								});
							}
						}
					});
					break;
				case 'complainApply':
					this.action = 'apply';
					break;
			}
		},
		//监听弹出层是否弹出
		change(e) {
			if(e) this.showText = e.show;
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
@import '../public/css/complain.scss';
</style>
<style scoped>
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
</style>
