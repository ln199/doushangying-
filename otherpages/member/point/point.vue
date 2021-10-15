<template>
	<view class="point" :data-theme="themeStyle">
		<view class="head-wrap color-base-bg" :style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/point_bg.png') + ')' }">
			<view class="title">当前积分</view>
			<view class="point">{{ pointInfo.point }}</view>
			<view class="flex-box">
				<view class="flex-item">
					<view class="num">{{ pointInfo.totalPoint }}</view>
					<view class="font-size-tag">累计积分</view>
				</view>
				<view class="flex-item">
					<view class="num">{{ pointInfo.totalConsumePoint }}</view>
					<view class="font-size-tag">累计消费</view>
				</view>
				<view class="flex-item">
					<view class="num">{{ pointInfo.todayPoint }}</view>
					<view class="font-size-tag">今日获得</view>
				</view>
			</view>
		</view>

		<view class="menu-wrap">
			<view class="menu-item" @click="$util.redirectTo('/otherpages/member/point_detail/point_detail')">
				<text class="iconfont iconjifen-"></text>
				<text class="font-size-base">积分明细</text>
			</view>
			<view class="menu-item" @click="$util.redirectTo('/promotionpages/point/list/list')">
				<text class="iconfont icondianpu"></text>
				<text class="font-size-base">积分商城</text>
			</view>
		</view>

		<view class="task-wrap">
			<view class="title">
				<text class="box left">
					<text class="color-base-text iconfont iconAK-YKfangkuai_fill"></text>
					<text class="color-base-text-light iconfont iconAK-YKfangkuai_fill "></text>
				</text>
				<text class="text">积分任务</text>
				<text class="box right">
					<text class="color-base-text iconfont iconAK-YKfangkuai_fill"></text>
					<text class="color-base-text-light iconfont iconAK-YKfangkuai_fill"></text>
				</text>
			</view>
			<view class="task-item" @click="toSign">
				<view class="icon color-base-bg"><text class="iconfont iconqiandao1"></text></view>
				<view class="wrap">
					<view>每日签到</view>
					<view class="color-tip font-size-tag">连续签到可获得更多积分</view>
				</view>
				<view class="btn color-base-text color-base-border">去签到</view>
			</view>
			<view class="task-item" @click="$util.redirectTo('/pages/index/index/index')">
				<view class="icon color-base-bg"><text class="iconfont iconshangpin-"></text></view>
				<view class="wrap">
					<view>购买商品</view>
					<view class="color-tip font-size-tag">购买商品可获得积分</view>
				</view>
				<view class="btn color-base-text color-base-border">去下单</view>
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				pointInfo: {
					point: 0,
					totalPoint: 0,
					totalConsumePoint: 0,
					todayPoint: 0
				}
			};
		},
		mixins: [globalConfig],
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/otherpages/member/point/point');
			} else {
				this.getMemberPoint();
				this.getMemberTotalPoint();
				this.getMemberTotalConsumePoint();
				this.getMemberTodayPoint();
			}
		},
		methods: {
			toSign() {
				this.$util.redirectTo('/otherpages/member/signin/signin');
			},
			getMemberPoint() {
				this.$api.sendRequest({
					url: '/api/memberaccount/info',
					data: {
						account_type: 'point'
					},
					success: res => {
						if (res.code == 0) {
							this.pointInfo.point = parseInt(res.data.point);
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			getMemberTotalPoint() {
				this.$api.sendRequest({
					url: '/api/memberaccount/sum',
					data: {
						account_type: 'point',
						query_type: 'income'
					},
					success: res => {
						if (res.code == 0) {
							this.pointInfo.totalPoint = parseInt(res.data);
						}
					}
				});
			},
			getMemberTotalConsumePoint() {
				this.$api.sendRequest({
					url: '/api/memberaccount/sum',
					data: {
						account_type: 'point',
						query_type: 'pay'
					},
					success: res => {
						if (res.code == 0) {
							this.pointInfo.totalConsumePoint = Math.abs(parseInt(res.data));
						}
					}
				});
			},
			getMemberTodayPoint() {
				this.$api.sendRequest({
					url: '/api/memberaccount/sum',
					data: {
						account_type: 'point',
						start_time: new Date(new Date().toLocaleDateString()).getTime() / 1000,
						end_time: parseInt(new Date().getTime() / 1000)
					},
					success: res => {
						if (res.code == 0) {
							this.pointInfo.todayPoint = Math.abs(parseInt(res.data));
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
	@import '../public/css/point.scss';
</style>
