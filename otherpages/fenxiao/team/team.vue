<template>
	<view :data-theme="themeStyle">
		<view class="team-cate">
			<block v-for="(item, index) in category" :key="index">
				<view class="cate-li" :class="{ 'active color-base-text color-base-border': selectId == item.id }" v-if="index < levelNum" @click="selectCate(item.id)">
					{{ index == 0 ? item.name : item.name + fenxiaoWords.fenxiao_name }}
				</view>
			</block>
		</view>
		<mescroll-uni ref="mescroll" @getData="getData" top="90" class="member-point" :size="8">
			<block slot="list">
				<view class="team-li" v-for="(item, index) in teamList" :key="index" v-if="teamList.length != 0">
					<view class="li-box" :class="{ active: index + 1 == teamList.length }">
						<image v-if="item.headimg" :src="$util.img(item.headimg)" @error="imgError(index)" mode="aspectFill"></image>
						<image v-else :src="$util.getDefaultImage().default_headimg"></image>
						<view class="menber-info">
							<view class="member-name">
								<block v-if="item.is_fenxiao">
									<view class="left">
										<view class="name">{{ item.fenxiao_name }}</view>
										<view v-if="item.level_name" class="title  color-base-border color-base-text">{{ item.level_name }}</view>
									</view>
									<view>
										<text class="color-tip font-size-goods-tag">{{ item.audit_time }}</text>
									</view>
								</block>
								<block v-else>
									<view class="left">
										<view class="name font-size-tag">
											<text>{{ item.nickname }}</text>
										</view>
									</view>
									<view>
										<text class="color-tip font-size-goods-tag">{{ item.reg_time }}</text>
									</view>
								</block>
							</view>
							<view class="member-date">
								<view>
									<text class="tit ">消费：</text>
									<text class="">{{ item.order_money }}</text>
								</view>
								<view>
									<text class="tit">订单：</text>
									<text class="">{{ item.order_num }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<block v-if="teamList.length == 0 && emptyShow">
					<ns-empty text="暂无推荐会员" :isIndex="!1" v-if="selectId == 0"></ns-empty>
					<ns-empty :text="'暂无一级' + fenxiaoWords.fenxiao_name" :isIndex="!1" v-if="selectId == 1"></ns-empty>
					<ns-empty :text="'暂无二级' + fenxiaoWords.fenxiao_name" :isIndex="!1" v-if="selectId == 2"></ns-empty>
				</block>
			</block>
		</mescroll-uni>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			category: [
				{
					id: 0,
					name: '推荐会员',
					number: 0
				},
				{
					id: 1,
					name: '一级',
					number: 2
				},
				{
					id: 2,
					name: '二级',
					number: 0
				}
			],
			selectId: 0,
			teamList: [],
			emptyShow: false,
			levelNum: 0
		};
	},
	mixins: [fenxiaoWords, globalConfig],
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
			this.getFenxiaoWrods();
			this.$langConfig.title(this.fenxiaoWords.my_team);
			this.getFenXiaoLevel();
		}
	},
	methods: {
		getData(mescroll) {
			this.emptyShow = false;
			if (mescroll.num == 1) {
				this.teamList = [];
			}
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/team',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					level: this.selectId
				},
				success: res => {
					this.emptyShow = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
						newArr.forEach(v => {
							v.audit_time = this.$util.timeStampTurnTime(v.audit_time).substring(0, 10);
							v.reg_time = this.$util.timeStampTurnTime(v.reg_time).substring(0, 10);
						});
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.teamList = []; //如果是第一页需手动制空列表
					this.teamList = this.teamList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		imgError(e) {
			this.teamList[e].headimg = $util.getDefaultImage().default_headimg;
			this.$forceUpdate();
		},
		selectCate(e) {
			this.selectId = e;
			this.$refs.mescroll.refresh();
		},
		getFenXiaoLevel() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/basics',
				success: res => {
					if (res.code == 0 && res.data) {
						this.levelNum = Number(res.data.level);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.team-cate {
	padding: 0 30rpx;
	width: calc(100%);
	height: 90rpx;
	display: flex;
	box-sizing: border-box;
	background: #ffffff;
	position: fixed;
	left: 0;
	top: var(--window-top);

	.cate-li {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 90rpx;
		height: 100%;
		font-size: 30rpx;

		&.active {
			box-sizing: border-box;
			border-bottom: 4rpx solid;
		}
	}
}

.team-member {
	width: 100%;
	height: 70rpx;
	line-height: 70rpx;
	color: $color-tip;
	padding: 0 $padding;
	box-sizing: border-box;
}

.team-li {
	margin: $margin-updown $margin-both;
	padding: $margin-both;
	box-sizing: border-box;
	background: #fff;
	margin-bottom: 10px;
	border-radius: 10rpx;

	.li-box {
		display: flex;
		padding: $padding 0;
		border-bottom: 1rpx solid $color-line;
		box-sizing: border-box;

		image {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
		}

		.menber-info {
			flex: 1;
			padding-left: $padding;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.member-name {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: $font-size-base;

				.left {
					width: 70%;
					display: flex;
					align-items: center;

					.name {
						max-width: calc(100% - 150rpx);
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.title {
						padding: 4rpx 16rpx;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size: $font-size-activity-tag;
						border-radius: 4rpx;
						margin-left: 10rpx;
						line-height: 1;
						border: 1px solid;
						color: #fff;
					}
				}
			}

			.member-date {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: $padding;

				view {
					width: 50%;
					height: 100%;
					text-align: left;
					line-height: 1;

					text {
						font-size: $font-size-tag;
						color: $color-tip;
					}

					.tit {
						color: $color-tip;
					}
				}
			}
		}
	}

	.li-box.active {
		border: none;
	}
}
</style>
