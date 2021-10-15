export default {
	computed: {
		Development() {
			return this.$store.state.Development;
		},
		//全局主题样式
		themeStyleScore() {
			return this.$store.state.themeStyle;
		},
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		},
		//插件是否存在
		addonIsExit() {
			return this.$store.state.addonIsExit
		},
		wholeSaleNumber() {
			return this.$store.state.wholeSaleNumber
		},
		showToastValue() {
			return this.$store.state.showToastValue
		},
		diySeckillInterval() {
			return this.$store.state.diySeckillInterval
		}
	}
}
