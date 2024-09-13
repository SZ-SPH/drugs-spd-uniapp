<template>
  <view class="setting-container">
    <!--    <view class="menu-list">
      <u-cell-group :border="false" :customStyle="{'background': '#fff'}">
        <u-cell title="修改密码" :isLink="true" size="large" @click="handleToPwd">
          <template #icon>
            <view class="iconfont icon-password menu-icon"></view>
          </template>
        </u-cell>

        <u-cell title="账号设置" :isLink="true" size="large" @click="handleToBind">
          <template #icon>
            <view class="iconfont icon-user menu-icon"></view>
          </template>
        </u-cell>
      </u-cell-group>
    </view> -->
    <view class="menu-list">
      <u-cell-group :border="false" :customStyle="{'background': '#fff'}">
        <u-cell title="检查更新" :isLink="true" size="large" @click="handleToUpgrade">
          <template #icon>
            <view class="iconfont icon-refresh menu-icon"></view>
          </template>
        </u-cell>
        <u-cell title="清理缓存" :isLink="true" size="large" @click="handleCleanTmp">
          <template #icon>
            <view class="iconfont icon-clean menu-icon"></view>
          </template>
        </u-cell>
      </u-cell-group>
    </view>
    <view class="action-btn">
      <button @click="handleLogout()" class="login-btn cu-btn block bg-blue lg round">退出登录</button>
    </view>
  </view>
  <view>
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog type="info" cancelText="关闭" confirmText="退出" title="通知" content="确定注销并退出系统吗"
        @confirm="dialogConfirm" @close="dialogClose">
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
  import {
    getCurrentInstance,
    ref
  } from "vue";
  import useUserStore from "@/store/modules/user";
  const {
    proxy
  } = getCurrentInstance()
  const windowHeight = ref(uni.getSystemInfoSync().windowHeight);
  const popup = ref(null);

  function handleToPwd() {
    uni.navigateTo({
      url: '/pages/mine/pwd/index'
    });
  };

  function handleToUpgrade() {
    uni.showToast({
      title: '模块建设中~',
      mask: false,
      icon: "none",
      duration: 1000
    });
  };

  function handleCleanTmp() {
    uni.showToast({
      title: '模块建设中~',
      mask: false,
      icon: "none",
      duration: 1000
    });
  };

  function handleLogout() {
    popup.value.open();
  };

  function dialogConfirm() {
    useUserStore().logOut().then(() => {
      uni.reLaunch({
        url: '/pages/login'
      });
    })
  };

  function dialogClose() {
    //console.log('点击关闭')
  };

  function handleToBind() {
    proxy.$tab.navigateTo('/pages/mine/thirdBind/index')
  }
</script>

<style lang="scss" scoped>
  .page {
    background-color: #f8f8f8;
  }

  .action-btn {
    margin: 30rpx;
  }

  .menu-list {
    margin: 5px 0px 0 0;
    // padding: 5px 0px 0 0px;
    border-radius: 8px;
    background-color: white;
  }
</style>
