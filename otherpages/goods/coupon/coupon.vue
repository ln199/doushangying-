<template>
	<view :data-theme="themeStyle">
		<view class="cf-container color-line-border">
			<view class="tab">
				<view @click="couponTabOn(0)"><text :class="couponTab == 0 ? 'color-base-text active color-base-border-bottom' : ''">店铺优惠劵</text></view>
				<view @click="couponTabOn(1)"><text :class="couponTab == 1 ? 'color-base-text active color-base-border-bottom' : ''">平台优惠劵</text></view>
			</view>
		</view>
		<view>
			<view>
				<mescroll-uni ref="mescroll" :top="80" @getData="getMemberCounponList" v-if="addonIsExit.coupon">
					<block slot="list">
						<view class="coupon-listone">
							<view
								class="item"
								v-for="(item, index) in list"
								:key="index"
								@click="liClick(item, index)"
								:style="{ backgroundColor: item.useState == 2 ? '#F2F2F2' : '#FFF2F0' }"
							>
								<view
									class="item-base"
									:style="{
										backgroundImage:
											'url(' + $util.img(item.useState == 2 ? '/upload/uniapp/coupon/bg_lingqu_gary.png' : '/upload/uniapp/coupon/bg_lingqu.png') + ')'
									}"
								>
									<view>
										<view class="use_price" v-if="!item.discount || item.discount == '0.00'">
											<text>￥</text>
											{{ parseInt(item.money) }}
										</view>
										<view class="use_price" v-else-if="item.type == 'discount'" :class="{ disabled: item.useState == 2 }">
											{{ parseFloat(item.discount) }}
											<text>折</text>
										</view>
										<view class="use_condition font-size-tag" v-if="item.at_least > 0" :class="{ disabled: item.useState == 2 }">
											满{{ item.at_least }}元可用
										</view>
										<view class="use_condition font-size-tag" v-else :class="{ disabled: item.useState == 2 }">无门槛优惠券</view>
										<block v-if="couponTab == 0">
											<view class="use_condition font-size-tag margin_top_none" v-if="item.goods_type == 1" :class="{ disabled: item.useState == 2 }">
												全场商品
											</view>
											<view class="use_condition font-size-tag margin_top_none" v-else :class="{ disabled: item.useState == 2 }">指定商品</view>
										</block>
										<block v-if="couponTab == 1">
											<view class="use_condition font-size-tag margin_top_none" v-if="item.use_scenario == 1" :class="{ disabled: item.useState == 2 }">
												全场店铺
											</view>
											<view class="use_condition font-size-tag margin_top_none" v-else :class="{ disabled: item.useState == 2 }">指定店铺</view>
										</block>
									</view>
								</view>
								<view class="item-info">
									<view class="use_title">
										<view class="title">{{ couponTab == 0 ? item.coupon_name : item.platformcoupon_name }}</view>
										<view v-if="couponTab == 0 && item.site_name" class="max_price">{{ item.site_name }}</view>
										<view class="max_price" v-if="item.discount_limit && item.discount_limit != '0.00'">(最大优惠{{ item.discount_limit }}元)</view>
									</view>
									<view class="use_time" v-if="item.validity_type">有效期：领取之日起{{ item.fixed_term }}日内有效</view>
									<view class="use_time" v-else>有效期：{{ $util.timeStampTurnTime(item.end_time) }}</view>
								</view>
								<view class="item-btn">
									<view v-if="item.useState == 0" @click.stop="receiveCoupon(item, index)">领取</view>
									<view v-if="item.useState == 1" @click.stop="toGoodsList(item, index)">去使用</view>
									<view v-if="item.useState == 2" :class="{ disabled: item.useState == 2 }">已抢光</view>
								</view>
							</view>
						</view>
						<view v-if="list.length == 0"><ns-empty text="暂无可领取的优惠券" :isIndex="!1" :fixed="!1"></ns-empty></view>
					</block>
				</mescroll-uni>
				<loading-cover ref="loadingCover"></loading-cover>
			</view>
		</view>
	</view>
</template>

<script>
import Config from 'common/js/config.js';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			couponTab: 0, //优惠券类型
			list: [],
			back: '/otherpages/goods/coupon/coupon'
		};
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if (!this.addonIsExit.coupon) {
			this.$util.showToast({
				title: '优惠券未启用',
				mask: true
			});
			setTimeout(() => {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			}, 1000);
		}
	},
	mixins: [globalConfig, Config],
	computed: {
		addonIsExit() {
			return this.$store.state.addonIsExit;
		}
	},
	methods: {
		liClick(item, index) {
			if (item.useState == 0) this.receiveCoupon(item, index);
			else this.toGoodsList(item, index);
		},
		//优惠券类型
		couponTabOn(index) {
			this.couponTab = index;
			this.list = [];
			this.$refs.mescroll.refresh(false);
		},
		//领取优惠券
		receiveCoupon(item, index) {
			if (this.couponBtnSwitch) return;
			this.couponBtnSwitch = true;
			let token = uni.getStorageSync('token');
			if (token != '') {
				var url,
					data = {
						site_id: item.site_id,
						get_type: 2 //获取方式:1订单2.直接领取3.活动领取
					};
				if (this.couponTab == 0) {
					url = '/coupon/api/coupon/receive';
					data.coupon_type_id = item.coupon_type_id;
				} else {
					url = '/platformcoupon/api/platformcoupon/receive';
					data.platformcoupon_type_id = item.platformcoupon_type_id;
				}
				this.$api.sendRequest({
					url,
					data,
					success: res => {
						var data = res.data;
						let msg = res.message;
						if (res.code == 0) {
							msg = '领取成功';
						}
						let list = this.list;
						if (this.couponTab == 0) {
							if (res.data.is_exist == 1) {
								for (let i = 0; i < list.length; i++) {
									if (list[i].coupon_type_id == item.coupon_type_id) {
										list[i].useState = 1;
									}
								}
							} else {
								for (let i = 0; i < list.length; i++) {
									if (list[i].coupon_type_id == item.coupon_type_id) {
										list[i].useState = 2;
									}
								}
							}
						} else {
							if (res.data.is_exist == 1) {
								for (let i = 0; i < list.length; i++) {
									if (list[i].platformcoupon_type_id == item.platformcoupon_type_id) {
										list[i].useState = 1;
									}
								}
							} else {
								for (let i = 0; i < list.length; i++) {
									if (list[i].platformcoupon_type_id == item.platformcoupon_type_id) {
										list[i].useState = 2;
									}
								}
							}
						}
						this.$util.showToast({
							title: msg
						});
						this.couponBtnSwitch = false;
					},
					fail: res => {
						this.couponBtnSwitch = false;
					}
				});
			} else {
				this.bindgetuserinfo();
			}
		},
		bindgetuserinfo() {
			if (this.$util.isWeiXin()) {
				let redirect_url = '';
				if (this.back) redirect_url = Config.h5Domain + '/pages/login/login/login?back=' + encodeURIComponent(this.back);
				else redirect_url = Config.h5Domain + '/pages/login/login/login';

				this.$api.sendRequest({
					url: '/wechat/api/wechat/authcode',
					data: {
						redirect_url
					},
					success: res => {
						if (res.code >= 0) {
							location.href = res.data;
						}
					}
				});
			} else {
				if (this.back)
					this.$util.redirectTo('/pages/login/login/login', {
						back: this.back
					});
				else this.$util.redirectTo('/pages/login/login/login');
			}
			this.couponBtnSwitch = false;
		},
		getMemberCounponList(mescroll) {
			var url;
			if (this.couponTab == 0) {
				url = '/coupon/api/coupon/typepagelists';
			} else {
				url = '/platformcoupon/api/platformcoupon/typepagelists';
			}
			this.$api.sendRequest({
				url: url,
				data: {
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					if (newArr.length) {
						newArr.forEach(v => {
							v.useState = 0;
						});
					}
					mescroll.endSuccess(newArr.length);
					if (newArr.length) {
						newArr.forEach(v => {
							if (v.count == v.lead_count) v.useState = 2;
							else v.useState = 0;
						});
					}
					//设置列表数据
					if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//去使用优惠券
		toGoodsList(item) {
			if (this.couponTab == 0) {
				if (item.goods_type != 1) {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						couponId: item.coupon_type_id,
						site_id: item.site_id
					});
				} else {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						site_id: item.site_id
					});
				}
			} else {
				if (item.use_scenario != 1) {
					this.$util.redirectTo('/pages/goods/list/list', {
						platformcouponTypeId: item.platformcoupon_type_id
					});
				} else {
					this.$util.redirectTo('/pages/goods/list/list', {});
				}
			}
		}
	},
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var title = '送您一张优惠券,快来领取吧';
		var path = '/otherpages/goods/coupon/coupon';
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
.coupon-listone {
	margin: 0 30rpx;

	.item {
		display: flex;
		background-color: #fff2f0;
		background-size: 100% 100%;
		border-radius: 20rpx;
		align-items: stretch;
		margin-top: $padding;
		overflow: hidden;

		.item-base {
			position: relative;
			width: 197rpx;
			min-width: 197rpx;
			text-align: center;
			background-image: linear-gradient(to right top, #fc6831, #ff4544);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			padding: 38rpx 10rpx 38rpx 18rpx;

			> view {
				height: auto;
				position: relative;
				top: 50%;
				transform: translate(0, -50%);
			}

			.use_price {
				font-size: 60rpx;
				line-height: 1;
				color: #fff;

				text {
					font-size: $font-size-toolbar;
				}

				&.disabled {
					color: $color-tip;
				}
			}

			.use_condition {
				color: #fff;
				margin-top: $padding;

				&.margin_top_none {
					margin-top: 0;
				}

				&.disabled {
					color: $color-tip;
				}
			}

			&::after {
				position: absolute;
				content: '';
				background-color: #ffffff;
				left: 0;
				top: 50%;
				transform: translate(0, -50%);
				height: 30rpx;
				width: 15rpx;
				border-radius: 0 15px 15px 0;
			}
		}

		.item-btn {
			width: 160rpx;
			min-width: 160rpx;
			align-self: center;
			position: relative;

			view {
				width: 100rpx;
				height: 50rpx;
				border-radius: 50rpx;
				line-height: 50rpx;
				margin: auto;
				text-align: center;
				background-image: linear-gradient(to right, #fc6831, #ff4544);
				color: #fff;
				font-size: $font-size-tag;

				&.disabled {
					background: #dedede !important;
					color: #909399 !important;
				}
			}

			&::after {
				position: absolute;
				content: '';
				background-color: #ffffff;
				right: 0;
				top: 50%;
				transform: translate(0, -50%);
				height: 30rpx;
				width: 15rpx;
				border-radius: 15px 0 0 15px;
			}
		}

		.item-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			overflow: hidden;
			background-repeat-x: no-repeat;
			background-repeat-y: repeat;

			.use_time {
				padding: 20rpx 0;
				border-top: 1px dashed #cccccc;
				font-size: $font-size-activity-tag;
				color: #909399;
			}

			.use_title {
				font-size: $font-size-base;
				font-weight: 500;
				padding: 20rpx 0;

				.title {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.max_price {
					font-weight: 400;
					font-size: $font-size-tag;
				}
			}
		}
	}
}

.cf-container {
	background: #fff;
	overflow: hidden;
	border-bottom: 2rpx solid;
	padding: 10rpx 0;
}

.tab {
	display: flex;
	justify-content: center;

	> view {
		text-align: center;
		width: 40%;

		text {
			display: inline-block;
			line-height: 66rpx;
		}
	}

	.active {
		border-bottom: 4rpx solid;
	}
}

.tabs-box {
	overflow: hidden;
}

.coupon-tab {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-top: 10rpx;
	position: fixed;
	top: 0;

	.tab-item {
		height: 70rpx;
		// color: $color-base-text-black;
		line-height: 70rpx;
		box-sizing: border-box;
	}

	.tab-item.active {
		position: relative;
	}

	.tab-item.active::after {
		content: '';
		display: inline-block;
		width: 100%;
		height: 6rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		background: #ffffff;
		border-radius: 3rpx;
	}

	.tab-item:nth-child(1) {
		margin-right: 25%;
	}
}

.empty {
	margin-top: 200rpx;
}
</style>
