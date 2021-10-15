<template>
	<view :data-theme="themeStyle">
		<view scroll-y="true" class="goods-detail" :class="isIphoneX ? 'active' : ''">
			<view class="goods-container">
				<!-- 商品媒体信息 -->
				<view class="goods-media">
					<!-- 商品图片 -->
					<view class="goods-img" :class="{ show: switchMedia == 'img' }">
						<swiper class="swiper" @change="swiperChange" :interval="swiperInterval" :autoplay="swiperAutoplay">
							<swiper-item v-for="(item, index) in goodsSkuDetail.sku_images" :key="index" :item-id="'goods_id_' + index">
								<view class="item" @click="previewMedia(index)">
									<image :src="$util.img(item, { size: 'big' })" @error="swiperImgError(index)" mode="aspectFit" />
								</view>
							</swiper-item>
						</swiper>
						<view class="img-indicator-dots">
							<text>{{ swiperCurrent }}</text>
							<text v-if="goodsSkuDetail.sku_images">/{{ goodsSkuDetail.sku_images.length }}</text>
						</view>
					</view>
					<!-- 商品视频 -->
					<view class="goods-video" :class="{ show: switchMedia == 'video' }">
						<!-- #ifndef APP-PLUS -->
						<video :src="$util.img(goodsSkuDetail.video_url)" :poster="$util.img(goodsSkuDetail.sku_image, { size: 'big' })" objectFit="cover"></video>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
						<view class="video-img" @click="openVideo($util.img(goodsSkuDetail.video_url), $util.img(goodsSkuDetail.cover))">
							<image :src="$util.img(goodsSkuDetail.sku_image, { size: 'big' })" mode=""></image>
							<view class="video-open"><view class="iconfont iconarrow-"></view></view>
						</view>
						<!-- #endif -->
					</view>

					<!-- 切换视频、图片 -->
					<view class="media-mode" v-if="goodsSkuDetail.video_url != ''">
						<text :class="{ 'color-base-bg': switchMedia == 'video' }" @click="switchMedia = 'video'">{{ $lang('video') }}</text>
						<text :class="{ 'color-base-bg': switchMedia == 'img' }" @click="switchMedia = 'img'">{{ $lang('image') }}</text>
					</view>
				</view>

				<!-- 播放视频 -->
				<view @touchmove.prevent.stop class="videoPopup-box">
					<uni-popup ref="videoPopup" type="center">
						<view class="pop-video">
							<video :src="$util.img(goodsSkuDetail.video_url)" :poster="$util.img(goodsSkuDetail.sku_image, { size: 'big' })" objectFit="cover"></video>
						</view>
					</uni-popup>
				</view>

				<view
					v-if="goodsSkuDetail.timeMachine"
					class="goods-promotion"
					:style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/goods/detail_promotion_left_bg.png') + ')' }"
				>
					<view class="price-info">
						<view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_pintuan_tag.png')" mode="aspectFit"></image></view>
						<view class="pintuan-num">
							<text>{{ goodsSkuDetail.pintuan_num }}</text>
							<text>人团</text>
						</view>
						<view class="sale-num">已成团{{ goodsSkuDetail.order_num }}{{ goodsSkuDetail.unit }}</view>
					</view>
					<view class="countdown" :style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/goods/detail_promotion_right_bg.png') + ')' }">
						<view class="txt">距结束仅剩</view>
						<view class="clockrun">
							<uni-count-down
								:day="goodsSkuDetail.timeMachine.d"
								:hour="goodsSkuDetail.timeMachine.h"
								:minute="goodsSkuDetail.timeMachine.i"
								:second="goodsSkuDetail.timeMachine.s"
								color="#fff"
								splitorColor="#FF4644"
								backgroundColor="#FF4644"
							/>
						</view>
					</view>
				</view>

				<view class="group-wrap padding-top">
					<view class="goods-module-wrap">
						<text class="promotion-tag color-base-bg">拼团价</text>
						<text class="price-symbol color-base-text">{{ $lang('common.currencySymbol') }}</text>
						<text class="price color-base-text">{{ goodsSkuDetail.pintuan_price }}</text>
						<view class="market-price-wrap" v-if="goodsSkuDetail.price > 0">
							<text class="unit">{{ $lang('common.currencySymbol') }}</text>
							<text class="money">{{ goodsSkuDetail.price }}</text>
						</view>
						<view class="follow-and-share">
							<text class="follow iconfont iconfenxiang2" @click="openSharePopup()"></text>
							<text class="share iconfont" @click="editCollection()" :class="whetherCollection == 1 ? 'iconlikefill color-base-text' : 'iconguanzhu1'"></text>
						</view>
					</view>
					<view class="goods-module-wrap promotion-price-wrap color-base-bg-light color-base-border">
						<text class="label color-base-text">团长价</text>
						<text class="price-symbol color-base-text">{{ $lang('common.currencySymbol') }}</text>
						<text class="price color-base-text">{{ goodsSkuDetail.promotion_price }}</text>
					</view>
					<view class="goods-module-wrap info">
						<text class="sku-name-wrap">{{ goodsSkuDetail.goods_name }}</text>
						<text class="introduction color-base-text" v-if="goodsSkuDetail.introduction">{{ goodsSkuDetail.introduction }}</text>
						<view class="logistics-wrap">
							<block v-if="Development">
								<text v-if="goodsSkuDetail.is_free_shipping">快递 包邮</text>
								<text v-else>快递 买家承担</text>
							</block>
							<text>销量 {{ goodsSkuDetail.order_num }} {{ goodsSkuDetail.unit }}</text>
						</view>
					</view>
				</view>

				<!-- pintuanList.length > 0 -->
				<view class="group-wrap swiper" v-if="newList.length > 0">
					<!-- 已有拼团块 -->
					<swiper vertical="true" autoplay="true" interval="5000" class="spelling-block">
						<swiper-item v-for="(item, index) in newList" :key="index">
							<view class="item" v-if="item.end_time > timestamp">
								<view class="user-logo">
									<image
										:src="item.headimg ? $util.img(item.headimg) : $util.getDefaultImage().default_headimg"
										@error="pintuanImgError(index)"
										mode="aspectFill"
									/>
								</view>
								<text class="user-name" v-if="item.nickname">{{ item.nickname }}</text>
								<view class="info">
									<template v-if="item.timeMachine">
										<view class="tip">
											还差
											<text class="color-base-text">{{ item.pintuan_num - item.pintuan_count }}人</text>
											拼成
										</view>
										<text class="color-tip font-size-activity-tag">剩余</text>
										<uni-count-down
											:day="item.timeMachine.d"
											:hour="item.timeMachine.h"
											:minute="item.timeMachine.i"
											:second="item.timeMachine.s"
											color="#909399"
											splitorColor="#909399 !important"
											background-color="transparent"
											borderColor="transparent"
										/>
									</template>
								</view>

								<template v-if="item.timeMachine">
									<button
										type="primary"
										size="mini"
										@click="openPinTuan(item.group_id, item.pintuan_num - item.pintuan_count, item.end_time - item.currentTime, item.headimg)"
									>
										去拼单
									</button>
								</template>
								<template v-else>
									<button disabled size="mini">已结束</button>
								</template>
							</view>
						</swiper-item>
					</swiper>
					<view @touchmove.prevent.stop>
						<uni-popup ref="pintuanPopup" type="center" class="pintuan-popup-layer">
							<view class="layer">
								<view class="title">参与的拼单</view>
								<view class="info" v-if="currentPintuan">
									仅剩
									<text class="color-base-text">{{ currentPintuan.pintuan_num }}</text>
									个名额，
									<uni-count-down
										v-if="openPopup"
										:day="currentPintuan.timeMachine.d"
										:hour="currentPintuan.timeMachine.h"
										:minute="currentPintuan.timeMachine.i"
										:second="currentPintuan.timeMachine.s"
										color="#333"
										splitorColor="#333"
										background-color="transparent"
										borderColor="transparent"
									/>
									<text>后结束</text>
								</view>
								<image class="mask-layer-spelling-close" :src="$util.img('upload/uniapp/goods/mask_layer_pintuan_close.png')" @click="closePinTuanPopup()" />
								<view class="user-list">
									<scroll-view scroll-x class="imgX">
										<view class="item">
											<text class="boss color-base-bg">拼主</text>
											<image
												:src="currentPintuan.headimg != '' ? $util.img(currentPintuan.headimg) : $util.getDefaultImage().default_headimg"
												@error="currentPintuan.headimg = $util.getDefaultImage().default_headimg"
												mode="aspectFill"
											/>
										</view>
										<view class="item"><image :src="$util.img('upload/uniapp//spelling_who.png')" /></view>
									</scroll-view>
								</view>
								<button type="primary" @click="joinPintuan()">参与拼单</button>
							</view>
						</uni-popup>
					</view>
				</view>

				<!-- 当前商品参与的营销活动入口 -->
				<!-- <view class="group-wrap"><ns-goods-promotion ref="goodsPromotion" promotion="pintuan"></ns-goods-promotion></view> -->

				<view class="newdetail margin-bottom">
					<!-- 已选规格 -->
					<view class="item selected-sku-spec" v-if="goodsSkuDetail.sku_spec_format" @click="pintuan">
						<view class="label">选择</view>
						<view class="box">
							<text v-for="(item, index) in goodsSkuDetail.sku_spec_format" :key="index">{{ item.spec_name }}/{{ item.spec_value_name }}</text>
						</view>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
					<view class="item goods-attribute" @click="openAttributePopup()" v-if="goodsSkuDetail.goods_attr_format && goodsSkuDetail.goods_attr_format.length > 0">
						<view class="label">参数</view>
						<view class="list-wrap">
							<view class="item-wrap" v-for="(item, index) in goodsSkuDetail.goods_attr_format" :key="index" v-if="index < 2">
								<text>{{ item.attr_name }}:{{ item.attr_value_name }}</text>
							</view>
						</view>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
					<view class="item service" @click="openMerchantsServicePopup()" v-if="goodsSkuDetail.goods_service.length">
						<view class="label">服务</view>
						<view class="list-wrap">
							<view class="item-wrap" v-for="(item, index) in goodsSkuDetail.goods_service" :key="index" v-if="index < 3">
								<text class="iconfont icondui color-base-text"></text>
								<text>{{ item.service_name }}</text>
							</view>
						</view>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
				</view>

				<!-- 商品参数 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="attributePopup" type="bottom">
						<view class="goods-attribute-popup-layer popup-layer">
							<view class="head-wrap" @click="closeAttributePopup()">
								<text>商品参数</text>
								<text class="iconfont iconclose"></text>
							</view>
							<scroll-view scroll-y class="goods-attribute-body">
								<view class="item" v-for="(item, index) in goodsSkuDetail.goods_attr_format" :key="index">
									<text class="attr-name">{{ item.attr_name }}</text>
									<text class="value-name">{{ item.attr_value_name }}</text>
								</view>
							</scroll-view>
							<view class="button-box"><button type="primary" @click="closeAttributePopup()">确定</button></view>
						</view>
					</uni-popup>
				</view>

				<!-- 商品服务 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="merchantsServicePopup" type="bottom">
						<view class="goods-merchants-service-popup-layer popup-layer">
							<view class="head-wrap" @click="closeMerchantsServicePopup()">
								<text>{{ $lang('service') }}</text>
								<text class="iconfont iconclose"></text>
							</view>
							<scroll-view scroll-y>
								<view class="item" :class="{ 'empty-desc': !item.desc }" v-for="(item, index) in goodsSkuDetail.goods_service" :key="index">
									<view class="iconfont icondui color-base-text"></view>
									<view class="info-wrap">
										<text class="title">{{ item.service_name }}</text>
										<text class="describe" v-if="item.desc">{{ item.desc }}</text>
									</view>
								</view>
							</scroll-view>
							<view class="button-box"><button type="primary" @click="closeMerchantsServicePopup()">确定</button></view>
						</view>
					</uni-popup>
				</view>

				<!-- 店铺信息 -->
				<block v-if="Development">
					<view class="group-wrap">
						<view class="shop-wrap">
							<navigator hover-class="none" :url="'/otherpages/shop/index/index?site_id=' + shopInfo.site_id" class="box">
								<view class="shop-logo">
									<image
										v-if="shopInfo.avatar"
										:src="$util.img(shopInfo.avatar)"
										@error="shopInfo.avatar = $util.getDefaultImage().default_shop_img"
										mode="aspectFit"
									/>
									<image v-else :src="$util.getDefaultImage().default_shop_img" mode="aspectFit" />
								</view>
								<view class="shop-info">
									<text>{{ shopInfo.site_name }}</text>
									<view class="description" v-if="shopInfo.seo_description">{{ shopInfo.seo_description }}</view>
								</view>
							</navigator>
							<navigator hover-class="none" :url="'/otherpages/shop/index/index?site_id=' + shopInfo.site_id" class="box shop-score">
								<text>商品描述{{ shopInfo.shop_desccredit }}</text>
								<text>卖家服务{{ shopInfo.shop_servicecredit }}</text>
								<text>发货速度{{ shopInfo.shop_deliverycredit }}</text>
							</navigator>
							<view class="box">
								<view class="goods-action">
									<navigator hover-class="none" class="color-base-text color-base-border" :url="'/otherpages/shop/list/list?site_id=' + shopInfo.site_id">
										全部商品
									</navigator>
									<navigator hover-class="none" class="color-base-text color-base-border" :url="'/otherpages/shop/index/index?site_id=' + shopInfo.site_id">
										查看店铺
									</navigator>
								</view>
							</view>
						</view>
					</view>
				</block>

				<!-- 商品评价 -->
				<view class="group-wrap" v-if="evaluateConfig.evaluate_show == 1">
					<view class="goods-evaluate" @click="toEvaluateDetail(goodsSkuDetail.goods_id)">
						<view class="tit" :class="{ active: goodsEvaluate.content }">
							<view>
								<text class="color-title font-size-toolbar">
									评价
									<text class="font-size-base">({{ goodsSkuDetail.evaluate }})</text>
								</text>
								<text class="evaluate-item-empty" v-if="!goodsEvaluate.content">暂无评价</text>
								<view class="evaluate-item-empty" v-else>
									<text class="font-size-tag">查看全部</text>
									<text class="iconfont iconright font-size-tag"></text>
								</view>
							</view>
						</view>
						<view class="evaluate-item" v-if="goodsEvaluate.content">
							<view class="evaluator">
								<view class="evaluator-info">
									<view class="evaluator-face">
										<image
											v-if="goodsEvaluate.member_headimg"
											:src="$util.img(goodsEvaluate.member_headimg)"
											@error="goodsEvaluate.member_headimg = $util.getDefaultImage().default_headimg"
											mode="aspectFill"
										/>
										<image v-else :src="$util.getDefaultImage().default_headimg" mode="aspectFill" />
									</view>
									<text class="evaluator-name">{{ goodsEvaluate.member_name }}</text>
								</view>
								<text class="time color-tip">{{ $util.timeStampTurnTime(goodsEvaluate.create_time) }}</text>
							</view>
							<view class="cont margin-top">{{ goodsEvaluate.content }}</view>
							<view class="evaluate-img" v-if="goodsEvaluate.images">
								<view class="img-box" v-for="(item, index) in goodsEvaluate.images" :key="index" @click="previewEvaluate(index, 'images')">
									<image :src="$util.img(item)" mode="aspectFit" />
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 详情 -->
				<view class="goods-detail-tab">
					<view class="detail-tab">
						<view class="tab-item" :class="detailTab == 0 ? 'active' : ''" @click="detailTab = 0">商品详情</view>
						<!-- <view class="tab-item" :class="detailTab == 1 ? 'active color-base-text' : ''" @click="detailTab = 1">售后保障</view> -->
					</view>
					<view class="detail-content" :class="detailTab == 1 ? 'active' : ''">
						<view class="detail-content-item" v-show="detailTab == 0">
							<view class="goods-details" v-if="goodsSkuDetail.goods_content">
								<u-parse class="richText" :content="goodsSkuDetail.goods_content" @navigate="navigate"></u-parse>
							</view>
							<view class="goods-details active" v-else>该商家暂无上传相关详情哦！</view>
						</view>
						<view class="detail-content-item" v-show="detailTab == 1">
							<view class="goods-details" v-if="service"><u-parse class="richText" :content="service" @navigate="navigate"></u-parse></view>
							<view class="goods-details active" v-else>该商品暂无相关售后哦！</view>
						</view>
					</view>
				</view>

				<nsGoodsRecommend ref="goodrecommend"></nsGoodsRecommend>

				<!-- SKU选择 -->
				<ns-goods-sku ref="goodsSku" @refresh="refreshGoodsSkuDetail" :goods-detail="goodsSkuDetail"></ns-goods-sku>

				<!-- 海报 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="posterPopup" type="bottom" class="poster-layer">
						<template v-if="poster != '-1'">
							<view :style="{ height: posterHeight > 0 ? posterHeight + 80 + 'px' : '' }">
								<view class="image-wrap">
									<image :src="$util.img(poster)" :show-menu-by-longpress="true" :style="{ height: posterHeight > 0 ? posterHeight + 'px' : '' }" />
								</view>
								<!-- #ifdef MP || APP-PLUS -->
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
								<!-- #ifdef MP-WEIXIN -->
								<view class="share-box" v-if="goodsCircle">
									<button class="share-btn" :plain="true" @click="openBusinessView">
										<view class="iconfont iconhaowuquan"></view>
										<text>分享到好物圈</text>
									</button>
								</view>
								<!-- #endif -->
								<view class="share-box" @click="openPosterPopup">
									<button class="share-btn" :plain="true">
										<view class="iconfont iconpengyouquan"></view>
										<text>生成分享海报</text>
									</button>
								</view>
								<!-- #ifdef H5 -->
								<view class="share-box" @click="copyUrl">
									<button class="share-btn" :plain="true">
										<view class="iconfont iconfuzhilianjie"></view>
										<text>复制链接</text>
									</button>
								</view>
								<!-- #endif -->
							</view>
							<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
						</view>
					</uni-popup>
				</view>
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>

		<!-- 商品底部导航 -->
		<ns-goods-action :safeArea="isIphoneX">
			<template v-if="goodsSkuDetail.goods_state == 1 && goodsSkuDetail.verify_state == 1">
				<ns-goods-action-icon text="店铺" icon="iconshouye11" @click="goHome" />
				<ns-goods-action-icon text="客服" icon="iconkefu11" @click="goConnect" v-if="kefuConfig.type == 'system' && showKefu == 1" />
				<ns-goods-action-icon text="购物车" icon="icongouwuche21" :corner-mark="cartCount > 0 ? cartCount + '' : ''" @click="goCart" />

				<template v-if="goodsSkuDetail.goods_stock < goodsSkuDetail.pintuan_num && !goodsSkuDetail.sku_spec_format">
					<ns-goods-action-button class="goods-action-button active4" disabled-text="库存不足" :disabled="true" />
					<!-- <ns-goods-action-button
								v-if="goodsSkuDetail.sku_spec_format"
								class="goods-action-button active4"
								disabled-text="库存不足"
								:disabled="true"
								@click="pintuan"
							/>
							<ns-goods-action-button v-else class="goods-action-button active4" disabled-text="库存不足" :disabled="true" /> -->
				</template>

				<template v-else>
					<ns-goods-action-button
						v-if="goodsSkuDetail.is_single_buy == 1"
						class="goods-action-button"
						:text-price="'¥ ' + goodsSkuDetail.price"
						text="单独购买"
						:class="goodsSkuDetail.is_single_buy == 1 ? 'active1' : ''"
						background="linear-gradient(to right, #ffd01e, #ff8917)"
						@click="buyNow"
					/>
					<ns-goods-action-button
						class="goods-action-button"
						:class="goodsSkuDetail.is_single_buy == 1 ? 'active2' : 'active4'"
						:text-price="'¥ ' + goodsSkuDetail.show_price"
						text="发起拼团"
						@click="pintuan"
					/>
				</template>
			</template>
			<template v-else>
				<ns-goods-action-button class="goods-action-button active3" disabled-text="该商品已下架" :disabled="true" />
			</template>
		</ns-goods-action>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
	</view>
</template>

<script>
import nsGoodsAction from '@/components/ns-goods-action/ns-goods-action.vue';
import nsGoodsActionIcon from '@/components/ns-goods-action-icon/ns-goods-action-icon.vue';
import nsGoodsActionButton from '@/components/ns-goods-action-button/ns-goods-action-button.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsGoodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
import detail from '../public/js/detail.js';
import scroll from '@/common/js/scroll-view.js';
import globalConfig from '@/common/js/golbalConfig.js';
import toTop from '@/components/toTop/toTop.vue';
import uParse from '@/components/u-parse/u-parse.vue';

export default {
	components: {
		nsGoodsAction,
		nsGoodsActionIcon,
		nsGoodsActionButton,
		uniPopup,
		nsGoodsSku,
		nsGoodsRecommend,
		uniCountDown,
		toTop,
		uParse
	},
	data() {
		return {
			kefuConfig: {
				weapp: '',
				system: '',
				open: '',
				open_url: ''
			}
		};
	},
	mixins: [detail, scroll, globalConfig],
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var path = '/promotionpages/pintuan/detail/detail?pintuan_id=' + this.pintuan_id + '&group_id=' + this.groupId;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: this.goodsSkuDetail.sku_name,
			imageUrl: this.$util.img(this.goodsSkuDetail.sku_image, {
				size: 'big'
			}),
			path: path,
			success: res => {},
			fail: res => {}
		};
	},
	// #ifdef MP-WEIXIN
	// 分享到微信朋友圈
	onShareTimeline() {
		let query = 'pintuan_id=' + this.pintuan_id + '&group_id=' + this.groupId;
		if (this.memberId) query += '&source_member=' + this.memberId;
		return {
			title: this.goodsSkuDetail.sku_name,
			query: query,
			imageUrl: this.$util.img(this.goodsSkuDetail.sku_image, {
				size: 'big'
			})
		};
	}
	// #endif
};
</script>
<style lang="scss">
@import './../../../common/css/goods_detail.scss';
@import '../public/css/detail.scss';
</style>
<style scoped>
.richText /deep/ image {
	max-width: 100% !important;
}

rich-text image {
	max-width: 100%;
}

/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}

/deep/ .action-icon-wrap .iconfont.iconshouye1 {
	font-size: 40rpx;
}

/deep/ .uni-video-cover {
	background: none;
}

/deep/ .uni-video-cover-duration {
	display: none;
}

/deep/ .uni-video-cover-play-button {
	border-radius: 50%;
	border: 4rpx solid #fff;
	width: 120rpx;
	height: 120rpx;
	background-size: 30%;
}

.poster-layer >>> .uni-popup__wrapper-box {
	max-height: initial !important;
}

/deep/ .sku-layer .uni-popup__wrapper-box {
	overflow-y: initial !important;
}

.goods-promotion .countdown .clockrun >>> .uni-countdown__number {
	min-width: 32rpx;
	height: 32rpx;
	text-align: center;
	line-height: 32rpx;
	border-radius: 4px;
	display: inline-block;
	padding: 4rpx;
	margin: 0;
	border: none;
}

.goods-promotion .countdown .clockrun >>> .uni-countdown__splitor {
	width: 10rpx;
	height: 32rpx;
	line-height: 36rpx;
	text-align: center;
	display: inline-block;
}

.goods-promotion .countdown .clockrun >>> .uni-countdown__splitor.day {
	width: initial;
}

.spelling-block >>> .uni-countdown__splitor {
	padding: 0;
	font-size: 20rpx;
}

.sku-layer >>> .uni-popup__wrapper-box {
	overflow-y: initial !important;
}

.poster-layer >>> .uni-popup__wrapper-box {
	max-height: initial !important;
}

.spelling-block >>> .uni-countdown__number {
	padding: 0;
	margin: 0;
	font-size: 20rpx;
}

.pintuan-popup-layer >>> .uni-popup__wrapper-box {
	overflow-y: initial !important;
	border-radius: 10rpx;
}

.pintuan-popup-layer >>> .uni-countdown__number {
	padding: 0;
	margin: 0;
}

/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	max-height: unset !important;
}

/deep/ .goods-action-button.active1 {
	padding-left: 10px;
}

/deep/ .goods-action-button.active2 {
	padding-right: 10px;
}

/deep/ .goods-action-button.active3 {
	padding: 0 10px;
}

/deep/ .goods-action-button.active4 {
	padding: 0 10px;
}

/deep/ .goods-action-button .action-buttom-wrap {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

/deep/ .goods-action-button.active1 .action-buttom-wrap {
	height: 42px;
	line-height: 42px;
	border-top-left-radius: 42rpx;
	border-bottom-left-radius: 42rpx;
}

/deep/ .goods-action-button.active2 .action-buttom-wrap {
	height: 42px;
	line-height: 42px;
	border-top-right-radius: 42rpx;
	border-bottom-right-radius: 42rpx;
}

/deep/ .goods-action-button.active3 .action-buttom-wrap {
	height: 42px;
	line-height: 42px;
	border-radius: 42px;
	margin: 10px 0;
}

/deep/ .goods-action-button.active4 .action-buttom-wrap {
	height: 42px;
	line-height: 42px;
	border-radius: 42px;
}

/deep/ .goods-action-button .action-buttom-wrap text {
	line-height: 1.4;
}

[data-theme='theme-pink'] >>> .active1 .action-buttom-wrap text {
	color: #303133;
}

[data-theme='theme-golden'] >>> .active1 .action-buttom-wrap text {
	color: #303133;
}
</style>
