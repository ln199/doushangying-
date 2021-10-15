<template>
	<view :style="{ backgroundColor: value.backgroundColor, height: value.height * 2 + 'rpx', margin: '0 ' + value.marginLeftRight * 2 + 'rpx' }"></view>
</template>

<script>
// 辅助空白
export default {
	name: 'diy-horz-blank',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {};
	},
	created() {},
	methods: {}
};
</script>

<style></style>
