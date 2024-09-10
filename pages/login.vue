<template>
  <view class="page">
    <index></index>
    <up-toast ref="uToastRef"></up-toast>
    <view class="login-form-content">
      <view class="logo-content align-center justify-center flex margin-bottom">
        <text class="title">{{appName}}</text>
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="loginForm.username" class="input" type="text" placeholder="请输入账号" maxlength="30" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
      </view>
      <view class="input-item flex align-center" v-if="captchaEnabled">
        <view class="iconfont icon-code icon"></view>
        <input v-model="loginForm.code" class="input" placeholder="请输入验证码" maxlength="6" @keyup.enter="handleLogin" />
        <image :src="codeUrl" @click="getCode" class="login-code-img"></image>
      </view>

      <view class="action-btn">
        <button @click="handleLogin" class="login-btn cu-btn block bg-blue lg round">登录</button>
      </view>
      <view class="reg text-center" v-if="register">
        <text class="text-grey1">没有账号？</text>
        <text @click="handleUserRegister" class="text-blue">立即注册</text>
      </view>
    </view>

    <view class="other-login">
      <!-- #ifdef MP-WEIXIN -->
      <button type="default" open-type="getUserInfo" @getuserinfo="weChatLogin" class="wxLoginBtn">
        <view class="loginType">
          <view class="item">
            <view class="icon">
              <u-icon size="60" name="weixin-fill" color="rgb(83,194,64)"></u-icon>
            </view>
          </view>
        </view>
      </button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <button type="default" class="wxLoginBtn" @click="onAuth('WECHAT_MP')">
        <view class="iconfont icon-weixin text-navy icon-login"></view>
      </button>

      <button type="default" class="wxLoginBtn" @click="onAuth('GITEE')">
        <view class="iconfont icon-github text-blue icon-login"></view>
      </button>
      <!-- #endif -->
    </view>
    <view class="xieyi text-center">
      <text class="text-grey1">登录即代表同意</text>
      <text @click="handleUserAgrement" class="text-blue">《用户协议》</text>
      <text @click="handlePrivacy" class="text-blue">《隐私协议》</text>
    </view>
  </view>
</template>

<script setup>
  import { onShow,onHide,onUnload } from '@dcloudio/uni-app'
  import index from '@/components/pdaScan/index'
  import {
    getCodeImg
  } from '@/api/login'
  import {
    computed,
    getCurrentInstance,
    ref
  } from "vue";
  const {
    proxy
  } = getCurrentInstance()
  import user from '@/store/modules/user'
  import config from '@/config.js'
  import configService from '@/api/config.service.js'
  import useUserStore from '@/store/modules/user';
  const codeUrl = ref("");
  const captchaEnabled = ref(false);
  const globalConfig = ref(config);
  const loginForm = ref({
    username: "admin",
    password: "123456",
    code: "",
    uuid: '',
    clientId: ''
  });
  const appName = computed(() => {
    return uni.getSystemInfoSync().appName
  })

  const statusBarHeight = computed(() => {
    return uni.getSystemInfoSync().statusBarHeight
  })

  // 隐私协议
  function handlePrivacy() {
    let site = globalConfig.value.appInfo.agreements[0];
    uni.navigateTo({
      url: `/pages/common/webview/index?title=${site.title}&url=${site.url}`
    });
  };
  // 用户协议
  function handleUserAgrement() {
    let site = globalConfig.value.appInfo.agreements[1]
    uni.navigateTo({
      url: `/pages/common/webview/index?title=${site.title}&url=${site.url}`
    });
  };

  // 获取图形验证码
  function getCode() {
    getCodeImg().then(res => {
      captchaEnabled.value = res.data.captchaOff != 'off'
      if (captchaEnabled.value) {
        codeUrl.value = 'data:image/gif;base64,' + res.data.img
        loginForm.value.uuid = res.data.uuid
      }
    })
  };

  async function handleLogin() {
    if (loginForm.value.username === "") {
      proxy.$modal.msgError("请输入您的账号")
    } else if (loginForm.value.password === "") {
      proxy.$modal.msgError("请输入您的密码")
    } else if (loginForm.value.code === "" && captchaEnabled.value) {
      proxy.$modal.msgError("请输入验证码")
    } else {
      uni.showLoading({
        title: '登录中...'
      })
      pwdLogin()
    }
  };
  // 密码登录
  async function pwdLogin() {
    /* this.$modal.closeLoading() */
    useUserStore().login(loginForm.value).then(() => {
      loginSuccess()
    }).catch(() => {
      if (captchaEnabled.value) {
        getCode()
      }
    }).finally(() => {
      uni.hideLoading()
    })
  };

  function loginSuccess(result) {
    // 设置用户信息
    useUserStore().getInfo().then(res => {
      // 处理兼容，如果没有上一级界面则返回首页
      const pages = getCurrentPages();
      if (pages.length === 1) {
        uni.reLaunch({
          url: "/pages/essay/index"
        })
      } else {
        uni.navigateBack({
          delta: 1
        });
      }
    })
  }
  const register = ref(true)

  function handleUserRegister() {
    proxy.$tab.redirectTo(`/pages/register`)
  }

  function weChatLogin(e) {
    if (e.detail) {
      uni.showLoading({
        title: "登录中....",
        mask: true
      })
      var userInfo = e.detail.userInfo
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          useUserStore().miniProgramLogin({
            code: loginRes.code,
            ...userInfo
          }).then(() => {
            proxy.$modal.closeLoading()
            loginSuccess()
          }).catch((err) => {
            console.log('error', err)
          })
        }
      });
    } else {
      proxy.$modal.msgError("登录失败")
    }
  }

  function onAuth(type) {
    switch (type) {
      default:
        window.location.href = configService.apiUrl + '/auth/Authorization?authSource=' + type
        break
    }
  }

  function goBack() {
    uni.navigateBack().catch((err) => {
      console.log(err)
    })
  }
  getCode();

	onShow(()=>{
		uni.$on('scancode',function(data){
			// console.log('你想要的code：', data.code)
      showToast({
        type:"success",
        message:data.code
      })
		})
	})

  const uToastRef = ref(null)

  const showToast = (params) => {
    uToastRef.value.show({
      ...params,
      complete() {
        params.url && uni.navigateTo({
          url: params.url
        });
      }
    })
  }

  onHide(() => {
    // 移除监听事件
    uni.$off('scancode')
  })

  onUnload(() => {
    // 移除监听事件
    uni.$off('scancode')
  })
</script>

<style lang="scss" scoped>
  page {
    background-color: #fff;
  }

  .page {
    background: #fff;
    position: relative;
    width: 100%;
    height: calc(100vh - calc(var(--tab-bar-height) / 2 + var(--status-bar-height)));

    .logo-content {
      width: 100%;
      font-size: 21px;
      text-align: center;
      // padding-top: 9vh;

      image {
        border-radius: 4px;
        width: 100rpx;
        height: 100rpx;
        vertical-align: middle;
      }

      .title {
        margin-left: 10px;
      }
    }

    .login-form-content {
      text-align: center;
      margin: 0px auto;
      width: 80%;
      padding-top: 80px;

      .input-item {
        margin: 20px auto;
        background-color: #f5f6f7;
        height: 45px;
        border-radius: 20px;

        .icon {
          font-size: 38rpx;
          margin-left: 10px;
          color: #999;
        }

        .input {
          width: 100%;
          font-size: 14px;
          line-height: 20px;
          text-align: left;
          padding-left: 15px;
        }

      }

      .login-btn {
        margin-top: 40px;
      }

      .reg {
        margin-top: 15px;
      }

      .xieyi {
        color: #333;
        margin-top: 20px;
      }
    }

    .easyinput {
      width: 100%;
    }
  }

  .login-code-img {
    height: 45px;
  }

  .other-login {
    display: flex;

    .wxLoginBtn {
      background: transparent !important;
      border: none;
    }

    .wxLoginBtn::after {
      border: none;
    }

    .loginType {
      display: flex;
      // padding: 140rpx 0;
      justify-content: center;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: skyblue;
        font-size: 22rpx;
      }
    }
  }

  .icon-login {
    font-size: 32px;
  }
</style>
