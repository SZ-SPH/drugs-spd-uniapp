<template>
  <view class="the_all" ref="mianscroll">
    <view v-for="item in messageList">
      <view class="u-info">
        <up-avatar size="32" v-if="item.user" :src="item.user.avatar"></up-avatar>
        <view class="u-right margin-left-sm" @click="handleDetails(item)">
          <view class="nick-wrap" v-if="item.user">
            <span class="nick-name"> {{ item.user.nickName }}</span>
          </view>
          <view class="content-wrap">
            {{item.content}}
            <text class="margin-left-sm">
              {{formatTime(dayjs(item.addTime).valueOf())}}
            </text>
          </view>
        </view>
        <view class="img-wrap">
        </view>
      </view>
      <up-line></up-line>
    </view>
    <u-empty mode="list" :marginTop="140" v-if="page.totalNum == 0"></u-empty>
  </view>
</template>

<script setup>
  import {
    reactive,
    ref
  } from 'vue';
  import {
    onPullDownRefresh,
    onReachBottom
  } from '@dcloudio/uni-app'
  import {
    formatTime
  } from '@/utils/index.js'
  import {
    listMySysUserMsg
  } from '/api/common.js'
  import {
    getArticleDetails
  } from '@/api/article/article.js'
  import dayjs from 'dayjs';
  const messageList = ref([])
  const page = reactive({
    totalNum: 0,
    totalPage: 0
  })
  const queryParams = reactive({
    pageNum: 1,
    msgType: 2,
    sort: 'msgId',
    sortType: 'desc',
    pageSize: 10
  })

  function handleDetails(item) {
    getArticleDetails(item.targetId).then(res => {
      const {
        code,
        data
      } = res
      var articleType = data.articleType

      if (articleType == 1) {
        uni.navigateTo({
          url: `/pages/essay/details?cid=` + data.cid
        })
      }
      if (articleType == 2) {
        uni.navigateTo({
          url: `/pages/moments/details?&cid=` + data.cid
        })
      }
    })
  }

  function getList() {
    uni.showLoading({
      title: 'loading'
    })
    listMySysUserMsg(queryParams).then(res => {
      const {
        result,
        totalNum,
        totalPage
      } = res.data
      page.totalNum = totalNum
      page.totalPage = totalPage

      if (queryParams.pageNum <= 1) {
        messageList.value = result
      } else {
        messageList.value = [...messageList.value, ...result];
      }
    }).finally(() => {
      uni.hideLoading()
    })
  }

  function handleQuery() {
    queryParams.pageNum = 1
    getList()
  }
  onPullDownRefresh(() => {
    uni.stopPullDownRefresh()

    handleQuery()
  })
  onReachBottom(() => {
    if (queryParams.pageNum < page.totalPage) {
      queryParams.pageNum++
      getList()
    } else {
      console.log('全部加载完')
    }
  })
  getList()
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


  .u-info {
    display: flex;
    background-color: #fff;
    padding: 10px 10px;

    .u-right {
      flex: 1;
    }

    .nick-name {
      cursor: pointer;
      flex-wrap: wrap;
      font-weight: bold;
      font-size: 14px;
      color: #000;
    }


    .nick-wrap {
      display: flex;
      align-items: center;
    }

    .content-wrap {
      margin-top: 3px;
      font-size: 12px;
      margin-bottom: 10px;
      white-space: pre-line;
    }

    // 右侧图片
    .img-wrap {
      display: flex;
      justify-content: flex-end;
      width: 100px;
    }
  }
</style>
