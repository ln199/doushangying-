<template>
	<view class="page" :data-theme="themeStyle">
		<view class="notice-title">{{ detail.title }}</view>
		<view class="notice-content">
			<rich-text :nodes="content"></rich-text>
		</view>
		<view class="notice-meta">
			<text class="notice-time">发表时间: {{ $util.timeStampTurnTime(detail.create_time) }}</text>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import htmlParser from '@/common/js/html-parser';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				noticeId: 0,
				content: '',
				detail: {}
			};
		},
		mixins: [globalConfig],
		onLoad(options) {
			options.notice_id ? (this.noticeId = options.notice_id) : this.$util.redirectTo('/otherpages/notice/list/list', {},
				'redirectTo');
			this.$api.sendRequest({
				url: '/api/notice/info',
				data: {
					id: this.noticeId
				},
				success: res => {
					if (res.code == 0) {
						if (res.data) {
							this.detail = res.data;
							this.content = htmlParser(res.data.content);
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.redirectTo('/otherpages/notice/list/list', {}, 'redirectTo');
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
						setTimeout(() => {
							this.$util.redirectTo('/otherpages/notice/list/list', {}, 'redirectTo');
						}, 1000);
					}
				},
				fail: res => {
					this.$util.redirectTo('/otherpages/notice/list/list', {}, 'redirectTo');
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		onShow() {
			this.$langConfig.refresh();
		},
		onShareAppMessage(res) {
			var title = '[公告]' + this.detail.title;
			var path = '/otherpages/notice/detail/detail?notice_id=' + this.noticeId;
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	};
</script>

<style lang="scss">
	.page {
		width: 100%;
		height: 100%;
		padding: $padding;
		box-sizing: border-box;
		background-color: #fff;
	}

	.notice-title {
		font-size: $font-size-toolbar;
		text-align: center;
	}

	.notice-content {
		margin-top: $margin-updown;
		word-break: break-all;
		font-size: $font-size-base;
	}

	.notice-meta {
		text-align: right;
		margin-top: $margin-updown;
		color: $color-tip;

		.notice-time {
			font-size: $font-size-tag;
		}
	}
</style>
