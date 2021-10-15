<template>
	<scroll-view scroll-y="true" class="container" :data-theme="themeStyle">
		<view>
			<view class="head-wrap">
				<image :src="$util.img('upload/uniapp/game/egg_head.png')" mode="widthFix"></image>
				<view class="rule-mark" @click="openRulePopup">规则</view>
			</view>

			<view class="status-wrap">
				<block v-if="gameInfo.status == 1">
					<view v-if="token">
						<view class="mark" v-if="token">
							今日还有
							<text class="num">{{ gameInfo.surplus_num }}</text>
							次机会
						</view>
					</view>
					<view v-if="token">
						<view class="mark active">
							消耗
							<text class="num">{{ gameInfo.points }}</text>
							积分
						</view>
					</view>
					<view class="mark" v-if="!token">请先进行登录</view>
				</block>
				<block v-else-if="gameInfo.status == 0"><view class="mark">活动尚未开始</view></block>
				<block v-else><view class="mark">活动已经结束</view></block>
			</view>

			<view class="eggs-wrap">
				<view class="box" @click="lottery"><image :src="$util.img('upload/uniapp/game/golden_eggs.png')" mode="widthFix"></image></view>
				<view class="box" @click="lottery"><image :src="$util.img('upload/uniapp/game/golden_eggs.png')" mode="widthFix"></image></view>
				<view class="box" @click="lottery"><image :src="$util.img('upload/uniapp/game/golden_eggs.png')" mode="widthFix"></image></view>
			</view>

			<!-- 操作 -->
			<view class="operation-text">
				<view class="point">我的积分：{{ point }}</view>
				<view class="record" @click="redirectToRecord(id)">我的中奖记录</view>
			</view>

			<!-- 中奖名单 -->
			<view class="record-wrap" v-if="gameInfo.is_show_winner && gameInfo.draw_record.length">
				<view class="body-shade"></view>
				<view class="head">中奖名单</view>
				<view class="body">
					<view class="wrap" :class="{ animate: animate }">
						<view v-for="(item, index) in gameInfo.draw_record" :key="index">
							<view class="tit">{{ item.member_nick_name | cover }}</view>
							<view class="txt">
								<l-time :text="item.create_time * 1000"></l-time>
								获得 {{ item.award_name }}
							</view>
						</view>
					</view>
				</view>
			</view>

			<uni-popup ref="transitionPopup" type="center" :maskClick="false">
				<view class="transition-popup">
					<view class="wrap">
						<image :src="$util.img('upload/uniapp/game/golden_eggs_0.png')" mode="widthFix" class="eggs" v-if="eggStatus == 0"></image>
						<image :src="$util.img('upload/uniapp/game/golden_eggs_1.png')" mode="widthFix" class="eggs" v-if="eggStatus == 1"></image>
						<image :src="$util.img('upload/uniapp/game/golden_eggs_2.png')" mode="widthFix" class="eggs" v-if="eggStatus == 2"></image>
						<image :src="$util.img('upload/uniapp/game/hammer.png')" mode="widthFix" class="hammer"></image>
					</view>
				</view>
			</uni-popup>

			<!-- 抽奖结果 -->
			<uni-popup ref="resultPopup" type="center" :maskClick="false">
				<view class="result-wrap">
					<block v-if="result.is_winning">
						<view class="content-wrap yes">
							<image :src="$util.img('upload/uniapp/game/point.png')" mode="widthFix" v-if="result.award_type == 1" class="look"></image>
							<image :src="$util.img('upload/uniapp/game/balance.png')" mode="widthFix" v-if="result.award_type == 2" class="look"></image>
							<image :src="$util.img('upload/uniapp/game/coupon.png')" mode="widthFix" v-if="result.award_type == 3" class="look"></image>
							<image :src="$util.img('upload/uniapp/game/gift.png')" mode="widthFix" v-if="result.award_type == 4" class="look"></image>

							<view class="msg" v-if="result.award_type == 1">恭喜您抽中{{ result.point }}个积分</view>
							<view class="msg" v-if="result.award_type == 2">恭喜您抽中{{ result.balance }}元红包</view>
							<view class="msg" v-if="result.award_type == 3">恭喜您抽中优惠券“{{ result.relate_name }}”</view>

							<view class="btn" @click="closePopup">继续抽奖</view>
							<text class="iconfont iconroundclose" @click="closePopup"></text>
						</view>
						<image :src="$util.img('upload/uniapp/game/result_yes.png')" mode="widthFix" class="bg-img"></image>
					</block>
					<block v-else>
						<view class="content-wrap">
							<image :src="$util.img('upload/uniapp/game/result_look.png')" mode="widthFix" class="look"></image>
							<view class="msg">{{ gameInfo.no_winning_desc }}</view>
							<view class="btn" @click="closePopup">继续抽奖</view>
							<text class="iconfont iconroundclose" @click="closePopup"></text>
						</view>
						<image :src="$util.img('upload/uniapp/game/result_no.png')" mode="widthFix" class="bg-img"></image>
					</block>
				</view>
			</uni-popup>

			<!-- 活动规则 -->
			<uni-popup ref="rulePopup" type="center" :maskClick="false">
				<view class="rule-wrap">
					<view class="content-wrap">
						<image :src="$util.img('upload/uniapp/game/rule_head.png')" mode="widthFix" class="rule-head"></image>
						<scroll-view scroll-y="true" class="rule">
							<view>
								<view class="tit">活动时间</view>
								<view class="text">{{ $util.timeStampTurnTime(gameInfo.start_time) }} - {{ $util.timeStampTurnTime(gameInfo.end_time) }}</view>
								<view class="tit">参与规则</view>
								<view class="text" v-if="gameInfo.join_type == 0">每个用户活动期间共有{{ gameInfo.join_frequency }}次抽奖机会。</view>
								<view class="text" v-else>每个用户活动期间每天都有{{ gameInfo.join_frequency }}次抽奖机会，每天0点更新。</view>
								<view class="text">每次抽奖需消耗 {{ gameInfo.points }} 积分</view>
								<view class="text" v-if="gameInfo.level_id != 0">该活动只有{{ gameInfo.level_name }}等级的会员可参与。</view>
								<block v-if="gameInfo.remark != ''">
									<view class="tit">活动说明</view>
									<view class="text">{{ gameInfo.remark }}</view>
								</block>
							</view>
						</scroll-view>
						<text class="iconfont iconroundclose" @click="closeRulePopup"></text>
					</view>
				</view>
			</uni-popup>

			<loading-cover ref="loadingCover"></loading-cover>
			<ns-login ref="login"></ns-login>
		</view>
	</scroll-view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import LTime from '@/components/l-time/l-time.vue';
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	components: {
		uniPopup,
		LTime
	},
	data() {
		return {
			token: null,
			id: 0,
			gameInfo: {
				// 游戏数据
				no_winning_desc: '',
				surplus_num: 0
			},
			result: {
				// 抽奖结果
				is_winning: 0,
				award_type: 0,
				point: 0,
				balance: 0.0,
				relate_name: ''
			},
			isClick: false,
			eggStatus: 0,
			scrollTimer: null,
			point: 0,
			animate: false,
			siteId: 0
		};
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.egg) {
				this.$util.showToast({
					title: '砸金蛋未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			} else {
				if (uni.getStorageSync('token')) {
					this.getMemberPointInfo();
					this.token = uni.getStorageSync('token');
				}
			}
		});
	},
	onLoad(option) {
		if (option.id) this.id = option.id;
		if (option.site_id) this.siteId = option.site_id;
		this.getGameInfo();
	},
	mixins: [globalConfig],
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.token = uni.getStorageSync('token');
				this.getMemberPointInfo();
				this.getGameInfo();
			}
		}
	},
	methods: {
		redirectToRecord(id) {
			this.$util.redirectTo('/promotionpages/game/record/record', {
				id: id
			});
		},
		getMemberPointInfo() {
			this.$api.sendRequest({
				url: '/api/memberaccount/info',
				data: {
					account_type: 'point'
				},
				success: res => {
					if (res.data) {
						this.point = parseInt(res.data.point);
					}
				}
			});
		},
		lottery() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/promotionpages/game/smash_eggs/smash_eggs?id=' + this.id + '&site_id=' + this.siteId);
				return;
			}
			if (this.gameInfo.status != 1) return;
			if (this.gameInfo.surplus_num <= 0) {
				this.$util.showToast({
					title: '您的抽奖次数已用完'
				});
				return;
			}
			if (this.gameInfo.points > 0 && this.point < this.gameInfo.points) {
				this.$util.showToast({
					title: '积分不足'
				});
				return;
			}
			if (this.isClick) return;
			this.isClick = true;
			this.$api.sendRequest({
				url: '/egg/api/egg/lottery',
				data: {
					id: this.id,
					site_id: this.siteId
				},
				success: res => {
					if (res.code >= 0) {
						this.result = res.data;
						this.start();

						// 扣除次数 积分
						this.point -= this.gameInfo.points;
						this.gameInfo.surplus_num -= 1;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		getGameInfo() {
			this.$api.sendRequest({
				url: '/egg/api/egg/info',
				data: {
					id: this.id,
					site_id: this.siteId
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.gameInfo = res.data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();

						if (this.gameInfo.is_show_winner && this.gameInfo.draw_record.length > 6) {
							this.scrollTimer = setInterval(this.scrollRecord, 2000);
						}
					} else {
						this.$util.showToast({
							title: '未获取到活动信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}, 1000);
					}
				},
				fail: res => {
					this.$util.showToast({
						title: '未获取到活动信息！'
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}, 1000);
				}
			});
		},
		start() {
			this.$refs.transitionPopup.open();
			setTimeout(() => {
				this.eggStatus = 1;
			}, 1000);
			setTimeout(() => {
				this.eggStatus = 2;
			}, 3000);
			setTimeout(() => {
				this.$refs.transitionPopup.close();
				this.$refs.resultPopup.open();
			}, 3300);
		},
		scrollRecord() {
			this.animate = true;
			setTimeout(() => {
				this.gameInfo.draw_record.push(this.gameInfo.draw_record[0]); // 将数组的第一个元素添加到数组的
				this.gameInfo.draw_record.shift();
				this.animate = false;
			}, 1000);
		},
		closePopup() {
			this.isClick = false;
			this.eggStatus = 0;
			this.$refs.resultPopup.close();
		},
		openRulePopup() {
			this.$refs.rulePopup.open();
		},
		closeRulePopup() {
			this.$refs.rulePopup.close();
		}
	},
	filters: {
		cover(str) {
			return str.substr(0, 1) + '******' + str.substr(-1);
		}
	},
	onHide() {
		clearInterval(this.scrollTimer);
	}
};
</script>

<style lang="scss">
@import '../public/css/egg.scss';
</style>
<style scoped>
>>> .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
}

>>> .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	overflow: unset;
}

/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
