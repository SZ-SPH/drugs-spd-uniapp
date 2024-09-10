<template>
  <view class="contain-box">
    <view class="content">
      <view class="header-box" @longpress="handleDetails(item)">
        <view class="left">
          <view class="avatar" v-if="showType == 0">
            <view class="head-img">
              <up-avatar shape="circle" size="35" :src="item.user.avatar"></up-avatar>
            </view>
          </view>
          <view class="info">
            <view class="name-wrap" v-if="showType == 0">
              <text class="name">{{item.user.nickName}}</text>
              <user-sex v-model="item.user.sex"></user-sex>
            </view>
            <view class="tip">
              {{formatTime(dayjs(item.createTime).valueOf())}} - {{ position}}
            </view>
          </view>
        </view>
        <view class="right">
          <view v-if="item.isTop > 0 && showTop">
            <up-tag type="error" size="mini" text="置顶" plain=""></up-tag>
          </view>
          <view class="margin-left" v-if="showFollow">
            <!-- <u-icon name="plus" color="#000" :size="10"></u-icon>
            <span class="text">
              关注
            </span> -->
            <up-tag size="mini" text="关注" plain=""></up-tag>
          </view>
          <view class="margin-left-lg margin-right" @click.stop="handleMore(item)" v-if="morePosition == 1">
            <u-icon name="more-dot-fill" size="21"></u-icon>
          </view>
        </view>
      </view>

      <view class="main-text" @longpress="handleDetails(item)">
        <view class="title" v-if="item.title">
          {{ item.title}}
        </view>
        <rich-text :nodes="content.c2"></rich-text>
        <view class="album-wrap" v-if="item && item.coverImgList && item.coverImgList.length > 0">
          <u-album @click.stop :urls="item.coverImgList"></u-album>
        </view>
      </view>

    </view>
    <view class="flex u-flex-between">
      <view class="tag-wrap">
        <view v-if="item.tags && item.topicId > 0">
          <u-tag :text="item.tags" size="mini" icon="tags-fill" type="error" plain=""
            @click="handleTopic(item)"></u-tag>
        </view>
        <view v-if="item.categoryNav && item.categoryNav.categoryId > 0">
          <u-tag :text="item.categoryNav.name" size="mini" border-color="#fff" icon="moments" plain=""
            @click="handleCircle(item)"></u-tag>
        </view>
        <view v-if="item.isPublic == 0">
          <u-tag text="仅自己可见" icon="lock-fill" size="mini" type="info" plain=""></u-tag>
        </view>
      </view>
      <view class="margin-left-lg" @click.stop="handleMore(item)" v-if="morePosition == 2">
        <u-icon name="more-dot-fill" size="21"></u-icon>
      </view>
    </view>

    <slot>
      <view class="handle-box">
        <view class="footer-item">
          <view class="label">
            <u-icon size="23" color="var(--icon-color)" name="share-square"></u-icon>
          </view>
          <text class="value">分享</text>
        </view>
        <view class="footer-item" style="justify-content: center" @click="handleComment(item)">
          <u-icon size="23" color="var(--icon-color)" name="chat"></u-icon>
          <text class="value" v-if="item.commentNum > 0">
            {{item.commentNum}}
          </text>
          <text class="value" v-else>抢首评</text>
        </view>
        <view class="footer-item" style="justify-content: flex-end;" @click="handlePraise(item)">
          <u-icon size="23" :color="item.isPraise == 1 ? 'var(--icon-color-active)': 'var(--icon-color)'"
            name="thumb-up" :bold="item.isPraise == 1"></u-icon>
          <text class="value" :style="{ color: item.isPraise == 1 ? 'var(--icon-color-active)': '' }"
            v-if="item.praiseNum > 0">
            {{item.praiseNum}}
          </text>
          <text class="value" v-else>点赞</text>
        </view>
      </view>
    </slot>

    <u-action-sheet @close="show = false" :safeAreaInsetBottom="true" round cancelText="取消" @select="selectClick"
      :actions="moreList" :show="show"></u-action-sheet>

    <!-- <commentPopup ref="commentRef" :targetId="item.cid"></commentPopup> -->
  </view>
</template>

<script setup>
  import {
    praiseArticle,
    topArticle,
    delArticle,
    changeArticlePublic
  } from '@/api/article/article.js'
  import {
    formatTime
  } from '@/utils/index.js'
  import dayjs from 'dayjs';
  import useUserStore from '@/store/modules/user';
  import {
    contentShow
  } from '@/utils/index.js'
  import {
    computed,
    defineProps,
    defineEmits,
    defineExpose,
    ref,
    watch,
    getCurrentInstance
  } from 'vue';
  const {
    proxy
  } = getCurrentInstance()
  const props = defineProps({
    item: {
      type: Object
    },
    // 0、首页 1、我的
    showType: {
      type: Number,
      default: 0
    },
    /**
     * 是否可以跳转查看详情
     */
    details: {
      type: Boolean,
      default: false
    },
    /**
     * 显示关注
     */
    showFollow: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示置顶
     */
    showTop: {
      type: Boolean,
      default: false
    },
    /**
     * 是否可以跳转查看话题页
     */
    jumpTopic: {
      type: Boolean,
      default: false
    },
    /**
     * 是否可以跳转查看圈子页
     */
    jumpCircle: {
      type: Boolean,
      default: false
    },
    /**
     * 显示更多位置
     * 1、顶部 2、底部
     */
    morePosition: {
      type: Number,
      default: 1
    }
  })
  const myName = computed(() => {
    return useUserStore().userInfo.nickName
  })
  const userId = computed(() => {
    return useUserStore().userId
  })
  const emits = defineEmits(['praise', 'success'])
  const content = computed(() => {
    return contentShow(props.item.content)
  })
  const position = computed(() => {
    var val = props.item.position
    if (val) {
      return val
    }
    return '未知'
  })

  /**
   * 点赞
   * @param {Object} item
   */
  function handlePraise(item) {
    // emits('praise', item)
    praiseArticle(item.cid, {
      authorId: item.userId
    }).then((res => {
      if (res.data == 1) {
        item.praiseNum++
        item.isPraise = 1
      } else {
        item.praiseNum--
        item.isPraise = 0
      }
    }))
  }

  /**
   * 显示评论组件
   * @param {Object} item
   */
  function handleComment(item) {
    handleDetails(item, true)
    // proxy.$refs.commentRef.handleOpen(item)
  }

  const isTop = computed(() => {
    return props.item.isTop
  })

  const moreList = ref([])
  const show = ref(false)

  /**
   * 显示更多操作(根据用户动态添加)
   * @param {Object} item
   */
  function handleMore(item) {
    show.value = true
    moreList.value = []
    if (userId.value > 0 && userId.value == item.userId) {
      moreList.value.push({
        name: isTop.value == 1 ? '取消置顶' : '置顶',
        // color: '#ffaa7f',
        type: 'top'
      })
      moreList.value.push({
        name: `设为${props.item.isPublic == 1 ? '私密': '公开'}`,
        type: 'private'
      })
      moreList.value.push({
        type: 'delete',
        name: '删除'
      })
    } else {
      moreList.value = [{
        type: 'report',
        name: '举报'
      }]
    }
  }

  function selectClick(i) {
    if (i.type == 'report') {
      uni.showToast({
        icon: 'none',
        title: '敬请期待'
      })
      return
    }
    switch (i.type) {
      case 'delete':
        uni.showModal({
          content: '你确定要删除吗？'
        }).then((val) => {
          if (val.confirm) {
            delArticle(props.item.cid).then(() => {
              proxy.$modal.msg('删除成功')
              emits('success')
            })
          }
        })
        break;
      case 'top':
        var isTop = props.item.isTop == 1 ? 0 : 1
        topArticle({
          cid: props.item.cid,
          isTop: isTop
        }).then(() => {
          proxy.$modal.msg(`${isTop == 1 ? '': '取消'}置顶成功`)
          emits('success')
        })
        break
      case 'private':
        var isPublic = props.item.isPublic == 1 ? 0 : 1
        changeArticlePublic({
          cid: props.item.cid,
          isPublic: isPublic,
          userId: props.item.userId
        }).then(() => {
          proxy.$modal.msg(`设置${isPublic == 1 ? '公开': '私密'}成功`)
          emits('success')
        })
        break
      default:
        break;
    }
    // emits('handleCommand', i.type, props.item)
  }

  /**
   * 查看内容详情
   * @param {Object} item
   */
  function handleDetails(item, showComment) {
    if (!props.details) return
    uni.navigateTo({
      url: `/pages/moments/details?showComment=${showComment}&cid=` + item.cid
    })
  }

  /**
   * 跳转到话题页
   * @param {Object} item
   */
  function handleTopic(item) {
    if (!props.jumpTopic) return
    if (item && item.topicId > 0)
      uni.navigateTo({
        url: `/pages/moments/topic?id=` + item.topicId
      })
  }
  /**
   * 跳转至圈子
   * @param {Object} item
   */
  function handleCircle(item) {
    if (!props.jumpCircle) return
    uni.navigateTo({
      url: `/pages/moments/circledetails?categoryId=` + item.categoryId
    })
  }
</script>

<style lang="scss" scoped>
  @import '@/static/scss/user.scss';

  .contain-box {
    color: #222222;
    padding: 20rpx;
    background-color: #FFFFFF;

    .content {
      width: 100%;
    }

    .album-wrap {
      min-height: 20px;
      margin: 10px 0;
    }

    .main-text {
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      font-size: 29rpx;
      font-weight: 400;
      color: #222222;

      .title {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 3px;
      }
    }

    .handle-box {
      display: grid;
      grid-template-columns: repeat(3, 33%);
      padding-top: 40rpx;
      margin: 0 5px;
      position: relative;

      .more {
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .footer-item {
        display: flex;
        // justify-content: center;
        align-items: center;

        .label {
          margin-right: 10rpx;
        }

        .value {
          color: var(--icon-color);
          font-size: 12px;
        }
      }
    }
  }

  .tag-wrap {
    display: inline-flex;
    align-items: center;

    view {
      margin-right: 5px;
    }
  }

  // 快捷评论
  .comment-wrap {
    margin-top: 15px;

    .comment-item:last-child {
      margin-bottom: unset;
    }

    .comment-item {
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        flex: 1;
        display: flex;
        align-items: center;
        color: #ccc;

        .nick {
          max-width: 180px;
          width: 80px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          margin: 0 10px;
          color: #000;
        }
      }
    }
  }
</style>
