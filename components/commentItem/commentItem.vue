<template>
  <view class="comment-item">
    <!-- 作者id：{{authorId}} -->
    <view class="u-info">
      <view class="avatar-wrap">
        <up-avatar :src="item.avatar" :size="32"></up-avatar>
      </view>
      <view class="u-right" @longpress="handleOperate(5,item)">
        <view class="u-top">
          <text class="nick-name one-ellipsis">{{item.nickName}}</text>
          <text class="author-tag" v-if="item.userId == props.authorId">作者</text>
          <text class="author-tag author-tag-me" v-if="item.userId == userId">我</text>
        </view>
        <view class="content-wrap">
          {{item.content}}<text class="author-tag author-tag-me" v-if="item.top >0">置顶</text>
        </view>
        <div class="content-wrap" v-if="item.chatImg">
          <imagePreview width="90px" height="120px" :src="item.chatImg"></imagePreview>
        </div>
        <view class="tool">
          <view class="action-box">
            {{formatTime(dayjs(item.addTime).valueOf())}}
            <view class="time-dot">·</view>
            {{ item.position || 'IP未知'}}
            <view class="btn-reply" @click="handleOperate(4, item)">回复</view>
          </view>
          <view class="action-box">
            <!-- <view class="icon">
              <up-icon name="more-dot-fill" @click="handleOperate(5,item)"></up-icon>
            </view> -->
            <view class="icon">
              <up-icon name="thumb-up" @click="handlePraise(item)"></up-icon>
              <text class="ml5" v-if="item.praiseNum > 0">{{ item.praiseNum }}</text>
              <text class="ml5" v-else>赞</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="reply-list">
      <view class="comment-item" v-for="replyItem in replyList">
        <view class="u-info" v-if="replyItem.parentId == item.commentId">
          <view class="avatar-wrap">
            <up-avatar :src="replyItem.avatar" size="20" class="avatar"></up-avatar>
          </view>
          <view class="u-right" @longpress="handleOperate(5,replyItem)">
            <view class="u-top">
              <text class="nick-name one-ellipsis">{{replyItem.nickName}}</text>
              <text class="author-tag" v-if="replyItem.userId == props.authorId">作者</text>
              <text class="author-tag author-tag-me" v-if="replyItem.userId == userId">我</text>
              <template v-if="replyItem.replyUserId > 0">
                <up-icon name="play-right" :size="12"></up-icon>
                <view class="ml10 reply-nick one-ellipsis">
                  <!-- {{ replyItem.replyNickName }} -->
                  {{replyInfo(replyItem)}}
                </view>
              </template>
            </view>
            <view class="content-wrap">
              {{replyItem.content}}
            </view>
            <div class="content-wrap" v-if="replyItem.chatImg">
              <imagePreview width="90px" height="120px" :src="item.chatImg"></imagePreview>
            </div>
            <view class="tool">
              <view class="action-box">
                {{formatTime(dayjs(replyItem.addTime).valueOf())}}
                <view class="time-dot">·</view>
                {{ replyItem.position || 'IP未知'}}
                <view class="btn-reply" @click="handleOperate(4, replyItem)">回复</view>
              </view>
              <view class="action-box">
                <!-- <view class="icon">
                  <up-icon name="more-dot-fill" @click="handleOperate(5,replyItem)"></up-icon>
                </view> -->
                <view class="icon">
                  <up-icon name="thumb-up" @click="handlePraise(replyItem)"></up-icon>
                  <text class="ml5" v-if="replyItem.praiseNum > 0">{{ replyItem.praiseNum }}</text>
                  <text class="ml5" v-else>赞</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="reply-bar margin-bottom-xs" v-if="parentItem && item.replyNum > 0 && queryParams.hasMore"
      @click="handleReplyList(item)">
      <up-icon name="minus" color="#eee"></up-icon>
      <text class="margin-left-sm" v-if="queryParams.pageNum == 0">
        展开 {{ item.replyNum }} 条回复
      </text>
      <text v-else>展开更多</text>
      <up-icon name="arrow-down"></up-icon>
    </view>
    <u-action-sheet @close="show = false" :safeAreaInsetBottom="true" round cancelText="取消" @select="selectClick"
      :actions="moreList" :show="show"></u-action-sheet>
  </view>
</template>
<script setup>
  import {
    formatTime
  } from '@/utils/index.js'
  import dayjs from 'dayjs';
  import {
    listMessage,
    addMessage,
    praiseMessage,
    delMessage,
    topMessage
  } from '@/api/comment.js'
  import useUserStore from '@/store/modules/user';
  import {
    getCurrentInstance,
    ref,
    reactive,
    computed,
    defineExpose
  } from 'vue';
  const count = ref()
  const userStore = useUserStore()
  const {
    proxy
  } = getCurrentInstance()
  const emits = defineEmits()

  const props = defineProps({
    /**
     * 评论内容
     */
    item: {
      type: Object
    },
    /**
     * 父集
     */
    parentItem: {
      type: Object
    },
    /**
     * 内容作者id
     */
    authorId: {
      type: Number
    }
  })

  const avatar = userStore.avatar
  const userId = computed(() => {
    return userStore.userId
  })
  const loading = ref(false)
  // 回复列表
  const replyList = ref(props.item.replyList ?? [])
  const queryParams = reactive({
    totalPage: 0,
    pageNum: 0,
    hasMore: props.parentItem.hasMore
  })

  /**
   * 获取回复xxx的昵称
   * @param {Object} info
   */
  function replyInfo(info) {
    var i = replyList.value.find(x => x.userId == info.replyUserId)

    if (i && i.nickName) {
      return i.nickName
    }
  }
  /**
   * 点赞评论
   * @param {*} info
   */
  function handlePraise(info) {
    praiseMessage({
      commentId: info.commentId
    }).then(() => {
      proxy.$modal.msgSuccess('点赞成功')
      info.praiseNum = info.praiseNum + 1
    })
  }

  /**
   * 查询回复列表
   * @param {*} comment
   */
  function handleReplyList(comment) {
    queryParams.pageNum++
    loading.value = true
    listMessage({
      commentId: comment.commentId,
      pageNum: queryParams.pageNum
    }).then((res) => {
      const {
        result,
        totalPage
      } = res.data
      if (queryParams.pageNum == 1) {
        replyList.value = result
      } else {
        replyList.value = replyList.value.concat(result)
      }

      queryParams.totalPage = totalPage
      if (queryParams.pageNum >= queryParams.totalPage) {
        queryParams.hasMore = false
      } else {
        queryParams.hasMore = true
      }
      loading.value = false
    })
  }

  /**
   * 回复成功调用此方法插入回复列表
   * @param {Object} item 回复的内容
   */
  function handleReply(item) {
    replyList.value.push(item)
  }

  /**
   * 更多操作
   * @param {Object} type 5、更多
   * @param {Object} item
   */
  function handleOperate(type, item) {
    switch (type) {
      case 4:
        emits('selected', item)
        break;
      case 5:
        show.value = true
        moreList.value = [{
          type: 'report',
          name: '举报',
          data: item
        }]

        if (userId.value > 0 && userId.value == props.authorId && parseInt(item.parentId) <= 0) {
          moreList.value.push({
            type: 'top',
            name: `${item.top > 0 ? '取消': ''}置顶`,
            data: {
              commentId: item.commentId,
              top: item.top,
              targetId: item.targetId
            }
          })
        }
        if (userId.value > 0 && (userId.value == item.userId || userId.value == props.authorId)) {
          moreList.value.push({
            type: 'delete',
            name: '删除',
            data: item
          })
        }
        break;
      default:
        break
    }
  }
  // 显示操作面板
  const show = ref(false)
  const moreList = ref([])

  /**
   * 选中事件
   * @param {Object} i { type: 'delete', name :'': data: {...} }
   */
  function selectClick(i) {
    if (i.type == 'report') {
      uni.showToast({
        icon: 'none',
        title: '敬请期待'
      })
      return
    }
    switch (i.type) {
      case 'top':
        topMessage(i.data).then((res) => {
          proxy.$modal.msgSuccess('操作成功')
          emits('success')
        })
        break;
      case 'delete':
        uni.showModal({
          content: '你确定要删除吗？'
        }).then((val) => {
          if (val.confirm) {
            delMessage(i.data.commentId).then((res) => {
              proxy.$modal.msg('删除成功')
              if (i.data.parentId.length > 1) {
                replyList.value = replyList.value.filter((f) => f.commentId != i.data.commentId)
              } else {
                emits('deleted', i.data, res.data)
              }
            })
          }
        })
        break;
    }
  }

  defineExpose({
    handleReply
  })
</script>

<style lang="scss" scoped>
  .comment-item {
    cursor: pointer;
    padding: 5px 0 10px 10px;

    .u-info {
      display: flex;
      font-size: 14px;
      // margin-bottom: 15px;

      .u-right {
        // width: 90%;
        flex: 1;
      }

      .avatar-wrap {
        margin-right: 10px;
        // width: 30px;
        // text-align: center;
      }

      .u-top {
        margin-bottom: 10px;
        color: #8a919f;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 11px;

        .more {
          position: absolute;
          right: 10px;
        }
      }

      .nick-name {
        cursor: pointer;
        flex-wrap: wrap;
        font-size: 13px;
        max-width: 100px;
      }

      .tool {
        color: #8a919f;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        font-size: 13px;

        .time-dot {
          display: inline-flex;
          padding: 0 3px;
        }

        .btn-reply {
          cursor: pointer;
          display: inline-flex;
          color: #47536c;
          margin-left: 10px;
        }
      }

      .content-wrap {
        font-size: 15px;
        margin-bottom: 10px;
        font-weight: 400;
        white-space: pre-line;
        color: #000;
        padding-right: 40px;
      }
    }
  }

  .author-tag {
    color: #fff;
    font-size: 11px;
    border-radius: 2px;
    background: #ff0000;
    margin-left: 4px;
    flex-shrink: 0;
    position: relative;
    padding: 0 3px;
    // top: -2px;
  }

  .author-tag-me {
    background-color: #ccc;
  }

  .reply-nick {
    flex-wrap: wrap;
    margin: 0 10px;
    font-size: 13px;
    width: 80px;
  }

  .action-box {
    display: flex;
    justify-content: flex-end;

    .icon {
      cursor: pointer;
      // color: #ccc;
      min-width: 50px;
      text-align: left;
      display: inline-flex;
    }
  }

  .reply-list {
    margin-left: 32px;
    margin-top: 10px;

    .comment-item {
      padding: unset;
      margin-bottom: 10px;
    }
  }

  .reply-bar {
    margin-left: 40px;
    color: #47536c;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    align-items: center;

    b {
      color: var(--el-color-primary);
    }
  }
</style>
