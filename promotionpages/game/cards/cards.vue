<template>
	<view class="container" :data-theme="themeStyle">
		<view>
			<view class="head-wrap">
				<image :src="$util.img('upload/uniapp/game/cards_head.png')" mode="widthFix"></image>
				<view class="rule-mark" @click="openRulePopup">规则</view>
			</view>
			<!-- 刮卡区域 -->
			<view class="prize-area">
				<view class="content-wrap">
					<view>
						<view class="guide-wrap" v-if="showGuide">
							<block v-if="gameInfo.status == 1">
								<view class="text">刮开试试手气</view>
								<view class="btn color-base-bg" :class="{ disabled: gameInfo.surplus_num == 0 }" @click="lottery">
									点我刮奖{{ '(' + gameInfo.points + '积分)' }}
								</view>
							</block>
							<block v-else-if="gameInfo.status == 0"><view class="text">活动尚未开始</view></block>
							<block v-else><view class="text">活动已经结束</view></block>
						</view>
						<!-- #ifdef MP -->
						<view class="canvas-shade" v-if="showGuide"></view>
						<canvas :disable-scroll="true" class="canvas" canvas-id="cardsCanvas" id="canvas" @touchmove="touchMove" v-show="!showGuide && !popState"></canvas>
						<!-- #endif -->

						<!-- #ifdef H5 -->
						<canvas :disable-scroll="true" class="canvas" canvas-id="cardsCanvas" id="canvas" @touchmove="touchMove"></canvas>
						<!-- #endif -->
						<view class="result-wrap">
							<block v-if="result.is_winning">
								<view class="title">恭喜您中奖了</view>
								<view class="text color-base-text">{{ result.award_name }}</view>
								<view class="tips">可到“我的中奖记录”中查看</view>
							</block>
							<block v-else>
								<view class="text color-base-text">{{ gameInfo.no_winning_desc }}</view>
							</block>
						</view>
					</view>
				</view>
				<image :src="$util.img('upload/uniapp/game/cards_bg.png')" mode="widthFix"></image>
			</view>

			<!-- 操作 -->
			<view class="action-text">
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

		<!-- 活动规则 -->
		<uni-popup ref="rulePopup" type="center" :maskClick="false" @change="popChange">
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
			ctxData: null,
			ctx: null,
			ctxW: 0,
			ctxH: 0,
			scaleRatio: 1,
			showGuide: true,
			id: 0,
			gameInfo: {
				// 游戏数据
				no_winning_desc: '',
				surplus_num: 0
			},
			result: {
				// 抽奖结果
				is_winning: 0
			},
			isClick: false,
			point: 0,
			animate: false,
			scrollTimer: null,
			siteId: 0,
			token: '',
			popState: false
		};
	},
	mixins: [globalConfig],
	onLoad(option) {
		if (option.id) this.id = option.id;
		if (option.site_id) this.siteId = option.site_id;
		this.getGameInfo();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.cards) {
				this.$util.showToast({
					title: '刮刮乐未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			} else {
				if (uni.getStorageSync('token')) {
					this.token = uni.getStorageSync('token');
					this.getMemberPointInfo();
				}
			}
		});
	},
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
		popChange(e) {
			this.popState = e.show;
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
		createCtx() {
			this.ctx = uni.createCanvasContext('cardsCanvas', this);
			this.ctx.setFillStyle('#e5e5e5');
			this.ctx.fillRect(0, 0, this.ctxW, this.ctxH);
			this.ctx.globalCompositeOperation = 'destination-out';
			this.ctx.draw();
		},
		touchMove(event) {
			event.preventDefault();
			var canvasRect = this.ctxData;
			this.ctx.beginPath();
			this.ctx.arc(event.touches[0].x, event.touches[0].y, 10 * this.scaleRatio, 0, Math.PI * 2);
			this.ctx.globalCompositeOperation = 'destination-out';
			this.ctx.setFillStyle('#fff');
			this.ctx.fill();
			this.ctx.draw(true);
		},
		// 抽奖
		lottery() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/promotionpages/game/cards/cards?id=' + this.id + '&site_id=' + this.siteId);
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
				url: '/cards/api/cards/lottery',
				data: {
					id: this.id,
					site_id: this.siteId
				},
				success: res => {
					if (res.code >= 0) {
						this.showGuide = false;
						this.result = res.data;

						// #ifdef MP
						const query = uni.createSelectorQuery().in(this);
						query
							.select('.guide-wrap')
							.boundingClientRect(data => {
								this.ctxData = data;
								this.ctxW = data.width;
								this.ctxH = data.height;
								this.createCtx();
							})
							.exec();
						// #endif

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
				url: '/cards/api/cards/info',
				data: {
					site_id: this.siteId,
					id: this.id
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
		},
		reCards() {
			if (this.showGuide) return;
			let data = {
				ctxData: null,
				ctx: null,
				ctxW: 0,
				ctxH: 0,
				scaleRatio: 1,
				showGuide: true,
				gameInfo: {
					// 游戏数据
					no_winning_desc: '',
					surplus_num: 0
				},
				result: {
					// 抽奖结果
					is_winning: 0
				},
				isClick: false,
				point: 0,
				animate: false,
				scrollTimer: null
			};
			Object.assign(this.$data, data);
			this.getGameInfo();
			if (uni.getStorageSync('token')) {
				this.getMemberPointInfo();
			}
			// #ifdef H5
			const query = uni.createSelectorQuery().in(this);
			query
				.select('#canvas')
				.boundingClientRect(data => {
					this.ctxData = data;
					this.ctxW = data.width;
					this.ctxH = data.height;
					this.createCtx();
				})
				.exec();
			// #endif
		}
	},
	onReady() {
		// #ifdef H5
		const query = uni.createSelectorQuery().in(this);
		query
			.select('#canvas')
			.boundingClientRect(data => {
				this.ctxData = data;
				this.ctxW = data.width;
				this.ctxH = data.height;
				this.createCtx();
			})
			.exec();
		// #endif
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
@import '../public/css/cards.scss';
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
