export default {
	data() {
		return {
			mescroll: null,
			timeList: [], //时间列表
			seckillId: null, //选中的时间块
			seckillIndex: null, //选中时间块的index
			dataList: [], //选中时间块的商品列表
			index: null, //当前正在抢购的index,
			siteId: 0,
			timer: null,
			noStartList: [],
			showEmpty: false
		};
	},
	watch: {
		seckillId(newName, oldName) {
			if (newName && oldName && newName != oldName) {
				this.mescroll.resetUpScroll(false);
			}
		}
	},
	computed: {
		show() {
			return this.timeList.length > 0
		}
	},
	methods: {
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], {
				size: 'mid'
			}) : this.$util.getDefaultImage().default_goods_img;
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
		isEnd(isShow) {
			if (!isShow) return;
			this.$util.showToast({
				title: "限时秒杀活动已结束",
			});
		},
		getTimeList() {
			this.$api.sendRequest({
				url: '/seckill/api/seckill/lists',
				data: {site_id: this.siteId},
				success: res => {
					let data = res.data;
					if (!data) return;
					let time = new Date(res.timestamp * 1000);
					let newTimes = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
					var tempList = Object.values(data.list);
					tempList.forEach((v, k) => {
						if (v.seckill_start_time <= newTimes && newTimes < v.seckill_end_time) {
							v.isNow = true;
							this.seckillId = v.id;
							this.index = k;
							this.seckillIndex = k;
						} else {
							v.isNow = false;
						}
					});
					this.timeList = data.list;

					if (tempList.length) {
						let now = Math.round(new Date() / 1000), // 当前时间戳
							start = Math.round(new Date(new Date().toLocaleDateString()).getTime() / 1000), // 当天0点时间戳
							second = now - start;
						for (let i = 0; i < data.list.length; i++) {
							if (newTimes < data.list[i].seckill_start_time && i == 0) {
								this.seckillId = data.list[i].id;
								this.index = i;
								this.seckillIndex = i;
							} else if (newTimes < data.list[i].seckill_start_time && newTimes > data.list[i - 1].seckill_end_time && i !=
								0) {
								this.seckillId = data.list[i].id;
								this.index = i;
								this.seckillIndex = i;
							} else if (i == data.list.length - 1 && newTimes > data.list[i].seckill_end_time) {
								this.seckillId = data.list[i].id;
								this.index = i;
								this.seckillIndex = i;
							}

							if (second < tempList[i].seckill_start_time) {
								let temp = tempList[i];
								temp.index = i;
								this.noStartList.push(temp);
							}
						}

						if (this.noStartList.length) {
							this.autoEvent();
						}
					}
					var self = this;
					setInterval(res => {
						self.getExpirationTime();
					}, 1000);
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getData(mescroll) {
			this.mescroll = mescroll;
			if (mescroll.size == 1) {
				this.dataList = [];
			}
			this.$api.sendRequest({
				url: '/seckill/api/seckillgoods/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					seckill_id: this.seckillId,
					site_id: this.siteId
				},
				success: res => {
					this.showEmpty = true;
					let newArr = []
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						})
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getExpirationTime() {
			var timeListData = this.timeList,
				currDate = new Date(),
				dateStr = currDate.toLocaleDateString(),
				expirationTime,
				nowTime,
				obj;

			for (var i in timeListData) {
				if (timeListData[i].isNow) {
					this.ident = true;
					nowTime = Date.parse(currDate);
					expirationTime = Date.parse(dateStr) + parseInt(timeListData[i].seckill_end_time) * 1000;
					let endSeconds = (expirationTime - nowTime) / 1000;
					obj = this.$util.countDown(endSeconds);
					this.hour = obj.h;
					this.minute = obj.i;
					this.second = obj.s;
					if (endSeconds == 0) {
						let next = parseInt(i) + 1;
						if (next < timeListData.length) this.index = next;
						this.timeList[i].isNow = false;
					}
					return false;
				}
			}
			this.ident = false;
		},
		ontabtap(e, f) {
			this.seckillId = e;
			this.seckillIndex = f;
		},
		//跳转到详情页
		toGoodsDetail(id, index) {
			if (this.seckillIndex < this.index) {
				this.$util.showToast({
					title: "秒杀活动已结束！",
				});
				return;
			}
			if (this.seckillIndex > this.index) {
				this.$util.showToast({
					title: "秒杀活动还未开启，敬请期待！",
				});
				return;
			}
			this.$api.sendRequest({
				url: '/api/config/time',
				data: {},
				success: res => {

					let time = new Date(res.timestamp * 1000);
					let newTimes = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
					if (this.timeList[index].seckill_start_time <= newTimes && newTimes < this.timeList[index].seckill_end_time) {
						this.timeList[index].isNow = true;
					} else {
						this.timeList[index].isNow = false;
					}

					this.$forceUpdate();

					if (!this.timeList[index].isNow) {
						this.$util.showToast({
							title: "秒杀活动即将开启，敬请期待！",
						});
						return;
					}
					this.$util.redirectTo('/promotionpages/seckill/detail/detail', {
						seckill_id: id
					});

				}
			});
		},
		imgError(index) {
			this.dataList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		autoEvent() {
			this.timer = setInterval(() => {
				let now = Math.round(new Date() / 1000), // 当前时间戳
					start = Math.round(new Date(new Date().toLocaleDateString()).getTime() / 1000), // 当天0点时间戳
					second = now - start;
				for (let i = 0; i < this.noStartList.length; i++) {
					let item = this.noStartList[i];
					if (second > item.seckill_start_time && !item.isNow) {
						this.seckillId = item.seckill_id;
						this.index = item.index;
						this.timeList[item.index].isNow = true;
						if (this.timeList[item.index - 1] != undefined) {
							this.timeList[item.index - 1].isNow = false;
						}
						this.noStartList.splice(i);
					}
				}

				if (this.noStartList.length == 0) {
					clearInterval(this.timer);
				}
			}, 1000)
		},
		goodsTag(data) {
			switch (data.recommend_way) {
				case 1:
					return '新品';
					break;
				case 2:
					return '精品';
					break;
				case 3:
					return '推荐';
					break;
				default:
					return '';
			}
		}
	},
	onShareAppMessage(res) {
		var title = '一大波的秒杀福利就要开始了，真的不来看看嘛';
		var path = '/promotionpages/seckill/list/list';
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	},
	onHide() {
		clearInterval(this.timer);
	}
};
