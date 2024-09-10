<template>
  <up-loading-page :loading="!topInfo"></up-loading-page>
  <view class="page">
    <view class="topic-info" v-if="topInfo">
      <view class="name-wrap">
        <view class="name one-ellipsis">
          # {{topInfo.topicName}}
        </view>
        <view class="right">
          <view class="label margin-right">
            {{topInfo.joinNum}} 人参与
          </view>
          <view class="label">
            {{topInfo.viewNum}} 次浏览
          </view>
        </view>
      </view>

      <view class="desc">
        {{topInfo.topicDescription || '暂无介绍~'}}
      </view>
    </view>
    <u-gap height="5"></u-gap>
    <up-sticky bgColor="#fff">
      <view class="tab-wrap">
        <u-tabs :list="tabList" @click="handleTabClick" lineColor="#000"></u-tabs>
      </view>
    </up-sticky>
    <template v-for="(item, index) in dataList">
      <monentItem :item="item" :details="true" @comment="showComments()" @success="getList()"></monentItem>
      <u-gap height="5"></u-gap>
    </template>
    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="totalNum == 0"></u-empty>
    </view>

    <up-back-top :scrollTop="scrollTop" right="18px" bottom="150px"></up-back-top>

  </view>
</template>

<script setup>
  import {
    delArticle,
    topArticle,
    getTopicInfo
  } from '@/api/article/article.js'
  import {
    list
  } from '@/api/article/moment.js'
  import {
    getCurrentInstance,
    reactive,
    ref
  } from 'vue';
  import {
    onPullDownRefresh,
    onReachBottom,
    onShow,
    onPageScroll
  } from '@dcloudio/uni-app'
  const {
    proxy
  } = getCurrentInstance()
  const props = defineProps({
    id: [String, Number],
  });
  const queryParams = reactive({
    pageNum: 1,
    tabId: 1,
    topicId: 0
  })
  const totalPage = ref(0)
  const totalNum = ref(0)
  const show = ref(false)
  const dataList = ref([])

  onPullDownRefresh(() => {
    uni.stopPullDownRefresh()

    queryParams.pageNum = 1
    getList()
  })
  onReachBottom(() => {
    if (queryParams.pageNum < totalPage.value) {
      queryParams.pageNum++
      getList()
    } else {
      console.log('全部加载完')
    }
  })
  getList()

  function showComments() {
    show.value = true
  }

  function handlePublish() {
    uni.navigateTo({
      url: '/pages/moments/publish'
    })
  }

  function getList() {
    queryParams.topicId = props.id
    list(queryParams).then(res => {
      const {
        code,
        data
      } = res
      totalNum.value = data.totalNum
      totalPage.value = data.totalPage

      if (queryParams.pageNum <= 1) {
        dataList.value = data.result
      } else {
        dataList.value = [...dataList.value, ...data.result];
      }
    })
  }
  const topInfo = ref()
  /**
   * 查询话题信息
   */
  getTopicInfo(props.id).then(res => {
    const {
      code,
      data
    } = res
    uni.setNavigationBarTitle({
      title: '#' + data.topicName
    })
    topInfo.value = data
  })

  function handleTabClick(item) {
    queryParams.pageNum = 1
    queryParams.tabId = item.id
    getList()
  }

  const tabList = ref([{
    name: '最新',
    id: 1
  }, {
    name: '热门',
    id: 3
  }])
  const scrollTop = ref(0)
  // 定义 onPageScroll 方法
  onPageScroll((e) => {
    scrollTop.value = e.scrollTop;
  });
</script>

<style lang="scss" scoped>
  .page {
    padding-bottom: 90px;
  }

  .topic-info {
    background: var(--bg-color);
    padding: 0 10px;

    .name-wrap {
      display: flex;

      .name {
        width: 125px;
        font-size: 17px;
        font-weight: bold;
      }

      .right {
        flex: 1;
        color: #ccc;
        font-size: 13px;
        display: flex;
        justify-content: flex-end;
      }
    }

    .desc {
      padding: 10px 0;
      color: #ccc;
    }
  }
</style>
