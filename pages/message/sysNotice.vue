<template>
  <view class="the_all" ref="mianscroll">
    <view class="talk_width">
      <template v-for="item in messageList">
        <view class="time-wrap">
          <view class="time">
            {{formatTime(dayjs(item.addTime).valueOf())}}
          </view>
        </view>

        <view class="talk_item talk_other">
          <view class="head">
            <up-icon name="bell" size="23" color="#fff"></up-icon>
          </view>
          <view class="bubble_con" @click="handleToJump(item)">
            {{item.content}}
          </view>
        </view>
      </template>
      <u-empty mode="list" :marginTop="140" v-if="page.totalNum == 0"></u-empty>
    </view>
  </view>

</template>

<script setup>
  import {
    reactive,
    ref
  } from 'vue';
  import {
    listMySysUserMsg
  } from '/api/common.js'
  import {
    formatTime
  } from '@/utils';
  import dayjs from 'dayjs';
  const messageList = ref([])
  const page = reactive({
    totalNum: 0,
    totalPage: 0
  })
  listMySysUserMsg({
    msgType: 1
  }).then(res => {
    const {
      result,
      totalNum
    } = res.data
    messageList.value = result
    page.totalNum = totalNum
  })

  function handleToJump() {}
</script>

<style lang="scss">
  .the_all {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .talk_width {
    width: 94%;
    margin: 10px auto;
    overflow-y: scroll;

    .time-wrap {
      display: flex;
      justify-content: space-around;
      margin: 4px 0;

      .time {
        text-align: center;
        background-color: #ccc;
        border-radius: 6px;
        color: #fff;
        display: inline;
        padding: 0 8px;
        font-size: 12px;
      }
    }
  }

  .talk_item {
    position: relative;
    display: flex;
    height: auto;
    margin-bottom: 10px;

    .head {
      background: linear-gradient(23deg, rgba(110, 227, 225, 0.18) 0%, #00D9F5 100%);
      border-radius: 50%;
      padding: 6px;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 5px;
    }

    .bubble_con {
      word-wrap: break-word;
      word-break: break-all;
      background: rgba(255, 255, 255, 1);
      color: #000;
      border-radius: 10px;
      position: relative;
      text-align: left;
      font-size: 14px;
      margin: 3px 5px;
      padding: 10px;
      max-width: 80%;
    }
  }

  .bubble:after {
    position: absolute;
    top: 1rem;
    border: 0.5rem solid transparent;
    content: ' ';
  }

  .talk_primary .content {
    text-align: right;
  }

  .talk_other .bubble:after {
    right: 100%;
    border-right-color: rgba(255, 255, 255, 1);
  }

  .talk_primary .content .bubble {
    background: #10dfec;
    color: rgba(255, 255, 255, 1);
  }

  .talk_primary .bubble:after {
    left: 100%;
    border-left-color: #10dfec;
  }

  .talk_primary .head {
    float: right;
  }

  .talk_item:after {
    clear: both;
  }
</style>
