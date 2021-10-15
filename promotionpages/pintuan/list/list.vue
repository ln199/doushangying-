<template>
	<view :data-theme="themeStyle">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExit.pintuan">
			<block slot="list">
				<ns-adv keyword="NS_PINTUAN"></ns-adv>
				<view class="goods-list single-column" v-if="dataList.length">
					<view class="goods-item margin-bottom" v-for="(item, index) in dataList" :key="index">
						<view class="goods-img" @click="toDetail(item)">
							<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
							<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
						</view>
						<view class="info-wrap">
							<view class="name-wrap">
								<view class="goods-name" @click="toDetail(item)">{{ item.goods_name }}</view>
								<view class="pintuan-info">
									<text v-if="item.order_num" class="color-base-text font-size-activity-tag pintuan-num">已团{{ item.order_num }}件</text>
									<text class="color-base-border color-base-text font-size-activity-tag">{{ item.pintuan_num }}人团</text>
								</view>
							</view>
							<view class="lineheight-clear">
								<view class="discount-price">
									<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
									<text class="price color-base-text font-size-toolbar">{{ item.pintuan_price }}</text>
								</view>
							</view>
							<view class="pro-info">
								<view class="delete-price font-size-activity-tag color-tip">
									<text class="font-size-tag lineheight-clear txt">单购价：</text>
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									{{ item.price }}
								</view>
								<view @click="toDetail(item)"><button type="primary" size="mini">去拼团</button></view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="!dataList.length"><ns-empty :fixed="!1" text="暂无拼团"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import nsAdv from '@/components/ns-adv/ns-adv.vue';
export default {
	data() {
		return {
			dataList: [],
			siteId: 0
		};
	},
	mixins: [globalConfig],
	components: {
		nsAdv
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
			if (!data.pintuan) {
				this.$util.showToast({
					title: '拼团未开启',
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
				url: '/pintuan/api/goods/page',
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
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
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
			this.$util.redirectTo('/promotionpages/pintuan/detail/detail', {
				pintuan_id: e.pintuan_id
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
</style>
