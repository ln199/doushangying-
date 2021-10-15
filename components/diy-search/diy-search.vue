<template>
	<view>
		<view class="search-box" :style="{ backgroundColor: value.backgroundColor }">
			<view class="img" v-if="value.searchType == 2"><image :src="$util.img(value.searchImg)" mode="aspectFit"></image></view>
			<view class="location" @click="$util.redirectTo('/otherpages/index/city/city')" v-if="value.searchType == 3" :style="{color: value.textColor}">
				<text class="iconfont iconzuobiao"></text>
				<text>{{ city }}</text>
			</view>	
			<view class="search-content" :style="{ textAlign: value.textAlign, borderRadius: borderRadius }">
				<input
					type="text"
					class="uni-input ns-font-size-base"
					maxlength="50"
					:placeholder="value.title"
					v-model="searchText"
					confirm-type="search"
					@confirm="search()"
					disabled="true"
					@click="search()"
					:placeholderStyle="placeholderStyle"
					:style="{ backgroundColor: value.bgColor }"
				/>
				<text class="iconfont iconsousuo2" @click="search()" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }"></text>
			</view>
		</view>
	</view>
</template>

<script>
// 搜索
export default {
	name: 'diy-search',
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		city: {
			type: String,
			value: ''
		},
		siteId: {
			type: [Number, String],
			default: 0
		},
		redirectUrl: {
			type: [String],
			default: '/otherpages/goods/search/search'
		}
	},
	data() {
		return {
			searchText: ''
		};
	},
	created() {
		if (!this.value.searchType) {
			this.value.searchType = 1;
		}
	},
	methods: {
		search() {
			this.$util.redirectTo(this.redirectUrl);
		}
	},
	computed: {
		borderRadius() {
			return this.value.borderType == 1 ? 10 + 'rpx' : 50 + '%';
		},
		placeholderStyle() {
			let str = '';
			if (this.value.textColor) {
				str = 'color:' + this.value.textColor;
			} else {
				str = 'color: rgba(0,0,0,0)';
			}
			return str;
		}
	}
};
</script>

<style lang="scss">
.search-box {
	position: relative;
	padding: 20rpx 10rpx;
	// background: #fff;
	display: flex;
	align-items: center;
	border-radius: 10rpx;
	.img {
		width: 170rpx;
		height: 60rpx;
		margin-right: 20rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
}

.location {
	height: 80rpx;
	line-height: 80rpx;
	padding-right: 10rpx;
	margin-right: 16rpx;
	font-weight: 600;
}

.location .iconzuobiao {
	display: inline-block;
	margin-right: 10rpx;
	font-weight: bold;
	font-size: $font-size-toolbar;
	color: red;
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
	height: 78rpx;
	border-radius: 40rpx;
	flex: 1;
}

.search-content input {
	box-sizing: border-box;
	display: block;
	height: 77rpx;
	width: 100%;
	padding: 0 20rpx 0 40rpx;
	color: #333333;
	border-radius: 40rpx;
}

.search-content .iconfont {
	position: absolute;
	top: 50%;
	right: 40rpx;
	transform: translateY(-50%);
	font-size: $font-size-toolbar;
	z-index: 10;
	color: #89899a;
	width: 80rpx;
	text-align: center;
	font-size: 30rpx;
}
</style>
