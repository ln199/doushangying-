<template>
	<view class="balance" :data-theme="themeStyle">
		<view class="balance-wrap">
			<view class="balance-top">
				<view class="balance-num">
					<view class="balance-tips balance-title">
						<text>{{ $lang('accountBalance') }}{{ $lang('money') }}</text>
					</view>
					<view class="all-alance">{{ (parseFloat(balanceInfo.balance) + parseFloat(balanceInfo.balance_money)).toFixed(2) }}</view>
				</view>
			</view>

			<block v-if="Development">
				<view class="balance_other">
					<view class="balance_allow">
						<view>{{ $lang('ableAccountBalance') }} {{ $lang('money') }}</view>
						<view class="font-size-toolbar">{{ balanceInfo.balance_money }}</view>
					</view>
					<view class="balance-split"></view>
					<view class="balance_unallow">
						<view>{{ $lang('noAccountBalance') }} {{ $lang('money') }}</view>
						<view class="font-size-toolbar">{{ balanceInfo.balance }}</view>
					</view>
				</view>
			</block>
		</view>

		<block v-if="Development">
			<view class="action_recode">
				<view @click="toBalanceDetail">
					<image :src="$util.img('upload/uniapp/member/balance_detail/recharge_detail.png')"></image>
					<text>{{ $lang('balanceDetailed') }}</text>
					<text class="iconfont iconright"></text>
				</view>
				<view v-if="addonIsExit.memberrecharge && memberrechargeConfig && memberrechargeConfig.is_use" @click="toOrderList">
					<image :src="$util.img('upload/uniapp/member/balance_detail/recharge_recode.png')"></image>
					<text>{{ $lang('rechargeRecord') }}</text>
					<text class="iconfont iconright"></text>
				</view>
			</view>
		</block>

		<block v-if="Development">
			<view class="action">
				<view @click="toList" class="recharge-withdraw color-base-bg" v-if="addonIsExit.memberrecharge && memberrechargeConfig && memberrechargeConfig.is_use">
					{{ $lang('recharge') }}
				</view>
				<view class="withdraw color-base-border color-base-text" v-if="addonIsExit.memberwithdraw && withdrawConfig && withdrawConfig.is_use" @click="toWithdrawal">
					{{ $lang('withdrawal') }}
				</view>
			</view>
		</block>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			balanceInfo: {
				balance: 0,
				balance_money: 0
			},
			withdrawConfig: null,
			memberrechargeConfig: null
		};
	},
	mixins: [globalConfig],
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if (!uni.getStorageSync('token')) {
			this.$refs.login.open('/otherpages/member/balance/balance');
		}
		this.getUserInfo();
		this.getWithdrawConfig();
		this.getMemberrechargeConfig();
	},
	methods: {
		toWithdrawal() {
			this.$util.redirectTo('/otherpages/member/apply_withdrawal/apply_withdrawal');
		},
		toOrderList() {
			this.$util.redirectTo('/otherpages/recharge/order_list/order_list');
		},
		toBalanceDetail() {
			this.$util.redirectTo('/otherpages/member/balance_detail/balance_detail');
		},
		toList() {
			this.$util.redirectTo('/otherpages/recharge/list/list');
		},
		//获取余额信息
		getUserInfo() {
			this.$api.sendRequest({
				url: '/api/memberaccount/info',
				data: {
					account_type: 'balance,balance_money'
				},
				success: res => {
					if (res.data) {
						this.balanceInfo = res.data;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/**
		 * 获取余额提现配置
		 */
		getWithdrawConfig() {
			this.$api.sendRequest({
				url: '/api/memberwithdraw/config',
				success: res => {
					if (res.code >= 0 && res.data) {
						this.withdrawConfig = res.data;
					}
				}
			});
		},
		/**
		 * 获取充值提现配置
		 */
		getMemberrechargeConfig() {
			this.$api.sendRequest({
				url: '/memberrecharge/api/memberrecharge/config',
				success: res => {
					if (res.code >= 0 && res.data) {
						this.memberrechargeConfig = res.data;
					}
				}
			});
		}
	},
	onBackPress(options) {
		if (options.from === 'navigateBack') {
			return false;
		}
		this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
		return true;
	}
};
</script>

<style lang="scss">
page {
	padding: 20rpx 30rpx 0;
}

.balance-wrap {
	border-radius: 10rpx;
	width: 100%;
	padding: 52rpx 30rpx 40rpx;
	box-sizing: border-box;

	.balance-top {
		.balance-tips {
			display: flex;
			align-items: center;

			text {
				font-size: $font-size-base;
				font-weight: 500;
				color: #ffffff;
				line-height: 1;
				margin-right: 10rpx;
			}

			image {
				width: 30rpx;
				height: 19rpx;
			}

			.iconyincang {
				vertical-align: middle;
				font-size: 40rpx;
			}
		}

		.all-alance {
			font-size: 50rpx;
			line-height: 1;
			color: #ffffff;
			margin-top: 33rpx;
		}

		.withdraw-btn {
			height: 54rpx;
			line-height: 54rpx;

			border-radius: 100rpx 0 0 100rpx;
			padding: 2rpx 40rpx;
			position: absolute;
			right: 0;
			background: #ff4544;
			color: #fff !important;
		}

		.all-alance {
			line-height: 1;
			font-size: 50rpx;
			font-weight: 500;
		}
	}

	.balance-bottom {
		flex: 2;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-right: 104rpx;

		.balance-bottom-item {
			display: flex;
			flex-direction: column;
			justify-content: center;

			.balance-title {
				font-size: $font-size-base;
				margin-bottom: 10rpx;
				font-weight: 500;
				color: $color-tip;
			}

			.balance {
				line-height: 1;
				font-size: $font-size-toolbar;
				color: #ffffff;
			}
		}
	}
}

.balance_other {
	display: flex;
	margin-top: 76rpx;
	align-items: center;

	.balance_allow,
	.balance_unallow {
		view:first-child {
			font-size: $font-size-base;
			color: #ffffff;
			line-height: 1;
		}

		view:last-child {
			color: #ffffff;
			line-height: 1;
			margin-top: 20rpx;
		}
	}

	.balance-split {
		width: 1rpx;
		height: 47rpx;
		background-color: #ffffff;
		margin-left: 96rpx;
		margin-right: 64rpx;
	}
}

.action_recode {
	margin-top: 20rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	padding: 0 30rpx;

	> view {
		padding: 22rpx 0;
		display: flex;
		align-items: center;
		position: relative;

		&:first-child {
			border-bottom: 1px solid #eeeeee;
		}

		image {
			width: 55rpx;
			height: 55rpx;
			margin-right: 14rpx;
		}

		text {
			color: $color-title;
		}

		text.iconfont {
			position: absolute;
			font-size: $font-size-base;
			color: $color-tip;
			right: 0;
		}
	}
}

.action {
	position: fixed;
	bottom: 44rpx;
	padding-bottom: constant(safe-area-inset-bottom); //兼容IOS < 11.2
	padding-bottom: env(safe-area-inset-bottom); //兼容IOS > 11.2
	width: calc(100% - 60rpx);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 100rpx;
	padding-bottom: 30rpx;

	.recharge {
		color: #ffffff;
		width: 80%;
		border-radius: 50rpx;
		text-align: center;
		padding: 20rpx 0;
	}

	> view {
		margin-top: 30rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		width: 500rpx;
		box-sizing: border-box;
		border-radius: 40rpx;
		color: #fff;
	}

	.withdraw {
		border: 1px solid;
	}
}

.balance-other-info {
	margin-top: 50rpx;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 750rpx;
	margin-top: 50rpx;

	.balance-detail {
		line-height: 1;
		padding: 0 20rpx;
		font-size: $font-size-tag;
	}

	.recharge-record {
		line-height: 1;
		padding: 0 20rpx;
		font-size: $font-size-tag;
	}
}

.balance-xian {
	width: 2rpx;
	height: 20rpx;
	background-color: #383838;
}

.balance-title {
	color: rgba(255, 255, 255, 0.7);
}
</style>
