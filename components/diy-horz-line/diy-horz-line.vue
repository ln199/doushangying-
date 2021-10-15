<template>
	<view :style="{ paddingLeft: value.padding * 2 + 'rpx', paddingRight: value.padding * 2 + 'rpx', margin: value.margin * 2 + 'rpx 0' }">
		<view :style="{ borderTop: '2rpx ' + value.borderStyle + ' ' + value.color }"></view>
	</view>
</template>

<script>
// 辅助线
export default {
	name: 'diy-horz-line',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style></style>
