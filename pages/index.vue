<template>
  <view class="page">
    <view class="text-area">
      <image class="logo" src="@/static/logo.png"></image>
      <text class="title">ZRAdmin移动端管理系统</text>
    </view>
    <view class="introduce">
      移动端基于uniapp、uview-plus、uni、pinia进行开发
      <u--text mode="link" :text="text2" :block="false" href="http://www.izhaorui.cn/doc/app/changelog.html"></u--text>
    </view>


    <view class="fun-wrap">
      <text class="p">1、支持动态权限控制</text>
      <text class="p">2、移动端代码支持自动生成所有代码，快速实现开发</text>
      <text class="p">3、移动端同样支持字典显示、图片预览上传等功能</text>
      <text class="p">4、移动端支持第三方登录，只需要简单配置既可</text>
    </view>

    <view class="fun-wrap">
      <up-button type="primary" shape="circle" @click="handleJump(2)">探索APP</up-button>
      <view class="margin-top" v-if="!name">
        <up-button type="info" shape="circle" @click="handleJump(1)">登录APP</up-button>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    computed,
    ref
  } from 'vue';
  import useUserStore from '@/store/modules/user';
  const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight);
  const version = ref(uni.getSystemInfoSync().appVersion)
  const text2 = ref('当前版本：v' + version.value)

  const name = computed(() => {
    return useUserStore().name
  })

  function handleJump(type) {
    var url = ''
    if (type == 2) {
      url = '/pages/essay/index'
      uni.switchTab({
        url: url
      })
    }
    if (type == 1) {
      url = '/pages/login'
      uni.navigateTo({
        url: url
      })
    }

  }
</script>

<style lang="scss">
  page {
    background-color: #fff;
    // height: 90vh;
  }

  .logo {
    height: 100rpx;
    width: 100rpx;
    margin-right: 20rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 160rpx 0 60rpx;
    // padding-top: var(--status-bar-height);
  }

  .title {
    font-size: 36rpx;
    color: #8f8f94;
  }

  .introduce {
    color: #8f8f94;
    margin: 50rpx 50rpx 40rpx 50rpx;
  }

  .fun-wrap {
    margin: 10px;
    background: #fff;
    padding: 10px;
    border-radius: 5px;

    .p {
      display: block;
      margin: 10rpx;
      color: skyblue;
    }
  }

  .notice-wrap {
    width: 100%;
    overflow: hidden;
  }

  .mine-actions {
    width: 100%;
    padding: 20px 0px 10px 0px;


    .action-item {
      .icon {
        font-size: 28px;
      }

      .text {
        display: block;
        font-size: 13px;
        margin: 8px 0px;
      }
    }
  }
</style>
