<template>
	<view class="search-box">
		<view class="search-content">
			<input
				type="text"
				class="uni-input font-size-tag"
				maxlength="50"
				placeholder="商品搜索"
				v-model="searchText"
				confirm-type="search"
				@confirm="search()"
				disabled="true"
				@click="search()"
			/>
			<text class="iconfont iconsousuo1" @click="search()"></text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-search',
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		siteId:{
			type: [Number,String],
			default: () => {
				return 0;
			}
		}
	},
	data() {
		return {
			searchText: ''
		};
	},
	methods: {
		search() {
			this.$util.redirectTo('/otherpages/goods/search/search',{siteId:this.siteId});
		}
	}
};
</script>

<style lang="scss">
/* 修改搜索框的高度时，会影响分类高度，修改时统一修改 */
.search-box {
	position: relative;
	padding: 30rpx;
	display: flex;
	align-items: center;
}

.location {
	height: 80rpx;
	line-height: 80rpx;
	padding-right: 10rpx;
	font-weight: 600;
}

.location .iconiconangledown {
	display: inline-block;
	font-weight: bold;
	font-size: $font-size-toolbar;
}

.search-add {
	padding: 0 10rpx;
	display: flex;
	align-items: center;
	margin-right: 20rpx;
	text {
		padding: 0 5rpx;
	}
}

.search-content {
	position: relative;
	height: 70rpx;
	border-radius: 40rpx;
	flex: 1;
	background-color: $color-bg;
}

.search-content input {
	box-sizing: border-box;
	display: block;
	height: 70rpx;
	width: 100%;
	padding: 0 20rpx 0 40rpx;
	background: $color-bg;
	color: #333;
	border-radius: 40rpx;
}

.search-content .iconfont {
	position: absolute;
	top: 50%;
	right: 10rpx;
	transform: translateY(-50%);
	font-size: $font-size-toolbar;
	z-index: 10;
	color: #89899a;
	width: 80rpx;
	text-align: center;
}
</style>
