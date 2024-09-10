<template>
  <view class="page">
    <view class="form1" v-if="!userInfo.phonenumber">
      <up-form v-model="bindForm">
        <u-form-item prop="phoneNum" ref="item1">
          <up-input placeholder="请输入手机号" :adjustPosition="false" v-model="bindForm.phoneNum"></up-input>
          <template #right>
            <up-button :disabled="bindForm.step == 2" class="margin-left" type="success" @click="handleCheck">
              <template v-if="bindForm.step == 1">
                获取验证码
              </template>
              <up-count-down v-else :time="60 * 1000" format="mm:ss" @finish="bindForm.step = 1"></up-count-down>
            </up-button>
          </template>
        </u-form-item>
        <u-form-item prop="phoneCode" ref="item1" v-if="bindForm.step == 2">
          <up-code-input v-model="bindForm.phoneCode"></up-code-input>
        </u-form-item>

        <up-button class="margin-top-lg" type="success" @click="handleBind" :disabled="bindForm.step == 1"
          shape="circle">提交</up-button>
      </up-form>
    </view>
    <view class="form1" v-else>
      <!-- <up-alert type="warning" description="为了保证你的账号安全,请验证身份.验证成功后进行下一步操作"></up-alert> -->

      <view class="text-center">
        暂不支持更换、解绑<up-text mode="phone" :text="userInfo.phonenumber" format="encrypt"></up-text>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    computed,
    getCurrentInstance,
    reactive,
    ref
  } from 'vue';

  import useUserStore from '@/store/modules/user';
  import {
    checkMobile,
    bindMobile
  } from '@/api/login.js'

  const {
    proxy
  } = getCurrentInstance()
  const userStore = useUserStore()

  const userInfo = computed(() => {
    return userStore.userInfo
  })

  const bindForm = reactive({
    code: '',
    phoneCode: '',
    phoneNum: '',
    step: 1,
    sendType: 1
  })

  function handlePhoneBind() {
    show.value = true
  }

  function handleCheck() {
    if (!uni.$u.test.mobile(bindForm.phoneNum)) {
      proxy.$modal.msg('请输入正确的手机号')
      return
    }
    checkMobile(bindForm).then((res) => {
      bindForm.step = 2
      proxy.$modal.msg('发送成功')
    })
  }

  function handleBind() {
    if (!uni.$u.test.digits(bindForm.phoneCode)) {
      proxy.$modal.msg('请输入正确的短信验证码')
      return
    }
    bindMobile(bindForm).then((res) => {
      proxy.$modal.msg('绑定成功')
      userStore.getInfo()
      uni.navigateBack()
    })
  }
</script>

<style lang="scss">
  .page {
    height: 100%;
    background-color: #fff;
  }

  .form1 {
    text-align: center;
    padding: 50px 30px;
  }
</style>
