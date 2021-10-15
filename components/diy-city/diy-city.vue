<template>
	<view class="city-wrap" @click="$util.redirectTo('/otherpages/index/city/city')">
		<view class="city-left">
			当前城市是：{{city}}
		</view>
		<view class="city-right">
			<text>切换</text>
			<text class="iconfont iconright"></text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'diy-text',
	props: {
		value: {
			type: Object
		}
	},
	data(){
		return {
			city: ''
		};
	},
	created() {
		if(uni.getStorageSync('city'))
			this.city = uni.getStorageSync('city').title;
	},
};
</script>

<style lang="scss">
	.city-wrap{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		.city-right{
			display: flex;
			align-items: center;
			color: $color-tip;
		}
	}
</style>
