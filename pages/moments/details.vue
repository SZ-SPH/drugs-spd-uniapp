<template>
  <view class="page">
    <up-navbar :autoBack="true" :placeholder="true">
      <template #left>
        <view class="u-nav-slot">
          <up-icon name="arrow-left" size="20" @click="handleBack()"></up-icon>
          <up-line direction="column" :hairline="false" length="16" margin="0 8px"></up-line>
          <up-icon name="home" size="20" @click="handleIndex()"></up-icon>
        </view>
      </template>
    </up-navbar>
    <view v-if="info">
      <monentItem :item="info" @success="handleQuery()" :showFollow="true" :morePosition="2" :showTop="true">
        <template #default>
          <view>

          </view>
        </template>
      </monentItem>
    </view>
    <!-- <up-gap :height="5"></up-gap> -->
    <commentPopup ref="commentRef" v-if="info" :targetId="info.cid"></commentPopup>
  </view>
</template>

<script setup>
  import {
    getArticleDetails,
    praiseArticle
  } from '@/api/article/article.js'
  import {
    getCurrentInstance,
    onMounted,
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
    cid: String,
    showComment: String
  });
  const info = ref()

  function handleQuery() {
    uni.showLoading({
      title: 'loading'
    })
    getArticleDetails(props.cid).then(res => {
      const {
        code,
        data
      } = res
      setTimeout(() => {
        uni.hideLoading()
        info.value = data
      }, 200)
    }).catch(() => {
      info.value = null
      uni.hideLoading()
    })
  }
  handleQuery()
  onMounted(() => {
    setTimeout(() => {
      handleComment()
    }, 800)
  })
  onPullDownRefresh(() => {
    uni.stopPullDownRefresh()

    handleComment()
    handleQuery()
  })

  function handleComment() {
    proxy.$refs.commentRef.handleOpen(info.value)
  }

  function handlePraise(item) {
    praiseArticle(item.cid, {
      authorId: item.userId
    }).then((res => {
      if (res.data == 1) {
        item.praiseNum++
      } else {
        item.praiseNum--
      }
      item.isPraise = res.data
    }))
  }

  function handleBack() {
    uni.navigateBack()
  }

  function handleIndex() {
    uni.switchTab({
      url: '/pages/moments/index'
    })
  }
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

  .comment-wrap {
    background-color: #fff;

    .commentNum {
      padding: 10px 10px;
    }
  }

  .u-nav-slot {
    display: flex;
  }
</style>
