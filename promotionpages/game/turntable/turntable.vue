<template>
	<scroll-view scroll-y="true" class="container" :data-theme="themeStyle">
		<view>
			<view class="head-wrap">
				<image :src="$util.img('upload/uniapp/game/turntable_head.png')" mode="widthFix"></image>
				<view class="rule-mark" @click="openRulePopup">规则</view>
			</view>
			<view class="turntable-wrap" :style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/turntable_bg.png') + ')' }">
				<view class="wrap">
					<view class="award-wrap" v-for="(item, index) in gameInfo.award" :key="index">
						<view class="box" :class="{ on: index == currentIndex }">
							<view class="award-img"><image :src="$util.img(item.award_img)" mode="widthFix"></image></view>
							<view class="award-text">{{ item.award_name }}</view>
						</view>
					</view>
					<block v-if="gameInfo.status == 1">
						<block v-if="gameInfo.surplus_num > 0 || !token">
							<view class="star-box" @click="lottery">
								<view class="text">立即抽奖</view>
								<view class="tips">{{ '消耗' + gameInfo.points + '积分' }}</view>
							</view>
						</block>
						<block v-else>
							<view class="star-box disabled">
								<view class="text">立即抽奖</view>
								<view class="tips">{{ '(消耗' + gameInfo.points + '积分)' }}</view>
							</view>
						</block>
					</block>
					<block v-else-if="gameInfo.status == 0">
						<view class="status-box"><view>活动尚未开始</view></view>
					</block>
					<block v-else>
						<view class="status-box"><view>活动已经结束</view></view>
					</block>
				</view>
			</view>
			<view class="remain-box" v-if="gameInfo && token">
				<view class="remain">
					<text>今日还有{{ gameInfo.surplus_num }}次抽奖机会</text>
				</view>
			</view>
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
		</view>

		<!-- 抽奖结果 -->
		<uni-popup ref="resultPopup" type="center" :maskClick="false">
			<view class="result-wrap">
				<block v-if="result.is_winning">
					<view class="content-wrap yes">
						<image :src="$util.img(gameInfo.award[resultIndex].award_img)" mode="widthFix" class="look"></image>
						<view class="msg">恭喜您抽中{{ gameInfo.award[resultIndex].award_name }}</view>
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
			isClick: false,
			currentIndex: -1, // 当前选中
			maxRing: 6, // 最大圈数,
			currentRing: 1, // 当前圈数
			speed: 300, // 转数
			timer: null,
			id: 0, // 活动id
			gameInfo: {
				// 游戏信息
				award: [
					{
						award_img: '',
						award_name: ''
					}
				],
				surplus_num: ''
			},
			award: [],
			noAward: [],
			resultIndex: 0,
			result: {
				// 抽奖结果
				is_winning: 1
			},
			point: 0,
			animate: false,
			scrollTimer: null,
			siteId: 0
		};
	},
	onLoad(option) {
		if (option.id) this.id = option.id;
		if (option.site_id) this.siteId = option.site_id;
		this.getGameInfo();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.turntable) {
				this.$util.showToast({
					title: '幸运抽奖未开启',
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
				this.$refs.login.open('/promotionpages/game/turntable/turntable?id=' + this.id + '&site_id=' + this.siteId);
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

			// 初始化转盘参数
			this.currentIndex = 0;
			this.currentRing = 1;
			this.speed = 300;
			this.timer = setInterval(this.startRoll, this.speed);

			this.$api.sendRequest({
				url: '/turntable/api/turntable/lottery',
				data: {
					id: this.id,
					site_id: this.siteId
				},
				success: res => {
					if (res.code >= 0) {
						this.result = res.data;

						if (res.data.is_winning) {
							this.resultIndex = this.$util.inArray(res.data.award_id, this.award);
						} else {
							let length = this.noAward.length;
							this.resultIndex = this.noAward[Math.floor(Math.random() * length)];
						}

						// 扣除次数 积分
						this.point -= this.gameInfo.points;
						this.gameInfo.surplus_num -= 1;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				},
				fail: res => {
					this.resultIndex = this.$util.inArray(-1, this.award);
				}
			});
		},
		getGameInfo() {
			this.$api.sendRequest({
				url: '/turntable/api/turntable/info',
				data: {
					id: this.id,
					site_id: this.siteId
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.gameInfo = res.data;
						res.data.award.forEach((e, f) => {
							this.award.push(e.award_id);
							if (e.award_id < 0) {
								this.noAward.push(f);
							}
						});
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
		startRoll() {
			if (this.speed > 50) {
				this.speed -= 50;
			}
			if (this.currentRing >= this.maxRing - 1 && this.speed < 700) {
				this.speed += 100;
			}
			if (this.currentRing == this.maxRing && this.currentIndex == this.resultIndex) {
				clearInterval(this.timer);
				this.showResult();
				return;
			}
			if (this.currentIndex == 7) {
				this.currentRing += 1;
				this.currentIndex = 0;
			} else {
				this.currentIndex += 1;
			}
			clearInterval(this.timer);
			this.timer = setTimeout(this.startRoll, this.speed); //开始转动
		},
		// 展示中奖结果
		showResult() {
			this.$refs.resultPopup.open();
		},
		closePopup() {
			this.isClick = false;
			this.currentIndex = -1;
			this.$refs.resultPopup.close();
		},
		openRulePopup() {
			this.$refs.rulePopup.open();
		},
		closeRulePopup() {
			this.$refs.rulePopup.close();
		},
		scrollRecord() {
			this.animate = true;
			setTimeout(() => {
				this.gameInfo.draw_record.push(this.gameInfo.draw_record[0]); // 将数组的第一个元素添加到数组的
				this.gameInfo.draw_record.shift();
				this.animate = false;
			}, 1000);
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
@import '../public/css/turntable.scss';
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
