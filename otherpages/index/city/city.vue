<template>
	<view>
		<city-select :activeCity="activeCity" :locationCity="locationCity" :obtainCitys="obtainCitys" :formatName="formatName"
		 :hotCity="hotCity" ref="city" @cityClick="selectCity"></city-select>
	</view>
</template>

<script>
	import citySelect from "@/components/city-select/city-select.vue"
	import WxMap from 'common/js/map-wx-jssdk.js'

	export default {
		components: {
			citySelect
		},
		data() {
			return {
				activeCity: null,
				locationCity: null,
				obtainCitys: [],
				hotCity: [{
						"id": 0,
						"title": "全国"
					},
					{
						"id": 110100,
						"title": "北京"
					},
					{
						"id": 140100,
						"title": "太原"
					},
					{
						"id": 120100,
						"title": "天津"
					},
					{
						"id": 130100,
						"title": "石家庄"
					},
					{
						"id": 370100,
						"title": "济南"
					}
				],
				formatName: 'title',
				cityAddon: 0
			}
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.getCityList();
			this.getLocation();
			this.checkAddonIsexit();
			if (uni.getStorageSync('city')) this.activeCity = uni.getStorageSync('city');
		},
		methods: {
			getCityList() {
				if (uni.getStorageSync('cityData')) this.obtainCitys = uni.getStorageSync('cityData');
				this.$api.sendRequest({
					url: '/api/address/city',
					success: res => {
						if (res.data) {
							this.obtainCitys = res.data;
							this.$refs.city.updateCitys(res.data);
							uni.setStorageSync('cityData', res.data);
						}
					}
				})
			},
			selectCity(data) {
				uni.setStorage({
					key: 'city',
					data: data,
					success: () => {
						this.$util.goBack();
					}
				})
			},
			/**
			 * 获取定位城市
			 */
			getLocation() {
				const map = new WxMap({
					key: this.$config.mpKey
				});
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						map.reverseGeocoder({
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success: res => {
								this.$api.sendRequest({
									url: '/api/address/citybyname',
									data: {
										city: res.result.address_component.city
									},
									success: res => {
										if (res.data) {
											this.locationCity = res.data;
										}
									}
								})
							},
							fail: res => {
								console.error('定位失败错误信息：' + res.message)
							}
						})
					}
				})
			},
			checkAddonIsexit() {
				this.$api.sendRequest({
					url: '/api/addon/isexit',
					data: {
						name: 'city'
					},
					success: res => {
						this.cityAddon = res.data;
					}
				})
			}
		}
	}
</script>
