<template>
  <view class="page">
    <form @submit="submit">
      <button type="default" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="avatar">
        <u-image :show-loading="true" :src="avatarUrl" width="80px" height="80px" mode="widthFix">
          <template #error>
            <view style="font-size: 24rpx;">失败</view>
          </template>
        </u-image>
      </button>
      <input type="nickname" class="weui-input" @blur="getUserName" v-model="nickName" placeholder="请输入昵称" />

      <button type="primary" form-type="submit" :disabled="!nickName">提交</button>
    </form>
  </view>
</template>

<script setup>
  import {
    getCurrentInstance,
    ref
  } from 'vue';
  import {
    uploadAvatar
  } from '@/api/system/user.js'
  import useUserStore from '@/store/modules/user';
  const {
    proxy
  } = getCurrentInstance()
  const avatarUrl = ref('')
  const nickName = ref('')
  avatarUrl.value = useUserStore().avatar

  function onChooseAvatar(e) {
    console.log(e)
    avatarUrl.value = e.detail.avatarUrl

    let data = {
      name: 'picture',
      filePath: e.detail.avatarUrl
    }
    uploadAvatar(data).then(response => {
      uni.showToast({
        title: "修改头像成功",
        icon: 'success'
      })
      uni.$emit('refresh');
    })
  }

  function getUserName(e) {
    nickName.value = e.detail.value
  }

  function submit(e) {
    console.log(nickName.value)
  }
</script>

<style>
  .page {
    margin: 20px;
  }

  .wxLoginBtn {
    background: transparent !important;
    border: none;
  }

  .wxLoginBtn::after {
    border: none;
  }

  .avatar {
    width: 80px;
    height: 80px;
    padding: 0;
    background: none;
  }

  .avatar image {
    width: 80px;
    height: 80px;
    border-radius: 100px;
  }

  .weui-input {
    width: 90%;
    height: 60px;
    margin: 20px auto;
    background: #eee;
    border-radius: 5px;
    padding-left: 15px;
  }
</style>
