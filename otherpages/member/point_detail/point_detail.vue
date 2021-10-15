<template>
	<view :data-theme="themeStyle">
		<view class="tab color-bg">
			<view>
				<picker mode="date" :value="searchType.date" @change="bindDateChange" fields="month">
					<view class="uni-input">
						{{ date }}
						<text class="iconfont iconiconangledown"></text>
					</view>
				</picker>
			</view>
			<view>
				<picker @change="bindPickerChange" :value="pointIndex" :range="pointType" class="picker" range-key="label">
					<text class="desc uni-input">{{ pointType[pointIndex].label }}</text>
					<text class="iconfont iconiconangledown"></text>
				</picker>
			</view>
		</view>

		<mescroll-uni @getData="getData" class="member-point" ref="mescroll">
			<view slot="list">

				<block v-if="dataList.length">
					<view class="detailed-wrap">
						<view class="cont">
							<view class="detailed-item" v-for="(item, index) in dataList" :key="index">
								<view class="info" @click="toFromDetail(item)">
									<view class="event">{{ item.type_name }}</view>
									<view class="time-box">
										<text class="time color-tip">{{ $util.timeStampTurnTime(item.create_time) }}</text>
									</view>
								</view>
								<view class="num color-base-text" v-if="item.account_data > 0">+{{ parseInt(item.account_data) }}</view>
								<view class="num " v-else>{{ parseInt(item.account_data) }}</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="cart-empty">
						<ns-empty></ns-empty>
					</view>
				</block>
			</view>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			});
			return {
				memberAccount: {
					point: 0
				},
				dataList: [],
				memberInfo: {
					headimg: ''
				},
				date: currentDate,
				searchType: {
					from_type: 0,
					date: ''
				},
				pointType: [{
					label: '全部',
					value: '0'
				}], //积分类型
				pointIndex: 0
			};
		},
		mixins: [globalConfig],
		onShow() {
			this.$langConfig.refresh();
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo(
					'/pages/login/login/login', {
						back: '/otherpages/member/point/point'
					},
					'redirectTo'
				);
			}
			this.getMemberInfo();
		},
		onLoad() {
			this.getPointType();
		},
		computed: {},
		methods: {
			bindDateChange: function(e) {
				var temp = e.target.value;
				var tempArr = temp.split('-');
				this.date = tempArr[0] + '年' + tempArr[1] + '月';
				this.searchType.date = e.target.value;
				this.$refs.mescroll.refresh();
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}年${month}月`;
			},
			bindPickerChange(e) {
				this.pointIndex = e.detail.value;
				this.searchType.from_type = this.pointType[this.pointIndex].value;
				this.$refs.mescroll.refresh();
			},
			//获取分类类型
			getPointType() {
				var temp = [],
					that = this;
				this.$api.sendRequest({
					url: '/api/memberaccount/fromType',
					success: res => {
						for (var index in res.point) {
							var obg = {};
							obg.label = res.point[index].type_name;
							obg.value = index;
							that.pointType.push(obg);
						}
					}
				});
			},
			toList() {
				this.$util.redirectTo('/promotionpages/point/list/list');
			},
			toOrderList() {
				this.$util.redirectTo('/promotionpages/point/order_list/order_list');
			},
			toFromDetail(item) {
				if (item.from_type == 'pointexchange') {
					this.$api.sendRequest({
						url: '/pointexchange/api/order/info',
						data: {
							'order_id': item.type_tag
						},
						success: res => {
							if (res.code >= 0) {
								var data = res.data;
								if (data.type == 1 && data.relate_order_id) {
									switch (data.delivery_type) {
										case 'store':
											this.$util.redirectTo('/pages/order/detail_pickup/detail_pickup', {
												order_id: data.relate_order_id
											});
											break;
										case 'local':
											this.$util.redirectTo('/pages/order/detail_local_delivery/detail_local_delivery', {
												order_id: data.relate_order_id
											});
											break;
										default:
											this.$util.redirectTo('/pages/order/detail/detail', {
												order_id: data.relate_order_id
											});
									}
								} else {
									this.$util.redirectTo('/pages/order/detail_point/detail_point', {
										order_id: data.order_id
									});
								}
							}
						}
					});
				} else if (item.from_type == 'pointcash') {
					this.$util.redirectTo('/pages/order/detail/detail', {
						order_id: item.type_tag
					});
				} else if (item.from_type == 'memberconsume') {
					this.$util.redirectTo('/pages/order/detail/detail', {
						order_id: item.type_tag
					});
				}
			},
			//获取个人积分信息
			getAccountInfo() {
				this.$api.sendRequest({
					url: '/api/memberaccount/info',
					data: {
						account_type: 'point'
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.memberAccount = res.data;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			// 会员信息
			getMemberInfo() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code >= 0) {
							this.memberInfo = res.data;
							this.getAccountInfo();
						}
					}
				});
			},
			//获得列表数据
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/api/memberaccount/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						account_type: 'point',
						from_type: this.searchType.from_type,
						date: this.searchType.date
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = this.dataList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	/deep/ .fixed {
		position: relative;
		top: 0;
	}

	.tab {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 10;
		display: flex;
		justify-content: space-between;
		height: 80rpx;
		background-color: $color-bg;

		view {
			flex: 1;
			text-align: center;
			line-height: 80rpx;

			text {
				margin-left: 10rpx;
				font-size: $font-size-base;
			}
		}
	}

	.cart-empty {
		margin-top: 104px !important;
	}

	.account-box {
		width: 100%;
		box-sizing: border-box;
		position: relative;

		>image {
			width: 100%;
			position: absolute;
			top: 0;
			z-index: 1;
		}

		.accout-btn {
			display: flex;
			margin-top: 30rpx;

			view {
				width: 170rpx;
				height: 44rpx;
				border-radius: 22rpx;
				border: 1px solid rgba(255, 255, 255, 0.4);
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 44rpx;
			}
		}

		.account-text {
			position: relative;
			padding: 50rpx 30rpx 34rpx 30rpx;
			display: flex;
			align-items: center;
			z-index: 9;

			.headimg {
				width: 100rpx;
				height: 100rpx;
				background: #fff;
				border: 2px solid #fff;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.point {
				margin-left: 30rpx;
				color: #fff;
				font-size: 36rpx;
			}

			.iconjifen1 {
				color: #fff;
				margin-left: 8rpx;
			}
		}
	}

	.detailed-wrap {
		background: #fff;
		position: relative;
		z-index: 9;
		padding-top: 80rpx;

		.head {
			display: flex;
			height: 90rpx;

			&>view {
				flex: 1;
				text-align: left;
				padding: 0 $padding;
				line-height: 90rpx;
			}
		}

		.cont {
			background: #fff;
			width: 100%;
			margin: 0 auto;

			.detailed-item {
				padding: 30rpx 0 32rpx;
				margin: 0 32rpx;
				border-bottom: 1px solid $color-line;
				position: relative;
				box-sizing: border-box;

				&:last-of-type {
					border-bottom: none;
				}

				.info {
					padding-right: 180rpx;

					.event {
						font-size: $font-size-base;
						line-height: 1.3;
						font-weight: 500;
					}

					.time-box {
						line-height: 1;
						margin-top: 24rpx;
					}

					.time {
						font-size: $font-size-activity-tag;
						color: $color-tip;
					}
				}

				.num {
					width: 160rpx;
					position: absolute;
					right: 17rpx;
					top: 50%;
					transform: translateY(-50%);
					text-align: right;
					font-size: $font-size-toolbar;
					font-weight: 500;
				}
			}
		}
	}
</style>
