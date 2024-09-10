<template>
  <view class="article-item">
    <view class="article-title" @click.native="handleDetails(item)">
      {{item.title}}
    </view>
    <view class="u-info" @click.native="handleDetails(item)">
      <view class="u-right">
        <view class="nick-wrap" v-if="item.user">
          <up-avatar size="16" :src="item.user.avatar"></up-avatar>
          <span class="nick-name margin-left-sm"> {{ item.user.nickName }}</span>
        </view>
        <view class="content-wrap">
          <up-text :lines="2" color="#8a919f" :text="item.abstractText"></up-text>
        </view>
      </view>

      <view class="img-wrap" v-if="item.coverUrl">
        <imagePreview :canPreview="false" width="100px" :src="item.coverUrl">
        </imagePreview>
      </view>
    </view>

    <view class="tool">
      <view class="flex-center-row">
        <view class="margin-right">
          <up-icon name="eye" size="22" space="5px" color="var(--icon-color)" labelColor="var(--icon-color)"
            :label="item.hits"> </up-icon>
        </view>
        <view class="margin-left" @click="handlePraise(item)">
          <up-icon name="thumb-up" :color="item.isPraise == 1 ? 'var(--icon-color-active)': 'var(--icon-color)'"
            size="22" top="-1" space="5px"
            :label-color="item.isPraise == 1 ? 'var(--icon-color-active)' : 'var(--icon-color)'" :label="item.praiseNum"
            :bold="item.isPraise == 1"> </up-icon>
        </view>
      </view>
      <view class="action-box">
        <up-tag class="margin-right-sm" type="info" plain="" :text="item.categoryNav.name"
          v-if="item.categoryNav && item.categoryNav.categoryId > 0"> </up-tag>

        <view class="icon-more" @click="handleMore(item)">
          <up-icon name="more-dot-fill"></up-icon>
        </view>
      </view>
    </view>
    <u-action-sheet @close="show = false" :safeAreaInsetBottom="true" round cancelText="取消" @select="selectClick"
      :actions="moreList" :show="show"></u-action-sheet>
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
    praiseArticle,
    delArticle,
    topArticle,
    changeArticlePublic
  } from '@/api/article/article.js'
  import dayjs from 'dayjs';
  import useUserStore from '@/store/modules/user';
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
     * 显示更多位置
     * 1、顶部 2、底部
     */
    morePosition: {
      type: Number,
      default: 1
    }
  })
  const {
    proxy
  } = getCurrentInstance()
  const emits = defineEmits(['success'])

  function handleDetails(item) {
    uni.navigateTo({
      url: `/pages/essay/details?cid=` + item.cid
    })
  }

  function handlePraise(item) {
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
  const userId = computed(() => {
    return useUserStore().userId
  })
  const moreList = ref([])
  const show = ref(false)
  const isTop = computed(() => {
    return props.item.isTop
  })
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
  }
</script>

<style lang="scss" scoped>
  .article-item {
    cursor: pointer;
    padding: 5px 10px 3px 10px;
    background-color: #fff;
    margin-bottom: 5px;

    // 文章的标题
    .article-title {
      font-weight: 400;
      font-size: 16px;
      cursor: pointer;
      margin: 5px 0;
      color: #000;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -moz-box;
      -moz-line-clamp: 2;
      -moz-box-orient: vertical;
      overflow-wrap: break-word;
      word-break: break-all;
      white-space: normal;
      overflow: hidden;
    }

    .u-info {
      display: flex;
      font-size: 14px;

      .u-right {
        flex: 1;
      }

      .nick-name {
        cursor: pointer;
        flex-wrap: wrap;
      }


      .nick-wrap {
        display: flex;
        align-items: center;
      }

      .content-wrap {
        margin-top: 8px;
        font-size: 15px;
        margin-bottom: 10px;
        font-weight: 400;
        white-space: pre-line;
      }

      // 右侧图片
      .img-wrap {
        display: flex;
        justify-content: flex-end;
        width: 100px;
      }
    }

    .tool {
      color: #8a919f;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 6px 0px;

      .flex-center-row {
        display: flex;
        align-items: center;
      }

      .action-box {
        display: flex;
        align-items: center;

        .icon-more {
          transform: rotate(90deg);
        }
      }
    }
  }
</style>
