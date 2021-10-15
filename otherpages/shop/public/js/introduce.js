export default {
	data() {
		return {
			shopInfo: {},
			shopDesccredit: 0,
			shopServicecredit: 0,
			shopDeliverycredit: 0,
			workingDay: '',
		};
	},
	methods: {
		//获取店铺详细信息
		getShopInfo() {
			this.$api.sendRequest({
				url: '/api/shop/info',
				data: {
					site_id: this.siteId
				},
				success: res => {
					if (res.code == 0) {
						this.shopInfo = res.data;
						this.shopDesccredit = Math.floor((parseFloat(this.shopInfo.shop_desccredit) * 100) / 5);
						this.shopServicecredit = Math.floor((parseFloat(this.shopInfo.shop_servicecredit) * 100) / 5);
						this.shopDeliverycredit = Math.floor((parseFloat(this.shopInfo.shop_deliverycredit) * 100) / 5);

						let arr = this.shopInfo.work_week.split(',');
						if (arr.length == 7) {
							this.workingDay = '全天';
						}
						for (let i = 0; i < arr.length; i++) {
							if (arr[i] == 1) arr[i] = '星期一';
							if (arr[i] == 2) arr[i] = '星期二';
							if (arr[i] == 3) arr[i] = '星期三';
							if (arr[i] == 4) arr[i] = '星期四';
							if (arr[i] == 5) arr[i] = '星期五';
							if (arr[i] == 6) arr[i] = '星期六';
							if (arr[i] == 7) arr[i] = '星期天';
						}
						this.workingDay = arr.toString();
					} else {
						this.$util.showToast({
							title: res.message
						})
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	}
};
