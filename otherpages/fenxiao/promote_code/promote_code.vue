<template>
	<view class="container" :data-theme="themeStyle">
		<swiper class="swiper">
			<swiper-item>
				<view class="swiper-item">
					<view class="poster-wrap"><image :src="$util.img(poster)" mode="widthFix" :show-menu-by-longpress="true"></image></view>
				</view>
			</swiper-item>
		</swiper>
		<!-- #ifdef H5 -->
		<view class="tips">长按识别图中二维码</view>
		<!--  #endif -->
		<!-- #ifdef MP -->
		<view class="btn color-base-bg color-base-border" @click="save">保存海报</view>
		<!--  #endif -->

		<uni-popup ref="popupDialog" :custom="true" :mask-click="false">
			<view class="dialog-popup">
				<view class="title">提示</view>
				<view class="message">您拒绝了保存图片到相册的授权请求，无法保存图片到相册，如需正常使用，请授权之后再进行操作。</view>
				<view class="action-wrap">
					<view @click="closeDialog">取消</view>
					<view><button type="default" open-type="openSetting" @opensetting="closeDialog" hover-class="none">立即授权</button></view>
				</view>
			</view>
		</uni-popup>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import { Weixin } from 'common/js/wx-jssdk.js';
import globalConfig from '@/common/js/golbalConfig.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export default {
	data() {
		return {
			poster: '',
			fenxiaoInfo: {}
		};
	},
	components: {
		uniPopup
	},
	mixins: [globalConfig],
	methods: {
		/**
		 * 获取分销海报
		 */
		getPoster() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/poster',
				data: {
					page: '/pages/index/index/index',
					qrcode_param: JSON.stringify({})
				},
				success: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					if (res.code >= 0) {
						this.poster = res.data.path + '?time=' + new Date().getTime();
					} else {
						this.$util.showToast({
							title: '海报生成失败'
						});
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					this.$util.showToast({
						title: '海报生成失败'
					});
				}
			});
		},
		save() {
			// #ifdef MP
			uni.downloadFile({
				url: this.$util.img(this.poster),
				success: res => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.$util.showToast({
									title: '保存成功'
								});
							},
							fail: res => {
								if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny' || res.errMsg == 'saveImageToPhotosAlbum:fail:auth denied') {
									this.$refs.popupDialog.open();
								} else {
									this.$util.showToast({
										title: '保存失败，请稍后重试'
									});
								}
							}
						});
					} else {
						this.$util.showToast({
							title: '下载失败'
						});
					}
				},
				fail: res => {
					this.$util.showToast({
						title: '下载失败'
					});
				}
			});
			// #endif
		},
		getFenxiaoDetail() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/detail',
				success: res => {
					if (res.data) {
						this.fenxiaoInfo = res.data;
						this.getPoster();
						this.setShareData();
					} else {
						this.$util.redirectTo('/otherpages/fenxiao/apply/apply', {}, 'redirectTo');
					}
				}
			});
		},
		setShareData() {
			// #ifdef H5
			if (this.$util.isWeiXin()) {
				this.$api.sendRequest({
					url: '/wechat/api/wechat/share',
					data: {
						url: window.location.href
					},
					success: res => {
						if (res.code == 0) {
							var wxJS = new Weixin();
							wxJS.init(res.data.jssdk_config);

							let shareConfig = res.data.share_config,
								url = this.$config.h5Domain + '/pages/index/index/index';
							if (this.fenxiaoInfo.member_id) url += '?source_member=' + this.fenxiaoInfo.member_id;

							wxJS.setShareData({
								title: '快来加入我的团队吧，一起得佣金哦',
								desc: shareConfig.qrcode_param_1 + '\r\n' + shareConfig.qrcode_param_2 + '\r\n' + '收藏热度：★★★★★',
								link: url,
								imgUrl: this.$util.img(this.fenxiaoInfo.headimg)
							});
						}
					}
				});
			}
			// #endif
		},
		closeDialog() {
			this.$refs.popupDialog.close();
		}
	},
	onLoad() {
		// 刷新多语言
		this.$langConfig.refresh();

		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.fenxiao) {
				this.$util.showToast({
					title: '分销未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			} else {
				if (uni.getStorageSync('token')) {
					this.getFenxiaoDetail();
				} else {
					this.$util.redirectTo('/pages/login/login/login', {
						back: '/otherpages/fenxiao/promote_code/promote_code'
					});
				}
			}
		});
	},
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var path = '/pages/index/index/index';
		if (this.fenxiaoInfo.member_id) path += '?source_member=' + this.fenxiaoInfo.member_id;
		return {
			title: '快来加入我的团队吧，一起得佣金哦',
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
.container {
	width: 100vw;
	min-height: 100vh;
	background-color: #f5f5f5;
}

.poster-wrap {
	padding: 40rpx 0;
	width: calc(100vw - 80rpx);
	margin: 0 40rpx;
	line-height: 1;

	image {
		border-radius: 20rpx;
		overflow: hidden;
		width: 100%;
	}
}

.swiper {
	height: 1170rpx;
}

.btn {
	margin: 0 80rpx;
	margin-top: 30rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 80rpx;
	color: #fff;
	text-align: center;
}

.tips {
	text-align: center;
	font-size: $font-size-base;
	color: #999;
	font-weight: 600;
	margin-top: 20rpx;
}

.dialog-popup {
	width: 580rpx;
	background: #fff;
	box-sizing: border-box;
	border-radius: 10rpx;
	overflow: hidden;
	height: initial;

	.title {
		padding: 30rpx 30rpx 0 30rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
	}

	.message {
		padding: 0 30rpx;
		color: #666;
		text-align: center;
		font-size: $font-size-base;
		line-height: 1.3;
		margin-top: 30rpx;
	}

	.action-wrap {
		margin-top: 50rpx;
		height: 80rpx;
		display: flex;
		border-top: 1px solid #eee;

		& > view {
			flex: 1;
			text-align: center;
			line-height: 80rpx;

			&:first-child {
				border-right: 1px solid #eee;
				color: #999;
			}

			button {
				border: none;
				line-height: 80rpx;
				padding: 0;
				margin: 0;
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
