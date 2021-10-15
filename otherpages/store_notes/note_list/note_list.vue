<template>
	<view :data-theme="themeStyle">
		<view class="notes-nav">
			<scroll-view class="notes-list" scroll-x="true">
				<text
					v-for="(gruopItem, gruopIndex) in groupInfo.groupList"
					:key="gruopIndex"
					class="notes-item"
					@click="tabCut(gruopItem.group_id, gruopIndex)"
					:class="gruopIndex == groupInfo.currIdent ? 'color-base-text active color-base-border' : ''"
				>
					{{ gruopItem.group_name }}
				</text>
			</scroll-view>
		</view>

		<mescroll-uni @getData="getNotesList" ref="mescroll" v-if="groupInfo.currId != 0" top="94">
			<block slot="list">
				<view class="notes-content" v-if="noteListInfo.length">
					<view class="note-item" v-for="(listItem, listIndex) in noteListInfo" :key="listIndex" @click="noteDetail(listItem.note_id)">
						<text class="note-title">{{ listItem.note_title }}</text>
						<view class="notes-highlights-list" v-if="listItem.goods_highlights">
							<text class="color-base-bg" v-for="(labelItem, labelIndex) in listItem.label" :key="labelIndex">{{ labelItem }}</text>
						</view>
						<view class="note-desc">
							<text class="color-base-text">#{{ listItem.note_type == 'goods_item' ? '单品介绍' : '掌柜说' }}#</text>
							{{ listItem.note_abstract }}
						</view>
						<view class="notes-img-wrap" :class="{ 'notes-img-wrap-list': listItem.cover_type == 1 }">
							<image v-if="listItem.cover_type == 0" :src="$util.img(listItem.cover_img)" mode="aspectFill" class="notes-item-image"></image>
							<image
								v-else
								v-for="(imgItem, imgIndex) in listItem.img"
								:key="imgIndex"
								:src="$util.img(imgItem)"
								mode="aspectFit"
								class="notes-item-image-li"
							></image>
						</view>

						<view class="rest-info">
							<view class="time" v-if="listItem.is_show_release_time == 1">{{ $util.timeStampTurnTime(listItem.create_time, 'time') }}</view>
							<view class="read-info">
								<text v-if="listItem.is_show_read_num == 1">
									阅读
									<text>{{ listItem.initial_read_num + listItem.read_num }}</text>
								</text>
								<text v-if="listItem.is_show_dianzan_num == 1" @click.stop="giveLike(listItem.note_id, listIndex)">
									<text class="iconfont iconlikefill color-base-text" v-if="listItem.is_dianzan == 1"></text>
									<text class="iconfont icongz" v-else></text>
									<text>{{ listItem.initial_dianzan_num + listItem.dianzan_num }}</text>
								</text>
							</view>
						</view>
					</view>
				</view>
			</block>

			<loading-cover ref="loadingCover"></loading-cover>
		</mescroll-uni>
		<view class="empty-box" v-if="showEmpty && noteListInfo.length == 0"><ns-empty :isIndex="!1" :fixed="!1" text="暂无店铺笔记"></ns-empty></view>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			groupInfo: {
				groupList: [],
				currIdent: 0,
				currId: 0
			},
			noteListInfo: [],
			giveLikeFlag: false,
			showEmpty: false,
			siteId: 0
		};
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$store.dispatch('getAddonIsexit').then(data => {
			if (!data.notes) {
				this.$util.showToast({
					title: '店铺笔记未开启',
					mask: true
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 1000);
			} else {
				this.getGroup();
				if (this.$refs.mescroll) {
					this.$refs.mescroll.refresh();
				}
			}
		});
	},
	onLoad(data) {
		this.siteId = parseInt(data.site_id) || 0;
	},
	mixins: [globalConfig],
	methods: {
		/* 获取分组数据 */
		getGroup() {
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/notes/api/notes/group',
				success: res => {
					this.showEmpty = true;
					if (res.code == 0) {
						if (res.data.length != 0) {
							this.groupInfo.groupList = res.data;
							this.groupInfo.currId = res.data[0].group_id;
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/* 切换标签页 */
		tabCut(groupId, index) {
			this.groupInfo.currIdent = index;
			this.groupInfo.currId = groupId;

			this.$refs.mescroll.refresh();
			if (this.$refs.loadingCover) this.$refs.loadingCover.show();
		},
		/* 获取l列表信息 */
		getNotesList(mescroll) {
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/notes/api/notes/lists',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					group_id: this.groupInfo.currId,
					site_id: this.siteId
				},
				success: res => {
					this.showEmpty = true;
					let newArr = [];
					if (res.code == 0) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}

					mescroll.endSuccess(newArr.length);
					if (mescroll.num == 1) this.noteListInfo = []; //如果是第一页需手动制空列表
					this.noteListInfo = this.noteListInfo.concat(newArr); //追加新数据
					this.noteListInfo.forEach(function(item, index) {
						item.img = item.cover_img.split(',');
						item.label = item.goods_highlights.split(',');
					});

					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/* 跳转详情 */
		noteDetail(noteId) {
			this.$util.redirectTo('/otherpages/store_notes/note_detail/note_detail', {
				note_id: noteId
			});
		},
		/* 点赞 */
		giveLike(noteId, index) {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/otherpages/store_notes/note_list/note_list');
				return;
			}

			if (this.giveLikeFlag) return false;
			this.giveLikeFlag = true;

			var url = this.noteListInfo[index].is_dianzan == 1 ? '/notes/api/record/delete' : '/notes/api/record/add';
			this.$api.sendRequest({
				url: url,
				data: {
					note_id: noteId
				},
				success: res => {
					this.giveLikeFlag = false;
					if (res.code == 0 && res.data > 0) {
						if (this.noteType != 'goods_item')
							this.noteListInfo[index].dianzan_num =
								this.noteListInfo[index].is_dianzan == 1 ? this.noteListInfo[index].dianzan_num - 1 : this.noteListInfo[index].dianzan_num + 1;
						else {
							this.noteListInfo[index].dianzan_num =
								this.noteListInfo[index].is_dianzan == 1 ? this.noteListInfo[index].dianzan_num - 1 : this.noteListInfo[index].dianzan_num + 1;
						}
						this.noteListInfo[index].is_dianzan = this.noteListInfo[index].is_dianzan == 1 ? 0 : 1;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.notes-nav {
	overflow: hidden;
	padding: 0 20rpx;
	background-color: #fff;

	.notes-list {
		display: flex;
		align-items: center;
		width: 100%;
		height: 90rpx;
		white-space: nowrap;

		.notes-item {
			&.active {
				border-bottom: 4rpx solid;
			}

			display: inline-block;
			margin: 0 20rpx;
			height: 86rpx;
			text-align: center;
			line-height: 90rpx;
		}
	}
}

.notes-content {
	height: 100%;
	width: 100%;
	padding: 1px 0;
}

.note-item {
	margin: $margin-updown $margin-both;
	padding: 20rpx;
	background-color: #fff;
	border-radius: 6rpx;
	overflow: hidden;
	position: relative;

	.note-title {
		font-size: 30rpx;
		font-weight: 600;
		line-height: 44rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.notes-highlights-list {
		text {
			display: inline-block;
			color: #ffffff;
			font-size: 24rpx;
			line-height: 36rpx;
			padding: 0 10rpx;
			border-radius: 4rpx;
			margin: 0 5rpx;
		}
	}

	.note-desc {
		margin: 4rpx 0 8rpx;
		line-height: 40rpx;
		overflow: hidden;

		text {
			float: left;
			margin-right: 16rpx;
		}
	}

	.notes-img-wrap {
		position: relative;
		height: 300rpx;

		.notes-item-image {
			width: 100%;
			height: 300rpx;
			object-fit: cover;
		}

		.notes-label {
			display: inline-block;
			position: absolute;
			left: 20rpx;
			bottom: 20rpx;
			max-width: calc(100vh - 40rpx);
			background-color: #ffffff;
			line-height: 36rpx;
			padding: 0 10rpx 0 4rpx;

			> span {
				font-size: 24rpx;
				margin-left: 6rpx;

				span {
					margin-right: 2rpx;
				}
			}
		}
	}

	.notes-img-wrap-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		height: auto;

		image {
			width: calc((100% - 40rpx) / 3);
			height: 210rpx;
			margin-top: 20rpx;

			&:nth-child(-n + 3) {
				margin-top: 0;
			}
		}

		&:after {
			content: '';
			width: calc((100% - 40rpx) / 3);
		}
	}

	.note-img-one {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 420rpx;

		image {
			width: 100%;
			height: 420rpx;
		}
	}

	.note-img-more {
		width: 100%;
		white-space: nowrap;

		.more-item {
			~ .more-item {
				margin-left: 16rpx;
			}

			overflow: hidden;
			display: inline-block;
			width: 200rpx;
			height: 200rpx;
			text-align: center;
			line-height: 200rpx;
			border-radius: 10rpx;

			image {
				width: 200rpx;
				height: 200rpx;
			}
		}
	}

	.notes-img-wrap {
		position: relative;
		height: 300rpx;

		.notes-item-image {
			width: 100%;
			height: 300rpx;
			object-fit: cover;
		}

		.notes-label {
			display: inline-block;
			position: absolute;
			left: 20rpx;
			bottom: 20rpx;
			max-width: calc(100vh - 40rpx);
			background-color: #ffffff;
			line-height: 36rpx;
			padding: 0 10rpx 0 4rpx;

			> span {
				font-size: 24rpx;
				margin-left: 6rpx;

				span {
					margin-right: 2rpx;
				}
			}
		}
	}

	.notes-img-wrap-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		height: auto;

		image {
			width: calc((100% - 40rpx) / 3);
			height: 210rpx;
			margin-top: 20rpx;

			&:nth-child(-n + 3) {
				margin-top: 0;
			}
		}

		&:after {
			content: '';
			width: calc((100% - 40rpx) / 3);
		}
	}

	.rest-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;

		.time,
		.read-info {
			color: #b6b6b6;
			font-size: 24rpx;
		}

		text {
			margin-left: 10rpx;
		}

		.read-info > text {
			margin-left: 30rpx;
		}
	}
}

.empty-box {
	margin-top: 200rpx;
}
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
