export default {
	data() {
		return {
			listStyle: '',
			loadingType: 'loading', //加载更多状态
			orderType: '',
			priceOrder: 'desc', //1 价格从低到高 2价格从高到低
			categoryList: [], //排序类型
			goodsList: [],
			order: '',
			sort: 'desc',
			showCategory: false,
			showScreen: false,
			keyword: '',
			categoryId: 0,
			categoryLevel: 0,
			brandId: 0,
			attr: [],
			currAttr: [],
			minPrice: '',
			maxPrice: '',
			isFreeShipping: -1, //是否免邮
			brandList: [], //品牌筛选项
			showBrandMore: false,
			attributeList: [], //属性筛选项
			siteId: 0,
			
			emptyShow: false,
			isList:true,
			
			couponId:0,
			platformcouponTypeId:0,
			network:false,
			mescroll:null,
			
		}
	},

	onLoad(options) {
		if (!options.site_id) {
			this.$util.redirectTo('/otherpages/shop/index/index', {}, 'redirectTo');
			return;
		}
		this.siteId = options.site_id;

		this.categoryId = options.category_id || 0;
		this.categoryLevel = options.category_level || 0;
		this.brandId = options.brand_id || 0;
		this.keyword = options.keyword || '';
		this.loadCategoryList(this.categoryId);
		this.couponId = options.couponId || 0;
		this.platformcouponTypeId = options.platformcouponTypeId || 0;
	},
	onShow() {
		this.network = true;
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		getGoodsList(mescroll) {
			this.mescroll = mescroll
			let data={
				page: mescroll.num,
				page_size: mescroll.size,
				keyword: this.keyword,
				// category_id: this.categoryId,
				category_level: this.categoryLevel,
				brand_id: this.brandId,
				min_price: this.minPrice,
				max_price: this.maxPrice,
				order: this.order,
				sort: this.sort,
				attr: this.currAttr.length > 0 ? JSON.stringify(this.currAttr) : "",
				site_id: this.siteId,
				coupon_type:this.couponId,
				platform_coupon_type:this.platformcouponTypeId
			}
			if (this.siteId) {
				data.shop_category_id=this.categoryId;
			}else{
				data.category_id = levelId;
				data.category_level=this.categoryLevel;
			}
			if(this.isFreeShipping>0){
				data.is_free_shipping=this.isFreeShipping;
			}
			
			this.$api.sendRequest({
				url: '/api/goodssku/page',
				data: data,
				success: res => {
					let newArr = []
					let msg = res.message;
					if (res.code == 0 && res.data) {
						if (res.data.page_count == 0) {
							this.emptyShow = true
						}
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						})
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					this.network = true
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		changeListStyle() {
			this.isList = !this.isList
		},
		//重置数据
		resetData() {
			this.categoryId = 0
			this.minPrice = ''
			this.maxPrice = ''
			this.isFreeShipping = false
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], {
				size: 'mid'
			}) : this.$util.getDefaultImage().default_goods_img;
		},
		//加载分类
		loadCategoryList(fid, sid) {
			this.$api.sendRequest({
				url: '/api/shopgoodscategory/tree',
				data: {
					site_id: this.siteId
				},
				success: res => {
					if (res.data != null) this.categoryList = res.data;
				}
			});
		},
		//筛选点击
		sortTabClick(tag) {
			if (tag == 'sale_num') {
				this.order = 'sale_num';
				this.sort = 'desc';
			} else if (tag == 'discount_price') {
				this.order = 'discount_price';
				this.sort = 'desc';
			} else if (tag == 'screen') {
				//筛选
				this.showScreen = true;
				return;
			} else {
				this.order = '';
				this.sort = '';
			}

			if (this.orderType === tag && tag !== 'discount_price') return;

			this.orderType = tag;
			if (tag === 'discount_price') {
				this.priceOrder = this.priceOrder === 'asc' ? 'desc' : 'asc';
				this.sort = this.priceOrder;
			} else {
				this.priceOrder = '';
			}
			this.emptyShow = false;
			this.$refs.mescroll.refresh();
		},
		//商品详情
		toDetail(item) {
			this.$util.redirectTo('/pages/goods/detail/detail', {
				sku_id: item.sku_id
			});
		},
		search() {
			this.emptyShow = false;
			this.goodsList = [];
			this.$refs.mescroll.refresh();
		},
		selectedCategory(categoryId, categoryLevel) {
			this.keyword = '';
			this.categoryId = categoryId;
			this.categoryLevel = categoryLevel;
		},
		// 选择属性筛选项
		selectedAttr(attr_id, attr_value_id) {
			if (this.attr[attr_id] && this.attr[attr_id].attr_value_id == attr_value_id) {
				delete this.attr[attr_id];
			} else {
				this.attr[attr_id] = {
					attr_id: attr_id,
					attr_value_id: attr_value_id
				};
			}
			this.currAttr = [];
			for (let i in this.attr) this.currAttr.push(this.attr[i]);
		},
		//是否选中属性
		isSelectedAttr(attr_id, attr_value_id) {
			var res = false;
			for (let i in this.currAttr) {
				if (this.currAttr[i].attr_id == attr_id && this.currAttr[i].attr_value_id == attr_value_id) {
					res = true;
					break;
				}
			}
			return res;
		},
		screenData() {
			if (this.minPrice != '' || this.maxPrice != '') {
				
				if (!Number(this.minPrice)) {
					this.$util.showToast({
						title: '请输入最低价'
					});
					return;
				}
				if (!Number(this.maxPrice)) {
					this.$util.showToast({
						title: '最输入最高价'
					});
					return;
				}
				if (Number(this.minPrice) < 0 || Number(this.maxPrice) < 0) {
					this.$util.showToast({
						title: '筛选价格不能小于0'
					});
					return; 
				}
				if (this.minPrice != '' && Number(this.minPrice) > Number(this.maxPrice)) {
				
					this.$util.showToast({
						title: '最低价不能大于最高价'
					});
					return;
				}
				if (this.maxPrice != '' && Number(this.maxPrice) < Number(this.minPrice)) {
					this.$util.showToast({
						title: '最高价不能小于最低价'
					});
					return;
				}
				
			}
			this.$refs.mescroll.refresh();
			this.showScreen = false;
			this.emptyShow = false;
		},
		imgError(index) {
			this.goodsList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		showPrice(data) {
			let price = data.discount_price;
			if (data.member_price && parseFloat(data.member_price) < parseFloat(price)) price = data.member_price;
			return price;
		}
	}

}
