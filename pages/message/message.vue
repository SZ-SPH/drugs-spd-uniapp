<template>
  <view class="page">
    <view class="notice-wrap">
      <u-notice-bar :text="noticeList" direction="column" url="/pages/notice/index"></u-notice-bar>
    </view>

    <view class="mine-actions grid col-3 text-center">
      <view class="action-item" @click="handleJump('/pages/message/praise',2 )">
        <view class="iconfont icon-aixin text-pink icon"></view>
        <text class="text">赞和收藏</text>
        <up-badge :absolute="true" :offset="[0,30]" max="99" :value="getNum(2)"></up-badge>
      </view>
      <view class="action-item">
        <view class="iconfont icon-people text-blue icon"></view>
        <text class="text">新增关注</text>
      </view>
      <view class="action-item">
        <view class="iconfont icon-community text-mauve icon"></view>
        <text class="text">评论和@</text>
        <up-badge :absolute="true" :offset="[0,30]" max="99" :value="getNum(3)"></up-badge>
      </view>
    </view>
    <view class="item-cell" @click="handleJump('/pages/message/sysNotice', 1)">
      <view class="left">
        <view class="icon-wrap">
          <up-icon name="bell" size="26" color="#fff"></up-icon>
          <up-badge :absolute="true" :offset="[0,-5]" max="99" :is-dot="getNum(1) >0"></up-badge>
        </view>
      </view>
      <view class="right">
        <view class="right-top ">
          系统通知
        </view>
        <view class="right-bm u-flex-between">
          <view class="content one-ellipsis" v-if="lastSysMsgInfo">
            {{lastSysMsgInfo.content}}
          </view>
          <view class="time" v-if="lastSysMsgInfo">
            {{formatTime(dayjs(lastSysMsgInfo.addTime).valueOf())}}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';
  import {
    onPullDownRefresh,
    onShow
  } from '@dcloudio/uni-app'
  import {
    queryNotice
  } from '@/api/system/notice.js'
  import {
    formatTime
  } from '@/utils/index.js'
  import dayjs from 'dayjs';
  import {
    queryUnReadMsgNum,
    readSysUserMsg
  } from '@/api/common.js'
  const noticeList = ref([])

  function getList() {
    queryNotice().then((res) => {
      var arr = res.data.map((item) => {
        return item.noticeTitle
      })

      noticeList.value = arr
    })
  }
  const lastSysMsgInfo = ref()
  const unReadList = ref([])

  function getNum(type) {
    return unReadList.value.find(x => x.msgType == type)?.num | 0
  }

  function handleJump(url, msgType) {
    var num = getNum(msgType)
    if (num > 0) {
      readSysUserMsg(0, msgType)
    }

    uni.navigateTo({
      url: url
    })
  }

  onPullDownRefresh(() => {
    uni.stopPullDownRefresh()
    getList()
  })
  onShow(() => {
    getList()
    queryUnReadMsgNum().then(res => {
      unReadList.value = res.data.data
      lastSysMsgInfo.value = res.data.lastSysMsgInfo
    })

  })
</script>

<style lang="scss">
  .item-cell {
    display: flex;
    border-bottom: 1px solid #f4f6f8;
    padding: 8px 5rpx;
    background-color: #fff;
    // margin: 3px 0;

    .icon-wrap {
      background: linear-gradient(23deg, rgba(110, 227, 225, 0.18) 0%, #00D9F5 100%);
      border-radius: 50%;
      padding: 6px;
    }

    .left {
      width: 80rpx;
      margin: auto 15rpx;
      position: relative;
    }

    .right {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 5px;

      .right-top {
        text-align: left;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-weight: 500;
        font-size: 15px;
        margin-bottom: 5px;
      }

      .right-bm {
        display: flex;
        align-items: center;
        color: #ccc;

        .content {
          width: 190px;
        }
      }
    }

    .time {
      width: 120px;
      color: #ccc;
      text-align: right;
      padding-right: 5px;
    }
  }

  .mine-actions {
    width: 100%;
    padding: 20px 0px 10px 0px;
    background-color: #fff;

    .action-item {
      position: relative;

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
