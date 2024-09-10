<template>
  <view class="container">
    <uni-list>
      <view class="avatar-wrap align-center justify-center flex">
        <u--image :showLoading="true" :src="user.avatar" width="100px" height="100px" mode="widthFix" shape="circle">
          <view slot="error" style="font-size: 24rpx;">加载失败</view>
        </u--image>
        <view class="sex-wrap">
          <user-sex v-model="user.sex"></user-sex>
        </view>
      </view>
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'person-filled'}" title="昵称" :rightText="user.nickName" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'phone-filled'}" title="手机号码"
        :rightText="user.phonenumber" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'email-filled'}" title="邮箱" :rightText="user.email" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'auth-filled'}" title="岗位" :rightText="postGroup" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'staff-filled'}" title="角色" :rightText="roleGroup" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'calendar-filled'}" title="创建日期"
        :rightText="user.createTime" />
    </uni-list>
  </view>
</template>

<script>
  import {
    getUserProfile
  } from "@/api/system/user"

  export default {
    data() {
      return {
        user: {},
        roleGroup: "",
        postGroup: ""
      }
    },
    onLoad() {
      this.getUser()
    },
    methods: {
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data.user
          // this.roleGroup = response.data.roleGroup
          this.postGroup = response.data.postGroup


          var groups = response.data.roles
          this.roleGroup = groups.toString()
        })
      }
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #ffffff;
  }

  .avatar-wrap {
    margin: 10px auto;
    position: relative;
    width: 100px;

    .sex-wrap {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
</style>
