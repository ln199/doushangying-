<template>
	<view class="nc-modify-content" :data-theme="themeStyle">
		<view class="modify">
			<view>
				<image v-if="newImg == ''" :src="memberImg ? $util.img(memberImg) : $util.getDefaultImage().default_headimg" @error="memberImg = $util.getDefaultImage().default_headimg"
				 mode="aspectFill"></image>
				<image v-else :src="$util.img(newImg)" @error="newImg = $util.getDefaultImage().default_headimg" mode="aspectFill" />
			</view>
		</view>
		<view class="opection-box">
			<block v-if="newImg == ''"><button type="primary" @click="chooseImage()">点击上传</button></block>
			<block v-else>
				<view class="opec">
					<button size="mini" type="primary" @click="save()">确认保存</button>
					<button size="mini" type="primary" @click="chooseImage()">重新上传</button>
				</view>
			</block>
		</view>
		<img-cropping selWidth="300" selHeight="300" @upload="myUpload" ref="imgCropping"></img-cropping>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import imgCropping from '@/components/img-cropping/cropping.vue';
	export default {
		data() {
			return {
				memberImg: '',
				newImg: '',
				imgurl: ''
			};
		},
		components: {
			imgCropping
		},
		mixins: [globalConfig],
		onShow() {
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo(
					'/pages/login/login/login', {
						back: '/otherpages/member/modify_face/modify_face'
					},
					'redirectTo'
				);
			}
			this.$langConfig.refresh();
			this.initGetHeading();
		},
		methods: {
			initGetHeading() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code == 0) {
							this.memberImg = res.data.headimg;
							this.imgurl = res.data.headimg;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			chooseImage() {
				this.$refs.imgCropping.fSelect();
			},
			//上传返回图片
			myUpload(rsp) {
				uni.request({
					url: this.$config.baseUrl + '/api/upload/headimgBase64',
					method: 'POST',
					data: {
						app_type: 'h5',
						app_type_name: 'H5',
						images: rsp.base64
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded;application/json'
					},
					dataType: 'json',
					responseType: 'text',
					success: res => {
						if (res.data.code == 0) {
							this.newImg = res.data.data.pic_path;
							this.imgurl = res.data.data.pic_path;
						}
					},
					fail: () => {
						this.$util.showToast({
							title: '头像上传失败'
						});
					}
				});
			},
			previewImage() {
				uni.previewImage({
					current: 0,
					urls: this.images
				});
			},
			save() {
				this.$api.sendRequest({
					url: '/api/member/modifyheadimg',
					data: {
						headimg: this.newImg
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: '头像修改成功'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/member/info/info', {}, 'redirectTo');
							}, 1000);
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		overflow: hidden;
	}

	.modify {
		position: relative;
		padding-top: 50rpx;

		view {
			width: 500rpx;
			height: 500rpx;
			margin: 0 auto;
			overflow: hidden;
			background-color: #ffffff;
			border: 4rpx solid #ffffff;
			border-radius: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.opection-box {
		margin-top: 50rpx;
	}

	.opec {
		width: 100%;
		padding: 0 10%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}
</style>
