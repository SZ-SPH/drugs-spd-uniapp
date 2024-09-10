<template>
  <view class="page">
    <up-navbar title="动态" :autoBack="false" :placeholder="true">
      <template #center>
        <u-tabs :list="tabList" @click="handleTabClick" lineColor="#000" :current="1"></u-tabs>
      </template>
      <template #left>
        <up-button icon="plus" color="#000" iconColor="#fff" size="mini" @click="handlePublish">发布</up-button>
      </template>
    </up-navbar>
    <!-- <up-skeleton rows="3" title :loading="loading"></up-skeleton> -->
    <up-loading-page :loading="loading"></up-loading-page>
    <view class="circle-wrap" v-if="hotCircleList.length > 0">
      <view class="flex padding-sm u-flex-between">
        <view class="font-13 hl-bold">
          推荐圈子
        </view>

        <view class="right font-11 text-muted">
          我加入的圈子
        </view>
      </view>
      <view class="content-wrap">
        <up-scroll-list :indicator="false">
          <view v-for="(item, index) in hotCircleList" :key="index" class="flex u-flex-column margin-sm"
            @click="handleToCircle(item)">
            <up-image radius="5" width="60px" height="60px" :src="item.icon"></up-image>
            <text class="text-center margin-top-sm one-ellipsis font-12" style="width: 60px;">{{item.name}}</text>
          </view>
        </up-scroll-list>
      </view>
    </view>

    <u-gap height="5"></u-gap>
    <view class="header flex u-flex-between padding-sm" style="background-color: #fff;">
      <view class="text-grey1 font-11">排序</view>
      <view class="font-12 text-gray">
        <text @click="sortChange(1)" :style="{'color': queryParams.orderBy == 1 ? 'var(--text-color)': ''}">热门</text>
        |
        <text @click="sortChange(2)" :style="{'color': queryParams.orderBy == 2 ? 'var(--text-color)': ''}">最新</text>
      </view>
    </view>
    <template v-for="(item, index) in dataList">
      <monentItem :item="item" :details="true" :jumpTopic="true" :jumpCircle="true" @success="getList()">
      </monentItem>
      <u-gap height="5"></u-gap>
    </template>

    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="totalNum == 0"></u-empty>
    </view>

    <up-back-top :scrollTop="scrollTop" right="18px" bottom="150px"></up-back-top>
    <!-- <uni-fab ref="fab" :pattern="pattern" :popMenu="false" size="small" horizontal="right" vertical="bottom"
      direction="horizontal" @fabClick="handlePublish" /> -->
  </view>
</template>

<script setup>
  import {
    delArticle,
    topArticle,
    listArticleCategory
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
    onPageScroll
  } from '@dcloudio/uni-app'
  const {
    proxy
  } = getCurrentInstance()
  const pattern = reactive({
    color: '#7A7E83',
    buttonColor: '#000',
    iconColor: '#fff'
  })
  const queryParams = reactive({
    pageNum: 1,
    tabId: 1,
    orderBy: 2
  })
  const loading = ref(true)
  const totalPage = ref(0)
  const totalNum = ref(0)
  const dataList = ref([])

  onPullDownRefresh(() => {
    uni.stopPullDownRefresh()

    handleQuery()
  })
  onReachBottom(() => {
    if (queryParams.pageNum < totalPage.value) {
      queryParams.pageNum++
      getList()
    } else {
      console.log('全部加载完')
    }
  })

  handleQuery()

  function handlePublish() {
    uni.navigateTo({
      url: '/pages/moments/publish'
    })
  }

  function handleQuery() {
    queryParams.pageNum = 1
    getList()
  }

  function getList() {
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
    }).finally(() => {
      loading.value = false
    })
  }

  function handleTabClick(item) {
    queryParams.tabId = item.id
    handleQuery()
  }

  /**
   * 排序
   * @param {Object} orderBy
   */
  function sortChange(orderBy) {
    queryParams.orderBy = orderBy

    handleQuery()
  }
  const tabList = ref([{
    name: '关注',
    id: 100
  }, {
    name: '发现',
    id: 1
  }])
  const scrollTop = ref(0)
  // 定义 onPageScroll 方法
  onPageScroll((e) => {
    scrollTop.value = e.scrollTop;
  });
  /**
   *
   */
  const hotCircleList = ref([])

  /**
   * 跳转到圈子
   * @param {Object} item
   */
  function handleToCircle(item) {
    uni.navigateTo({
      url: '/pages/moments/circledetails?categoryId=' + item.categoryId
    })
  }
  listArticleCategory({
    categoryType: 1
  }).then(res => {
    const {
      code,
      data
    } = res
    hotCircleList.value = data.result
  })
</script>

<style lang="scss" scoped>
  .page {
    padding-bottom: 90px;
    // padding-top: var(--status-bar-height);
  }

  .circle-wrap {
    background-color: #fff;
  }
</style>
