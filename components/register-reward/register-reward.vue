<template>
	<view>
		<view @touchmove.prevent.stop v-if="reward" class="reward-popup">
			<uni-popup ref="registerReward" type="center" :maskClick="false">
				<view class="reward-wrap">
					<image :src="$util.img('upload/uniapp/register_reward_bg.png')" mode="widthFix" class="bg-img"></image>
					<view class="wrap">
						<view>
							<scroll-view scroll-y="true" class="register-box">
								<view class="reward-content">
									<view class="reward-item" v-if="reward.point > 0">
										<view class="head">积分奖励</view>
										<view class="content">
											<view class="info">
												<view>
													<text class="num">{{ reward.point }}</text>
													<text class="type">积分</text>
												</view>
												<view class="desc">用于下单时抵现或兑换商品等</view>
											</view>
											<view class="tip" @click="closeRewardPopup('point')">立即查看</view>
										</view>
									</view>
									<view class="reward-item" v-if="reward.growth > 0">
										<view class="head">成长值</view>
										<view class="content">
											<view class="info">
												<view>
													<text class="num">{{ reward.growth }}</text>
													<text class="type">成长值</text>
												</view>
												<view class="desc">用于提升会员等级</view>
											</view>
											<view class="tip" @click="closeRewardPopup('growth')">立即查看</view>
										</view>
									</view>
									<view class="reward-item" v-if="reward.balance > 0">
										<view class="head">红包奖励</view>
										<view class="content">
											<view class="info">
												<view>
													<text class="num">{{ reward.balance }}</text>
													<text class="type">元</text>
												</view>
												<view class="desc">不可提现下单时可用</view>
											</view>
											<view class="tip" @click="closeRewardPopup('balance')">立即查看</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
					<view class="btn" @click="closeRewardPopup"><image :src="$util.img('upload/uniapp/register_reward_btn.png')" mode="widthFix" class="btn-img"></image></view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import uniPopup from '../uni-popup/uni-popup.vue';
import globalConfig from '@/common/js/golbalConfig.js';

// 注册奖励弹出层
export default {
	name: 'register-reward',
	components: {
		uniPopup
	},
	data() {
		return {
			reward: null
		};
	},
	created() {
		if (this.addonIsExit.memberregister) {
			this.getRegisterReward();
		}
	},
	mixins: [globalConfig],
	methods: {
		getReward() {
			return this.reward;
		},
		open() {
			this.$refs.registerReward.open();
		},
		cancel() {
			this.$refs.registerReward.close();
		},
		/**
		 * 获取新人礼配置
		 */
		getRegisterReward() {
			this.$api.sendRequest({
				url: '/memberregister/api/Config/Config',
				success: res => {
					if (res.code >= 0) {
						let data = res.data;
						if (data.is_use == 1 && (data.value.point > 0 || data.value.balance > 0 || data.value.growth > 0 || data.value.coupon > 0)) {
							this.reward = data.value;
						}
					}
				}
			});
		},
		closeRewardPopup(type) {
			this.$refs.registerReward.close();

			switch (type) {
				case 'point':
					this.$util.redirectTo('/otherpages/member/point_detail/point_detail', {});
					break;
				case 'balance':
					this.$util.redirectTo('/otherpages/member/balance_detail/balance_detail', {});
					break;
				case 'growth':
					this.$util.redirectTo('/otherpages/member/level/level', {});
					break;
				case 'coupon':
					this.$util.redirectTo('/otherpages/member/coupon/coupon', {});
					break;
				default:
					this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
			}
		}
	}
};
</script>
<style scoped>
.register-box /deep/ .uni-scroll-view {
	background: unset !important;
}
.register-box {
	max-height: 750rpx;
	overflow-y: scroll;
	margin-top: 200rpx;
}
</style>

<style lang="scss">
.reward-wrap {
	width: 80vw;
	height: auto;
	position: relative;

	& > uni-image,
	.bg-img {
		width: 100%;
		will-change: transform;
	}

	.wrap {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;

		& > view {
			position: relative;
		}
	}

	.reward-content {
		margin: 0 50rpx 0 50rpx;
	}

	.reward-item {
		.head {
			color: #fff;
			text-align: center;
			line-height: 1;
			margin: 20rpx 0;
		}

		.content {
			display: flex;
			padding: 16rpx 26rpx;
			background: #fff;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
			.info {
				flex: 1;
			}

			.tip {
				color: #ff222d;
				padding: 10rpx 0 10rpx 30rpx;
				width: 70rpx;
				line-height: 1.5;
				letter-spacing: 2rpx;
				border-left: 1px dashed #e5e5e5;
			}

			.num {
				font-size: 52rpx;
				color: #ff222d;
				font-weight: bolder;
				line-height: 1;
			}

			.type {
				font-size: $font-size-base;
				margin-left: 10rpx;
				line-height: 1;
			}

			.desc {
				margin-top: 8rpx;
				color: $color-tip;
				font-size: $font-size-tag;
				line-height: 1;
			}
		}
	}

	.btn {
		position: absolute;
		width: calc(100% - 100rpx);
		bottom: 40rpx;
		left: 50rpx;

		.btn-img {
			width: 100%;
		}
	}
}
</style>
