<template>
	<scroll-view scroll-y="true" class="store-list" @scrolltolower="getStoreList()">
		<!-- 数据列表 -->
		<view class="item-box" v-for="(item, index) in storeList" :key="index" @click="toDetail(item.store_id, item.site_id)">
			<image class="item-pic" v-if="item.store_image" :src="$util.img(item.store_image)" @error="storeImgError(index)" mode="aspectFill"></image>
			<image class="item-pic" v-else :src="$util.getDefaultImage().default_store_img" mode=""></image>
			<view class="item-desc">
				<view class="desc-info">
					<view class="desc-name">{{ item.store_name }}</view>
				</view>
				<view>
					<view class="desc-date">营业时间：{{ item.open_date }}</view>
					<view class="desc-address">
						<text class="iconfont icondizhi color-base-text"></text>
						{{ item.address }}
					</view>
				</view>
			</view>
			<view class="option color-base-text"><text class="iconfont icondadianhua2 color-base-text" @click.stop="phone(item.telphone)"></text></view>
		</view>
		<!-- 加载中 -->
		<view class="mescroll-upwarp" v-show="isLoading"><ns-loading></ns-loading></view>
	</scroll-view>
</template>

<script>
import nsLoading from '@/components/ns-loading/ns-loading.vue';
export default {
	name: 'diy-shop-store',
	components: {
		nsLoading
	},
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			isAll: false, //判断是否已经达到最大值
			size: 10,
			num: 1,
			isNetwork: 1, //是否可以继续请求
			isLoading: true,
			storeList: []
		};
	},
	created() {
		this.getStoreList();
	},
	methods: {
		toDetail(store_id, site_id) {
			this.$util.redirectTo('/otherpages/shop/store_detail/store_detail', {
				store_id: store_id,
				site_id: site_id
			});
		},
		phone(e) {
			uni.makePhoneCall({
				phoneNumber: e
			});
		},
		storeImgError(index) {
			this.storeList[index].store_image = this.$util.getDefaultImage().default_store_img;
			this.$forceUpdate();
		},
		getStoreList() {
			if (!this.isNetwork) return;
			if (this.isAll) return;
			this.isNetwork = 0;
			if (this.num != 1) {
				this.isLoading = true;
			}

			this.$api.sendRequest({
				url: '/api/store/page',
				data: {
					page: this.num,
					page_size: this.size,
					site_id: this.siteId
				},
				success: res => {
					this.isLoading = false;
					this.isNetwork = 1;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						this.num = this.num + 1;
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}

					if (this.num == 1) this.storeList = []; //如果是第一页需手动制空列表
					this.storeList = this.storeList.concat(newArr); //追加新数据

					if (this.storeList.length == res.data.count) {
						this.isAll = true;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.store-list {
	width: 100%;
	max-height: 100vh;
}

.item-box {
	width: 100%;
	padding: $padding;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	background: #ffffff;
	margin-top: $margin-updown;

	.item-pic {
		width: 180rpx;
		height: 180rpx;
	}

	.item-desc {
		width: calc(100% - 200rpx - 120rpx - 20rpx);
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.desc-info {
			display: flex;
			justify-content: space-between;
			min-height: 75rpx;

			.desc-name {
				font-size: $font-size-base;
				font-weight: 600;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}

		.desc-date {
			font-size: $font-size-tag;
			color: $color-tip;
		}

		.desc-address {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			line-height: 1.5;
			color: $color-tip;
			font-size: $font-size-tag;

			.icondizhi {
				margin: 0 4rpx 0 2rpx;
				font-size: 26rpx;
			}
		}
	}

	.option {
		width: 120rpx;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: $font-size-tag;
		text {
			line-height: 1;
		}
		.iconfont {
			font-size: 40rpx;
			margin-bottom: 30rpx;
		}
	}
}

/* 上拉加载区域 */
.mescroll-upwarp {
}

.no-more {
	width: 100%;
	height: 70rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: $color-tip;
}

.empty-box {
	margin-top: 200rpx;
}
</style>
