<template>
  <view class="page">
    <up-navbar :autoBack="false" :placeholder="true">
      <template #left>
        <view class="">
          <up-icon name="search" size="28" @click="handleToSearch"></up-icon>
        </view>
      </template>
      <template #center>
        <view class="">
          文章
        </view>
      </template>
    </up-navbar>
    <article-swiper :adtype="1"></article-swiper>
    <up-sticky bgColor="#fff" :customNavHeight="44">
      <up-tabs :list="categoryList" @click="handleTab" lineColor="#000"></up-tabs>
    </up-sticky>
    <u-gap height="5"></u-gap>
    <essayItem :item="item" v-for="item in dataList" @success="handleQuery"></essayItem>

    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="totalNum == 0"></u-empty>
    </view>

    <up-back-top :scrollTop="scrollTop" right="18px" bottom="150px"></up-back-top>
  </view>
</template>

<script setup>
  import {
    formatTime
  } from '@/utils/index.js'
  import {
    ref,
    reactive,
    getCurrentInstance,
    onMounted,
    computed
  } from 'vue';
  import {
    listArticle,
    listArticleCategory
  } from '@/api/article/article.js'
  import dayjs from 'dayjs';
  import {
    onPullDownRefresh,
    onReachBottom,
    onPageScroll
  } from '@dcloudio/uni-app'
  import useUserStore from '@/store/modules/user';

  const {
    proxy
  } = getCurrentInstance()

  const queryParams = reactive({
    pageNum: 1,
    title: '',
    categoryId: undefined
  })
  const categoryList = ref([{
    categoryId: undefined,
    name: '推荐'
  }])
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
  getList()

  onMounted(() => {
    listArticleCategory({
      categoryType: 0,
      parentId: 0
    }).then(res => {
      const {
        code,
        data
      } = res
      categoryList.value = [...categoryList.value, ...data.result];
    })
  })

  function handleQuery() {
    queryParams.pageNum = 1
    getList()
  }

  function getList() {
    uni.showLoading({
      title: 'loading...'
    })
    listArticle(queryParams).then((res) => {
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
      uni.hideLoading()
    })
  }


  function handleToSearch() {
    uni.navigateTo({
      url: '/pages/search'
    })
  }

  function handleTab(item) {
    queryParams.categoryId = item.categoryId
    handleQuery()
  }
  const scrollTop = ref(0)
  // 定义 onPageScroll 方法
  onPageScroll((e) => {
    scrollTop.value = e.scrollTop;
  });
</script>

<style lang="scss">
  .page {
    padding-bottom: 30px;
  }
</style>
