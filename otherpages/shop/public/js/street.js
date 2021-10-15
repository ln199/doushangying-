export default {
	data() {
		return {
			orderType: '',
			shopList: [],
			order: '',
			sort: 'desc',
			keyword: '',
			lat: 0,
			lng: 0,
			iphoneX:false,
			hasFollow: false
		}
	},

	onLoad(options) {
		this.keyword = options.keyword || '';
		this.iphoneX=this.$util.uniappIsIPhoneX()
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		
		if (uni.getStorageSync('location')) {
			this.lat = uni.getStorageSync('location').latitude;
			this.lng = uni.getStorageSync('location').longitude;
		}
	},
	methods: {
		follow() {
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo('/pages/login/login/login', {});
				return;
			}
			if (this.hasFollow) {
				uni.showModal({
					title: '提示',
					content: '真的要取消关注嘛',
					success: function(res) {
						if (res.confirm) {
							this.$api.sendRequest({
								url: '/api/shopmember/delete',
								data: {
									site_id: this.shopList.site_id
								},
								success: res => {
									if (res.code == 0 && res.data) {
										this.hasFollow = !this.hasFollow;
										this.$util.showToast({
											title: '取消成功'
										});
									}
								}
							});
						}
					}
				});
			} else {
				this.$api.sendRequest({
					url: '/api/shopmember/add',
					data: {
						site_id: this.shopList.site_id
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.hasFollow = !this.hasFollow;
							this.$util.showToast({
								title: '关注成功'
							});
						}
					}
				});
			}
		},
		isFollow() {
			this.$api.sendRequest({
				url: '/api/shopmember/issubscribe',
				data: {
					site_id: this.shopList.site_id
				},
				success: res => {
					if (res.code == 0) {
						this.hasFollow = res.data;
					}
				}
			});
		},
		getShopList(mescroll) {
			this.$api.sendRequest({
				url: '/api/shop/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					keyword: this.keyword,
					order: this.order,
					sort: this.sort,
					lat: this.lat,
					lng: this.lng
				},
				success: res => {
					let newArr = []
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
						for (var i = 0; i < newArr.length; i++) {
							newArr[i].composite_score = ((parseFloat(newArr[i].shop_desccredit) + parseFloat(newArr[i].shop_servicecredit) +
								parseFloat(newArr[i].shop_deliverycredit)) / 3).toFixed(1);
						}
					} else {
						this.$util.showToast({
							title: msg
						})
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.shopList = []; //如果是第一页需手动制空列表
					this.shopList = this.shopList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//筛选点击
		sortTabClick(tag) {
			if (tag == 'shop_sales') {
				this.order = 'shop_sales';
				this.sort = 'desc';
			} else if (tag == 'shop_desccredit') {
				this.order = 'shop_desccredit';
				this.sort = 'desc';
			} else {
				this.order = '';
				this.sort = '';
			}

			this.orderType = tag;

			this.$refs.mescroll.refresh();
		},
		search() {
			this.$refs.mescroll.refresh();
		},
		imgError(index) {
			this.shopList[index].logo = this.$util.getDefaultImage().default_shop_img;
			this.$forceUpdate();
		},
		phone(e){
			uni.makePhoneCall({
			    phoneNumber: e //仅为示例
			});
		},
		jump(e){
			this.$util.redirectTo(e)
		},
		GetDistance( lat1, lng1, lat2, lng2){
		    var radLat1 = lat1*Math.PI / 180.0;
		    var radLat2 = lat2*Math.PI / 180.0;
		    var a = radLat1 - radLat2;
		    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
		    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
		    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
		    s = s *6378.137 ;// EARTH_RADIUS;
		    s = Math.round(s * 10000) / 10000;
		    return s;
		}
	}

}
