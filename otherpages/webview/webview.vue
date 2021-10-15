<template>
	<view>
		<web-view :src="link"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				link: ''
			};
		},
		onLoad(option) {
			if (option.link) {
				this.link = decodeURIComponent(option.link);
			}
		}
	};
</script>