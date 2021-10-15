<template>
	<view
		class="uni-calendar-item__weeks-box"
		:class="{
			'uni-calendar-item--disable': weeks.disable,
			'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
			'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
			'uni-calendar-item--before-checked': weeks.beforeMultiple,
			'uni-calendar-item--multiple': weeks.multiple,
			'uni-calendar-item--after-checked': weeks.afterMultiple
		}"
		@click="choiceDate(weeks)"
	>
		<view class="uni-calendar-item__weeks-box-item">
			<text v-if="selected && weeks.extraInfo" class="uni-calendar-item__weeks-box-circle"></text>
			<text
				class="uni-calendar-item__weeks-box-text"
				:class="{
					'uni-calendar-item--isDay-text': weeks.isDay,
					'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
					'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
					'uni-calendar-item--before-checked': weeks.beforeMultiple,
					'uni-calendar-item--multiple': weeks.multiple,
					'uni-calendar-item--after-checked': weeks.afterMultiple,
					'uni-calendar-item--disable': weeks.disable
				}"
			>
				{{ weeks.date }}
			</text>
			<text
				v-if="!lunar && !weeks.extraInfo && weeks.isDay"
				class="uni-calendar-item__weeks-lunar-text"
				:class="{
					'uni-calendar-item--isDay-text': weeks.isDay,
					'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
					'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
					'uni-calendar-item--before-checked': weeks.beforeMultiple,
					'uni-calendar-item--multiple': weeks.multiple,
					'uni-calendar-item--after-checked': weeks.afterMultiple
				}"
			></text>
			<text
				v-if="lunar && !weeks.extraInfo"
				class="uni-calendar-item__weeks-lunar-text"
				:class="{
					'uni-calendar-item--isDay-text': weeks.isDay,
					'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
					'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
					'uni-calendar-item--before-checked': weeks.beforeMultiple,
					'uni-calendar-item--multiple': weeks.multiple,
					'uni-calendar-item--after-checked': weeks.afterMultiple,
					'uni-calendar-item--disable': weeks.disable
				}"
			>
				{{ weeks.isDay ? '今天' : weeks.lunar.IDayCn === '初一' ? weeks.lunar.IMonthCn : weeks.lunar.IDayCn }}
			</text>
			<text
				v-if="weeks.extraInfo && weeks.extraInfo.info"
				class="uni-calendar-item__weeks-lunar-text"
				:class="{
					'uni-calendar-item--extra': weeks.extraInfo.info,
					'uni-calendar-item--isDay-text': weeks.isDay,
					'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
					'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
					'uni-calendar-item--before-checked': weeks.beforeMultiple,
					'uni-calendar-item--multiple': weeks.multiple,
					'uni-calendar-item--after-checked': weeks.afterMultiple,
					'uni-calendar-item--disable': weeks.disable
				}"
			>
				{{ weeks.extraInfo.info }}
			</text>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		weeks: {
			type: Object,
			default() {
				return {};
			}
		},
		calendar: {
			type: Object,
			default: () => {
				return {};
			}
		},
		selected: {
			type: Array,
			default: () => {
				return [];
			}
		},
		lunar: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		choiceDate(weeks) {
			this.$emit('change', weeks);
		}
	}
};
</script>

<style lang="scss" scoped>
.uni-calendar-item__weeks-box {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.uni-calendar-item__weeks-box-text {
	font-size: 24rpx;
	color: #fff;
}

.uni-calendar-item__weeks-lunar-text {
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.uni-calendar-item__weeks-box-item {
	position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
}

.uni-calendar-item__weeks-box-circle {
	position: absolute;
	top: 5px;
	right: 5px;
	width: 8px;
	height: 8px;
	border-radius: 8px;
	background-color: $uni-color-error;
}

.uni-calendar-item--disable {
	color: #feaa93;
}

.uni-calendar-item--isDay-text {
	color: #fff;
}

.uni-calendar-item--isDay {
	color: #000;
	background-color: #fff;
	border-radius: 50%;
}

.uni-calendar-item--extra {
	// color: $uni-color-error;
	// opacity: 0.8;
}

.uni-calendar-item--checked {
	color: #fff;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
}

.uni-calendar-item--multiple {
	background-color: $uni-color-primary;
	color: #fff;
	opacity: 0.8;
}
.uni-calendar-item--before-checked {
	background-color: #ff5a5f;
	color: #fff;
}
.uni-calendar-item--after-checked {
	background-color: #ff5a5f;
	color: #fff;
}
</style>
