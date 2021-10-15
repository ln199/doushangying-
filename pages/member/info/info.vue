<template>
	<view :data-theme="themeStyle">
		<view v-if="indent == 'all'" class="info-wrap">
			<!-- 头像 -->
			<view @click="headImage" class="info-list-cell info-item info-list-con" hover-class="cell-hover">
				<text class="cell-tit">{{ $lang('headImg') }}</text>
				<view class="info-list-head cell-tip">
					<image
						:src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().default_headimg"
						@error="memberInfo.headimg = $util.getDefaultImage().default_headimg"
						mode="aspectFill"
					/>
				</view>
				<text class="cell-more"></text>
			</view>
			<!-- 账号 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover">
				<text class="cell-tit">{{ $lang('account') }}</text>
				<text class="cell-tip cell-tip1">{{ memberInfoformData.number }}</text>
			</view>
			<!-- 昵称 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('name')">
				<text class="cell-tit">{{ $lang('nickname') }}</text>
				<text class="cell-tip">{{ memberInfoformData.nickName }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 真实姓名 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('realName')">
				<text class="cell-tit">{{ $lang('realName') }}</text>
				<text class="cell-tip">{{ memberInfoformData.realName }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 性别 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('sex')">
				<text class="cell-tit">{{ $lang('sex') }}</text>
				<text class="cell-tip">{{ memberInfoformData.sex }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 生日 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('birthday')">
				<text class="cell-tit">{{ $lang('birthday') }}</text>
				<text class="cell-tip">{{ memberInfoformData.birthday }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 手机号 -->
			<view class="info-list-cell info-list-con" @click="modifyInfo('mobile')">
				<text class="cell-tit">{{ $lang('mobilePhone') }}</text>
				<text v-if="memberInfoformData.user_tel == ''" class="cell-tip">{{ $lang('bindMobile') }}</text>
				<text v-else class="cell-tip">{{ memberInfoformData.mobile }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 密码 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('password')">
				<text class="cell-tit">{{ $lang('password') }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 支付密码 -->
			<!-- <view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('paypassword')">
				<text class="cell-tit">{{ $lang('paypassword') }}</text>
				<text class="cell-more"></text>
			</view> -->

			<!-- 注销 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('cancellation')" v-if="addonIsExit.membercancel && memberConfig.is_enable == 1">
				<text class="cell-tit">{{ $lang('cancellation') }}</text>
				<!-- <text class="cell-tip">{{ $lang('modify') }}</text> -->
				<text class="cell-more"></text>
			</view>

			<!-- 语言 -->
			<!-- <view class="info-list-cell info-item info-list-con" hover-class="cell-hover" @click="modifyInfo('language')">
				<text class="cell-tit">{{ $lang('lang') }}</text>
				<text class="cell-tip">{{ langList[langIndex].name }}</text>
				<text class="cell-more"></text>
			</view> -->
			<!-- 退出登录 -->
			<!-- #ifdef H5 -->
			<view class="save-item" @click="logout" v-if="!$util.isWeiXin()">
				<button type="primary">{{ $lang('logout') }}</button>
			</view>
			<!-- #endif -->
		</view>
		<!-- 修改昵称 -->
		<view v-if="indent == 'name'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('nickname') }}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('nickPlaceholder')" v-model="formData.nickName" />
			</view>
			<view class="save-item" @click="save('name')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<!-- 修改真实姓名 -->
		<view v-if="indent == 'realName'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('realName') }}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('pleaseRealName')" v-model="formData.realName" />
			</view>
			<view class="save-item" @click="save('realName')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<!-- 修改性别 -->
		<view v-if="indent == 'sex'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('sex') }}</text>
				<radio-group @change="radioChange" class="edit-sex-list">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio v-if="themeStyle == 'theme-blue'" color="#1786f8" :value="item.value" :checked="index === formData.sex" />
							<radio v-else-if="themeStyle == 'theme-green'" color="#31bb6d" :value="item.value" :checked="index === formData.sex" />
							<radio v-else-if="themeStyle == 'theme-pink'" color="#ff547b" :value="item.value" :checked="index === formData.sex" />
							<radio v-else-if="themeStyle == 'theme-golden'" color="#c79f45" :value="item.value" :checked="index === formData.sex" />
							<radio v-else color="#ff4544" :value="item.value" :checked="index === formData.sex" />
						</view>
						<view>{{ item.name }}</view>
					</label>
				</radio-group>
			</view>
			<view class="save-item" @click="save('sex')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<!-- 修改生日 -->
		<view v-if="indent == 'birthday'" class="edit-info edit-birthday-list">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('birthday') }}</text>
				<picker mode="date" :value="formData.birthday" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{ formData.birthday ? formData.birthday : '请选择生日' }}</view>
				</picker>
			</view>
			<view class="save-item" @click="save('birthday')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<!-- 修改密码 -->
		<view v-if="indent == 'password'" class="edit-info">
			<block v-if="memberInfo.password == 0 && memberInfo.mobile == ''">
				<view class="empty">
					<view class="empty_img"><image :src="$util.img('upload/uniapp/common-empty.png')" mode="aspectFit"></image></view>
					<view class="color-tip margin-top margin-bottom">请先绑定手机再执行该操作</view>
					<button type="primary" size="mini" class="button color-base-bg" @click="modifyInfo('mobile')">立即绑定</button>
				</view>
			</block>
			<block v-else>
				<view class="edit-info-box" v-if="memberInfo.password">
					<text class="info-name">{{ $lang('nowPassword') }}</text>
					<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('nowPassword')" v-model="formData.currentPassword" />
				</view>
				<block v-else>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('confirmCode') }}</text>
						<input class="uni-input info-content" type="number" maxlength="4" :placeholder="$lang('confirmCode')" v-model="formData.mobileVercode" />
						<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('animateCode') }}</text>
						<input class="uni-input info-content" type="number" maxlength="6" :placeholder="$lang('animateCode')" v-model="formData.mobileDynacode" />
						<button type="primary" class="dynacode" @click="passwordMoblieCode()">{{ formData.mobileCodeText }}</button>
					</view>
					<view class="color-tip font-size-goods-tag set-pass-tips">点击“获取动态码”，将会向您已绑定的手机号{{ memberInfoformData.mobile | mobile }}发送验证码</view>
				</block>
				<view class="edit-info-box">
					<text class="info-name">{{ $lang('newPassword') }}</text>
					<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('newPassword')" v-model="formData.newPassword" />
				</view>
				<view class="edit-info-box">
					<text class="info-name">{{ $lang('confirmPassword') }}</text>
					<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('confirmPassword')" v-model="formData.confirmPassword" />
				</view>

				<view class="save-item" @click="save('password')">
					<button type="primary">{{ $lang('save') }}</button>
				</view>
			</block>
		</view>
		<!-- 修改手机号 -->
		<view v-if="indent == 'mobile'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('phoneNumber') }}</text>
				<input class="uni-input info-content" type="number" maxlength="11" :placeholder="$lang('phoneNumber')" v-model="formData.mobile" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('confirmCode') }}</text>
				<input class="uni-input info-content" type="number" maxlength="4" :placeholder="$lang('confirmCode')" v-model="formData.mobileVercode" />
				<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('animateCode') }}</text>
				<input class="uni-input info-content" type="number" maxlength="6" :placeholder="$lang('animateCode')" v-model="formData.mobileDynacode" />
				<button type="primary" class="dynacode" @click="bindMoblieCode()">{{ formData.mobileCodeText }}</button>
			</view>
			<view class="save-item" @click="save('mobile')">
				<button type="primary">{{ $lang('save') }}</button>
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import info from '../public/js/info.js';
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	data() {
		return {};
	},
	mixins: [info, globalConfig],
	onShow() {
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages/login/login/login', { back: '/pages/member/info/info' }, 'redirectTo');
		}
	},
	filters: {
		mobile(mobile) {
			return mobile.substring(0, 4 - 1) + '****' + mobile.substring(6 + 1);
		}
	}
};
</script>

<style lang="scss">
.info-head {
	.head-nav {
		width: 100%;
		height: var(--status-bar-height);
		background: #ffffff;
	}

	.head-nav.active {
		padding-top: 40rpx;
	}
}

.captcha {
	width: 170rpx;
	height: 50rpx;
}

.info-list-cell {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 30rpx;
	position: relative;
	line-height: 50rpx;
	background-color: #fff;

	&:first-child {
		padding: 28rpx 30rpx;
	}

	.cell-tip1 {
		margin-right: 40rpx;
	}

	&.log-out-btn {
		margin-top: 40rpx;

		.cell-tit {
			margin: auto;
		}
	}

	.info-list-head {
		border: 1rpx solid $color-line;
		width: 82rpx;
		height: 82rpx;
		border-radius: 50%;
	}

	.info-list-head image {
		max-width: 100%;
		max-height: 100%;
	}

	// #ifdef MP
	&.info-item {
		margin-top: 16rpx;
	}
	// #endif

	&.info-list-con ~ &.info-list-con:after {
		content: '';
		position: absolute;
		left: 30rpx;
		right: 30rpx;
		top: 0;
		border-bottom: 1rpx solid $color-line;
	}

	.cell-tip {
		margin-left: auto;
		color: $color-tip;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 470rpx;
	}

	.cell-more {
		margin-left: 10rpx;
		width: 32rpx;
		height: 100%;
	}

	.cell-more:after {
		content: '';
		display: block;
		width: 12rpx;
		height: 12rpx;
		border: 2rpx solid darken($color-line, 20%) {
			right-color: transparent;
			bottom-color: transparent;
		}

		transform: rotate(135deg);
	}
}

.edit-info-box {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 40rpx;
	min-height: 50rpx;
	background-color: #fff;

	.info-name {
		width: 150rpx;
		font-size: $font-size-base;
		text-align: left;
	}

	.info-content {
		&:first-of-type {
			width: auto !important;
		}

		margin-right: auto;
		width: 250rpx;
		font-size: $font-size-base;
		padding: 0;
	}

	.dynacode {
		margin: 0;
		padding: 0 10rpx;
		width: 250rpx;
		height: 60rpx;
		font-size: $font-size-base;
		line-height: 60rpx;
		color: #fff;
		word-break: break-all;
	}
	.edit-sex-list {
		display: flex;
		label {
			display: flex;
			margin-left: 30rpx;
			align-items: center;
		}
	}
	uni-radio .uni-radio-input {
		width: 32rpx;
		height: 32rpx;
	}
}

.set-pass-tips {
	padding: 20rpx 20rpx 0 20rpx;
}

.input-len {
	width: 500rpx !important;
}

.save-item {
	margin-top: 50rpx;

	button {
		border-radius: 94rpx;
		font-size: 30rpx;
	}
}

.empty {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: $padding;
	box-sizing: border-box;
	justify-content: center;
	padding-top: 80rpx;
	.empty_img {
		width: 63%;
		height: 450rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}
	.iconfont {
		font-size: 190rpx;
		color: $color-tip;
		line-height: 1.2;
	}

	button {
		min-width: 300rpx;
		margin-top: 100rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: $font-size-base;
	}
}
</style>
