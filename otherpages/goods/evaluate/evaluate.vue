<template>
	<view class="goods-evaluate" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getGoodsEvaluate">
			<block slot="list">
				<view class="evaluate-item" v-for="(item, index) in list" :key="index">
					<view class="evaluator">
						<view>
							<view class="evaluator-face">
								<image v-if="item.member_headimg" :src="$util.img(item.member_headimg)" @error="imgError(index)" mode="aspectFill" />
								<image v-else :src="$util.getDefaultImage().default_headimg" mode="aspectFill" />
							</view>

							<view class="evaluator-info">
								<view class="evaluator-name">{{ item.member_name }}</view>
								<view class="evaluator-time color-tip">{{ $util.timeStampTurnTime(item.create_time) }}</view>
							</view>
						</view>
					</view>
					<view class="cont">{{ item.content }}</view>
					<scroll-view scroll-x="true">
						<view class="evaluate-img" v-if="item.images">
							<view class="img-box" v-for="(img, img_index) in item.images" :key="img_index" @click="previewEvaluate(index, img_index, 'images')">
								<image :src="$util.img(img)" mode="aspectFill" />
							</view>
						</view>
					</scroll-view>

					<view v-if="item.explain_first != ''" class="time shop-reply-box">
						<view class="shop-reply">商家回复：</view>
						<view class="cont">{{ item.explain_first }}</view>
					</view>

					<template v-if="item.again_content != ''">
						<view class="review-evaluation color-base-text">
							追加评价
						</view>
						<view class="cont">{{ item.again_content }}</view>
						<scroll-view scroll-x="true">
							<view class="evaluate-img" v-if="item.again_images.length > 0">
								<view class="img-box" v-for="(again_img, again_index) in item.again_images" :key="again_index" @click="previewEvaluate(index, again_index, 'again_images')">
									<image :src="$util.img(again_img)" mode="aspectFill"></image>
								</view>
							</view>
						</scroll-view>

						<view v-if="item.again_explain != ''" class="time shop-reply-box">
							<view class="shop-reply" v-if="item.again_explain != ''">商家回复：</view>
							<view class="cont">{{ item.again_explain }}</view>
						</view>
					</template>
				</view>
				<view v-if="list.length == 0">
					<ns-empty text="暂无商品评价"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				goodsId: 0,
				list: []
			};
		},
		mixins: [globalConfig],
		onLoad(data) {
			this.goodsId = data.goods_id || 0;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		methods: {
			getGoodsEvaluate(mescroll) {
				this.$api.sendRequest({
					url: '/api/goodsevaluate/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						goods_id: this.goodsId
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

						for (var i = 0; i < newArr.length; i++) {
							if (newArr[i].images) newArr[i].images = newArr[i].images.split(',');
							if (newArr[i].again_images) newArr[i].again_images = newArr[i].again_images.split(',');
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},

			// 预览评价图片
			previewEvaluate(index, img_index, field) {
				var paths = [];
				for (let i = 0; i < this.list[index][field].length; i++) {
					paths.push(this.$util.img(this.list[index][field][i]));
				}
				uni.previewImage({
					current: img_index,
					urls: paths
				});
			},
			imgError(index) {
				this.list[index].member_headimg = this.$util.getDefaultImage().default_headimg;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.goods-evaluate {
		.evaluate-item {
			margin: $margin-updown $margin-both;
			padding: $margin-both;
			background: #fff;
			border-radius: 10rpx;

			.evaluator {
				&>view {
					display: flex;
					align-items: center;
				}

				.evaluator-face {
					width: 79rpx;
					height: 79rpx;
					border-radius: 50%;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.evaluator-info {
					margin-left: 13rpx;

					.evaluator-name {
						color: #303133;
						font-size: $font-size-base;
						line-height: 1;
					}

					.evaluator-time {
						font-size: $font-size-tag;
						margin-top: 14rpx;
						line-height: 1;
					}
				}
			}

			.cont {
				text-align: justify;
				display: -webkit-box;
				word-break: break-all;
				font-size: $font-size-base;
				margin: 26rpx 0 0;
				color: #000000;
				line-height: 42rpx;
			}

			.evaluate-img {
				display: flex;
				width: 100%;
				flex-wrap: wrap;
				margin-top: 19rpx;

				.img-box {
					flex-shrink: 0;
					width: 140rpx;
					height: 140rpx;
					overflow: hidden;
					margin: 20rpx 23rpx 0 0;
					border-radius: 10rpx;

					&:nth-child(4n) {
						margin-right: 0;
					}

					&:nth-child(-n + 4) {
						margin-top: 0;
					}

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.time {
				font-size: $font-size-tag;
				background: #f8f8f8;
				padding: 10rpx 20rpx;
				border-radius: 6rpx;
				margin-top: 20rpx;

				text {
					line-height: 42rpx;
					color: $color-tip;
				}
			}

			.evaluation-reply {
				margin-top: 10rpx;
				font-size: $font-size-tag;
			}

			.review-evaluation {
				margin-top: 29rpx;
				font-size: $font-size-base;
				line-height: 1;

				.review-time {
					overflow: hidden;
					float: right;
				}

				&+.cont {
					margin: 18rpx 0 0;
				}
			}
		}
	}

	.shop-reply {
		font-size: $font-size-base;
		color: #000;
		line-height: 1;

		&+.cont {
			margin-top: 10rpx !important;
		}
	}

	.shop-reply-box {
		padding: 20rpx !important;
	}
</style>
