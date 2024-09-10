<template>
  <view>
    <div class="login">
      <div class="login-form">
        <!-- <h3 class="title">登录</h3> -->

        <div v-if="!loading" style="text-align: center" class="pb20">
          <u-empty mode="permission" v-if="!loading" :text="text">
          </u-empty>
          <navigator url="login" hover-class="navigator-hover" class="login-btn ">
            返回登录
          </navigator>
        </div>
        <div v-else class="loading">登 录 中...</div>
      </div>
    </div>
  </view>
</template>

<script setup>
  import {
    getCurrentInstance,
    ref
  } from 'vue';
  import {
    getQueryObject
  } from '@/utils/common.js'
  import useUserStore from '../store/modules/user';
  const {
    proxy
  } = getCurrentInstance()
  const callbackQuery = ref()
  const redirect = ref('')
  const authSource = ref('')
  const loading = ref(false)
  const text = ref('未获取到授权信息，请返回重新授权登录')
  callbackQuery.value = getQueryObject()

  if (callbackQuery.value && callbackQuery.value.state != null) {
    loading.value = true
    useUserStore().oauthLogin(callbackQuery.value).then(res => {
      loginSuccess()
    }).catch((err) => {
      console.log(err)
      text.value = err.msg
      proxy.$modal.msgError(err.msg)
      loading.value = false
    });
  }
  // 登录成功后，处理函数
  function loginSuccess() {
    useUserStore().getInfo().then(res => {
      proxy.$tab.reLaunch('/pages/index')
    })
  }
</script>

<style>
  .loading {
    text-align: center;
    color: #ccc;
    padding: 10px;
  }

  .login-btn {
    margin-top: 40px;
    height: 45px;
  }

  .pb20 {
    margin: 60px;
  }
</style>
