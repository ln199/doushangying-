<template>
	<view>
		<view class="ns-copyright-info" v-if="bottom_info">
			<view class="ns-copyright-pic code-pic" v-if="bottom_info.logo" @click="link(bottom_info.copyright_link)">
				<image :src="$util.img(bottom_info.logo)" mode="widthFix"></image>
			</view>
			<!-- <view class="copyright-desc color-tip" v-if="bottom_info.company_name" @click="link(bottom_info.copyright_link)">{{ bottom_info.company_name }}</view> -->
			<!-- <view class="copyright-desc color-tip" v-else @click="link('http://www.niushop.com')">牛之云科技提供技术支持</view> -->
		</view>
		<view class="ns-copyright-info" v-else @click="link('http://www.niushop.com')">
			<view class="ns-copyright-pic"><image :src="$util.img('upload/uniapp/logo_copy.png')" mode="widthFix"></image></view>
			<!-- <view class="copyright-desc color-tip">牛之云科技提供技术支持</view> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bottom_info: {}
		};
	},
	created() {
		this.getAdvList();
	},
	methods: {
		//获取版权信息
		getAdvList() {
			this.$api.sendRequest({
				url: '/api/config/copyright',
				success: res => {
					if (res.code == 0 && res.data) {
						this.bottom_info = res.data;
					}
				}
			});
		},
		link(url) {
			if (url) {
				this.$util.redirectTo('/otherpages/webview/webview', {
					link: encodeURIComponent(url)
				});
			}
		}
	}
};
</script>

<style lang="scss">
.ns-copyright-info {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	margin-top: 14rpx;
	margin-bottom: 14rpx;
}

.ns-copyright-info .ns-copyright-pic image {
	width: 160rpx;
}

.ns-copyright-info text {
	font-size: $font-size-goods-tag;
	height: 100rpx;
	line-height: 100rpx;
	color: $color-tip !important;
}

.ns-copyright-info .copyright-desc {
	color: lighten($color-tip, 30%);
	font-size: $font-size-goods-tag;
	text-shadow: 0 0 1px lighten($color-tip, 40%);
}
</style>
