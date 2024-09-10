<template>
  <view class="edit-wrap">
    <up-form labelPosition="left" labelWidth="80px" :model="user" :rules="rules" ref="formRef">
      <view class="flex align-center margin-bottom" style="flex-direction: column;">
        <up-avatar @click="handleToAvatar" :src="user.avatar" size="60" mode="widthFix" shape="circle">
          <template #error>
            <view style="font-size: 24rpx;">我</view>
          </template>
        </up-avatar>

        <view class="font-11">
          点击修改头像
        </view>

      </view>
      <up-form-item label="用户昵称" prop="nickName" required ref="item1">
        <up-input v-model="user.nickName" :maxlength="10" border="bottom" placeholder="请输入昵称"></up-input>
      </up-form-item>
      <up-form-item label="邮箱" prop="email" required="" ref="item1">
        <up-input v-model="user.email" border="bottom" placeholder="请输入邮箱地址"></up-input>
      </up-form-item>

      <up-form-item label="性别" prop="sex" ref="item1">
        <up-radio-group v-model="user.sex">
          <up-radio :customStyle="{marginRight: '12px'}" v-for="(item, index) in state.sexs" :key="index"
            :label="item.text" :name="item.value">
          </up-radio>
        </up-radio-group>
      </up-form-item>
      <up-button type="primary" shape="circle" class="margin-top-lg" @click="submit">提交</up-button>
    </up-form>
  </view>
</template>

<script setup>
  import {
    getCurrentInstance,
    reactive,
    ref,
    toRefs
  } from "vue";
  import {
    getUserProfile,
    updateUserProfile
  } from "@/api/system/user"
  import useUserStore from "@/store/modules/user";
  const {
    proxy
  } = getCurrentInstance()
  const state = reactive({
    user: {
      nickName: "",
      email: "",
      sex: "",
      phoneCaptcha: '',
      avatar: ''
    },
    sexs: [{
      text: '男',
      value: 0
    }, {
      text: '女',
      value: 1
    }, {
      text: '隐藏',
      value: 2
    }],
    rules: {
      nickName: {
        required: true,
        message: '用户昵称不能为空'
      },
      email: [{
        required: true,
        message: '邮箱地址不能为空'
      }, {
        type: 'email',
        message: '请输入正确的邮箱地址'
      }]
    }
  })

  const {
    rules,
    user
  } = toRefs(state)

  function getUser() {
    getUserProfile().then(response => {
      state.user = response.data.user
    })
  }
  const formRef = ref(null)

  function submit(ref) {
    var that = this
    formRef.value.validate().then(res => {
      updateUserProfile(user.value).then(response => {
        uni.showModal({
          showCancel: false,
          content: '修改成功',
          success: function(res) {
            if (res.confirm) {
              uni.navigateBack();
              uni.$emit('refresh');
            }
          }
        })
      })
    }).catch(() => {
      // 处理验证错误
      // uni.$u.toast('表单校验失败')
    });
  }

  function handleToAvatar() {
    uni.navigateTo({
      url: '/pages/mine/avatar/index'
    });
  };
  getUser()

  // 接收修改头像返回的emit方法
  uni.$on('refresh', () => {
    console.log('资料更新了')
    getUser()
  })
  // proxy.$refs.formRef.setRules(state.rules)
</script>

<style lang="scss">
  page {
    background-color: #fff;
  }

  .edit-wrap {
    width: 90%;
    padding: 15px;
    margin: 0 auto;
  }

  .form-item {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .button {
    display: flex;
    align-items: center;
    height: 35px;
    line-height: 35px;
    margin-left: 10px;
  }
</style>
