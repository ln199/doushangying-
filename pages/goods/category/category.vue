<template>
	<view :data-theme="themeStyle">
		<block v-for="(item, index) in diyData.value" :key="index">
			<view v-if="item.controller == 'GoodsCategory'" :style="categoryHeight">
				<diy-goods-level-category :value="item" :siteId="siteId" @netFinish="netFinish" ref="goodsLevelCategory"></diy-goods-level-category>
			</view>
		</block>
		<loading-cover ref="loadingCover"></loading-cover>

		<!-- 底部tabBar -->
		<view class="page-bottom"><diy-bottom-nav></diy-bottom-nav></view>
	</view>
</template>

<script>
import diyGoodsLevelCategory from '@/components/diy-goods-level-category/diy-goods-level-category.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	components: {
		diyBottomNav,
		diyGoodsLevelCategory
	},
	data() {
		return {
			diyData: {},
			categoryHeight: 0,
			siteId: 0
		};
	},
	mixins: [globalConfig],
	onLoad(data) {
		this.siteId = parseInt(data.site_id) || 0;
		uni.hideTabBar();
		this.getDiyInfo();
	},
	async onShow() {
		await this.getCateHeight();
		this.$langConfig.refresh();
	},
	methods: {
		async getCateHeight() {
			var cateHeight = 0;
			var res = await uni.getSystemInfo({
				async: false
			});

			// 底部导航高度
			cateHeight = res[1].windowHeight - 57;
			if (this.$util.uniappIsIPhoneX()) {
				// #ifdef MP-WEIXIN
				cateHeight -= 31;
				// #endif
			}
			this.categoryHeight = 'height:' + cateHeight + 'px';
		},
		//监听子组件分类列表是否请求完成
		netFinish(e) {
			if (e) {
				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			}
		},
		getDiyInfo() {
			this.$api.sendRequest({
				url: '/api/diyview/info',
				data: {
					name: 'DIY_VIEW_GOODS_CATEGORY'
				},
				success: res => {
					if (res.code != 0 || !res.data) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						return;
					}
					this.diyData = res.data;

					if (this.diyData.value) {
						this.diyData = JSON.parse(this.diyData.value);
					}
					uni.stopPullDownRefresh();
				}
			});
		}
	}
};
</script>

<style lang="scss">
/deep/ .uni-popup__wrapper.uni-center {
	background: rgba(0, 0, 0, 0.6);
}
/deep/.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	border-radius: 10px;
	background: rgba($color: #000000, $alpha: 0);
}
/deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	overflow-y: visible;
}
</style>
