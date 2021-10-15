<template>
	<view class="bill" :data-theme="themeStyle">
		<block v-if="addonIsExit.fenxiao">
			<mescroll-uni ref="mescroll" @getData="getData" class="member-point" :size="8">
				<block slot="list">
					<view class="balances" v-if="accountList.length" v-for="item in accountList" :key="item.id">
						<image v-if="item.type == 'order'" :src="$util.img('upload/uniapp/fenxiao/bill/jiesuan.png')" mode="widthFix"></image>
						<image v-else :src="$util.img('upload/uniapp/fenxiao/bill/withdraw.png')" mode="widthFix"></image>
						<view class="balances-info">
							<text>{{ item.type_name }}</text>
							<text>账单编号: {{ item.account_no }}</text>
							<text>{{ $util.timeStampTurnTime(item.create_time) }}</text>
						</view>
						<view class="balances-num">
							<text :class="item.money > 0 ? 'color-base-text' : ''">{{ item.money > 0 ? '+' + item.money : item.money }}</text>
						</view>
					</view>
					<ns-empty v-if="!accountList.length && showEmpty" text="暂无账单信息" :isIndex="!1"></ns-empty>
				</block>
				<loading-cover ref="loadingCover"></loading-cover>
			</mescroll-uni>
		</block>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			accountList: {},
			showEmpty: false
		};
	},
	onShow() {
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
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo(
					'/pages/login/login/login',
					{
						back: '/otherpages/fenxiao/bill/bill'
					},
					'redirectTo'
				);
			}
		}
	},
	mixins: [globalConfig],
	methods: {
		getData(mescroll) {
			if (mescroll.num == 1) {
				this.accountList = [];
			}
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/fenxiao/api/account/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					this.showEmpty = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data && res.data.list) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.accountList = []; //如果是第一页需手动制空列表
					this.accountList = this.accountList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					this.showEmpty = true;
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	}
};
</script>

<style lang="scss">
/deep/ .empty {
	margin-top: 0 !important;
}

/deep/ .member-point .mescroll-uni-content {
	overflow: hidden;
}

.balances {
	width: calc(100% - 60rpx);
	border-radius: 10rpx;
	margin: 0 auto;
	padding: 27rpx 27rpx;
	box-sizing: border-box;
	display: flex;
	align-items: flex-start;
	background: #fff;
	margin-bottom: 18rpx;
	margin-top: 18rpx;

	image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
	}

	.balances-info {
		flex: 1;
		margin-left: 16rpx;
		display: flex;
		flex-direction: column;

		text {
			line-height: 1;

			&:last-child {
				font-size: $font-size-base;
			}

			&:nth-child(2) {
				margin-top: 18rpx;
				font-size: $font-size-tag;
				color: $color-tip;
			}

			&:nth-child(3) {
				font-size: $font-size-tag;
				margin-top: 19rpx;
				color: $color-tip;
			}
		}
	}

	.balances-num {
		text {
			line-height: 1;
			font-size: $font-size-toolbar;
			color: #000;
		}
	}
}
</style>
