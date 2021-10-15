<template>
	<view class="shop-search">
		<diy-shop-info :siteId="siteId" :type="0"></diy-shop-info>
		<view class="shop-info">
			<view class="search-box">
				<view class="search-content">
					<input type="text" class="uni-input font-size-base" maxlength="50" placeholder="搜索店内宝贝" v-model="inputValue"
					 confirm-type="search" @confirm="search()" />
					<text class="iconfont iconIcon_search" @click="search()"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import diyShopInfo from '@/components/diy-shop-info/diy-shop-info.vue';
	export default {
		components: {
			diyShopInfo
		},
		data() {
			return {
				siteId: 0,
				inputValue: ''
			};
		},
		onLoad(options) {
			if (!options.site_id) {
				this.$util.redirectTo('/otherpages/shop/index/index', {}, 'redirectTo');
				return;
			}
			this.siteId = options.site_id;
		},
		onShow() {
			this.$langConfig.refresh();
		},
		methods: {
			//点击其他列表搜索 例如热搜
			otherSearch(e) {
				this.inputValue = e;
				this.search();
			},
			//搜索
			search() {
				if (this.inputValue.trim()) {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						keyword: this.inputValue.trim(),
						site_id: this.siteId
					});
				} else {
					this.$util.showToast({
						title: '搜索内容不能为空哦'
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.shop-info {
		width: 100%;
		padding: $padding;
		box-sizing: border-box;
		background: #fff;
	}

	.search-content {
		background-color: #F4F4F4;
	}

	.shop-search {
		.search-box {
			position: relative;
			background: #fff;
		}

		.search-box input {
			display: block;
			height: 64rpx;
			width: 590rpx;
			padding: 0 20rpx;
			background: #f4f4f4;
			color: #333333;
		}

		.search-box .iconfont {
			position: absolute;
			top: 50%;
			right: 20rpx;
			transform: translateY(-50%);
			font-size: 40rpx;
			z-index: 10;
			color: #89899a;
			width: 80rpx;
			text-align: center;
		}
	}
</style>
