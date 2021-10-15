<template>
	<view class="order-container" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<block v-if="orderList.length">
					<view class="order-item" v-for="(orderItem, index) in orderList" :key="index" @click="toDetail(orderItem.order_id)">
						<view class="order-header">
							<view>
								<text class="color-tip font-size-tag">{{ $util.timeStampTurnTime(orderItem.create_time) }}</text>
							</view>
						</view>
						<view class="order-body">
							<view class="goods-wrap">
								<view class="goods-img">
									<image :src="$util.img(orderItem.gift_image)" v-if="orderItem.gift_image" @error="imgError(index)" mode="aspectFill"
									 :lazy-load="true"></image>
									<image :src="$util.img('upload/uniapp/point/gift.png')" v-else mode="aspectFill" :lazy-load="true"></image>
								</view>
								<view class="goods-info">
									<view class="goods-name">{{ orderItem.gift_name }}</view>
									<view class="goods-sub-section">
										<view>
											<text>
												<text class="iconfont iconclose"></text>
												{{ orderItem.num }}
											</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<ns-empty :isIndex="!1" :text="$lang('emptyTips')"></ns-empty>
				</block>
			</block>
		</mescroll-uni>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				orderList: []
			};
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();

			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/otherpages/member/gift/gift');
			}
		},
		mixins: [globalConfig],
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/gift/api/giftorder/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size
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
						if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
						this.orderList = this.orderList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			imgError(index) {
				this.orderList[index].gift_image = this.$util.img('upload/uniapp/point/hongbao.png');
				this.$forceUpdate();
			},
			toDetail(order_id) {
				this.$util.redirectTo('/otherpages/member/gift_detail/gift_detail', {
					id: order_id
				});
			}
		}
	};
</script>

<style lang="scss">
	.order-item {
		margin: $margin-updown $margin-both;
		padding: $padding;
		border-radius: $border-radius;
		background: #fff;
		position: relative;

		.order-header {
			display: flex;
			align-items: center;
			position: relative;

			&>view {
				flex: 1;
			}
		}

		.order-body {
			.goods-wrap {
				margin-bottom: $margin-updown;
				display: flex;
				position: relative;

				&:last-of-type {
					margin-bottom: 0;
				}

				.goods-img {
					width: 120rpx;
					height: 120rpx;
					padding: 20rpx 0 0 0;
					margin-right: $margin-both;

					image {
						width: 100%;
						height: 100%;
						border-radius: $border-radius;
					}
				}

				.goods-info {
					flex: 1;
					position: relative;
					padding: $padding 0 0;
					max-width: calc(100% - 140rpx);

					.goods-name {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						line-height: 1.5;
						font-size: $font-size-base;
					}

					.goods-sub-section {
						width: 100%;
						line-height: 1.3;
						display: flex;

						.goods-price {
							font-weight: 700;
							font-size: $font-size-base;
						}

						.unit {
							font-weight: normal;
							font-size: $font-size-base;
							margin-right: 2rpx;
						}

						view {
							flex: 1;
							line-height: 1.3;

							&:last-of-type {
								text-align: right;

								.iconfont {
									line-height: 1;
									font-size: 26rpx;
								}
							}
						}
					}
				}
			}
		}

		.order-footer {
			margin-top: $margin-updown;
			background: #f5f5f5;
			padding: $padding;
			border-radius: 4px;

			.label {
				color: $color-tip;
			}

			&.no-express {
				padding: 0;
				border-radius: 0;
				background: #fff;
			}
		}
	}

	.empty {
		padding-top: 200rpx;
		text-align: center;

		.empty-image {
			width: 180rpx;
			height: 180rpx;
		}
	}
</style>
