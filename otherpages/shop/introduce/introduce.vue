<template>
	<view :data-theme="themeStyle">
		<view class="store">
			<!-- 店铺信息 -->
			<diy-shop-info :siteId="siteId" :type="0"></diy-shop-info>
			<!-- 店铺描述 -->
			<view class="store-desc"><view class="desc-title">店铺介绍</view></view>
			<view class="store-exper">
				<view class="exper-info">
					<view class="exper-desc font-size-tag color-tip">{{ shopInfo.seo_description }}</view>
				</view>
			</view>
			<view class="store-eval">
				<view class="eval-li">
					<text class="margin-right">描述相符</text>
					<view class="line margin-right"><ns-progress :progress="shopDesccredit"></ns-progress></view>
					<text class="margin-right grade color-base-text">{{ shopInfo.shop_desccredit }}</text>
				</view>
				<view class="eval-li">
					<text class="margin-right">服务态度</text>
					<view class="line margin-right"><ns-progress :progress="shopServicecredit"></ns-progress></view>
					<text class="margin-right grade color-base-text">{{ shopInfo.shop_servicecredit }}</text>
				</view>
				<view class="eval-li">
					<text class="margin-right">物流服务</text>
					<view class="line margin-right"><ns-progress :progress="shopDeliverycredit"></ns-progress></view>
					<text class="margin-right grade color-base-text">{{ shopInfo.shop_deliverycredit }}</text>
				</view>
			</view>

			<!-- 店铺权益 -->
			<block
				v-if="
					shopInfo.shop_zhping ||
						shopInfo.shop_qtian ||
						shopInfo.shop_erxiaoshi ||
						shopInfo.shop_xiaoxie ||
						shopInfo.shop_baozh ||
						shopInfo.shop_tuihuo ||
						shopInfo.shop_shiyong ||
						shopInfo.shop_shiti
				"
			>
				<view class="store-desc"><view class="desc-title">商家服务</view></view>
				<view class="store-explain">
					<view class="explain-li" v-if="shopInfo.shop_zhping"><button type="primary" size="mini">正品保障</button></view>
					<view class="explain-li" v-if="shopInfo.shop_qtian"><button type="primary" size="mini">七天无理由退换</button></view>
					<view class="explain-li" v-if="shopInfo.shop_erxiaoshi"><button type="primary" size="mini">两小时发货</button></view>
					<view class="explain-li" v-if="shopInfo.shop_xiaoxie"><button type="primary" size="mini">消协保证</button></view>
					<view class="explain-li" v-if="shopInfo.shop_baozh"><button type="primary" size="mini">保证服务</button></view>
					<view class="explain-li" v-if="shopInfo.shop_tuihuo"><button type="primary" size="mini">退货承诺</button></view>
					<view class="explain-li" v-if="shopInfo.shop_shiyong"><button type="primary" size="mini">试用中心</button></view>
					<view class="explain-li" v-if="shopInfo.shop_shiti"><button type="primary" size="mini">实体验证</button></view>
				</view>
			</block>

			<!-- 店铺基础信息 -->
			<view class="store-desc"><view class="desc-title">店铺信息</view></view>

			<view class="store-base-info">
				<view class="base-li" v-if="shopInfo.site_name">
					<text>店铺名称</text>
					<text class="color-sub">{{ shopInfo.site_name }}</text>
				</view>
				<view class="base-li" v-if="shopInfo.telephone">
					<text>服务电话</text>
					<text class="color-sub">{{ shopInfo.telephone }}</text>
				</view>
				<view class="base-li" v-if="shopInfo.qq">
					<text>QQ</text>
					<text class="color-sub">{{ shopInfo.qq }}</text>
				</view>
				<view class="base-li" v-if="shopInfo.ww">
					<text>阿里旺旺</text>
					<text class="color-sub">{{ shopInfo.ww }}</text>
				</view>
				<view class="base-li" v-if="workingDay">
					<text>工作日</text>
					<text class="color-sub">{{ workingDay }}</text>
				</view>
			</view>

			<view class="store-desc" v-if="shopInfo.latitude && shopInfo.longitude"><view class="desc-title">店铺位置</view></view>
			<view class="store-base-info" v-if="shopInfo.latitude && shopInfo.longitude">
				<map :latitude="Number(shopInfo.latitude)" :markers="markers" :longitude="Number(shopInfo.longitude)"></map>
				<view class="margin-top">
					<text>{{ shopInfo.full_address }}{{ shopInfo.address }}</text>
				</view>
				<cover-view class="store-map-dark" @click="openMapLg"></cover-view>
			</view>

			<view class="follow-and-share">
				<view class="follow" @click="openSharePopup()"><text class="iconfont iconiconfontzhizuobiaozhun023130"></text></view>
			</view>
			<loading-cover ref="loadingCover"></loading-cover>
			<!-- 海报 -->
			<view @touchmove.prevent.stop>
				<uni-popup ref="posterPopup" type="bottom" class="poster-layer">
					<template v-if="poster != '-1'">
						<view :style="{ height: posterHeight > 0 ? posterHeight + 80 + 'px' : '' }">
							<view class="image-wrap"><image :src="$util.img(poster)" :style="{ height: posterHeight > 0 ? posterHeight + 'px' : '' }" /></view>
							<!-- #ifdef MP || APP-PLUS  -->
							<view class="save" @click="saveGoodsPoster()">保存图片</view>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<view class="save">长按保存图片</view>
							<!-- #endif -->
						</view>
						<view class="close iconfont iconclose" @click="closePosterPopup()"></view>
					</template>
					<view v-else class="msg">{{ posterMsg }}</view>
				</uni-popup>
			</view>

			<!-- 分享弹窗 -->
			<view @touchmove.prevent.stop>
				<uni-popup ref="sharePopup" type="bottom" class="share-popup">
					<view>
						<view class="share-title">分享</view>
						<view class="share-content">
							<!-- #ifdef MP -->
							<view class="share-box">
								<button class="share-btn" :plain="true" open-type="share">
									<view class="iconfont iconiconfenxianggeihaoyou"></view>
									<text>分享给好友</text>
								</button>
							</view>
							<!-- #endif -->
							<view class="share-box" @click="openPosterPopup">
								<button class="share-btn" :plain="true">
									<view class="iconfont iconpengyouquan"></view>
									<text>生成分享海报</text>
								</button>
							</view>
						</view>
						<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
					</view>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import introduce from '../public/js/introduce.js';
import diyShopInfo from '@/components/diy-shop-info/diy-shop-info.vue';
import nsProgress from '@/components/ns-progress/ns-progress.vue';
import Map from '@/common/js/map/openMap.js';
export default {
	components: {
		diyShopInfo,
		nsProgress
	},
	data() {
		return {
			siteId: 0,
			poster: '-1', //海报
			posterMsg: '', //海报错误信息
			posterHeight: 0
		};
	},
	computed: {
		markers() {
			let array = [];
			if (this.shopInfo && this.shopInfo.latitude && this.shopInfo.longitude) {
				array.push({
					id: 0,
					latitude: this.shopInfo.latitude,
					longitude: this.shopInfo.longitude,
					iconPath: this.$util.img('upload/uniapp/location.png'),
					width: 25,
					height: 25
				});
			} else {
				array = [];
			}
			return array;
		}
	},
	mixins: [introduce, globalConfig],
	onLoad(options) {
		if (!options.site_id) {
			this.$util.redirectTo('/otherpages/shop/index/index', {}, 'redirectTo');
			return;
		}
		this.siteId = options.site_id;
		this.getShopInfo();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		openMapLg() {
			if (!isNaN(Number(this.shopInfo.latitude)) && !isNaN(Number(this.shopInfo.longitude))) {
				Map.openMap(Number(this.shopInfo.latitude), Number(this.shopInfo.longitude), this.shopInfo.site_name, 'gcj02');
			}
		},
		//-------------------------------------分享-------------------------------------
		// 打开分享弹出层
		openSharePopup() {
			this.$refs.sharePopup.open();
		},
		// 关闭分享弹出层
		closeSharePopup() {
			this.$refs.sharePopup.close();
		},
		//-------------------------------------海报-------------------------------------

		// 打开海报弹出层
		openPosterPopup() {
			this.getGoodsPoster();
			this.$refs.sharePopup.close();
			this.$refs.posterPopup.open();
			if (this.poster != '-1') {
				setTimeout(() => {
					let view = uni
						.createSelectorQuery()
						.in(this)
						.select('.poster-layer .image-wrap');
					view.fields(
						{
							size: true
						},
						data => {
							let posterWhith = data.width;
							let ratio = parseFloat((740 / posterWhith).toFixed(2));
							if (uni.getStorageSync('token')) {
								this.posterHeight = parseInt(1120 / ratio);
							} else {
								this.posterHeight = parseInt(1100 / ratio);
							}
						}
					).exec();
				}, 100);
			}
		},
		// 关闭海报弹出层
		closePosterPopup() {
			this.$refs.posterPopup.close();
		},
		//生成海报
		getGoodsPoster() {
			//活动海报信息
			let qrcode_param = {
				site_id: this.siteId
			};
			if (this.memberId) qrcode_param.source_member = this.memberId;
			this.$api.sendRequest({
				url: '/api/shop/poster',
				data: {
					page: '/otherpages/shop/introduce/introduce',
					qrcode_param: JSON.stringify(qrcode_param),
					// #ifdef APP-PLUS
					app_type: 'weapp',
					app_type_name: '微信小程序'
					// #endif
				},
				success: res => {
					if (res.code == 0) {
						this.poster = res.data.path;
					} else {
						this.posterMsg = res.message;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.follow-and-share {
	position: fixed;
	bottom: 50rpx;
	right: 30rpx;
	background-color: rgba(0, 0, 0, 0.5);
	height: 60rpx;
	width: 60rpx;
	text-align: center;
	line-height: 60rpx;
	border-radius: 50%;

	text {
		color: #fff;
	}
}

@import '../public/css/introduce.scss';

.share-popup,
.uni-popup__wrapper-box {
	.share-title {
		line-height: 60rpx;
		font-size: $font-size-toolbar;
		padding: 15rpx 0;
		text-align: center;
	}

	.share-content {
		display: flex;
		display: -webkit-flex;
		-webkit-flex-wrap: wrap;
		-moz-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		-o-flex-wrap: wrap;
		flex-wrap: wrap;
		padding: 15rpx;

		.share-box {
			flex: 1;
			text-align: center;

			.share-btn {
				margin: 0;
				padding: 0;
				border: none;
				line-height: 1;
				height: auto;

				text {
					margin-top: 20rpx;
					font-size: 24rpx;
					display: block;
					color: $color-title;
				}
			}

			.iconfont {
				font-size: 80rpx;
				line-height: initial;
			}

			.iconpengyouquan,
			.iconiconfenxianggeihaoyou {
				color: #07c160;
			}
		}
	}

	.share-footer {
		height: 90rpx;
		line-height: 90rpx;
		border-top: 2rpx #f5f5f5 solid;
		text-align: center;
		color: #666;
	}
}

// 海报
.poster-layer {
	.generate-poster {
		padding: 40rpx 0;

		.iconfont {
			font-size: 80rpx;
			color: #07c160;
			line-height: initial;
		}

		> view {
			text-align: center;

			&:last-child {
				margin-top: 20rpx;
			}
		}
	}

	.image-wrap {
		width: 70%;
		margin: 30px auto 20px auto;
		box-shadow: 0 0 16px rgba(100, 100, 100, 0.3);

		image {
			width: 100%;
			height: 100%;
			height: 750rpx;
		}
	}

	.msg {
		padding: 40rpx;
	}

	.save {
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	.close {
		position: absolute;
		top: 0;
		right: 20rpx;
		width: 40rpx;
		height: 80rpx;
		font-size: 50rpx;
	}
}
</style>
