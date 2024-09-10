<template>
  <view class="mine-container">
    <!--顶部个人信息栏-->
    <view class="header-section btn" :style="{'padding-top':statusBarHeight + 'px'}">
      <view class="flex justify-between" style="padding: 30px 0 10px 0;">
        <view class="flex align-center">
          <up-avatar :src="avatar" size="48"></up-avatar>
          <view v-if="name && userInfo" @click="handleToInfo" class="user-info">
            <view class="u_title text-cut">
              {{ userInfo.nickName }}
            </view>
            <view class="u_content">
              用户名：{{name}}
            </view>
          </view>
          <view v-else @click="handleToLogin" class="login-tip">
            登录/注册
          </view>
        </view>
        <view class="flex align-center user-edit" v-if="userInfo && name">
          <!-- <view class="iconfont icon-edit"></view> -->
          <u-tag plain type="info" text="编辑" color="#fff" border-color="#fff" @click="handleToEditInfo"></u-tag>
        </view>
      </view>
    </view>
    <view class="content-section">
      <view class="mine-actions grid col-3 text-center">
        <view class="action-item">
          <view>1</view>
          <text class="text text-muted">点赞</text>
        </view>
        <view class="action-item" @click="handleFans(1)">
          <view>0</view>
          <text class="text text-muted">关注</text>
        </view>
        <view class="action-item" @click="handleFans(2)">
          <view>0</view>
          <text class="text text-muted">粉丝</text>
        </view>
      </view>

      <view class="mine-actions grid col-4 text-center">
        <view class="action-item" @click="handleJiaoLiuQun">
          <view class="iconfont icon-friendfill text-pink icon"></view>
          <text class="text">交流群</text>
        </view>
        <view class="action-item" @click="handleBuilding">
          <view class="iconfont icon-service text-blue icon"></view>
          <text class="text">在线客服</text>
        </view>
        <view class="action-item" @click="handleMonent">
          <view class="iconfont icon-community text-mauve icon"></view>
          <text class="text">动态</text>
        </view>
        <view class="action-item" @click="handleBuilding">
          <view class="iconfont icon-dianzan text-green icon"></view>
          <text class="text">点赞我们</text>
        </view>
      </view>

      <view class="menu-list">
        <u-cell-group :border="false" :customStyle="{'background': '#fff'}">
          <u-cell title="我的积分" :border="false" :isLink="true" value="100" size="large">
            <template #icon>
              <view class="iconfont icon-aixin menu-icon text-pink"></view>
            </template>
          </u-cell>
          <u-cell title="账号设置" size="large" :border="false" :isLink="true" url="/pages/mine/thirdBind/index">
            <template #icon>
              <view class="iconfont icon-user menu-icon text-hotpink"></view>
            </template>
          </u-cell>
          <u-cell title="登录日志" :border="false" :isLink="true" size="large" @click="handleToLoglog">
            <template #icon>
              <view class="iconfont icon-log menu-icon text-blue"></view>
            </template>
          </u-cell>
          <!-- #ifdef H5 -->
          <u-cell title="常见问题" size="large" :border="false" :isLink="true" @click="handleHelp">
            <template #icon>
              <view class="iconfont icon-help menu-icon text-blue"></view>
            </template>
          </u-cell>
          <!-- #endif -->
          <u-cell title="关于我们" size="large" :border="false" :isLink="true" @click="handleAbout">
            <template #icon>
              <view class="iconfont icon-version menu-icon text-info"></view>
            </template>
          </u-cell>
          <u-cell title="应用设置" size="large" :border="false" :isLink="true" @click="handleToSetting">
            <template #icon>
              <view class="iconfont icon-setting menu-icon text-grey1"></view>
            </template>
          </u-cell>
        </u-cell-group>
      </view>

      <view class="text-center text-muted margin-top-lg" v-if="userInfo">
        Id: {{userInfo.userId}}
      </view>
    </view>
  </view>
</template>

<script setup>
  import storage from '@/utils/storage'
  import {
    computed,
    getCurrentInstance,
    ref
  } from "vue";
  const {
    proxy
  } = getCurrentInstance()
  import config from '@/config.js'
  import useUserStore from '@/store/modules/user';
  const useStore = useUserStore()
  const name = computed(() => {
    return useStore.name
  })

  const avatar = computed(() => {
    return useStore.avatar
  })
  const userInfo = computed(() => {
    return useStore.userInfo
  })

  const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight);
  const popup = ref(null);

  // 接收修改头像返回的emit方法
  uni.$on('refresh', () => {
    // avatar.value = store.state.user.avatar;
    console.log('资料更新了')

    useStore.getInfo()
  })

  useStore.getInfo()

  function handleToInfo() {
    uni.navigateTo({
      url: '/pages/mine/info/index'
    });
  };

  function handleToEditInfo() {
    uni.navigateTo({
      url: '/pages/mine/info/edit'
    });
  };

  function handleToSetting() {
    uni.navigateTo({
      url: '/pages/mine/setting/index'
    });
  };

  function handleToLogin() {
    uni.navigateTo({
      url: '/pages/login'
    });
  };

  function handleToLoglog() {
    uni.navigateTo({
      url: '/pages/monitor/logininfo'
    });
  }

  function handleHelp() {
    uni.navigateTo({
      url: '/pages/mine/help/index'
    });
  };

  function handleAbout() {
    uni.navigateTo({
      url: '/pages/mine/about/index'
    });
  };

  function handleJiaoLiuQun() {
    uni.showToast({
      title: 'QQ：599854767',
      mask: false,
      icon: "none",
      duration: 1000
    });
  };

  function handleMonent(val) {
    var url = '/pages/moments/my'

    uni.navigateTo({
      url: url
    })
  }

  function handleFans(val) {
    var url = '/pages/fans/index?id=' + val

    uni.navigateTo({
      url: url,
    })
  }

  function handleBuilding() {
    uni.showToast({
      title: '模块建设中~',
      mask: false,
      icon: "none",
      duration: 1000
    });
  }
</script>

<style lang="scss">
  page {
    background-color: #f5f6f7;
  }

  .user-edit {
    margin-left: 10px;
    margin-top: 20px;
  }

  .menu-list {
    margin: 0 10px;
    padding: 5px 0px 5px 0px;
    border-radius: 8px;
    background-color: white;
  }

  .mine-container {
    width: 100%;
    height: 100%;

    .header-section {
      padding: 15px 15px 60px 15px;
      // background-color: #3c96f3;
      color: white;
      background: linear-gradient(23deg, rgba(110, 227, 225, 0.18) 0%, #00D9F5 100%);

      .login-tip {
        font-size: 18px;
        margin-left: 10px;
      }

      .cu-avatar {
        border: 2px solid #eaeaea;

        .icon {
          font-size: 40px;
        }
      }

      .user-info {
        margin-left: 15px;

        .u_title {
          font-size: 18px;
          line-height: 30px;
          width: 150px;
        }

        .u_content {
          display: flex;
          align-items: center;
        }
      }
    }

    .content-section {
      position: relative;
      top: -40px;

      .mine-actions {
        margin: 8px 10px;
        padding: 20px 0px 10px 0px;
        border-radius: 8px;
        background-color: white;

        .action-item {
          .icon {
            font-size: 28px;
          }

          .text {
            display: block;
            font-size: 13px;
            margin: 8px 0px;
          }
        }
      }
    }
  }
</style>
