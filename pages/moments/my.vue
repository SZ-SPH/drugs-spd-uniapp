<template>
  <view class="page">
    <up-sticky bgColor="#fff">
      <view class="tab-wrap">
        <u-tabs :list="tabList" @click="handleTabClick" lineColor="#000"></u-tabs>
      </view>
    </up-sticky>
    <u-gap height="5"></u-gap>
    <template v-for="(item, index) in dataList">
      <monentItem :showType="1" :details="true" :showTop="true" :item="item" @success="getList()"></monentItem>
      <u-gap height="5"></u-gap>
    </template>
    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="totalNum == 0"></u-empty>
    </view>

    <uni-fab ref="fab" :pattern="pattern" :popMenu="false" size="small" horizontal="right" vertical="bottom"
      direction="horizontal" @fabClick="handlePublish" />
  </view>
</template>

<script setup>
  import {
    delArticle,
    topArticle
  } from '@/api/article/article.js'
  import {
    listMyArticle
  } from '@/api/article/moment.js'
  import {
    getCurrentInstance,
    reactive,
    ref
  } from 'vue';
  import {
    onPullDownRefresh,
    onReachBottom,
    onShow
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
    pageSize: 10,
    articleType: 2,
    tabId: 1,
    userId: undefined
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
  onShow(() => {
    getList()
  })

  function handlePublish() {
    uni.navigateTo({
      url: '/pages/moments/publish'
    })
  }

  function getList() {
    listMyArticle(queryParams).then(res => {
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

  const tabList = ref([{
      name: '最新',
      id: 1
    },
    {
      name: '私密',
      id: 2
    }
  ])

  function handleTabClick(item) {
    queryParams.pageNum = 1
    queryParams.tabId = item.id
    getList()
  }

  function handleCommand(type, item) {
    getList()
  }
</script>

<style lang="scss" scoped>
  .page {
    padding-bottom: 90px;
  }
</style>
