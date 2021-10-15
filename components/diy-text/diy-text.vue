<template>
	<view
		class="diy-text"
		:style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }"
		style="border-radius: 10rpx;"
		@click="redirectTo(value.link)"
	>
		<view :class="value.style == 8 ? 'title2' : 'title'" :style="{ fontSize: value.fontSize * 2 + 'rpx', color: value.textColor }">
			<block v-if="value.style == 1" style="height: 40rpx; line-height: 40rpx;">
				<view class="text-left" :style="{ color: value.textColor, opacity: value.textColor ? 1 : 0 }"><text>───</text></view>
				<text :style="{ opacity: value.textColor ? 1 : 0 }">{{ value.title }}</text>
				<view class="text-right" :style="{ color: value.textColor, opacity: value.textColor ? 1 : 0 }"><text>───</text></view>
			</block>
			<block v-else-if="value.style == 2">
				<view class="style2">
					<text :style="{ color: value.textColor, opacity: value.textColor ? 1 : 0, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.title }}</text>
					<view class="xian" :style="{ background: value.textColor }">
						<view class="line-triangle" :style="{ borderColor: value.textColor, opacity: value.textColor ? 1 : 0 }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 3">
				<view class="style3">
					<text :style="{ color: value.textColor, opacity: value.textColor ? 1 : 0, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.title }}</text>
					<view class="inner-line" :style="{ background: value.textColor }"><view class="line-short" :style="{ background: value.textColor }"></view></view>
				</view>
			</block>
			<block v-else-if="value.style == 4">
				<view class="style4">
					<text :style="{ color: value.textColor, opacity: value.textColor ? 1 : 0, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.title }}</text>
					<view class="line-box">
						<view class="line-left" :style="{ background: value.textColor }"></view>
						<view class="line-center" :style="{ borderColor: value.textColor, opacity: value.textColor ? 1 : 0 }"></view>
						<view class="line-right" :style="{ background: value.textColor }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 5">
				<view class="style5">
					<view class="style5-box" :style="{ color: value.textColor, opacity: value.textColor ? 1 : 0 }">
						<text class="style5-title" :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.title }}</text>
						<view class="line-left" :style="{ background: value.textColor }"></view>
						<view class="line-right" :style="{ background: value.textColor }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 6">
				<view class="style6">
					<view class="style6-box" :style="{ color: value.textColor, opacity: value.textColor ? 1 : 0 }">
						<text class="style6-title" :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.title }}</text>
						<view class="style6-wrap" :style="{ color: value.textColor }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 7">
				<view class="style7">
					<view class="style7-box" :style="{ color: value.textColor, opacity: value.textColor ? 1 : 0 }">
						<text class="style7-title" :style="{ background: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.title }}</text>
						<view class="style7-wrap" :style="{ color: value.textColor }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 8">
				<view class="style8">
					<view class="style8-box" :style="{ color: value.textColor, opacity: value.textColor ? 1 : 0 }">
						<text class="style8-title" :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.title }}</text>
						<view class="style8-wrap" :style="{ background: value.textColor, height: value.fontSize * 2 + 'rpx' }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 9">
				<view class="style9">
					<view class="style9-box">
						<view class="style9-center">
							<view class="left-img"><image :src="$util.img('upload/uniapp/style9-1.png')"></image></view>
							<text
								class="style9-title"
								:style="{ fontSize: value.fontSize * 2 + 'rpx', color: value.textColor, opacity: value.textColor ? 1 : 0, fontWeight: value.fontWeight }"
							>
								{{ value.title }}
							</text>
							<view class="right-img"><image :src="$util.img('upload/uniapp/style9-2.png')"></image></view>
							<view
								class="style9-more"
								v-if="value.isShowMore"
								:style="{ color: value.btnColor, opacity: value.btnColor ? 1 : 0 }"
								@click.stop="redirectTo(value.moreLink)"
							>
								{{ value.moreText }}
								<view class="iconfont iconright" :style="{ color: value.btnColor, opacity: value.btnColor ? 1 : 0 }"></view>
							</view>
						</view>
						<text class="sub-title" :style="{ color: value.colorSub, opacity: value.colorSub ? 1 : 0 }">{{ value.subTitle }}</text>
						<!-- <view class="style9-more">
							<view class="iconfont iconyoujiantou">
								
							</view>
						</view> -->
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 10">
				<view class="style10">
					<view class="style10-box">
						<view class="style10-center">
							<view class="left-img"><image :src="$util.img('upload/uniapp/style10-1.png')"></image></view>
							<!-- <text class="style10-title" :style="{fontSize: value.fontSize * 2 + 'rpx',color: value.textColor,fontWeight:value.fontWeight}">{{ value.title }}</text> -->
							<!-- <view class="center-img">
								<image :src="$util.img('upload/uniapp/style10-3.png')"></image>
							</view> -->
							<text
								class="style10-title"
								v-if="$util.img('upload/uniapp/style10-3.png')"
								:style="{
									backgroundImage: 'url(' + $util.img('upload/uniapp/style10-3.png') + ')',
									backgroundSize: 100 + '%',
									backgroundPositionY: 93 + '%',
									backgroundRepeat: 'no-repeat',
									fontSize: value.fontSize * 2 + 'rpx',
									color: value.textColor ? value.textColor : 'rgba(0, 0, 0, 0)',
									fontWeight: value.fontWeight
								}"
							>
								{{ value.title }}
							</text>
							<view class="right-img"><image :src="$util.img('upload/uniapp/style10-2.png')"></image></view>
							<view
								class="style10-more"
								v-if="value.isShowMore"
								:style="{ color: value.btnColor ? value.btnColor : 'rgba(0, 0, 0, 0)' }"
								@click.stop="redirectTo(value.moreLink)"
							>
								{{ value.moreText }}
								<view class="iconfont iconright" :style="{ color: value.btnColor ? value.btnColor : 'rgba(0, 0, 0, 0)' }"></view>
							</view>
						</view>
						<text class="sub-title" :style="{ color: value.colorSub ? value.colorSub : 'rgba(0, 0, 0, 0)' }">{{ value.subTitle }}</text>
						<!-- <view class="style9-more">
							<view class="iconfont iconyoujiantou">
								
							</view>
						</view> -->
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 11">
				<view class="style11" :style="{ backgroundColor: value.backgroundColor }">
					<view class="style11-box">
						<view class="style11-conter">
							<view class="style11-conter-box">
								<view class="left">
									<view
										class="style11-title"
										:style="{
											fontSize: value.fontSize * 2 + 'rpx',
											color: value.textColor ? value.textColor : 'rgba(0, 0, 0, 0)',
											fontWeight: value.fontWeight
										}"
									>
										{{ value.title }}
									</view>
									<view class="style11-sub" :style="{ color: value.colorSub ? value.colorSub : 'rgba(0, 0, 0, 0)' }">{{ value.subTitle }}</view>
								</view>
								<view
									class="style11-more"
									v-if="value.isShowMore"
									:style="{ color: value.btnColor ? value.btnColor : 'rgba(0, 0, 0, 0)' }"
									@click.stop="redirectTo(value.moreLink)"
								>
									{{ value.moreText }}
									<view class="iconfont iconright" :style="{ color: value.btnColor ? value.btnColor : 'rgba(0, 0, 0, 0)' }"></view>
								</view>

								<image class="center-img" :src="$util.img('upload/uniapp/style11-1.png')" mode="widthFix"></image>

								<image class="right-img" :src="$util.img('upload/uniapp/style11-2.png')" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<!-- <text class="sub-title" v-if="value.subTitle" :style="{ textAlign: value.textAlign, fontSize: (value.fontSize - 4) * 2 + 'rpx' }">{{ value.subTitle }}</text> -->
	</view>
</template>

<script>
// 标题
export default {
	name: 'diy-text',
	props: {
		value: {
			type: Object
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	methods: {
		redirectTo(link) {
			if (this.siteId) {
				link.site_id = this.siteId;
			}
			this.$util.diyRedirectTo(link);
		}
	}
};
</script>

<style lang="scss">
.diy-text {
	padding: 20rpx 0;
	display: flex;
	justify-content: center;
}

.diy-text .title {
	margin: 0;
	color: #333;
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
}

.diy-text .title2 {
	margin: 0;
	color: #333;
	display: flex;
	align-items: center;
	width: 100%;
}

.diy-text .title text {
	padding: 0 15rpx;
}

.left {
	transform: translateY(0%);
	width: 30rpx;
	height: 24rpx;
}

.right {
	transform: translateY(0%);
	width: 30rpx;
	height: 24rpx;
}

.style2 {
	width: 100%;
	text-align: center;

	.xian {
		width: 100%;
		height: 2rpx;
		vertical-align: top;
		position: relative;
	}

	.line-triangle {
		background: transparent !important;
		position: absolute;
		border: 6px solid #000;
		border-top-color: transparent !important;
		border-left-color: transparent !important;
		left: 50%;
		bottom: -10rpx;
		margin-left: -6px;
		transform: rotate(45deg);
	}
}

.style3 {
	width: 100%;
	text-align: center;

	.inner-line {
		width: 100%;
		height: 2rpx;
		vertical-align: top;
		position: relative;
	}

	.line-short {
		width: 162px;
		height: 3px;
		position: absolute;
		bottom: 0;
		left: 50%;
		margin-left: -81px;
	}
}

.style4 {
	text-align: center;
	width: 100%;

	.line-box {
		height: 5rpx;
		position: relative;
		text-align: center;
		margin-top: 5rpx;
		width: 100%;

		.line-left {
			display: inline-block;
			position: absolute;
			top: 4px;
			left: 0;
			bottom: 0;
			width: calc((100% - 22px) / 2);
			height: 1px;
		}

		.line-center {
			width: 6px;
			height: 6px;
			border: 1px solid;
			display: inline-block;
			-webkit-transform: rotate(45deg);
			transform: rotate(45deg);
			position: absolute;
			top: 0;
			left: 50%;
			bottom: 0;
			margin-left: -3px;
		}

		.line-right {
			display: inline-block;
			position: absolute;
			top: 4px;
			bottom: 0;
			right: 0;
			width: calc((100% - 22px) / 2);
			height: 1px;
		}
	}
}

.style5 {
	text-align: center;
	position: relative;

	.style5-box {
		display: inline-block;
		padding: 10rpx !important;
		border: 1rpx solid;
		position: relative;

		.style5-title {
			display: inline-block;
			padding: 10rpx 30rpx;
			border: 1rpx solid;
			line-height: 1;
		}

		.line-left {
			height: 10rpx;
			position: absolute;
			width: 80rpx;
			top: 50%;
			margin-top: -4rpx;
			left: 0;
			margin-left: -60rpx;
		}

		.line-right {
			height: 10rpx;
			position: absolute;
			width: 80rpx;
			top: 50%;
			margin-top: -4rpx;
			right: 0;
			margin-right: -60rpx;
		}
	}
}

.style6 {
	text-align: center;
	position: relative;

	.style6-box {
		display: inline-block;
		position: relative;

		.style6-title {
			display: inline-block;
			padding: 6rpx 50rpx;
			border: 1rpx solid;
			position: relative;
			z-index: 2;
			padding-bottom: 3px;
			background: rgb(255, 255, 255);
			line-height: 1.5;
		}

		.style6-wrap {
			position: absolute;
			display: inline-block;
			width: 100%;
			top: 10rpx;
			right: 4rpx;
			bottom: -10rpx;
			left: 10rpx;
			border: 1rpx solid;
			z-index: 0;
			box-sizing: border-box;
		}
	}
}

.style7 {
	text-align: center;
	position: relative;

	.style7-box {
		display: inline-block;
		position: relative;

		.style7-title {
			display: inline-block;
			padding: 0rpx 50rpx;
			position: relative;
			z-index: 2;
			padding-bottom: 3px;
			color: rgb(255, 255, 255);
			line-height: 1.5;
		}

		.style7-wrap {
			width: 100%;
			box-sizing: border-box;
			position: absolute;
			top: 10rpx;
			right: 4rpx;
			bottom: -10rpx;
			left: 10rpx;
			border: 1rpx solid;
			z-index: 0;
		}
	}
}

.style8 {
	position: relative;
	text-align: left;

	.style8-box {
		text-align: left !important;

		.style8-wrap {
			height: 100%;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 0;
			width: 4rpx;
		}
	}
}

.style9 {
	width: 100%;

	.style9-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;

		.style9-center {
			display: flex;
			justify-content: center;
			align-items: center;
			width: calc(100% - 132px);
			position: relative;

			text {
				max-width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.left-img {
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				flex-shrink: 0;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.right-img {
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				flex-shrink: 0;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.style9-more {
				display: flex;
				position: absolute;
				right: -140rpx;
				/* #ifdef MP-WEIXIN */
				right: -120rpx;
				/* #endif */
				top: 14rpx;
				line-height: 1;
				align-items: center;

				.iconfont {
					line-height: 1;
				}
			}

			.sub-title {
				line-height: 1;
			}
		}
	}
}

.style10 {
	width: 100%;

	.style10-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;

		.style10-center {
			display: flex;
			justify-content: center;
			align-items: center;
			width: calc(100% - 132px);
			position: relative;

			text {
				max-width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding-bottom: 8rpx;
				z-index: 99;
			}

			.left-img {
				padding-bottom: 13rpx;
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				flex-shrink: 0;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.center-img {
				width: 198rpx;
				height: 18rpx;
				text-align: center;
				flex-shrink: 0;
				position: absolute;
				bottom: 26rpx;
				z-index: 5;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.right-img {
				padding-bottom: 13rpx;
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				flex-shrink: 0;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.style10-more {
				display: flex;
				position: absolute;
				right: -140rpx;
				/* #ifdef MP-WEIXIN */
				right: -120rpx;
				/* #endif */
				top: 14rpx;
				line-height: 1;
				align-items: center;

				.iconfont {
					line-height: 1;
				}
			}

			.sub-title {
				line-height: 1;
			}
		}
	}
}

.style11 {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;

	.style11-box {
		width: 100%;
		margin: 10rpx 0;

		.style11-conter {
			.style11-conter-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;

				.left {
					display: flex;
					width: 70%;
					flex-direction: column;
					justify-content: space-between;
					height: 100%;
					margin: 15rpx 0;
					padding-left: 17px;
					z-index: 9;

					.style11-title {
						width: 100%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.style11-sub {
						letter-spacing: 7px;
						width: 100%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}

				.style11-more {
					display: flex;
				}
			}

			.center-img {
				width: 30.5px;
				position: absolute;
				bottom: -13px;
				left: 8px;
				z-index: 0;
			}

			.right-img {
				width: 17.5px;
				position: absolute;
				top: -7px;
				left: 86px;
				z-index: 0;
			}
		}
	}
}
</style>
