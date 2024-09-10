<template>
  <view class="about-container">
    <view class="header-section text-center">
      <image style="width: 150rpx;height: 150rpx;" src="/static/logo.png" mode="widthFix">
      </image>
      <uni-title type="h2" title="ZRAdmin移动端"></uni-title>
    </view>
    <u-gap height="5"></u-gap>
    <view class="content-section">
      <view class="menu-list">
        <view class="list-cell list-cell-arrow">
          <view class="menu-item-box">
            <view>版本信息</view>
            <view class="text-right">v{{version}}</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow">
          <view class="menu-item-box">
            <view>官方邮箱</view>
            <view class="text-right">599854767@qq.com</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow">
          <view class="menu-item-box">
            <view>服务热线</view>
            <view class="text-right">400-999-9999</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow">
          <view class="menu-item-box">
            <view>公司网站</view>
            <view class="text-right">
              <uni-link :href="siteUrl" :text="siteUrl" showUnderLine="false"></uni-link>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="copyright">
      <view>Copyright &copy; 2024 <uni-link :href="siteUrl" text="zradmin" showUnderLine="false"></uni-link> All
        Rights Reserved.</view>
    </view>
  </view>
</template>

<script setup>
  import config from '@/config.js'
  const siteUrl = config.appInfo.site_url;
  const version = uni.getSystemInfoSync().appVersion
</script>

<style lang="scss" scoped>
  page {
    background-color: #f8f8f8;
  }

  .copyright {
    margin-top: 50rpx;
    text-align: center;
    line-height: 60rpx;
    color: #999;
  }

  .header-section {
    display: flex;
    padding: 30rpx 0 30px;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
  }

  .menu-list {
    margin: 0;
  }
</style>
