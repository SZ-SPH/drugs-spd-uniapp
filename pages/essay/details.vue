<template>
  <up-loading-page :loading="!info"></up-loading-page>

  <view class="page" v-if="info">
    <!--    <view class="title">
      {{info.title}}
    </view> -->
    <view class="header-box">
      <view class="left">
        <view class="avatar">
          <view class="head-img">
            <up-avatar shape="circle" size="35" :src="info.user.avatar"></up-avatar>
          </view>
        </view>
        <view class="info">
          <view class="name">
            {{info.user.nickName}}
          </view>
          <view class="time-line">
            <view class="time item" v-if="info.createTime">
              {{ formatTime(dayjs(info.createTime).valueOf()) }}
            </view>
            <view class="margin-right item">
              <up-icon name="eye" size="18" space="5px" color="var(--icon-color)" label-color="var(--icon-color)"
                label-size="13px" :label="info.hits"> </up-icon>
            </view>
            <view class="item">
              <up-icon name="clock" size="13" space="5px" color="var(--icon-color)" label-size="13px"
                label-color="var(--icon-color)" :label="'阅读' + readNum + '分钟'">
              </up-icon>
            </view>
          </view>
        </view>
      </view>
      <view class="right">
        <view class="btn">
          <u-icon name="plus" color="var(--text-color)" :size="10"></u-icon>
          <span class="text">
            关注
          </span>
        </view>
      </view>
    </view>

    <view class="margin">
      <u-album :urls="info.coverImgList"></u-album>
    </view>
    <view class="content">
      <zero-markdown-view :markdown="info.content"></zero-markdown-view>
    </view>
    <view class="dict-wrap margin-top" v-if="info && info.tags">
      <up-icon name="tags" color="#ccc" label-color="#ccc" size="22" space="5px" class="margin-right">
      </up-icon>
      <view class="tag-item" v-for="item in info.tagList">
        <up-tag type="info" plain :text="item"></up-tag>
      </view>
    </view>
  </view>
  <commentPopup ref="commentRef" v-if="info" :targetId="info.cid"></commentPopup>
  <view class="footer">
    <!--    <view class="left" @click="handleComment">
      <up-input placeholder="写评论..." prefixIcon="edit-pen" shape="circle" readonly></up-input>
    </view> -->
    <view class="center" v-if="info">
      <view class="icon margin-right-xl">
        <up-icon name="share" size="30" top="-1" space="5px" color="var(--icon-color)">
        </up-icon>
      </view>
      <view class="icon margin-right-xl" @click="handleComment">
        <up-icon name="chat" size="30" top="-1" space="5px" color="var(--icon-color)">
        </up-icon>
        <up-badge max="99" :value="info.commentNum" absolute :offset="[-5,-0]"></up-badge>
      </view>
      <view class="icon" @click="handlePraise(info)">
        <up-icon name="thumb-up" size="30" top="-1" space="5px"
          :color="info.isPraise == 1 ? 'var(--icon-color-active)': 'var(--icon-color)'">
        </up-icon>
        <up-badge max="99" :value="info.praiseNum" absolute inverted :offset="[-5,-0]"></up-badge>
      </view>
    </view>
  </view>

</template>

<script setup>
  import {
    getCurrentInstance,
    ref,
    onMounted
  } from 'vue';
  import {
    formatTime
  } from '@/utils/index.js'
  import dayjs from 'dayjs';
  import {
    getArticleDetails,
    praiseArticle
  } from '@/api/article/article.js'
  const {
    proxy
  } = getCurrentInstance()
  const props = defineProps({
    cid: String,
  });
  const readNum = ref(0)
  const info = ref()
  const authorInfo = ref()
  getArticleDetails(props.cid).then(res => {
    const {
      code,
      data
    } = res
    info.value = data
    readNum.value = parseInt(data.content.length / 300)
    authorInfo.value = res.user
    uni.setNavigationBarTitle({
      title: data.title
    })
  })

  function handlePraise(item) {
    // emits('praise', item)
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
  onMounted(() => {
    setTimeout(() => {
      handleComment()
    }, 800)
  })

  function handleComment() {
    proxy.$refs.commentRef.handleOpen(info.value)
  }
</script>

<style scoped lang="scss">
  @import '@/static/scss/user.scss';

  .page {
    padding: 0 10px;
    background: #fff;
    padding-bottom: 90px;

    .time-line {
      display: flex;
      font-size: 13px;

      .item {
        align-items: center;
        display: flex;
        flex-wrap: nowrap;
      }
    }

    .title {
      font-size: 45rpx;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .time {
      margin-right: 10px;
      color: var(--icon-color);
    }

    .el-tag+.el-tag {
      margin-left: 10px;
    }

    .dict-wrap {
      display: inline-flex;

      .tag-item+.tag-item {
        margin-left: 10px;
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    background: #fff;
    width: 100%;
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .right {
      width: 140px;
      display: flex;
      margin-left: 20px;
    }

    .left {
      flex: 1;
    }

    .icon {
      position: relative;
    }

    .center {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
</style>
