<template>

  <view class="form-wrap" v-show="show">
    <view class="img-wrap" v-if="form.chatImg">
      <up-icon name="close" class="icon-close" @click="form.chatImg = ''"></up-icon>
      <up-image :src="form.chatImg" width="50" height="50"></up-image>
      <up-tag text="发送" type="primary" @click="handleReply"></up-tag>
    </view>
    <view class="content-wrap">
      <view class="action-box">
        <view class="input-wrap">
          <up-input ref="inputRef" cursor-spacing="50px" prefixIcon="edit-pen" clearable shape="circle" :focus="focus"
            :maxlength="maxLength" @keyboardheightchange="showTool = false" fixed v-model="form.content"
            @focus="inputFocus()" @blur="inputBlur()" :placeholder="intro" confirm-type="send" @confirm="handleReply"
            :showConfirmBar="false" />
        </view>
        <view class="left">
          <view class="margin-left-xs">
            <up-icon name="chat" size="25" @click="clear" v-if="!focus"></up-icon>
          </view>
          <view class="margin-right-sm margin-left-xs">
            <up-icon name="gift" size="25" @click="handleEmoji"></up-icon>
          </view>

          <view>
            <uploadImage :previewImage="false" :limit="1" v-model="form.chatImg">
              <template #default>
                <up-icon name="photo" size="25"></up-icon>
              </template>
            </uploadImage>
          </view>

        </view>

      </view>
    </view>
    <up-transition :show="showEmoji" mode="fade-up">
      <scroll-view scroll-y="true">
        <view class="emoji-box">
          <view class="emoji-item" v-for="item in emojiList" @click="emojiSelected(item)">
            {{item.content}}
          </view>

          <view class="emoji-action-wrap">
            <!-- <view class="close margin-right" @click="handleClear()">
              <up-icon name="close"></up-icon>
            </view> -->
            <view class="btn-send">
              <up-tag text="发送" type="primary" @click="handleReply"></up-tag>
            </view>
          </view>
        </view>
      </scroll-view>
    </up-transition>
  </view>
</template>

<script setup>
  import useUserStore from '@/store/modules/user';
  import emojiList from '@/utils/emoji';
  import {
    defineProps,
    defineExpose,
    ref,
    computed,
    getCurrentInstance,
    defineEmits,
    watch
  } from 'vue';
  import {
    onLoad
  } from '@dcloudio/uni-app'
  const emits = defineEmits(['handleReply', 'cancel', 'success'])
  const {
    proxy
  } = getCurrentInstance()
  const userStore = useUserStore()
  const show = ref(false)
  const showTool = ref(false)
  const showEmoji = ref(false)
  const defaultIntro = '请文明发言'
  const intro = ref(defaultIntro)
  const maxLength = computed(() => {
    return userStore.userId == 1 ? 200 : 100
  })
  const form = ref({
    content: '',
    chatImg: '',
    commentId: undefined
  })

  /**
   * 获得焦点
   */
  function inputFocus() {
    show.value = true
    showTool.value = true
    showEmoji.value = false

    proxy.$nextTick(() => {
      focus.value = true
    })
  }

  /**
   * 失去焦点
   * (TODO 待优化)
   */
  function inputBlur() {
    focus.value = false
  }

  function handleEmoji() {
    showEmoji.value = !showEmoji.value
    showTool.value = true
  }

  // 要回复的评论信息
  const showInfo = ref()
  const focus = ref(false)
  /**
   * 如果已选中当前评论信息，再次点击择取消选中
   * @param {Object} item 选中的评论信息
   */
  function handleSelected(item) {
    if (show.value && show.value.commentId != item.commentId) {
      clear()
    }
    show.value = true
    showInfo.value = item
    form.value.commentId = item.commentId
    intro.value = '回复：' + item.nickName

    proxy.$nextTick(() => {
      focus.value = true
    })
  }

  /**
   * 回复
   * @param {*} item
   */
  function handleReply() {
    if (uni.$u.test.isEmpty(form.value.content) && uni.$u.test.isEmpty(form.value.chatImg)) {
      uni.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }
    emits('success', form.value)
  }

  function clear() {
    form.value = {
      content: '',
      chatImg: ''
    }
    emits('cancel')
    showEmoji.value = false
    intro.value = defaultIntro
    show.value = false
  }

  function handleClear() {
    form.value.content = form.value.content.replace(/\s/g, "")
  }

  function emojiSelected(item) {
    form.value.content += item.content
  }
  defineExpose({
    handleSelected,
    clear,
    inputFocus
  })
</script>

<style lang="scss" scoped>
  .form-wrap {
    position: fixed;
    bottom: 0px;
    width: 100%;
    padding: 1px 10px 0 10px;
    background: #fff;
    z-index: 999;
    // #ifdef MP-WEIXIN
    padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
    // #endif

    .content-wrap {
      display: flex;
      width: 100%;
      // #ifdef MP-WEIXIN
      // margin-bottom: 10px;
      // #endif

      .action-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 3px;
        width: 100%;

        .input-wrap {
          flex: 1;
        }

        .left {
          display: flex;
        }
      }
    }

    .btn-send {
      margin: 10px;
    }
  }

  .emoji-box {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 14.2%);
    height: 200px;

    .emoji-item {
      display: inline-flex;
      // height: 20px;
      text-align: center;
      justify-content: center;
      align-items: center;
      font-size: 25px;
      position: relative;
    }

    .emoji-action-wrap {
      position: absolute;
      right: 0px;
      bottom: 0px;
      display: flex;
      align-items: center;
    }
  }

  .img-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .icon-close {
      position: absolute;
      left: 52px;
      top: 5px;
    }
  }
</style>
