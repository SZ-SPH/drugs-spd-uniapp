<template>
  <view class="page">
    <view class="title">
      {{info.noticeTitle}}
    </view>
    <u-line></u-line>
    <view class="time">
      {{info.publisher}} 发布于：{{info.createTime}}
    </view>

    <view class="content">
      <!-- <rich-text class="typo m-padded-lr-responsive m-padded-tb-large ql-editor"
        :nodes="info.noticeContent"></rich-text> -->
      <u-parse :content="info.noticeContent"></u-parse>
    </view>
  </view>
</template>

<script>
  import {
    getNotice
  } from '@/api/system/notice.js'
  export default {
    data() {
      return {
        info: {}
      }
    },
    onLoad(e) {
      if (e) {
        getNotice(e.noticeid).then(res => {
          this.info = res.data
        })
      }
    },
    methods: {
      init() {

      }
    }
  }
</script>

<style scoped lang="scss">
  .page {
    padding: 10px;
    background: #fff;
    min-height: 90vh;

    .title {
      font-size: 19px;
      font-weight: bold;
      // margin: 10px;
      margin-bottom: 10px;
      text-align: left;
    }

    .time {
      margin: 20px 0;
      color: #ccc;
    }
  }
</style>
