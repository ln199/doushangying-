export default {
	data() {
		return {
			selectGoodsId: 0, //选中的商品分类id
			goodsCategory: [{
					'id': 0,
					'name': '宝贝'
				},
				{
					'id': 1,
					'name': '店铺'
				}
			],
			collectionList: [],
			isEdit: false,
			isShowEmpty: false
		};

	},
	methods: {
		//跳转至详情页
		toDetail(item) {
			if (this.isEdit) return;
			this.$util.redirectTo("/pages/goods/detail/detail", {
				sku_id: item
			});
		},
		toShopDetail(e) {
			if (this.isEdit) return;
			this.$util.redirectTo("/otherpages/shop/index/index", {
				site_id: e
			});
		},
		//是否为商品，店铺，或其他
		goodsCateChange: function(e) {
			if (this.selectGoodsId != e) {
				this.collectionList = [];
				this.isEdit = false;
				this.selectGoodsId = e;
				this.$refs.goodsRecommend.init()
				this.$refs.mescroll.refresh()
			}
		},
		//是否编辑
		edit() {
			if(this.collectionList.length <= 0) return false;
			this.isEdit = !this.isEdit;
		},
		//请求数据
		getData(mescroll) {
			this.isShowEmpty = false;
			let url = "/api/goodscollect/page"
			if (this.selectGoodsId == 1) {
				url = "/api/shopmember/membershoppages"
			}
			let that = this;
			let array = []
			this.$api.sendRequest({
				url: url,
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
				},
				async: false,
			}).then((res) => {
				let newArr = res.data.list;
				if (this.selectGoodsId == 0) {
					for (var i = 0; i < newArr.length; i++) {
						newArr[i].composite_score = Math.floor((parseFloat(newArr[i].shop_desccredit) + parseFloat(newArr[i].shop_servicecredit) +
							parseFloat(newArr[i].shop_deliverycredit)) / 3).toFixed(1);
					}
				}

				array = array.concat(newArr);

				//设置列表数据
				if (mescroll.num == 1) this.collectionList = []; //如果是第一页需手动制空列表
				this.collectionList = this.collectionList.concat(newArr); //追加新数据

				if (array.length < mescroll.size) {
					this.$refs.goodsRecommend.getLikeList(mescroll.size).then((res) => {
						array = array.concat(res)
						mescroll.endSuccess(array.length);
						if (mescroll.num == 1) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						}
					})
				} else {
					mescroll.endSuccess(array.length);
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}

				this.isShowEmpty = true;
			})

		},
		//监听下拉刷新，初始化页面数据
		listenRefresh(e) {
			this.$refs.goodsRecommend.init();
		},
		//删除某一项
		deleteItem(e) {
			this.$api.sendRequest({
				url: "/api/goodscollect/delete",
				data: {
					goods_id: e
				},
				success: res => {
					if (res.code == 0) {
						this.$util.showToast({
							title: "删除成功"
						})
						let array = this.collectionList;
						let newArray = array.filter((v) => {
							return v.goods_id != e;
						})
						this.collectionList = newArray;
					} else {
						this.$util.showToast({
							title: res.message
						})
					}
				}
			})
		},
		//取消关注店铺
		unfollow(e) {
			this.$api.sendRequest({
				url: "/api/shopmember/delete",
				data: {
					site_id: e
				},
				success: res => {
					if (res.code == 0 && res.data) {
						let arr = this.collectionList.filter((v) => {
							return v.site_id != e;
						})
						this.collectionList = arr;
						this.$util.showToast({
							title: "取消成功"
						})
					} else {
						this.$util.showToast({
							title: res.message
						})
					}
				},
			});
		},
		imgError(index) {
			this.collectionList[index].logo = this.$util.getDefaultImage().default_shop_img;
			this.$forceUpdate();
		},
		goodsImgError(index) {
			this.collectionList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
