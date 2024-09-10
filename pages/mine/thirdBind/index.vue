<template>
  <view class="page">
    <u-cell-group :customStyle="{'background': '#fff'}">
      <u-cell title="修改密码" :isLink="true" size="large" url="/pages/mine/pwd/index">
        <template #icon>
          <view class="iconfont icon-password menu-icon"></view>
        </template>
      </u-cell>
      <u-cell title="手机号" :isLink="true" size="large" :border="false" url="/pages/mine/phoneBind/index">
        <template #icon>
          <view class="iconfont icon-user menu-icon"></view>
        </template>
        <template #value>
          <view v-if="userInfo.phonenumber">
            <up-text mode="phone" :text="userInfo.phonenumber" format="encrypt"></up-text>
          </view>
          <view v-else>
            未绑定
          </view>
        </template>
      </u-cell>
    </u-cell-group>

    <u-gap height="5"></u-gap>
    <view class="margin">
      绑定第三方账号
    </view>
    <u-cell-group :customStyle="{'background': '#fff'}">
      <u-cell title="微信小程序" :isLink="true" size="large">
        <template #icon>
          <view class="iconfont icon-weixin menu-icon"></view>
        </template>
        <template #value>
          <button v-if="!typeList.includes('miniProgram')" type="default" open-type="getUserInfo"
            @getuserinfo="weChatLogin" class="wxLoginBtn">
            未绑定
          </button>
          <view class=" text-muted" v-else>已绑定</view>
        </template>
      </u-cell>
      <u-cell title="Github" :isLink="true" :border="false" size="large">
        <template #icon>
          <view class="iconfont icon-github menu-icon"></view>
        </template>
        <template #value>
          <view v-if="!typeList.includes('github')">未绑定</view>
          <view class=" text-muted" v-else>已绑定</view>
        </template>
      </u-cell>
    </u-cell-group>
  </view>
</template>

<script setup>
  import {
    computed,
    getCurrentInstance,
    onMounted,
    reactive,
    ref
  } from 'vue';
  import {
    onPullDownRefresh,
    onShow
  } from "@dcloudio/uni-app"

  import useUserStore from '@/store/modules/user';
  import {
    getMyBindAccount,
    miniLogin
  } from '@/api/login.js'

  const {
    proxy
  } = getCurrentInstance()
  const userStore = useUserStore()
  const oauthList = ref([])
  const typeList = ref([])

  function getBindList() {
    getMyBindAccount().then((res) => {
      typeList.value = res.data.typeList
      oauthList.value = res.data.list
    })
  }

  function weChatLogin(e) {
    if (e.detail) {
      uni.showLoading({
        title: "绑定中....",
        mask: true
      })
      var userInfo = e.detail.userInfo
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          miniLogin({
            code: loginRes.code
          }).then(() => {
            proxy.$modal.closeLoading()
            proxy.$modal.msgSuccess("绑定成功")
          })
        }
      });
    } else {
      proxy.$modal.msgError("登录失败")
    }
  }

  onPullDownRefresh(() => {
    uni.stopPullDownRefresh()
    getBindList()
  })
  const userInfo = computed(() => {
    return userStore.userInfo
  })

  function handleCheck() {
    uni.navigateTo({
      url: '/pages/mine/phoneBind/phoneBind'
    })
  }
  onShow(() => {
    userStore.getInfo()
  })
  // getBindList()
</script>

<style lang="scss">
  .button {
    display: flex;
    align-items: center;
    height: 35px;
    line-height: 35px;
    margin-left: 10px;
  }

  .wxLoginBtn {
    background: transparent !important;
    border: none;
    margin: 0;
    padding: 0;
    line-height: unset;
    font-size: 15px;
  }

  .wxLoginBtn::after {
    border: none;
  }

  .header {
    padding: 15px;
    text-align: center;
    font-weight: bold;
    font-size: 15px;
  }

  .content-wrap {
    height: 60vh;
  }

  .form1 {
    text-align: center;
    padding: 10px 30px;
  }
</style>
