<template>
	<view class="fenxiao-goods" :data-theme="themeStyle">
		<block v-if="addonIsExit.fenxiao">
			<image class="fx_adv" :src="$util.img('upload/uniapp/fenxiao/fx_adv.png')" mode="widthFix"></image>
			<view class="fenxiao-menu">
				<view class="menu-item">
					<text class="menu-item-tit">分享好友</text>
					<text>更多佣金挣不停</text>
				</view>
				<view class="shu"></view>
				<view class="menu-item">
					<text class="menu-item-tit">分销市场</text>
					<text>多种商品任你选择</text>
				</view>
				<view class="shu"></view>
				<view class="menu-item">
					<text class="menu-item-tit">实力好货</text>
					<text>正品保障放心卖</text>
				</view>
			</view>

			<mescroll-uni ref="mescroll" @getData="getData" top="440" :size="5">
				<view class="goods" slot="list">
					<view
						class="goods-list"
						v-if="goodsList.length != 0"
						v-for="(item, index) in goodsList"
						:key="index"
						@click="toGoodsDetail(item.sku_id)"
						@longtap="delFollowTip(item.collect_id, index)"
					>
						<view class="goods-item">
							<view class="goods-image">
								<image v-if="item.sku_image" :src="$util.img(item.sku_image, { size: 'mid' })" @error="imgError(index)" mode="aspectFill"></image>
								<image v-else :src="$util.getDefaultImage().default_goods_img" mode="aspectFill"></image>
							</view>
							<view class="goods-desc-wrap">
								<view class="goods-desc">
									<view class="goods-name">
										<text class="name">{{ item.sku_name }}</text>
									</view>
									<view class="goods-bottom">
										<view class="goods-price">
											<text class="font-size-tag">￥</text>
											{{ item.discount_price }}
										</view>
										<view class="good-share-money color-base-text">
											<view class="level_money">
												<view class="money_sign">佣金:</view>
												<view class="money color-base-text">￥{{ item.commission_money }}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<ns-empty v-if="emptyShow && goodsList.length == 0" :isIndex="!1" :fixed="!1"></ns-empty>
				</view>
			</mescroll-uni>
		</block>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
import MescrollMixin from '@/components/mescroll/mescroll-mixins.js';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			goodsList: [],
			emptyShow: false,
			searchText: '',
			account: 0,
			memberImg: '',
			memberName: ''
		};
	},
	mixins: [fenxiaoWords, MescrollMixin, globalConfig],
	onShow() {
		// 刷新多语言
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
			uni.setNavigationBarTitle({
				title: this.fenxiaoWords.concept + '商品'
			});
			if (uni.getStorageSync('token')) {
				this.getMemberInfo();
			} else {
				this.$util.redirectTo(
					'/pages/login/login/login',
					{
						back: '/otherpages/fenxiao/goods/goods'
					},
					'redirectTo'
				);
			}
		}
	},
	methods: {
		getData(mescroll) {
			this.emptyShow = false;
			if (mescroll.num == 1) {
				this.withdrawList = [];
			}
			this.$api.sendRequest({
				url: '/fenxiao/api/goodscollect/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					keyword: this.searchText.trim()
				},
				success: res => {
					this.emptyShow = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data && res.data.list) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//搜索
		search() {
			this.$refs.mescroll.refresh();
		},
		//获取个人信息
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/detail',
				data: {},
				success: res => {
					if (res.code == 0 && res.data) {
						this.account = res.data.account;
						if (res.data.headimg) {
							this.memberImg = res.data.headimg;
						} else {
							this.memberImg = this.$util.getDefaultImage().default_headimg;
						}
						this.memberName = res.data.fenxiao_name;
					}
				}
			});
		},
		imgError(index) {
			this.goodsList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		goTixian() {
			this.$util.redirectTo('/otherpages/fenxiao/withdraw_apply/withdraw_apply');
		},
		//跳转至商品详情
		toGoodsDetail(e) {
			this.$util.redirectTo('/pages/goods/detail/detail', {
				sku_id: e
			});
		},
		//取消关注
		delFollowTip(e, f) {
			uni.showActionSheet({
				itemList: ['取消关注'],
				success: res => {
					if (res.tapIndex == 0) {
						this.delFollow(e, f);
					}
				},
				fail: res => {}
			});
		},
		delFollow(e, f) {
			this.$api.sendRequest({
				url: '/fenxiao/api/goodscollect/delete',
				data: {
					collect_id: e
				},
				success: res => {
					let msg = '';
					if (res.code == 0) {
						msg = '取消成功';
					} else {
						msg = res.message;
					}
					this.$util.showToast({
						title: msg
					});

					let arr = this.goodsList;
					arr.splice(f, 1);
					this.goodsList = arr;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.fx_adv {
	width: 100%;
	display: block;
}

.fenxiao-menu {
	margin: 24rpx;
	height: 124rpx;
	display: flex;
	background-color: #ffffff;
	align-items: center;

	.menu-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-left: 36rpx;

		.menu-item-tit {
			font-size: 24rpx;
			color: #000000;
		}

		text {
			color: #838383;
			font-size: 20rpx;
		}
	}

	.shu {
		width: 1rpx;
		height: 92rpx;
		border: 1rpx solid #eaeaea;
	}
}

.goods {
	box-sizing: border-box;
	margin-top: 22rpx;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;

	.goods-list {
		width: 342rpx;
		height: 466rpx;
		background-color: #ffffff;
		border-radius: 5rpx;
		box-sizing: border-box;
		margin: 24rpx 0 24rpx 24rpx;

		.goods-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.goods-image {
				width: 301rpx;
				height: 301rpx;
				border-radius: 5rpx;
				margin-top: 19rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 5rpx;
					box-sizing: border-box;
				}
			}

			.goods-desc-wrap {
				padding: 22rpx;

				.goods-desc {
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.goods-name {
						width: 100%;

						.name {
							line-height: 1.3;
							font-weight: 600;
							word-break: break-all;
							text-overflow: ellipsis;
							overflow: hidden;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							font-size: $font-size-base;
							color: #000000;
						}
					}

					.goods-bottom {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 23rpx 29rpx 0 0;

						.goods-price {
							font-size: 28rpx;
							color: #000000;
						}

						.good-share-money {
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
							font-size: 28rpx;
						}

						.level_money {
							margin-right: 10rpx;
							display: flex;
							justify-content: center;
							align-items: center;

							.money_sign {
								line-height: 1;
								display: flex;
								justify-content: center;
								align-items: center;
								float: left;
								font-size: $font-size-base;
							}

							.money {
								float: left;
								height: 100%;
								line-height: 38rpx;
								font-size: $font-size-base;
							}
						}
					}
				}
			}
		}
	}
}
</style>
