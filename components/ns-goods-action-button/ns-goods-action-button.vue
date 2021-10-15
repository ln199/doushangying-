<template>
	<view :data-theme="themeStyle">
		<view class="action-buttom-wrap disabled" v-if="disabled" @click="clickEvent">{{ disabledText }}</view>
		<view class="action-buttom-wrap" :class="[backgroundClass, textPrice ? 'has-second' : '', background ? 'color-join-cart' : 'color-base-bg']" v-else @click="clickEvent">
			<text>{{ textPrice }}</text>
			<text>{{ text }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-goods-action-button',
	props: {
		// 商品底部按钮文字
		text: {
			type: String,
			default: ''
		},
		// 商品底部按钮价格文字
		textPrice: {
			type: String,
			default: ''
		},
		// 背景色
		background: {
			type: String,
			default: ''
		},
		// 背景色样式
		backgroundClass: {
			type: String,
			default: ''
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		// 禁用文字提示
		disabledText: {
			type: String,
			default: ''
		}
	},
	computed: {
		// 使用对象展开运算符将此对象混入到外部对象中
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		}
	},
	methods: {
		clickEvent() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss">
.action-buttom-wrap {
	flex: 1;
	height: 100rpx;
	font-weight: 500;
	font-size: $font-size-tag;
	line-height: 100rpx;
	border: none;
	color: #fff;
	text-align: center;
}

.action-buttom-wrap.has-second {
	line-height: 50rpx;
}

.action-buttom-wrap.has-second text {
	display: block;
	line-height: 1.2;
}

.action-buttom-wrap:active {
	opacity: 0.8;
}

.action-buttom-wrap.disabled {
	background: $color-disabled;
}
</style>
