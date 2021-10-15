import validate from '@/common/js/validate.js';
export default {
	data() {
		return {
			registerConfig: {},
			indent: 'all',
			customNavTitle: "",
			memberInfo: {
				headimg: ''
			},
			formData: {
				userHeadImg: '',
				number: '', //账号
				nickName: '', //昵称
				sex: '', //性别
				realName: '', //真实姓名
				birthday: '', //生日
				currentPassword: '', //当前密码
				newPassword: '', //新密码
				confirmPassword: '', //确认密码
				mobile: '', //手机号
				mobileVercode: '', //手机验证码
				mobileDynacode: '', //手机动态验证吗
				mobileCodeText: "",
			},
			memberInfoformData: {
				userHeadImg: '',
				number: '', //账号
				nickName: '', //昵称
				sex: '', //性别
				realName: '', //真实姓名
				birthday: '', //生日
				currentPassword: '', //当前密码
				newPassword: '', //新密码
				confirmPassword: '', //确认密码
				mobile: '', //手机号
				mobileVercode: '', //手机验证码
				mobileDynacode: '', //手机动态验证吗
				mobileCodeText: "",
			},
			langList: [],
			langIndex: 0,
			seconds: 120,
			timer: null,
			isSend: false,
			captcha: {
				id: '',
				img: ''
			},
			isIphoneX: false,
			items: [{
					value: '0',
					name: '未知'
				},
				{
					value: '1',
					name: '男',
					checked: 'true'
				},
				{
					value: '2',
					name: '女'
				}
			],
			current: 0,
			memberConfig: {
				is_audit: 0,
				is_enable: 0
			}
		};
	},
	onLoad(option) {
		this.customNavTitle = this.$lang('title');
		this.formData.mobileCodeText = this.$lang('findanimateCode');
		if (option.back) {
			this.back = option.back;
		}
		this.getCaptcha();

		if (option.action == 'mobile') {
			this.indent = 'mobile';
			this.customNavTitle = this.$lang('bindPhone');
		}

		this.getRegisterConfig();
		this.isIphoneX = this.$util.uniappIsIPhoneX()
	},
	onShow() {
		this.initLang();
		this.getInfo();
		this.getMemberConfig();
	},
	onHide() {
		this.seconds = 120;
		this.formData.mobileCodeText = '获取动态码';
		this.isSend = false;
		clearInterval(this.timer);
	},
	watch: {
		seconds(value) {
			if (value == 0) {
				this.seconds = 120;
				this.formData.mobileCodeText = '获取动态码';
				this.isSend = false;
				clearInterval(this.timer);
			}
		}
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	methods: {
		// 初始化语言
		initLang() {
			//获取语言列表
			this.langList = this.$langConfig.list();
			if (!uni.getStorageSync("lang")) {
				this.langIndex = 0;
			} else {
				for (let i = 0; i < this.langList.length; i++) {
					if (this.langList[i].value == uni.getStorageSync("lang")) {
						this.langIndex = i;
						break;
					}
				}
			}
			this.$langConfig.refresh();
		},
		// 初始化用户信息
		getInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0) {
						this.indent = 'all';
						this.memberInfo = res.data;
						this.memberInfoformData.userHeadImg = this.memberInfo.headimg;
						this.memberInfoformData.number = this.memberInfo.username; //账号
						this.memberInfoformData.nickName = this.memberInfo.nickname; //昵称
						this.memberInfoformData.realName = this.memberInfo.realname ? this.memberInfo.realname : '请输入真实姓名'; //真实姓名
						this.memberInfoformData.sex = this.memberInfo.sex == 0 ? '未知' : this.memberInfo.sex == 1 ? '男' : '女'; //性别
						this.memberInfoformData.birthday = this.memberInfo.birthday ? this.$util.timeStampTurnTime(this.memberInfo.birthday,
							'YYYY-MM-DD') : '请选择生日'; //生日
						this.memberInfoformData.mobile = this.memberInfo.mobile; //手机号

						this.formData.nickName = this.memberInfo.nickname; //昵称
						this.formData.realName = this.memberInfo.realname; //真实姓名
						this.formData.sex = this.memberInfo.sex; //性别
						this.formData.birthday = this.memberInfo.birthday ? this.$util.timeStampTurnTime(this.memberInfo.birthday,
							'YYYY-MM-DD') : '请选择生日'; //生日
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 切换编辑项
		modifyInfo(type) {
			let vm = this;
			if (type == 'name') {
				this.indent = type;
				this.customNavTitle = this.$lang('modifyNickname');
			}
			if (type == 'password') {
				this.indent = type;
				this.customNavTitle = this.$lang('modifyPassword');
			}
			if (type == 'realName') {
				this.indent = type;
				this.customNavTitle = this.$lang('realName');
			}
			if (type == 'sex') {
				this.indent = type;
				this.customNavTitle = this.$lang('sex');
			}
			if (type == 'birthday') {
				this.indent = type;
				this.customNavTitle = this.$lang('birthday');
			}
			if (type == 'mobile') {
				this.indent = type;
				this.getCaptcha();
				this.customNavTitle = this.$lang('bindPhone');
			}
			if (type == 'language') {
				// this.customNavTitle = this.$lang('lang');
				let newArray = [];
				for (let i = 0; i < this.langList.length; i++) {
					newArray.push(this.langList[i].name)
				}
				uni.showActionSheet({
					itemList: newArray,
					success: function(res) {
						if (vm.langIndex != res.tapIndex) {
							vm.$langConfig.change(vm.langList[res.tapIndex].value)
						}
					}
				});
			}
			if (type == 'cancellation') {
				this.indent = type;
				this.customNavTitle = this.$lang('cancellation');
				this.getCancelStatus();
			}
		},
		getCancelStatus() {
			this.$api.sendRequest({
				url: '/membercancel/api/membercancel/info',
				success: res => {
					if (res.code >= 0) {
						if (res.data) {
							if (res.data.status == 0) {
								this.$util.redirectTo('/otherpages/member/cancelstatus/cancelstatus', {
									back: '/pages/member/info/info'
								});
							} else if (res.data.status == 1) {
								this.$util.redirectTo('/otherpages/member/cancelsuccess/cancelsuccess', {
									back: '/pages/member/info/info'
								});
							} else {
								this.$util.redirectTo('/otherpages/member/cancelrefuse/cancelrefuse', {
									back: '/pages/member/info/info'
								});
							}
						} else {
							this.$util.redirectTo('/otherpages/member/cancellation/cancellation', {
								back: '/pages/member/info/info'
							});
						}
					}
				}
			});
		},
		// 导航返回
		NavReturn() {
			if (this.indent == 'all') {
				if (this.back) {
					this.$util.redirectTo(this.back, {}, 'redirectTo');
				} else {
					this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
				}
			} else {
				this.indent = 'all';
				this.customNavTitle = this.$lang('title');
				this.initFormData();
			}
		},
		// 获取验证码
		getCaptcha() {
			this.$api.sendRequest({
				url: '/api/captcha/captcha',
				data: {
					captcha_id: this.captcha.id
				},
				success: res => {
					if (res.code >= 0) {
						this.captcha = res.data;
						this.captcha.img = this.captcha.img.replace(/\r\n/g, '');
					}
				}
			});
		},
		// 退出登录
		logout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorage({
							key: 'token',
							success: res => {
								uni.setStorageSync('loginLock', 1);
								//购物车数量
								uni.removeStorageSync('userInfo')
								this.$store.dispatch('getCartNumber').then((e) => {})
								this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
							}
						});
					}
				}
			});
		},
		headImage() {
			this.$util.redirectTo("/otherpages/member/modify_face/modify_face");
		},
		// 检测手机是否已绑定
		async testBinding(type) {
			var res = await this.checkMobile();
			return res;
		},
		//获取注销的配置信息
		getMemberConfig() {
			this.$api.sendRequest({
				url: '/membercancel/api/membercancel/config',
				success: res => {
					if (res.code >= 0) {
						this.memberConfig = res.data
					}
				}
			});

		},
		save(type) {
			switch (type) {
				case 'name':
					this.modifyNickName();
					break;
				case 'realName':
					this.modifyRealName();
					break;
				case 'sex':
					this.modifySex();
					break;
				case 'birthday':
					this.modifyBirthday();
					break;
				case 'password':
					this.modifyPassword();
					break;
				case 'mobile':
					this.modifyMobile();
					break;
			}
		},

		// ------------------------修改昵称------------------------------

		modifyNickName() {
			if (this.formData.nickName == this.memberInfo.nickname) {
				this.$util.showToast({
					title: this.$lang('alikeNickname')
				});
				return;
			}
			var rule = [{
				name: 'nickName',
				checkType: 'required',
				errorMsg: this.$lang('noEmityNickname')
			}];
			if (!rule.length) return;
			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				this.$api.sendRequest({
					url: '/api/member/modifynickname',
					data: {
						nickname: this.formData.nickName
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: this.$lang("updateSuccess")
							});
							this.NavReturn();
							this.getInfo();
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error
				});
			}
		},

		// ------------------------修改真实姓名------------------------------
		modifyRealName() {
			if (this.formData.realName == this.memberInfo.realname && this.memberInfo.realname) {
				this.$util.showToast({
					title: '与原真实姓名一致，无需修改'
				});
				return;
			}
			var rule = [{
				name: 'realName',
				checkType: 'required',
				errorMsg: '真实姓名不能为空'
			}];
			if (!rule.length) return;
			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				this.$api.sendRequest({
					url: '/api/member/modifyrealname',
					data: {
						realname: this.formData.realName
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: this.$lang("updateSuccess")
							});
							this.NavReturn();
							this.getInfo();
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error
				});
			}
		},

		// ------------------------修改性别------------------------------
		radioChange: function(evt) {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].value === evt.target.value) {
					this.formData.sex = i;
					break;
				}
			}
		},

		modifySex() {
			this.$api.sendRequest({
				url: '/api/member/modifysex',
				data: {
					sex: this.formData.sex
				},
				success: res => {
					if (res.code == 0) {
						this.$util.showToast({
							title: this.$lang("updateSuccess")
						});
						this.NavReturn();
						this.getInfo();
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},

		// ------------------------修改生日------------------------------

		bindDateChange: function(e) {
			this.formData.birthday = e.target.value
		},

		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},

		modifyBirthday() {
			// var rule = [{
			// 	name: 'birthday',
			// 	checkType: 'required',
			// 	errorMsg: '生日不能为空'
			// }];
			// if (!rule.length) return;
			// var checkRes = validate.check(this.formData, rule);
			// if (checkRes) {
			// 	this.$api.sendRequest({
			// 		url: '/api/member/modifynickname',
			// 		data: {
			// 			realName: this.formData.realName
			// 		},
			// 		success: res => {
			// 			if (res.code == 0) {
			// 				this.$util.showToast({
			// 					title: this.$lang("updateSuccess")
			// 				});
			// 				this.NavReturn();
			// 				this.getInfo();
			// 			} else {
			// 				this.$util.showToast({
			// 					title: res.message
			// 				});
			// 			}
			// 		}
			// 	});
			// } else {
			// 	this.$util.showToast({
			// 		title: validate.error
			// 	});
			// }


			this.$api.sendRequest({
				url: '/api/member/modifybirthday',
				data: {
					birthday: this.$util.timeTurnTimeStamp(this.formData.birthday)
				},
				success: res => {
					if (res.code == 0) {
						this.$util.showToast({
							title: this.$lang("updateSuccess")
						});
						this.NavReturn();
						this.getInfo();
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},

		// ------------------------修改密码------------------------------
		/**
		 * 获取注册配置
		 */
		getRegisterConfig() {
			this.$api.sendRequest({
				url: '/api/register/config',
				success: res => {
					if (res.code >= 0) {
						this.registerConfig = res.data.value;
					}
				}
			});
		},
		modifyPassword() {
			if (this.memberInfo.password) {
				var rule = [{
						name: 'currentPassword',
						checkType: 'required',
						errorMsg: this.$lang("pleaseInputOldPassword")
					},
					{
						name: 'newPassword',
						checkType: 'required',
						errorMsg: this.$lang("pleaseInputNewPassword")
					}
				];
			} else {
				var rule = [{
						name: 'mobileVercode',
						checkType: 'required',
						errorMsg: this.$lang("confirmCodeInput")
					},
					{
						name: 'mobileDynacode',
						checkType: 'required',
						errorMsg: this.$lang("animateCodeInput")
					},
					{
						name: 'newPassword',
						checkType: 'required',
						errorMsg: this.$lang("pleaseInputNewPassword")
					}
				];
			}

			let regConfig = this.registerConfig;
			if (regConfig.pwd_len > 0) {
				rule.push({
					name: 'newPassword',
					checkType: 'lengthMin',
					checkRule: regConfig.pwd_len,
					errorMsg: '新密码长度不能小于' + regConfig.pwd_len + '位'
				});
			}
			if (regConfig.pwd_complexity) {
				let passwordErrorMsg = '密码需包含',
					reg = '';
				if (regConfig.pwd_complexity.indexOf('number') != -1) {
					reg += '(?=.*?[0-9])';
					passwordErrorMsg += '数字';
				}
				if (regConfig.pwd_complexity.indexOf('letter') != -1) {
					reg += '(?=.*?[a-z])';
					passwordErrorMsg += '、小写字母';
				}
				if (regConfig.pwd_complexity.indexOf('upper_case') != -1) {
					reg += '(?=.*?[A-Z])';
					passwordErrorMsg += '、大写字母';
				}
				if (regConfig.pwd_complexity.indexOf('symbol') != -1) {
					reg += '(?=.*?[#?!@$%^&*-])';
					passwordErrorMsg += '、特殊字符';
				}
				rule.push({
					name: 'newPassword',
					checkType: 'reg',
					checkRule: reg,
					errorMsg: passwordErrorMsg
				});
			}
			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				if (this.formData.currentPassword == this.formData.newPassword) {
					this.$util.showToast({
						title: '新密码不能与原密码相同'
					});
					return;
				}
				if (this.formData.newPassword != this.formData.confirmPassword) {
					this.$util.showToast({
						title: '两次密码不一致'
					});
					return;
				}
				this.$api.sendRequest({
					url: '/api/member/modifypassword',
					data: {
						new_password: this.formData.newPassword,
						old_password: this.formData.currentPassword,
						code: this.formData.mobileDynacode,
						key: uni.getStorageSync("password_mobile_key"),
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: this.$lang('updateSuccess')
							});
							this.NavReturn();
							this.getInfo();
							uni.removeStorageSync('password_mobile_key');
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error
				});
			}
		},

		// ------------------------修改手机号------------------------------
		// 验证手机号
		vertifyMobile() {
			var rule = [{
				name: 'mobile',
				checkType: 'required',
				errorMsg: '请输入手机号'
			}, {
				name: 'mobile',
				checkType: 'phoneno',
				errorMsg: '请输入正确的手机号'
			}];
			var checkRes = validate.check(this.formData, rule);
			if (!checkRes) {
				this.$util.showToast({
					title: validate.error
				});
				return false;
			}
			return true;
		},
		// 检测手机号是否存在
		async checkMobile() {
			if (!this.vertifyMobile()) return;
			let res = await this.$api.sendRequest({
				url: '/api/member/checkmobile',
				data: {
					mobile: this.formData.mobile
				},
				async: false
			});
			if (res.code != 0) {
				this.$util.showToast({
					title: res.message
				});
				return false;
			}
			return true;
		},

		// 发送短信动态码
		async bindMoblieCode() {
			if (this.seconds != 120) return;
			var rule = [{
					name: 'mobile',
					checkType: 'phoneno',
					errorMsg: this.$lang("surePhoneNumber")
				},
				{
					name: 'mobileVercode',
					checkType: 'required',
					errorMsg: this.$lang("confirmCodeInput")
				},
			];

			var checkRes = validate.check(this.formData, rule);

			if (checkRes && !this.isSend) {
				this.isSend = true;
				this.$api.sendRequest({
					url: '/api/member/bindmobliecode',
					data: {
						mobile: this.formData.mobile,
						captcha_id: this.captcha.id,
						captcha_code: this.formData.mobileVercode
					},
					success: res => {
						let data = res.data;
						if (data.key) {
							if (this.seconds == 120 && this.timer == null) {
								this.timer = setInterval(() => {
									this.seconds--;
									this.formData.mobileCodeText = '已发送(' + this.seconds + 's)';
								}, 1000);
							}
							uni.setStorageSync('mobile_key', data.key);
						} else {
							this.$util.showToast({
								title: res.message
							});
							this.isSend = false;
						}
					},
					fail: res => {
						this.isSend = false;
						this.getCaptcha();
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error ? validate.error : '请勿重复点击'
				});
			}
		},
		async modifyMobile() {

			var mobileRule = [{
					name: 'mobile',
					checkType: 'phoneno',
					errorMsg: this.$lang("surePhoneNumber")
				},
				{
					name: 'mobileVercode',
					checkType: 'required',
					errorMsg: this.$lang("confirmCodeInput")
				},
				{
					name: 'mobileDynacode',
					checkType: 'required',
					errorMsg: this.$lang("animateCodeInput")
				},
			];
			var checkRes = validate.check(this.formData, mobileRule);

			if (checkRes) {
				if (this.formData.mobile == this.memberInfo.mobile) {
					this.$util.showToast({
						title: this.$lang("alikePhone")
					});
					return;
				}
				this.$api.sendRequest({
					url: '/api/member/modifymobile',
					data: {
						mobile: this.formData.mobile,
						captcha_id: this.captcha.id,
						captcha_code: this.formData.mobileVercode,
						code: this.formData.mobileDynacode,
						key: uni.getStorageSync("mobile_key"),
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: this.$lang("updateSuccess")
							});
							if (this.back) {
								this.$util.redirectTo('/otherpages/member/pay_password/pay_password', {
									'back': this.back
								}, 'redirectTo')
							} else {
								this.NavReturn();
								this.getInfo();
							}
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						this.isSend = false;
						this.getCaptcha();
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error
				});
			}
		},
		/**
		 * 修改密码发送动态码
		 */
		passwordMoblieCode() {
			if (this.seconds != 120) return;

			if (this.formData.mobileVercode == '') {
				this.$util.showToast({
					title: this.$lang("confirmCodeInput")
				});
				return;
			}

			if (!this.isSend) {
				this.isSend = true;
				this.$api.sendRequest({
					url: '/api/member/pwdmobliecode',
					data: {
						captcha_id: this.captcha.id,
						captcha_code: this.formData.mobileVercode
					},
					success: res => {
						let data = res.data;
						if (data.key) {
							if (this.seconds == 120 && this.timer == null) {
								this.timer = setInterval(() => {
									this.seconds--;
									this.formData.mobileCodeText = '已发送(' + this.seconds + 's)';
								}, 1000);
							}
							uni.setStorageSync('password_mobile_key', data.key);
						} else {
							this.$util.showToast({
								title: res.message
							});
							this.isSend = false;
						}
					},
					fail: res => {
						this.isSend = false;
						this.getCaptcha();
					}
				});
			} else {
				this.$util.showToast({
					title: '请勿重复点击'
				});
			}
		},
		initFormData() {
			this.formData.currentPassword = '';
			this.formData.newPassword = '';
			this.formData.confirmPassword = '';
			this.formData.mobileVercode = '';
			this.formData.mobileDynacode = '';
			this.formData.mobile = '';
		}
	}
};
