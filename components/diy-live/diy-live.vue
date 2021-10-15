<template>
	<view :style="{ marginTop: value.marginTop * 2 + 'rpx' }" v-if="liveInfo && liveInfo.roomid != undefined">
		<view class="live-wrap" @click="entryRoom(liveInfo.roomid)">
			<view class="banner-wrap">
				<image
					:src="liveInfo.banner != '' ? $util.img(liveInfo.banner) : $util.img('upload/uniapp/live_default_banner.png')"
					mode="widthFix"
					@error="liveInfo.banner = $util.img('upload/uniapp/live_default_banner.png')"
				></image>
				<view class="shade"></view>
				<view class="wrap">
					<view class="room-name">
						<text class="status-name font-size-base" :class="{ 'color-base-bg': liveInfo.live_status == '101' }">
							<text class="iconfont iconzhibozhong font-size-sub" v-if="liveInfo.live_status == '101'"></text>
							<text class="iconfont iconzhibojieshu font-size-sub" v-else></text>
							{{ liveInfo.status_name }}
						</text>
						{{ liveInfo.name }}
					</view>
				</view>
			</view>
			<view class="room-info" v-if="value.isShowAnchorInfo || value.isShowLiveGood">
				<block v-if="value.isShowAnchorInfo">
					<image
						:src="liveInfo.anchor_img != '' ? $util.img(liveInfo.anchor_img) : $util.getDefaultImage().default_headimg"
						class="anchor-img"
						@error="liveInfo.anchor_img = $util.getDefaultImage().default_headimg"
					></image>
					<text class="anchor-name">主播：{{ liveInfo.anchor_name }}</text>
				</block>
				<text class="separate" v-if="value.isShowAnchorInfo && value.isShowLiveGood">|</text>
				<block v-if="value.isShowLiveGood">
					<text class="goods-text">直播商品：{{ liveInfo.goods.length }}</text>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
// 直播
export default {
	name: 'diy-live',
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			liveInfo: {
				banner: '',
				anchor_img: ''
			}
		};
	},
	created() {
		this.getLiveInfo();
	},
	watch: {
		siteId(val, nal) {
			this.getLiveInfo();
		}
	},
	methods: {
		getLiveInfo() {
			let data = {};
			if (this.siteId) {
				data.site_id = this.siteId;
			}
			this.$api.sendRequest({
				url: '/live/api/live/info',
				data: data,
				success: res => {
					if (res.code == 0 && res.data) {
						this.liveInfo = res.data;
						this.getLiveStatus();
					} else {
						this.liveInfo = null;
					}
				}
			});
		},
		entryRoom(roomId) {
			// #ifdef MP-WEIXIN
			wx.navigateTo({
				url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`
			});
			// #endif
		},
		getLiveStatus() {
			// #ifdef MP-WEIXIN
			let livePlayer = requirePlugin('live-player-plugin');

			livePlayer
				.getLiveStatus({ room_id: this.liveInfo.roomid })
				.then(res => {
					const liveStatus = res.liveStatus;
					if (liveStatus && liveStatus != this.liveInfo.live_status) {
						this.changeLiveStatus(liveStatus);
					}
				})
				.catch(err => {
					console.log('get live status', err);
				});

			// 往后间隔1分钟或更慢的频率去轮询获取直播状态
			var timer = setInterval(() => {
				livePlayer
					.getLiveStatus({ room_id: this.liveInfo.roomid })
					.then(res => {
						const liveStatus = res.liveStatus;
						if (liveStatus && liveStatus != this.liveInfo.live_status) {
							this.changeLiveStatus(liveStatus);
						}
						if (this.$util.inArray(liveStatus, [103, 104, 106, 107])) {
							clearInterval(timer);
						}
					})
					.catch(err => {
						console.log('get live status', err);
					});
			}, 60000);
			// #endif
		},
		changeLiveStatus(status) {
			this.$api.sendRequest({
				url: '/live/api/live/modifyLiveStatus',
				data: {
					room_id: this.liveInfo.roomid,
					status: status
				},
				success: res => {
					if (res.code == 0) {
						this.getLiveInfo();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.live-wrap {
	background: #fff;
	border-radius: 16rpx;
	overflow: hidden;
}
.banner-wrap {
	width: 100%;
	position: relative;
	line-height: 1;
	display: flex;

	image {
		width: 100%;
	}

	.shade {
		width: 100%;
		height: 100%;
		position: absolute;
		background: rgba($color: #888, $alpha: 0.3);
		left: 0;
		top: 0;
		z-index: 5;
	}

	.wrap {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 10;
		padding: 26rpx 20rpx;
		box-sizing: border-box;

		.room-name {
			font-size: $font-size-toolbar;
			color: #fff;
			line-height: 1;
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			display: flex;
			align-items: center;

			.status-name {
				display: inline-block;
				font-size: $font-size-activity-tag;
				color: #fff;
				padding: 8rpx 12rpx;
				background-color: rgba(0, 0, 0, 0.6);
				border-radius: 36rpx;
				margin-right: 20rpx;

				.iconzhibozhong {
					font-size: $font-size-activity-tag;
					color: #fff;
					margin-right: 9rpx;
				}
			}
		}
	}
}

.room-info {
	padding: 20rpx 30rpx;
	background: #fff;
	display: flex;

	.anchor-img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.anchor-name,
	.goods-text {
		font-size: $font-size-base;
		line-height: 60rpx;
	}

	.separate {
		color: #808080;
		margin: 0 10rpx;
		line-height: 56rpx;
	}
}
</style>
<style scoped>
.coupon-all >>> .uni-scroll-view::-webkit-scrollbar {
	display: none;
}
</style>
