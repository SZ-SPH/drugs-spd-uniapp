<template>
  <view class="page">
    <!-- <u-gap :height="5"></u-gap> -->

    <u-empty mode="list" :marginTop="140" v-if="menuList.length == 0"></u-empty>
    <template v-for="(menu, index) in menuList">
      <view class="menu-wrap">
        <uni-section :title="menu.meta.title" title-color="#8a8a8a" titleFontSize="16px"> </uni-section>

        <view class="grid-body">
          <u-grid :border="false" :col="4">
            <u-grid-item v-for="(item, i) in menu.children" :key="i" @click="changeMenu(item)">
              <view class="grid-item-box">
                <u-icon :customStyle="{ padding: '10rpx', borderRadius: '5px', backgroundColor: menu.meta.iconColor }"
                  :name="item.meta.icon" color="#fff" :size="28"></u-icon>
                <text class="text">{{ item.meta.title }}</text>
                <text class="num" v-if="item.dot">{{item.dot}}</text>
              </view>
            </u-grid-item>
          </u-grid>
          <u-empty mode="permission" v-if="menu.children.length == 0"></u-empty>
        </view>
      </view>
      <u-gap :height="5"></u-gap>
    </template>
  </view>
</template>

<script setup>
  import {
    computed,
    getCurrentInstance,
    reactive,
    ref,
    toRefs,
  } from "vue";
  import {
    onShow
  } from '@dcloudio/uni-app'

  import {
    getRouters
  } from '@/api/common.js'
  const {
    proxy
  } = getCurrentInstance()

  const dataList = ref([])
  const dotList = ref([{
      menuId: 1,
      num: 999
    }, {
      menuId: 2,
      num: 1
    },
    {
      menuId: 9,
      num: 1
    }
  ])
  const menuList = ref([])
  onShow(() => {
    getRouters().then(res => {
      menuList.value = res.data
    })
  })

  function changeMenu(item) {
    if (item && item.path) {
      proxy.$tab.navigateTo(item.path);
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #f5f6f7;
  }

  .page {
    // padding-top: var(--status-bar-height);
  }

  /* #ifndef APP-NVUE */
  page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: 100%;
    height: auto;
  }

  view {
    font-size: 14px;
    line-height: inherit;
  }

  /* #endif */
  .grid-body {
    background-color: #fff;
  }

  .text {
    text-align: center;
    font-size: 26rpx;
    margin-top: 10rpx;
  }

  .grid-item-box {
    flex: 1;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
    position: relative;

    .num {
      position: absolute;
      right: -10px;
      top: 10px;
      color: #fff;
      background-color: red;
      border-radius: 15px;
      padding: 0 5px;
      font-size: 12px;
    }
  }
</style>
