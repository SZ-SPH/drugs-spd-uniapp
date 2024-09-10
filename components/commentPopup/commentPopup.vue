<template>
  <view class="comment-box">
    <!-- <up-overlay :show="show" @click="close" :zIndex="990">
      <u-popup :show="show" @close="close" round="10" :overlay="false" :closeable="true" :z-index="980"> -->
    <up-line></up-line>
    <view class="header flex u-flex-between">
      <view>评论
        <text v-if="info">{{info.commentNum}}</text>
      </view>
      <view class="font-12 text-gray">
        <text @click="sortChange(1)" :style="{'color': queryParams.orderBy == 1 ? 'var(--text-color)': ''}">热门</text> |
        <text @click="sortChange(2)" :style="{'color': queryParams.orderBy == 2 ? 'var(--text-color)': ''}">最新</text>
      </view>
    </view>

    <scroll-view scroll-y="true" class="scroll-wrap" @scrolltolower="handleBottom">
      <commentItem :ref="'commentRef' + item.commentId" :authorId="authorId" :parent-item="item" :item="item"
        @deleted="handleCommentDel" @success="handleQuery" @selected="handleSelected" v-for="item in dataList">
      </commentItem>
      <up-loadmore :status="status" v-if="total > 0" line="" />
      <up-empty mode="car" v-if="total <= 0 && dataList.length <= 0" text="评论为空~"
        icon="https://cdn.uviewui.com/uview/empty/comment.png">
      </up-empty>
    </scroll-view>
    <up-back-top :scroll-top="scrollTop"></up-back-top>
    <commentEditor ref="editorRef" @cancel="handleCancel" @success="handleReply"></commentEditor>
    <view class="footer" v-if="info && !showEditor">
      <view class="left" @click="handleInput">
        <up-input placeholder="写评论..." prefixIcon="edit-pen" disabled="" shape="circle"></up-input>
      </view>
      <view class="center margin-left">
        <view class="icon margin-right-xl">
          <up-icon name="share-square" size="20" top="-1" space="5px" color="var(--icon-color)">
          </up-icon>
        </view>
        <view class="icon margin-right-xl">
          <up-icon name="chat" size="20" top="-1" space="5px" color="var(--icon-color)">
          </up-icon>
          <up-badge max="99" :value="info.commentNum" absolute :offset="[-10,-0]"></up-badge>
        </view>
        <view class="icon margin-right-xl">
          <up-icon name="thumb-up" size="20" top="-1" space="5px" :bold="info.isPraise == 1"
            :color="info.isPraise == 1 ? 'var(--icon-color-active)': 'var(--icon-color)'">
          </up-icon>
          <up-badge max="99" :value="info.praiseNum" absolute inverted :offset="[-10,-0]"></up-badge>
        </view>
      </view>
    </view>
    <!--      </u-popup>
    </up-overlay> -->
  </view>
</template>

<script setup>
  import {
    listMessage,
    addMessage
  } from '@/api/comment.js'
  import useUserStore from '@/store/modules/user';
  import {
    defineProps,
    defineExpose,
    ref,
    reactive,
    computed,
    getCurrentInstance,
    nextTick
  } from 'vue';
  import {
    onReachBottom,
    onPageScroll
  } from '@dcloudio/uni-app'
  const content = ref('')
  const show = ref(false)
  const props = defineProps({
    //分类id
    classifyId: {
      type: [Number],
      default: 0
    },
    //目标id，文章对应文档id
    targetId: {
      type: [Number, String],
      default: 0
    }
  })

  const {
    proxy
  } = getCurrentInstance()
  const userStore = useUserStore()
  const queryParams = reactive({
    pageNum: 1,
    orderBy: 1, // 1、热门 2、最新
    classifyId: props.classifyId,
    targetId: props.targetId
  })
  const total = ref(0)
  const userId = computed(() => {
    return userStore.userId
  })
  //内容作者id
  const authorId = computed(() => {
    return info.value.userId
  })
  const dataList = ref([])
  const totalPage = ref(0)

  /**
   * 评论删除
   * @param {Object} item
   */
  function handleCommentDel(item, deleteNum) {
    var myArray = dataList.value.filter((f) => f.commentId != item.commentId)
    dataList.value = myArray

    total.value = total.value - deleteNum
    // info.value.commentNum = info.value.commentNum - deleteNum
  }

  // 内容详情
  const info = ref()
  /**
   * 打开评论弹框
   * @param {Object} item
   */
  function handleOpen(item) {
    // uni.hideTabBar()
    // show.value = true
    info.value = item
    showInfo.value = {}
    dataList.value = []
    handleQuery()
  }

  function handleQuery() {
    queryParams.pageNum = 1
    getList()
  }

  /**
   * 排序
   * @param {Object} sort
   */
  function sortChange(sort) {
    queryParams.orderBy = sort

    handleQuery()
  }

  // 要回复的评论信息
  const showInfo = ref()

  /**
   * 如果已选中当前评论信息，再次点击择取消选中
   * @param {Object} item 选中的评论信息
   */
  function handleSelected(item) {
    showEditor.value = false
    showInfo.value = item
    proxy.$refs.editorRef.handleSelected(item)
  }

  /*
   * 编辑组件返回的数据内容
   * @param {Object} item {content: '我是聊天内容', chatImg: ''}
   */
  function handleReply(form) {
    var item = showInfo.value
    var parentId = item.commentId
    var replyId = item.commentId
    var replyUserId = item.userId
    var replyStatus = false

    if (item.parentId == '0' || uni.$u.test.isEmpty(item.parentId)) {
      replyUserId = 0
      replyId = 0
    } else {
      parentId = item.parentId
      replyStatus = true
    }

    const submitForm = {
      parentId: parentId,
      replyId: replyId,
      replyUserId: replyUserId,
      userId: userId.value,
      nickName: userStore.name,
      avatar: userStore.avatar,
      replyNickName: item.nickName,
      targetId: props.targetId,
      classifyId: props.classifyId,
      chatImg: form.chatImg,
      content: form.content,
    }

    addMessage(submitForm)
      .then((res) => {
        const {
          code,
          data
        } = res
        proxy.$modal.msgSuccess('评论成功')

        showEditor.value = false
        showInfo.value = {}
        proxy.$refs.editorRef.clear()
        total.value = total.value + 1
        var newComment = {
          ...submitForm,
          commentId: data.commentId,
          position: data.position
        }
        if (parseInt(parentId) > 0) {
          proxy.$refs['commentRef' + parentId][0].handleReply(newComment)
        }

        // 评论成功本地刷新评论列表
        if (!parentId || parseInt(parentId) <= 0) {
          // getList()
          dataList.value.unshift(newComment)
          uni.pageScrollTo({
            selector: '.header', //你要跳转的样式位置
            duration: 300, //跳转时间段
          })
        }
      })
  }

  function getList() {
    uni.showLoading({
      title: 'loading'
    })
    listMessage(queryParams)
      .then((res) => {
        const {
          code,
          data
        } = res
        if (res.code == 200) {
          total.value = data.totalNum
          totalPage.value = data.totalPage

          if (queryParams.pageNum <= 1) {
            dataList.value = data.result
          } else {
            dataList.value = [...dataList.value, ...data.result];
          }
        }
      })
      .finally(() => {
        setTimeout(() => {
          uni.hideLoading()
        }, 300)
      })
  }

  /**
   * 下拉加载评论
   * @param {Object} e
   */
  function handleBottom(e) {
    status.value = 'loading'
    if (queryParams.pageNum < totalPage.value) {
      queryParams.pageNum++
      getList()
    } else {
      status.value = 'nomore'
      console.log('全部加载完')
    }
  }
  const status = ref('')
  onReachBottom((e) => {
    handleBottom(e)
  })
  /**
   * 待回复的内容清空(输入框传过来方法)
   */
  function handleCancel() {
    showInfo.value = {}
    showEditor.value = false
  }
  // 显示编辑器
  const showEditor = ref(false)

  function handleInput() {
    showEditor.value = false
    proxy.$refs.editorRef.inputFocus()
  }
  // 创建响应式数据 scrollTop
  const scrollTop = ref(0);

  // 定义 onPageScroll 方法来更新 scrollTop 的值
  onPageScroll((e) => {
    scrollTop.value = e.scrollTop;
  });
  defineExpose({
    handleOpen
  })
</script>

<style lang="scss" scoped>
  .comment-box {
    background-color: #fff;
  }

  .header {
    text-align: left;
    margin: 10px 0;
    padding: 0 10px;
  }

  .scroll-wrap {
    height: 100%;
    padding-bottom: 60px;
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
    z-index: 10;

    .right {
      width: 160px;
      display: flex;
      margin-left: 20px;
    }

    .left {
      flex: 1;
      height: 40px;
    }

    .icon {
      position: relative;
    }

    .center {
      width: 150px;
      display: flex;
      justify-content: space-around;
    }
  }
</style>
