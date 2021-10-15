<template>
	<view :data-theme="themeStyle">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExit.bargain && isLoading">
			<block slot="list">
				<ns-adv keyword="NS_BARGAIN"></ns-adv>
				<block v-if="dataList.length > 0 || dataListing.length > 0">
					<view class="goods-list single-column" v-if="dataListing.length">
						<view class="goods-item margin-bottom" v-for="(item, index_item) in dataListing" :key="index_item">
							<view class="goods-img" @click="toDetail(item)">
								<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index_item)"></image>
								<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
							</view>
							<view class="info-wrap">
								<view class="name-wrap">
									<view class="goods-name" @click="toDetail(item)">{{ item.goods_name }}</view>
								</view>
								<view class="bargain_pro">
									<view class="progress">
										<view class="progress_top">
											<view class="progress_info">
												<progress
													percent="20"
													:show-info="false"
													stroke-width="3"
													backgroundColor="#FFC7C7"
													activeColor="#FF4544"
													border-radius="5"
													:percent="progressP(item)"
												/>
											</view>
											<view></view>
										</view>

										<view class="font-size-activity-tag txt lineheight-clear">
											已砍
											<text class="color-base-text">{{ (item.price - item.curr_price).toFixed(2) }}</text>
											元
											<text class="margin-left">
												还剩
												<text class="color-base-text">{{ item.curr_price }}</text>
												元
											</text>
										</view>
									</view>
									<view class="pro-info">
										<view class="delete-price font-size-activity-tag color-tip clockrun">
											<uni-count-down
												:day="item.time.d"
												:hour="item.time.h"
												:minute="item.time.i"
												:second="item.time.s"
												color="#fff"
												borderColor="none"
												splitorColor="#FF4644"
												backgroundColor="#FF4644"
											/>
										</view>
										<view @click="toDetailP(item)"><button type="primary" size="mini">继续砍价</button></view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="goods-list single-column" v-if="dataList.length">
						<view class="goods-item margin-bottom" v-for="(item, index) in dataList" :key="index">
							<view class="goods-img" @click="toDetail(item)">
								<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
								<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
							</view>
							<view class="info-wrap">
								<view class="name-wrap">
									<view class="goods-name" @click="toDetail(item)">{{ item.sku_name }}</view>
									<view class="progress-wrap">
										<progress
											percent="20"
											:show-info="false"
											stroke-width="3"
											backgroundColor="#FFC7C7"
											activeColor="#FF4544"
											border-radius="5"
											:percent="progress(item)"
										/>
										<text class="color-base-text font-size-activity-tag txt lineheight-clear">已砍{{ item.sale_num }}件</text>
									</view>
								</view>
								<view class="lineheight-clear">
									<view class="discount-price">
										<text class="font-size-tag lineheight-clear txt">底价：</text>
										<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
										<text class="price color-base-text font-size-toolbar">{{ item.floor_price }}</text>
									</view>
								</view>
								<view class="pro-info">
									<view class="delete-price font-size-activity-tag color-tip">
										<text class="font-size-tag lineheight-clear txt">原价：</text>
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										<text class="price">{{ item.price }}</text>
									</view>
									<view @click="toDetail(item)"><button type="primary" size="mini">去砍价</button></view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<ns-empty v-if="isLoading && !dataList.length && !dataListing.length" text="暂无砍价商品"></ns-empty>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import nsAdv from '@/components/ns-adv/ns-adv.vue';
import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
export default {
	components: {
		uniCountDown,
		nsAdv
	},
	data() {
		return {
			dataList: [],
			siteId: 0,
			dataListing: [],
			isLoading: true,
			mescroll: null
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
			if (!data.bargain) {
				this.$util.showToast({
					title: '砍价未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			} else {
				if (uni.getStorageSync('token')) {
					this.getDataing();
				}
				this.$refs.mescroll.refresh();
			}
		});
	},
	mixins: [globalConfig],
	methods: {
		getData(mescroll) {
			this.mescroll = mescroll;
			let data = {
				page_size: mescroll.size,
				page: mescroll.num
			};
			if (this.siteId) {
				data.site_id = this.siteId;
			}
			this.$api.sendRequest({
				url: '/bargain/api/goods/page',
				data: data,
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

					if (mescroll.endSuccess) mescroll.endSuccess(newArr.length);

					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据
					this.isLoading = true;
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					if (mescroll.endErr) mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getDataing() {
			let data = {};
			if (this.siteId) {
				data.site_id = this.siteId;
			}
			this.$api.sendRequest({
				url: '/bargain/api/goods/bargainingList',
				data: data,
				success: res => {
					this.dataListing = res.data;
					for (var index in res.data) {
						this.dataListing[index].time = this.$util.countDown(res.data[index].end_time - res.timestamp);
					}
					this.isLoading = true;
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/bargain/detail/detail', {
				bargain_id: e.bargain_id
			});
		},
		toDetailP(e) {
			this.$util.redirectTo('/promotionpages/bargain/launch/launch', {
				id: e.launch_id
			});
		},
		imgError(index) {
			this.dataList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0]
				? this.$util.img(imgs[0], {
						size: 'mid'
				  })
				: this.$util.getDefaultImage().default_goods_img;
		},
		progress(data) {
			let progress = ((parseInt(data.sale_num) / (parseInt(data.bargain_stock) + parseInt(data.sale_num))) * 100).toFixed();
			if (progress == 'NaN') {
				progress = 0;
			}
			return progress;
		},
		progressP(data) {
			let progress = (((parseFloat(data.price) - parseFloat(data.curr_price)) / parseFloat(data.price)) * 100).toFixed();
			if (progress == 'NaN') {
				progress = 0;
			}
			return progress;
		},
		goodsTag(data) {
			switch (data.recommend_way) {
				case 1:
					return '新品';
					break;
				case 2:
					return '精品';
					break;
				case 3:
					return '推荐';
					break;
				default:
					return '';
			}
		}
	},
	onShareAppMessage(res) {
		var title = '砍价，优惠更多哦';
		var path = '/promotionpages/bargain/list/list';
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
@import '../public/css/list.scss';
</style>
<style lang="scss" scoped>
/deep/ .fixed {
	position: relative;
	top: 0;
}

/deep/ .empty {
	margin-top: 0 !important;
}

.clockrun {
	.delete-price {
		max-width: 60%;
	}
}

/deep/ .uni-countdown__number {
	min-width: 32rpx;
	height: 32rpx;
	text-align: center;
	line-height: 32rpx;
	border-radius: 4px;
	display: inline-block;
	padding: 4rpx;
	margin: 0;
	border: none !important;
}

/deep/ .uni-countdown__splitor {
	width: 10rpx;
	height: 32rpx;
	line-height: 36rpx;
	text-align: center;
	display: inline-block;
}

/deep/ .uni-countdown__splitor.day {
	width: initial;
}

.pintuan-top {
	width: 100%;

	image {
		width: 100%;
	}
}

.bargain_pro {
	.progress {
		display: block;
		margin-bottom: 10rpx;

		.progress_top {
			display: flex;

			> view {
				flex: 1;
			}
		}

		view {
			margin-top: 10rpx;
		}
	}

	.pro-info {
		margin-top: $margin-updown;
	}
}
</style>
