export default {
	data() {
		return {
			isIphoneX: false,
			orderCreateData: {},
			orderPaymentData: {
				exchange_info: {
					type: 0
				}
			},
			type: 1,
			isSub: false
		};
	},
	methods: {
		// 显示弹出层
		openPopup(ref) {
			this.$refs[ref].open();
		},
		// 关闭弹出层
		closePopup(ref) {
			this.$refs[ref].close();
		},
		// 选择收货地址，默认有定位
		selectAddress() {
			var params = {
				back: '/promotionpages/point/payment/payment',
				local: 0,
				type: 1
			}
			// 外卖配送需要定位地址
			// if (this.orderPaymentData.delivery.delivery_type == 'local') {
			// 	params.local = 1;
			// 	params.type = 2;
			// }
			this.$util.redirectTo('/otherpages/member/address/address', params);
		},
		// 获取订单初始化数据
		getOrderPaymentData() {
			this.orderCreateData = uni.getStorageSync('exchangeOrderCreateData');
			var pay_flag = uni.getStorageSync("pay_flag"); // 支付中标识，防止返回时，提示,跳转错误
			if (!this.orderCreateData) {
				if (pay_flag == 1) {
					uni.removeStorageSync("pay_flag");
				} else {
					this.$util.showToast({
						title: '未获取到创建订单所需数据！'
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}, 1000);
				}
				return;
			}

			this.orderCreateData.buyer_message = '';

			this.$api.sendRequest({
				url: '/pointexchange/api/ordercreate/payment',
				data: this.orderCreateData,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData = res.data;
						this.orderPaymentData.timestamp = res.timestamp;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: '未获取到创建订单所需数据！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}, 1000);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			})
		},
		// 订单创建
		orderCreate() {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;

				var data = this.$util.deepClone(this.orderCreateData);
				data.delivery = JSON.stringify(data.delivery);
				data.member_address = JSON.stringify(data.member_address);

				this.$api.sendRequest({
					url: '/pointexchange/api/ordercreate/create',
					data,
					success: res => {
						if (res.code >= 0) {
							if (this.orderPaymentData.exchange_info.pay_type == 1 && this.orderPaymentData.exchange_info.price !=
								'0.00') {
								this.$refs.choosePaymentPopup.getPayInfo(res.data);
								this.isSub = false;
							} else {
								this.$util.redirectTo('/promotionpages/point/result/result', {}, 'redirectTo');
							}
							// uni.removeStorage({
							// 	key: 'exchangeOrderCreateData',
							// 	success: () => {}
							// });
						} else {
							this.isSub = false;
							if (res.data.error_code == 10 || res.data.error_code == 12) {
								uni.showModal({
									title: '订单未创建',
									content: res.message,
									confirmText: '去设置',
									success: res => {
										if (res.confirm) {
											this.selectAddress();
										}
									}
								})
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						}
					},
					fail: res => {
						uni.hideLoading();
						this.isSub = false;
					}
				})
			}
		},
		// 订单验证
		verify() {
			if (this.orderPaymentData.exchange_info.type == 1) {
				if (!this.orderPaymentData.member_address) {
					this.$util.showToast({
						title: '请先选择您的收货地址'
					});
					return false;
				}
			}
			return true;
		},
		imgError() {
			let imageUrl = ''
			if (this.orderPaymentData.exchange_info.type == 1) {
				imageUrl = this.$util.img('upload/uniapp/point/gift.png');
			} else if (this.orderPaymentData.exchange_info.type == 2) {
				imageUrl = this.$util.img('upload/uniapp/point/coupon.png');
			} else if (this.orderPaymentData.exchange_info.type == 3) {
				imageUrl = this.$util.img('upload/uniapp/point/hongbao.png');
			} else {
				imageUrl = this.$util.getDefaultImage().default_goods_img;
			}
			this.orderPaymentData.exchange_info.image = imageUrl;
			this.$forceUpdate();
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			if (this.verify() && this.orderPaymentData.exchange_info.pay_type == 1 && this.orderPaymentData.exchange_info.price !=
				'0.00') this.$refs.choosePaymentPopup.open();
			else this.orderCreate();
		},
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		if (uni.getStorageSync('addressBack')) {
			uni.removeStorageSync('addressBack');
		}

		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages/login/login/login');
		} else {
			this.getOrderPaymentData();
		}

		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	filters: {
		// 金额格式化输出
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		}
	}
}
