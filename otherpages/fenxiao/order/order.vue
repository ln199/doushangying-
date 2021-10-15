<template>
	<view :data-theme="themeStyle">
		<block v-if="addonIsExit.fenxiao">
			<view class="withdraw-cate">
				<view class="cate-li" v-for="(item, index) in category" :key="index" @click="selectCate(item.id)">
					<view class="li-con" :class="{ 'active color-base-text color-base-bg-before': selectId == item.id }">{{ item.name }}</view>
				</view>
			</view>
			<mescroll-uni ref="mescroll" @getData="getData" top="90" class="member-point" :size="8">
				<view class="goods_list" slot="list">
					<view class="order-list">
						<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex" @click="toDetail(orderItem.fenxiao_order_id)">
							<view class="order-header">
								<text class="site-name font-size-base">{{ orderItem.order_no }}</text>
								<text class="status-name color-base-text" v-if="orderItem.is_refund == 1">已退款</text>
								<text class="status-name color-text-green" v-else-if="orderItem.is_settlement == 1">已结算</text>
								<text class="status-name color-text-orange" v-else>待结算</text>
							</view>

							<view class="order-body">
								<view class="goods-wrap">
									<view class="goods-img">
										<image :src="$util.img(orderItem.sku_image, { size: 'mid' })" @error="imgError(orderIndex)" mode="aspectFill" :lazy-load="true"></image>
									</view>
									<view class="goods-info">
										<view class="top-wrap">
											<view class="goods-name font-size-base">{{ orderItem.sku_name }}</view>
											<view>
												<text class="color-tip">返{{ fenxiaoWords.account }}</text>
												<text class="color-base-text font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
												<text class="color-base-text font-size-toolbar">{{ orderItem.commission }}</text>
											</view>
										</view>
										<view class="goods-sub-section">
											<view class="goods-price">
												<text class="unit color-base-text">{{ $lang('common.currencySymbol') }}</text>
												<text class="color-base-text font-size-toolbar">{{ orderItem.price }}</text>
											</view>
											<view>
												<text>
													<text class="iconfont iconclose"></text>
													{{ orderItem.num }}
												</text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="order-footer">
								<view class="order-base-info active">
									<view class="order-type ">
										<text class="color-tip">{{ $util.timeStampTurnTime(orderItem.create_time) }}</text>
									</view>
									<view class="total">
										<text>合计：</text>
										<text class="color-base-text">{{ $lang('common.currencySymbol') }}</text>
										<text class="font-size-toolbar color-base-text">{{ orderItem.real_goods_money }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="cart-empty">
						<ns-empty text="暂无订单" :isIndex="!1" v-if="selectId == 0 && orderList.length == 0 && emptyShow"></ns-empty>
						<ns-empty text="暂无待结算订单" :isIndex="!1" v-if="selectId == 1 && orderList.length == 0 && emptyShow"></ns-empty>
						<ns-empty text="暂无已结算订单" :isIndex="!1" v-if="selectId == 2 && orderList.length == 0 && emptyShow"></ns-empty>
						<ns-empty text="暂无已退款订单" :isIndex="!1" v-if="selectId == 3 && orderList.length == 0 && emptyShow"></ns-empty>
					</view>
				</view>
			</mescroll-uni>

			<loading-cover ref="loadingCover"></loading-cover>
		</block>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			category: [
				{
					id: 0,
					name: '全部',
					number: 2
				},
				{
					id: 1,
					name: '待结算',
					number: 0
				},
				{
					id: 2,
					name: '已结算',
					number: 0
				},
				{
					id: 3,
					name: '已退款',
					number: 0
				}
			],
			selectId: 0,
			orderList: [],
			emptyShow: false
		};
	},
	components: {},
	mixins: [fenxiaoWords, globalConfig],
	onShow() {
		this.$langConfig.refresh();
		if (!this.addonIsExit.fenxiao) {
			this.$util.showToast({
				title: '分销未开启',
				mask: true
			});
			setTimeout(() => {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			}, 1000);
		} else {
			this.getFenxiaoWrods();
			this.$langConfig.title(this.fenxiaoWords.concept + '订单');
			if (uni.getStorageSync('token')) {
			} else {
				this.$util.redirectTo(
					'/pages/login/login/login',
					{
						back: '/otherpages/fenxiao/order/order'
					},
					'redirectTo'
				);
			}
		}
	},
	methods: {
		getData(mescroll) {
			this.emptyShow = false;
			if (mescroll.num == 1) {
				this.orderList = [];
			}
			this.$api.sendRequest({
				url: '/fenxiao/api/order/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					is_settlement: this.selectId
				},
				success: res => {
					this.emptyShow = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data && res.data.list) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
					this.orderList = this.orderList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		selectCate(e) {
			this.selectId = e;
			this.$refs.mescroll.refresh();
		},
		toDetail(e) {
			this.$util.redirectTo('/otherpages/fenxiao/order_detail/order_detail', {
				id: e
			});
		},
		imgError(index) {
			this.orderList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/order.scss';
</style>
