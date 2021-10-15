<template>
	<view
		class="diy-seckill"
		v-if="timeList.length > 1 || (timeList.length == 1 && dataList.length)"
		:style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }"
	>
		<view class="marketing-wrap">
			<image :src="$util.img('/upload/uniapp/bargain/' + value.bgSelect + '.png')" mode="widthFix"></image>

			<view class="marketimg-box">
				<view class="marketimg-box-title">
					<view class="marketimg-box-title-left">
						<image v-if="value.list.imageUrl" :src="$util.img(value.list.imageUrl)" mode="widthFix"></image>

						<view class="seckill-title-time color-base-border" v-if="isNow">
							<view class="seckill-title-name">距离结束</view>
							<view class="seckill-H">{{ seckillH }}</view>
							<view class="symbol">:</view>
							<view class="seckill-I">{{ seckillI }}</view>
							<view class="symbol">:</view>
							<view class="seckill-S">{{ seckillS }}</view>
						</view>
					</view>

					<view class="marketimg-box-title-right" :class="value.bgSelect" @click="toMore()">
						<text>更多秒杀</text>
						<text class="iconfont iconright"></text>
					</view>
				</view>

				<view class="seckill-time-list">
					<scroll-view class="seckil-nav" scroll-x="true" scroll-with-animation :scroll-into-view="'a' + seckillId">
						<!-- active 是选中之后的样式 -->
						<view
							class="nav-item"
							:id="'a' + item.id"
							:class="seckillId == item.id ? 'active' : ''"
							v-for="(item, key) in timeList"
							:key="key"
							@click="ontabtap(item.id, key)"
						>
							<view class="nav-item-con">
								<view class="nav-title">{{ transformSeckillTime(item.seckill_start_time) }}</view>
								<view class="nav-content" :class="seckillId == item.seckill_id ? 'active' : ''" v-if="key > index">敬请期待</view>
								<view class="nav-content" :class="seckillId == item.seckill_id ? 'active' : ''" v-if="key == index && !item.isNow">即将开始</view>
								<view class="nav-content" :class="seckillId == item.seckill_id ? 'active' : ''" v-if="key == index && item.isNow">抢购中</view>
								<view class="nav-content" :class="seckillId == item.seckill_id ? 'active' : ''" v-if="key < index">已结束</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<view class="marketimg-box-con" v-if="value.changeType == 1" @click="isEnd(seckillIndex < index && timeList[index].isNow)">
					<scroll-view class="marketimg-box-con-scroll" :scroll-x="true" :show-scrollbar="false">
						<view v-if="!dataList.length" style="z-index: 1 !important;"><ns-empty :fixed="!1" :isIndex="!1" text="该时间段暂无商品"></ns-empty></view>

						<view v-else class="marketimg-box-con-item" v-for="(dataItem, i) in dataList" :key="i" @click="toDetail(dataItem.id, index)">
							<view class="wrap">
								<view class="img-box">
									<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imgError(i)"></image>
									<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imgError(i)"></image> -->
								</view>
								<view class="content">
									<view class="title">{{ dataItem.goods_name }}</view>
									<view class="price-box color-base-text">
										￥
										<text class="original-price">{{ dataItem.seckill_price }}</text>
									</view>
									<view class="num">￥{{ dataItem.price }}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<view class="marketimg-box-con" v-if="value.changeType == 2" @click="isEnd(seckillIndex < index && timeList[index].isNow)">
					<swiper class="marketimg-swiper" style="height: 340rpx;" :autoplay="false" :current="current" @change="changeCurrent">
						<swiper-item class="swiper-item" v-if="!dataList.length" style="z-index: 1 !important;">
							<ns-empty :fixed="!1" :isIndex="!1" text="该时间段暂无商品"></ns-empty>
						</swiper-item>

						<swiper-item v-else class="swiper-item" v-for="i in Math.ceil(dataList.length / 3)" :key="i">
							<view class="item" style="overflow: hidden;">
								<!-- #ifdef MP-WEIXIN -->
								<block v-for="(dataItem, dataIndex) in dataList" :key="dataIndex" v-if="dataIndex < (i + 1) * 3 && dataIndex >= i * 3">
									<view class="marketimg-box-con-item marketimg-box-con-item_two" @click="toDetail(dataItem.id, dataIndex)">
										<view class="img-box">
											<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imgError(dataIndex)"></image>
											<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imgError(dataIndex)"></image> -->
										</view>
										<view class="content">
											<view class="title">{{ dataItem.goods_name }}</view>
											<view class="price-box color-base-text">
												￥
												<text class="original-price">{{ dataItem.seckill_price }}</text>
											</view>
											<view class="num">￥{{ dataItem.price }}</view>
										</view>
									</view>
								</block>
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								<block v-for="(dataItem, dataIndex) in dataList" :key="dataIndex" v-if="dataIndex < i * 3 && dataIndex >= (i - 1) * 3">
									<view class="marketimg-box-con-item marketimg-box-con-item_two" @click="toDetail(dataItem.id, dataIndex)">
										<view class="img-box">
											<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imgError(dataIndex)"></image>
											<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imgError(dataIndex)"></image> -->
										</view>
										<view class="content">
											<view class="title">{{ dataItem.goods_name }}</view>
											<view class="price-box color-base-text">
												￥
												<text class="original-price">{{ dataItem.seckill_price }}</text>
											</view>
											<view class="num">￥{{ dataItem.price }}</view>
										</view>
									</view>
								</block>
								<!-- #endif -->
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	name: 'diy-seckill',
	props: {
		value: {
			type: Object
		},
		siteId: {
			type: [Number, String],
			default: 0
		},
		name: {
			type: String,
			default() {
				return '';
			}
		}
	},
	mixins: [globalConfig],
	data() {
		return {
			seckillId: 0,
			seckillIndex: null, //选中时间块的index
			index: null, //当前正在抢购的index,
			timeList: [],
			dataList: [],
			isNow: false,
			seckillH: '',
			seckillI: '',
			seckillS: '',
			seckillName: '',
			current: 0, //当前的swiper
			seckillInterval: null
		};
	},
	created() {
		this.getTimeList();
		//设置秒杀状态
		this.$store.commit('setDiySeckillInterval', 1);
	},
	watch: {
		diySeckillInterval(val, old) {
			if (val == 0) {
				clearInterval(this.seckillInterval);
			} else if (val == 1) {
				this.getTimeList();
			}
		}
	},
	methods: {
		changeCurrent(e) {
			this.current = e.detail.current;
		},
		//时间转换
		transformSeckillTime(time) {
			time = parseFloat(time);
			var hour = parseInt(time / 3600);
			var minute = parseInt((time % 3600) / 60);
			var second = parseInt(time % 60);

			if (hour < 10) hour = '0' + hour;
			if (minute < 10) minute = '0' + minute;
			if (second < 10) second = '0' + second;

			return hour + ':' + minute;
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().default_goods_img;
		},
		isEnd(isShow) {
			if (!isShow) return;
			this.$util.showToast({
				title: '限时秒杀活动已结束'
			});
		},
		getTimeList() {
			clearInterval(this.seckillInterval);
			this.seckillId = 0;
			this.isNow = false;
			this.seckillH = '';
			this.seckillI = '';
			this.seckillS = '';
			this.$api.sendRequest({
				url: '/seckill/api/seckill/lists',
				data: { site_id: this.siteId },
				success: res => {
					let data = res.data;
					let time = new Date(res.timestamp * 1000); //当前时间

					let newTimes = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds(); //获取当前时间 时分秒的时间戳
					if (!(data.list instanceof Array)) {
						var tempArr = Object.values(data.list);
					} else {
						var tempArr = data.list;
					}
					tempArr.forEach((v, k) => {
						if (v.seckill_start_time <= newTimes && newTimes < v.seckill_end_time) {
							this.seckillId = v.id;
							this.index = k;
							this.seckillIndex = k;
							// this.seckillName = v.name;
							this.isNow = true;
							v.isNow = true;
						} else {
							v.isNow = false;
						}
					});

					if (!this.seckillId) {
						for (let i = 0; i < tempArr.length; i++) {
							if (newTimes < tempArr[i].seckill_start_time && i == 0) {
								this.seckillId = tempArr[i].id;
								this.index = i;
								this.seckillIndex = i;
							} else if (newTimes < tempArr[i].seckill_start_time && newTimes > tempArr[i - 1].seckill_end_time && i != 0) {
								this.seckillId = tempArr[i].id;
								this.index = i;
								this.seckillIndex = i;
							} else if (i == tempArr.length - 1 && newTimes > tempArr[i].seckill_end_time) {
								this.seckillId = tempArr[i].id;
								this.index = i;
								this.seckillIndex = i;
							}
						}
					}

					if (this.isNow && tempArr.length) {
						var self = this;
						this.seckillInterval = setInterval(function() {
							let currTime = new Date();
							let newTimes = currTime.getHours() * 60 * 60 + currTime.getMinutes() * 60 + currTime.getSeconds();
							var obj = self.$util.countDown(tempArr[self.index].seckill_end_time - newTimes);
							self.seckillH = obj.h;
							self.seckillI = obj.i;
							self.seckillS = obj.s;
							if (self.seckillH == '00' && self.seckillI == '00' && self.seckillS == '00') {
								var timeout = setTimeout(function() {
									self.$store.commit('setDiySeckillInterval', 0);
									self.isNow = false;
									self.seckillH = '';
									self.seckillI = '';
									self.seckillS = '';
									self.index = 1;
									clearTimeout(timeout);
								}, 2000);
							}
						}, 1000);
					}
					this.timeList = tempArr;
					if (this.seckillId) {
						this.getDataList(this.seckillId);
					}
				}
			});
		},
		getDataList(seckillId) {
			var data = {
				seckill_id: seckillId
			};
			if (this.name == 'DIY_VIEW_CITY_INDEX' && this.siteId) data.website_id = this.siteId;
			else data.site_id = this.siteId;

			this.$api.sendRequest({
				url: '/seckill/api/seckillgoods/page',
				data: data,
				success: res => {
					var data = res.data;
					if (data.list) {
						this.dataList = data.list;
					}
				}
			});
		},
		ontabtap(e, f) {
			this.seckillId = e;
			this.seckillIndex = f;
			this.current = 0;
			this.getDataList(this.seckillId);
		},
		toMore() {
			this.$util.redirectTo('/promotionpages/seckill/list/list', {
				site_id: this.siteId
			});
		},
		toDetail(id, index) {
			if (this.seckillIndex < this.index) {
				this.$util.showToast({
					title: '秒杀活动已结束！'
				});
				return;
			}
			if (this.seckillIndex > this.index) {
				this.$util.showToast({
					title: '秒杀活动还未开启，敬请期待！'
				});
				return;
			}

			if (this.isNow) {
				this.$util.redirectTo('/promotionpages/seckill/detail/detail', {
					seckill_id: id
				});
			} else {
				this.$util.showToast({
					title: '活动还未开始，敬请期待'
				});
			}
		},
		imgError(index) {
			this.dataList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
}

/deep/.uni-scroll-view ::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

/deep/::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

.diy-seckill {
	// padding: 0 30rpx;

	.marketing-wrap {
		background-color: #ffffff;
		border-radius: 10rpx;
		overflow: hidden;
		box-sizing: border-box;
		position: relative;

		> image {
			width: 100%;
			position: absolute;
			top: 0;
			z-index: 1;
		}

		.marketimg-box {
			padding: 30rpx 0;
			position: relative;
			z-index: 2;

			.marketimg-box-title {
				display: flex;
				height: 32rpx;
				line-height: 32rpx;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;

				.marketimg-box-title-left {
					display: flex;
					align-items: center;
					line-height: 32rpx;
					margin-right: 18rpx;

					image {
						width: 126rpx;
						margin-right: 20rpx;
					}

					text {
						color: #909399;
					}
				}

				.seckill-title-time {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					.seckill-title-name {
						font-size: 28rpx;
						margin-right: 7rpx;
						line-height: 1;
						color: #777777;
						font-size: $font-size-base;
					}
					.symbol {
						padding-left: 6rpx;
						padding-right: 6rpx;
						height: 28rpx;
						line-height: 24rpx;
					}
					.seckill-H {
						width: 30rpx;
						height: 30rpx;
						background-color: #383838;
						color: #ffffff;
						font-size: $font-size-tag;
						text-align: center;
						line-height: 30rpx;
						border-radius: 3rpx;
					}
					.seckill-I {
						width: 28rpx;
						height: 28rpx;
						background-color: #383838;
						color: #ffffff;
						font-size: $font-size-activity-tag;
						text-align: center;
						line-height: 28rpx;
						border-radius: 5rpx;
					}
					.seckill-S {
						width: 28rpx;
						height: 28rpx;
						background-color: #ff4544;
						color: #ffffff;
						font-size: $font-size-activity-tag;
						text-align: center;
						line-height: 28rpx;
						border-radius: 5rpx;
					}
				}

				.marketimg-box-title-right {
					display: flex;
					align-items: center;

					text {
						font-size: 24rpx;
					}

					&.red text {
						background: linear-gradient(-55deg, #ff5151 0%, #ff7b91 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}

					&.blue text {
						background: linear-gradient(-55deg, #0ecfd3 0%, #12d0ae 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}

					&.yellow text {
						background: linear-gradient(-55deg, #feb632 0%, #fe6232 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}

					&.violet text {
						background: linear-gradient(-55deg, #627bfd 0%, #8662fd 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
			}
		}

		.seckill-time-list {
			margin-top: 30rpx;
			width: 100%;
			flex-direction: row;
			line-height: 1;
			padding: 0 30rpx;
			box-sizing: border-box;

			.seckil-nav {
				width: 100%;
				white-space: nowrap;
			}

			.nav-item {
				display: inline-block;
				text-align: center;
				border-bottom: 2rpx solid #eeeeee;
				padding: 0 28rpx;

				.nav-item-con {
					padding-bottom: 20rpx;

					.nav-title {
						font-size: 28rpx;
						color: #606266;
						line-height: 28rpx;
					}

					.nav-content {
						font-size: 20rpx;
						line-height: 20rpx;
						color: #909399;
						margin-top: 10rpx;
					}
				}

				&.active {
					border-bottom: 2rpx solid #ff4544;
					color: #ff4544;

					.nav-item-con {
						.nav-title {
							color: #ff4544;
						}

						.nav-content {
							color: #ff4544;
						}
					}
				}
			}
		}

		.marketimg-box-con {
			width: 100%;
			height: 340rpx;
			margin-top: 20rpx;
			// padding: 0 20rpx;
			// overflow: hidden;
			// box-sizing: border-box;

			.marketimg-box-con-scroll {
				width: 100%;
				flex-direction: row;
				white-space: nowrap;
				line-height: 1;

				.empty {
					padding-top: 20rpx;
				}
			}

			.marketimg-box-con-scroll {
				width: calc(100% - 30rpx);
				margin: 0 10rpx 0 20rpx;
				line-height: 1;
				white-space: nowrap;
			}

			.marketimg-box-con-item {
				display: inline-block;
				width: 33.333%;
				&.marketimg-box-con-item_two {
					width: calc((100% - 40rpx) / 3);
				}
				.wrap {
					margin: 0 20rpx 0 10rpx;
				}

				.img-box {
					width: 188rpx;
					height: 188rpx;
				}

				image {
					width: 188rpx;
					height: 188rpx;
					border-radius: 10rpx;
				}

				.content {
					.title {
						font-size: $font-size-base;
						line-height: $font-size-base;
						margin-top: 20rpx;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.price-box {
						font-size: $font-size-tag;
						font-weight: 600;
						height: 32rpx;
						line-height: 32rpx;
						margin-top: 20rpx;

						text {
							font-size: 32rpx;
						}
					}

					.num {
						font-size: 20rpx;
						line-height: 20rpx;
						color: #909399;
						margin-top: 20rpx;
						text-decoration: line-through;
					}
				}
			}

			.marketimg-swiper {
				width: 100%;

				.swiper-item {
					padding: 0 30rpx;
					box-sizing: border-box;
				}

				.marketimg-box-con-item {
					margin-right: 20rpx;

					&:nth-child(3n + 3) {
						margin-right: 0;
					}
				}
			}
		}
	}
}
/deep/ .empty {
	height: 332rpx;
}
</style>
