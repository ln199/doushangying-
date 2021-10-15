<template>
	<view :data-theme="themeStyle">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExit.topic">
			<block slot="list">
				<ns-adv keyword="NS_TOPIC"></ns-adv>
				<view class="topic-list" v-if="dataList.length" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.topic_id, item.topic_name)">
					<view class="list-img"><image :src="$util.img(item.topic_adv)" mode="widthFix"></image></view>
					<view class="list-info">
						<view class="info-left">
							<text class="left-title">{{ item.topic_name }}</text>
							<text class="left-time">活动时间：{{ item.start_time }}~{{ item.end_time }}</text>
						</view>
						<view class="info-right">
							<text class="iconfont iconshijian1"></text>
							{{ nowTime < item.end_time ? '进行中' : '已结束' }}
						</view>
					</view>
				</view>
				<view v-if="!dataList.length" class="cart-empty"><ns-empty text="暂无专题活动"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import nsAdv from '@/components/ns-adv/ns-adv.vue';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	components: {
		nsAdv
	},
	data() {
		return {
			dataList: [],
			siteId: 0,
			nowTime: ''
		};
	},
	onLoad(options) {
		if (options.site_id) {
			this.siteId = options.site_id;
		}
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.topic) {
				this.$util.showToast({
					title: '专题活动未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			}
		});
	},
	mixins: [globalConfig],
	methods: {
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/topic/api/topic/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					site_id: this.siteId
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
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据
					this.dataList.forEach(i => {
						i.start_time = this.$util.timeStampTurnTime(i.start_time).slice(0, 10);
						i.end_time = this.$util.timeStampTurnTime(i.end_time).slice(0, 10);
					});
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toDetail(e, f) {
			this.$util.redirectTo('/promotionpages/topics/detail/detail', {
				topic_id: e,
				title: f
			});
		}
	},
	onShareAppMessage(res) {
		var title = '活动多多，优惠多多，快来看看吧';
		var path = '/promotionpages/topics/list/list';
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss" scoped>
/deep/ .ns-adv {
	margin: $margin-updown $margin-both;
	padding-top: $padding;
	border-radius: $border-radius;
	overflow: hidden;
	line-height: 1;

	image {
		width: 100%;
	}
}

/deep/ .fixed {
	position: relative;
	top: 0;
}

/deep/ .empty {
	margin-top: 0 !important;
}

.cart-empty {
	padding-top: 54px;
}

.topic-pic {
	height: 300rpx;

	image {
		height: 300rpx;
	}
}

.topic-list {
	margin: 0 24rpx 24rpx;
	border-radius: 10rpx;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	margin-bottom: 16rpx;
	background-color: #fff;

	.list-img {
		width: 100%;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.list-info {
		flex: 1;
		display: flex;
		padding: 0 24rpx;
		box-sizing: border-box;
		align-items: center;
		justify-content: space-between;
		padding-top: 29rpx;
		padding-bottom: 29rpx;

		.info-left {
			display: flex;
			flex-direction: column;
			line-height: 1;

			.left-title {
				font-size: $font-size-base;
				color: #383838;
				line-height: 1;
			}

			.left-time {
				font-size: $font-size-goods-tag;
				color: #838383;
				margin-top: 18rpx;
				line-height: 1;
			}
		}

		.info-right {
			font-size: $font-size-base;
			color: #838383;
			line-height: 1;

			.iconfont {
				font-size: $font-size-toolbar;
				vertical-align: middle;
			}

			text {
				font-size: $font-size-base;
				margin-right: 8rpx;
			}
		}
	}
}
</style>
