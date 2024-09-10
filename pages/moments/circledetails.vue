<template>
  <view class="page" v-if="info">
    <up-image :src="info.bgImg" height="130" width="100%" mode="scaleToFill"></up-image>
    <view class="btn-back">
      <up-icon name="arrow-left" color="#fff" size="22" @click="goBack"></up-icon>
    </view>

    <view class="page-bottom">
      <view class="title-wrap flex padding">
        <view class="title">
          {{info.name}}
        </view>

        <view class="flex font-12 justify-end" style="flex: 1;">
          <text>{{info.joinNum}}人已加入</text>
          <text class="margin-left">{{totalNum}}篇内容</text>
          <view class="margin-left">
            <up-button color="#000" size="mini">加入圈子</up-button>
          </view>
        </view>
      </view>

      <view class="text-muted padding">
        {{info.introduce}}
      </view>

      <up-line color="#ccc"></up-line>

      <up-sticky bgColor="#fff">
        <u-tabs :list="tabList" @click="handleTabClick" lineColor="#000"></u-tabs>
      </up-sticky>
      <u-gap height="5"></u-gap>
      <template v-for="(item, index) in dataList">
        <monentItem :item="item" :details="true" :jumpTopic="true" :jumpCircle="true" @comment="showComments()"
          @success="getList()">
        </monentItem>
        <u-gap height="5"></u-gap>
      </template>
      <view class="page-footer">
        <u-empty mode="list" :marginTop="140" v-if="totalNum == 0"></u-empty>
      </view>
    </view>
  </view>
  <view v-else>
    <up-empty></up-empty>
  </view>
</template>

<script setup>
  import {
    ref,
    reactive
  } from 'vue';
  import {
    queryArticleCategory
  } from '@/api/article/article.js'
  import {
    list
  } from '@/api/article/moment.js'
  import {
    onPullDownRefresh,
    onReachBottom,
    onShow,
    onPageScroll
  } from '@dcloudio/uni-app'
  const props = defineProps({
    categoryId: String
  });

  const info = ref()
  queryArticleCategory(props.categoryId).then(res => {
    info.value = res.data
  })

  function goBack() {
    uni.navigateBack()
  }
  const queryParams = reactive({
    pageNum: 1,
    tabId: 1,
    categoryId: props.categoryId
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
    })
  }

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
  onPullDownRefresh(() => {
    uni.stopPullDownRefresh()
  })
</script>

<style lang="scss" scoped>
  .page {
    position: relative;

    .btn-back {
      z-index: 100;
      position: fixed;
      margin-left: 10px;
      background-color: rgb(0, 0, 0, .3);
      border-radius: 50%;
      display: inline-block;
      // top: calc(var(--tab-bar-height) / 2 + var(--status-bar-height));
      top: calc(var(--status-bar-height) + 20px);
      padding: 5px;
    }

    .title-wrap {
      justify-content: space-between;

      .title {
        width: 120px;
      }
    }

    .page-bottom {
      border-radius: 5px 5px 0 0;
      margin-top: -17px;
      position: relative;
      z-index: 2;
      background: #fff;
      min-height: 500px;
    }
  }
</style>
