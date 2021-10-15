<template>
	<view :data-theme="themeStyle">
		<mescroll-uni @getData="getData" refs="mescroll" :size="10" v-if="addonIsExit.wholesale" style="background-color: #007AFF;">
			<block slot="list">
				<view class="goods-list single-column" v-if="dataList.length">
					<view class="goods-item margin-bottom" v-for="(item, index) in dataList" :key="index">
						<view class="goods-img" @click="toDetail(item)">
							<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
							<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
						</view>
						<view class="info-wrap">
							<view class="name-wrap">
								<view class="goods-name" @click="toDetail(item)">{{ item.goods_name }}</view>
								<view class="introduction font-size-activity-tag color-tip">库存{{ item.goods_stock }}件</view>
							</view>
							<view class="lineheight-clear">
								<view class="discount-price">
									<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
									<text class="price color-base-text font-size-toolbar">{{ item.show_prce }}</text>
								</view>
							</view>
							<view class="pro-info">
								<view class=" font-size-activity-tag color-tip">
									<block>
										<text class="unit">已售</text>
										{{ item.sale_num }}件
									</block>
								</view>
								<view @click="toDetail(item)">
									<button type="primary" size="mini">{{ item.min_num }}件起批</button>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="!dataList.length"><ns-empty :siteId="siteId" :fixed="false"></ns-empty></view>
			</block>
		</mescroll-uni>
		<drag-button :isDock="true" :existTabBar="true" @btnClick="btnClick" />
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import dragButton from '@/components/drag-button/drag-button.vue';
import diyWholeSale from '@/components/diy-wholesale/diy-wholesale.vue';
export default {
	components: {
		dragButton,
		diyWholeSale
	},
	data() {
		return {
			dataList: [],
			siteId: 0
		};
	},
	mixins: [globalConfig],
	onLoad(options) {
		if (options.site_id) {
			this.siteId = options.site_id;
		}
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.wholesale) {
				this.$util.showToast({
					title: '批发活动未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			}
		});
	},
	methods: {
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/wholesale/api/goods/page',
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
						this.$util.showToast({ title: msg });
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表

					newArr.forEach(item => {
						item.show_prce = item.min_price == item.max_price ? item.min_price : +item.min_price + ' ~ ￥' + item.max_price;
					});
					this.dataList = this.dataList.concat(newArr); //追加新数据
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
			this.$util.redirectTo('/promotionpages/wholesale/detail/detail', {
				goods_id: e.goods_id
			});
		},
		imgError(index) {
			this.goodsList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		btnClick() {
			this.$util.redirectTo('/promotionpages/wholesale/cartList/cartList');
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().default_goods_img;
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
	}
};
</script>
<style lang="scss">
@import '../public/css/list.scss';
.desc-con {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;

	.desc-price {
		line-height: 1;
	}

	.old-price {
		text-decoration: line-through;
		color: $color-tip;
		font-size: $font-size-tag;
	}

	.desc-pin {
		font-size: $font-size-base;
		color: #fff;
		padding: 0 $padding;
		height: 48rpx;
		line-height: 48rpx;
		border-radius: 48rpx;
	}
}
</style>
