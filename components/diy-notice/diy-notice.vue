<template>
	<view class="diy-notice" :style="{ background: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }">
		<view
			v-if="$util.img('upload/uniapp/ns-notice.png')"
			class="pic"
			:style="'background-image:url(' + $util.img('upload/uniapp/ns-notice.png') + ');background-repeat: no-repeat;background-size: auto 100%;background-position: center'"
		></view>
		<view class="notice-xian"></view>
		<view class="main-wrap">
			<view class="uni-swiper-msg">
				<swiper vertical="true" autoplay="true" circular="true" @change="change">
					<swiper-item v-for="(item, index) in value.list" :key="index" @touchmove.stop>
						<text
							@click="redirectTo(item.link)"
							class="beyond-hiding"
							:style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)', fontSize: value.fontSize * 2 + 'rpx' }"
						>
							{{ item.title }}
						</text>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	name: 'diy-notice',
	props: {
		value: {
			type: Object
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			list: [],
			index: 0
		};
	},
	created() {
		this.getData();
	},
	methods: {
		getData() {
			var data = {};
			if (this.value.sources == 'diy') {
				data.id_arr = this.value.noticeIds.toString();
			}
			data.site_id = this.siteId ? this.siteId : 0;
			this.$api.sendRequest({
				url: '/api/notice/lists',
				data: data,
				success: res => {
					if (res.code == 0 && res.data) {
						this.list = res.data;
					}
				}
			});
		},
		redirectTo() {
			if (this.value && this.value.list && this.value.list[this.index].link) {
				let link = this.value.list[this.index].link;
				if (this.siteId) {
					link.site_id = this.siteId;
				}
				this.$util.diyRedirectTo(link);
			}
		},
		change(e) {
			this.index = e.detail.current;
		}
	}
};
</script>

<style lang="scss">
.diy-notice {
	padding: 20rpx;
	height: 40rpx;
	line-height: 0;
	position: relative;
	display: flex;
	align-items: center;
	overflow: hidden;
	border-radius: 10rpx;

	.pic {
		width: 140rpx;
		height: 24rpx;
		flex-shrink: 0;

		image {
			height: 100%;
		}
	}
	.notice-xian {
		width: 1rpx;
		height: 26rpx;
		background-color: #e4e4e4;
		margin: 0 22rpx;
	}
}

.diy-notice .main-wrap {
	display: inline-block;
	width: calc(100% - 115rpx);
	position: relative;
}

.diy-notice .flag {
	border: 1px solid;
	padding: 4rpx 10rpx;
	border-radius: 24rpx;
	margin-right: 20rpx;
	float: left;
	line-height: initial;
}

.uni-swiper-msg {
	padding: 0;
}

.uni-swiper-msg swiper {
	height: 50rpx;
}

.beyond-hiding {
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
