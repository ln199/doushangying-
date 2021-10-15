export default {
	data() {
		return {
			cateList: [], //分类信息
			id: '', //左侧滚动使用id
			index: 0, //默认显示的数据的一级分类id
			cateDetail: [], //一级分类详情,
			siteId: 0 ,//店铺id
			iphoneX:false
		};
	},
	onLoad(options) {
		this.iphoneX=this.$util.uniappIsIPhoneX()
		if (!options.site_id) {
			this.$util.redirectTo('/otherpages/shop/index/index', {}, 'redirectTo');
			return;
		}
		this.siteId = options.site_id;
		this.initCategoryList();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		//点击左侧分类
		selectCategory(e, f) {
			this.index = e;
			this.id = 'a' + e;
			this.cateDetail = this.cateList[f];
		},
		//获取分类列表
		initCategoryList() {
			this.$api.sendRequest({
				url: '/api/shopgoodscategory/tree',
				data: {
					site_id: this.siteId
				},
				success: res => {
					if (res.code == 0) {
						if (res.data.length) {
							this.cateList = res.data;
							this.index = res.data[0].category_id;
							this.id = 'a' + res.data[0].category_id;
							this.cateDetail = res.data[0];
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},

		/**
		 * 跳转至商品列表页面
		 */
		goList(categoryId, level) {
			this.$util.redirectTo('/otherpages/shop/list/list', {
				category_id: categoryId,
				category_level: level,
				site_id: this.siteId
			});
		},
		imgError() {
			this.cateDetail.image = this.$util.img('/upload/uniapp/default_ad.png');
			this.$forceUpdate();
		},
		categoryImgError(index) {
			this.cateDetail.child_list[index].image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}

	}
};
