<template>
	<view class="fenxiao_index" :data-theme="themeStyle">
		<block v-if="info.fenxiao_name">
			<!-- 头部 -->
			<view class="fenxiao_index_header color-base-bg">
				<image
					:src="info.headimg ? $util.img(info.headimg) : $util.getDefaultImage().default_headimg"
					@error="info.headimg = $util.getDefaultImage().default_headimg"
					mode="aspectFill"
					class="member-pic"
				></image>
				<view class="member-info">
					<view class="member-info-box" @click="redirectTo('/otherpages/fenxiao/level/level', { back: '/otherpages/fenxiao/index/index', redirect: 'redirectTo' })">
						<text class="name">{{ info.fenxiao_name }}</text>
						<text class="level_name">{{ info.level_name }}</text>
					</view>
					<view class="recommend">推荐人：{{ info.parent_name ? info.parent_name : '无' }}</view>
				</view>
				<view class="manu-list-box" @click="redirectTo('/otherpages/fenxiao/promote_code/promote_code')">
					<image class="code" :src="$util.img('upload/uniapp/fenxiao/index/code1.png')" mode="aspectFill"></image>
				</view>
			</view>

			<!-- 提现 -->
			<view class="fenxiao_index_money color-base-bg">
				<view @click="$util.redirectTo('/otherpages/fenxiao/bill/bill')" class="index-money-item">
					<view class="item_money">{{ info.total_commission }}</view>
					<view class="item_tit">累计佣金 (元)</view>
				</view>
				<view class="xian"></view>
				<view @click="$util.redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list')" class="index-money-item">
					<view class="item_money">{{ info.account_withdraw }}</view>
					<view class="item_tit">累计提现 (元)</view>
				</view>
				<view class="xian"></view>
				<view @click="$util.redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list')" class="index-money-item">
					<text class="item_money">{{ info.account_withdraw_apply }}</text>
					<text class="item_tit">{{ fenxiaoWords.withdraw }}中（元）</text>
				</view>
			</view>

			<!-- 佣金 -->
			<view class="fenxiao-index-allmoney">
				<view class="allmoney-top">
					<view class="allmoney-top-money">
						<view class="total_commission color-base-text">{{ info.account }}</view>
						<view class="font-size-sub">可{{ fenxiaoWords.withdraw }}（元）</view>
					</view>
					<text @click="$util.redirectTo('/otherpages/fenxiao/withdraw_apply/withdraw_apply')" class="allmoney-top-btn color-base-bg">申请提现</text>
				</view>
				<view class="allmoney-xian"></view>
				<view class="allmoney-bottom">
					<view class="allmoney-today">
						<view class="today font-size-base color-base-text">{{ info.today_commission }}</view>
						<view class="font-size-sub">今日收入 (元)</view>
					</view>
					<view class="allmoney-all-wrap">
						<view class="allmoney-all font-size-base color-base-text">{{ info.today_order_money }}</view>
						<view class="font-size-sub">总销售额 (元)</view>
					</view>
				</view>
			</view>

			<view class="fenxiao-index-other">
				<view @click="$util.redirectTo('/otherpages/fenxiao/team/team')" class="all-money-item">
					<view class="img-wrap"><image :src="$util.img('upload/uniapp/fenxiao/index/team2.png')" mode="aspectFill"></image></view>
					<view class="all-money-tit-wrap">
						<text class="all-money-tit">我的团队</text>
						<text class="all-money-num">{{ teamNum }}人</text>
					</view>
				</view>
				<view @click="$util.redirectTo('/otherpages/fenxiao/team/team')" class="all-money-item">
					<view class="img-wrap"><image :src="$util.img('upload/uniapp/fenxiao/index/member.png')" mode="aspectFill"></image></view>
					<view class="all-money-tit-wrap">
						<text class="all-money-tit">推荐会员</text>
						<text class="all-money-num">{{ info.one_child_num }}人</text>
					</view>
				</view>
			</view>

			<!-- 功能列表 -->
			<view class="fenxiao_manu_list">
				<view class="content_manu">
					<view class="manu-list" @click="redirectTo('/otherpages/fenxiao/withdraw_apply/withdraw_apply')">
						<image :src="$util.img('upload/uniapp/fenxiao/index/withdraw.png')" mode="aspectFill"></image>
						<text>{{ fenxiaoWords.withdraw }}</text>
					</view>
					<view class="manu-list" @click="redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list')">
						<image :src="$util.img('upload/uniapp/fenxiao/index/tixian.png')" mode="aspectFill"></image>
						<text>{{ fenxiaoWords.withdraw }}明细</text>
					</view>
					<view class="manu-list" @click="redirectTo('/otherpages/fenxiao/order/order')">
						<image :src="$util.img('upload/uniapp/fenxiao/index/order.png')" mode="aspectFill"></image>
						<text>{{ fenxiaoWords.concept + '订单' }}</text>
					</view>
					<view class="manu-list" @click="redirectTo('/otherpages/fenxiao/team/team')">
						<image :src="$util.img('upload/uniapp/fenxiao/index/team.png')" mode="aspectFill"></image>
						<text>{{ fenxiaoWords.my_team }}</text>
					</view>
					<view class="manu-list" @click="redirectTo('/otherpages/fenxiao/promote_code/promote_code')">
						<image :src="$util.img('upload/uniapp/fenxiao/index/code.png')" mode="aspectFill"></image>
						<text>推广海报</text>
					</view>
					<view class="manu-list" @click="redirectTo('/otherpages/diy/diy/diy?name=DIY_FENXIAO_MARKET')">
						<image :src="$util.img('upload/uniapp/fenxiao/index/market.png')" mode="aspectFill"></image>
						<text>{{ fenxiaoWords.concept + '市场' }}</text>
					</view>
					<view class="manu-list" @click="redirectTo('/otherpages/fenxiao/follow/follow')">
						<image :src="$util.img('upload/uniapp/fenxiao/index/collection.png')" mode="aspectFill"></image>
						<text>{{ fenxiaoWords.concept + '商品' }}</text>
					</view>
					<view class="manu-list" @click="redirectTo('/otherpages/fenxiao/bill/bill')">
						<image :src="$util.img('upload/uniapp/fenxiao/index/bill.png')" mode="aspectFill"></image>
						<text>账单</text>
					</view>
				</view>
			</view>
		</block>
		<view class="margin-top"><ns-copyright></ns-copyright></view>
		<view class="empty" v-if="!info.fenxiao_name">
			<image :src="$util.img('upload/uniapp/fenxiao/index/no-fenxiao.png')" mode="widthFix"></image>
			<text>您还不是{{ fenxiaoWords.fenxiao_name }}，请先提交申请</text>
			<view @click="$util.redirectTo('/otherpages/fenxiao/apply/apply')" class="color-base-bg">立即加入</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import fenxiaoWords from '@/common/js/fenxiao-words.js';
import globalConfig from '@/common/js/golbalConfig.js';
import nsCopyRight from '@/components/ns-copyright/ns-copyright.vue';
export default {
	data() {
		return {
			info: {
				fenxiao_name: ''
			},
			teamNum: 0
		};
	},
	components: {
		nsCopyRight
	},
	mixins: [fenxiaoWords, globalConfig],
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if (!this.addonIsExit.fenxiao) {
			this.$util.showToast({
				title: '分销未开启',
				mask: true
			});
			setTimeout(() => {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			}, 1000);
		} else {
			this.getFenxiaoWrods();
			this.$langConfig.title(this.fenxiaoWords.concept + '中心');
			if (uni.getStorageSync('token')) {
				this.getFenxiaoDetail();
			} else {
				this.$util.redirectTo(
					'/pages/login/login/login',
					{
						back: '/otherpages/fenxiao/index/index'
					},
					'redirectTo'
				);
			}
		}
	},
	methods: {
		//点击跳转
		redirectTo(url) {
			if (this.info.status == -1) {
				this.$util.showToast({
					title: '您的账户已被冻结'
				});
			} else {
				this.$util.redirectTo(url);
			}
		},
		// 获取分销商信息
		getFenxiaoDetail() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/detail',
				success: res => {
					if (res.data) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.info = res.data;
						this.getTeamNum();
					} else {
						this.$util.redirectTo('/otherpages/fenxiao/apply/apply', {}, 'redirectTo');
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//去提现
		goTixian() {
			this.$util.redirectTo('/otherpages/fenxiao/withdraw_apply/withdraw_apply');
		},
		getTeamNum() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/teamnum',
				success: res => {
					if (res.code >= 0) {
						this.teamNum = res.data;
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
.fenxiao_index {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.fenxiao_index_header {
	width: 100%;
	position: relative;
	min-height: 200rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 50rpx 40rpx 0;
	box-sizing: border-box;

	.member-pic {
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		border: 6rpx solid #fff;
	}

	.member-info {
		width: 500rpx;
		height: 120rpx;
		margin-left: 16rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;

		view {
			color: #fff;
		}

		.member-info-box {
			display: flex;
			align-items: center;
			line-height: 1;
		}

		.name {
			font-size: $font-size-toolbar;
		}

		.level_name {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2rpx solid #fff;
			color: #fff;
			height: 34rpx;
			font-size: $font-size-activity-tag;
			padding: 0 4rpx;
			margin-left: 16rpx;
			line-height: 38rpx;
			border-radius: 4rpx;
		}

		.recommend {
			font-size: $font-size-tag;
			margin-top: 20rpx;
			line-height: 1;
			margin-bottom: 10rpx;
		}
	}

	.member-tixian {
		width: 120rpx;
		height: 50rpx;
		border: 2rpx solid #ffffff;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: $font-size-tag;
		color: #ffffff;
	}

	.code {
		width: 50rpx;
		height: 50rpx;
	}
}

.fenxiao_index_money {
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;

	.xian {
		height: 40rpx;
		border: 2rpx solid rgba(255, 255, 255, 0.5);
	}

	.index-money-item {
		padding: 40rpx 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.item_money {
			color: #fff;
			font-size: 36rpx;
			line-height: 1;
		}

		.item_tit {
			padding-top: 10rpx;
			font-size: $font-size-tag;
			color: #fff;
		}
	}
}

.fenxiao-index-allmoney {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-top: 20rpx;
	width: 690rpx;
	border-radius: 10rpx;
	background-color: #ffffff;

	.allmoney-top {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.allmoney-top-money {
			.total_commission {
				margin-bottom: 10rpx;
				line-height: 1;
				font-size: $font-size-base;
			}
		}

		.allmoney-top-btn {
			color: #ffffff;
			padding: 12rpx 17rpx;
			font-size: $font-size-tag;
			line-height: 1;
			border-radius: 24rpx;
		}
	}

	.allmoney-xian {
		width: 100%;
		border-top: 2rpx solid $color-line;
	}

	.allmoney-bottom {
		display: flex;

		.allmoney-today {
			padding: 30rpx;
			flex: 1;

			.today {
				margin-bottom: 10rpx;
				line-height: 1;
				font-size: $font-size-toolbar;
			}
		}

		.allmoney-all-wrap {
			padding: 30rpx;
			flex: 1;

			.allmoney-all {
				margin-bottom: 10rpx;
				line-height: 1;
				font-size: $font-size-toolbar;
			}
		}
	}
}

.fenxiao-index-other {
	padding: 30rpx 0;
	display: flex;
	margin-top: 20rpx;
	width: 690rpx;
	border-radius: 10rpx;
	background-color: #ffffff;

	.all-money-item {
		flex: 1;
		margin-left: 46rpx;
		display: flex;
		font-size: $font-size-tag;
		align-items: center;

		.img-wrap {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 70rpx;
			height: 70rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.all-money-tit-wrap {
			margin-left: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 70rpx;

			.all-money-tit {
				line-height: 1;
				color: $color-title;
				font-size: $font-size-base;
			}

			.all-money-num {
				color: $color-tip;
				font-size: $font-size-sub;
				line-height: 1;
			}
		}
	}
}

.fenxiao_manu_list {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 690rpx;
	margin-top: 20rpx;
	background-color: #fff;
	border-radius: 10rpx;

	.title-wrap {
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #f7f7f7;
		padding: 20rpx 40rpx;

		.title-img {
			width: 30rpx;
			height: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 10rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			color: #333333;
			font-size: $font-size-base;
			padding-left: 10rpx;
			padding-left: 5rpx;
		}
	}

	.content_manu {
		padding: 20rpx 0;
		width: 100%;
		background: #fff;
		border-radius: 10rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 10rpx;

		.manu-list {
			width: 24.5%;
			height: 150rpx;
			padding: 0 $padding;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			image {
				width: 50rpx;
				height: 50rpx;
				margin-bottom: 15rpx;
			}

			text {
				font-size: $font-size-sub;
			}
		}
	}
}

.fenxiao_content {
	.content_manu {
		width: 100%;
		background: #ffffff;
		border-radius: 15rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;

		.manu-list {
			width: 24.5%;
			height: 150rpx;
			display: inline-block;
			box-sizing: border-box;

			.manu-list-box {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				image {
					width: 60rpx;
					height: 60rpx;
					margin-bottom: 15rpx;
				}

				text {
					font-size: $font-size-tag;
				}
			}
		}
	}
}

.empty {
	width: 100%;
	height: 400rpx;
	margin-top: 200rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	image {
		width: 300rpx;
		margin-bottom: 50rpx;
	}

	text {
		font-size: $font-size-tag;
		font-weight: 600;
	}

	view {
		width: 300rpx;
		height: 70rpx;
		border-radius: 70rpx;
		text-align: center;
		line-height: 70rpx;
		color: #ffffff;
		margin-top: 30rpx;
	}
}
</style>
<style scoped>
>>> .ns-copyright-info {
	margin-bottom: 0;
}
</style>
