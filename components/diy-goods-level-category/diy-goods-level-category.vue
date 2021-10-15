<template>
	<view class="level-index">
		<template v-if="value.level == 1">
			<diy-goods-level-one-first
				:type="value.template"
				:categoryHeight="categoryHeight"
				v-if="value.template == 1"
				:value="value"
				:siteId="siteId"
				@netFinish="netFinish"
			></diy-goods-level-one-first>
			<diy-goods-level-one-second
				:type="value.template"
				:categoryHeight="categoryHeight"
				v-if="value.template == 2"
				:value="value"
				:siteId="siteId"
				@netFinish="netFinish"
			></diy-goods-level-one-second>
			<diy-goods-level-one-third
				:type="value.template"
				:categoryHeight="categoryHeight"
				v-if="value.template == 3"
				:value="value"
				:siteId="siteId"
				@netFinish="netFinish"
			></diy-goods-level-one-third>
		</template>

		<template v-if="value.level == 2">
			<diy-goods-level-two-first
				:categoryHeight="categoryHeight"
				:type="value.template"
				v-if="value.template == 1"
				:value="value"
				:siteId="siteId"
				@netFinish="netFinish"
			></diy-goods-level-two-first>
			<diy-goods-level-two-second
				:categoryHeight="categoryHeight"
				:type="value.template"
				v-if="value.template == 2"
				:value="value"
				:siteId="siteId"
				@netFinish="netFinish"
			></diy-goods-level-two-second>
			<diy-goods-level-two-third
				:categoryHeight="categoryHeight"
				:type="value.template"
				v-if="value.template == 3"
				:value="value"
				:siteId="siteId"
				@netFinish="netFinish"
			></diy-goods-level-two-third>
		</template>

		<template v-if="value.level == 3">
			<diy-goods-level-three-first :type="value.template" v-if="value.template == 1" :value="value" @netFinish="netFinish"></diy-goods-level-three-first>
			<diy-goods-level-three-second :type="value.template" v-if="value.template == 2" :value="value" @netFinish="netFinish"></diy-goods-level-three-second>
			<diy-goods-level-three-third :type="value.template" v-if="value.template == 3" :value="value" @netFinish="netFinish"></diy-goods-level-three-third>
		</template>
	</view>
</template>

<script>
import diyGoodsLevelOneFirst from '@/components/diy-goods-level-category/diy-goods-level-one-first.vue';
import diyGoodsLevelOneSecond from '@/components/diy-goods-level-category/diy-goods-level-one-second.vue';
import diyGoodsLevelOneThird from '@/components/diy-goods-level-category/diy-goods-level-one-third.vue';
import diyGoodsLevelTwoFirst from '@/components/diy-goods-level-category/diy-goods-level-two-first.vue';
import diyGoodsLevelTwoSecond from '@/components/diy-goods-level-category/diy-goods-level-two-second.vue';
import diyGoodsLevelTwoThird from '@/components/diy-goods-level-category/diy-goods-level-two-third.vue';
import diyGoodsLevelThreeFirst from '@/components/diy-goods-level-category/diy-goods-level-three-first.vue';
import diyGoodsLevelThreeSecond from '@/components/diy-goods-level-category/diy-goods-level-three-second.vue';
import diyGoodsLevelThreeThird from '@/components/diy-goods-level-category/diy-goods-level-three-third.vue';
export default {
	name: 'diy-goods-level-category',
	components: {
		diyGoodsLevelOneFirst,
		diyGoodsLevelOneSecond,
		diyGoodsLevelOneThird,
		diyGoodsLevelTwoFirst,
		diyGoodsLevelTwoSecond,
		diyGoodsLevelTwoThird,
		diyGoodsLevelThreeFirst,
		diyGoodsLevelThreeSecond,
		diyGoodsLevelThreeThird
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
		},
		categoryHeight: {
			type: [Number, String],
			default: 0
		}
	},
	methods: {
		netFinish() {
			this.$emit('netFinish', true);
		}
	}
};
</script>
<style lang="scss">
.level-index {
	height: 100%;
}
</style>
