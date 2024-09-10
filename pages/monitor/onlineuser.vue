<template>
  <view class="container">
    <u-gap height="5"></u-gap>
    <view class="info-item" style="margin-bottom: 5px;" v-for="(item, index) in dataList" :key="index">
      <view class="info-line">
        <text class="title">{{ item.name }}</text>
      </view>

      <view class="info-line">
        <text class="label-name">登录时间</text>
        <text>{{ item.loginTime }}</text>
      </view>
      <view class="info-line">
        <text class="label-name">登录地点</text>
        <text>{{ item.userIP }}({{item.location}})</text>
      </view>

      <view class="info-line">
        <text class="label-name">登录浏览器</text>
        <text>{{ item.browser }}</text>
      </view>

      <view class="info-line">
        <text class="label-name">登录平台</text>
        <u-tag :text="item.platform" plain size="mini"></u-tag>
      </view>

      <view class="info-line">
        <text class="label-name">在线时长</text>
        <text>{{ item.onlineTime }}分钟</text>
      </view>

      <view class="info-btn-wrap justify-end">
        <view class="tag-item" v-if="myConnId != item.connnectionId">
          <u-tag text="强制退出" plain shape="circle" type="error" icon="lock" @click="handleToLock(item)"
            v-if="checkPermi(['monitor:online:forceLogout'])"></u-tag>
        </view>
      </view>

    </view>

    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="totalNum == 0"></u-empty>
      <uni-pagination v-else show-icon="true" :total="totalNum" :pageSize="queryParams.pageSize"
        :current="queryParams.pageNum" @change="getData"></uni-pagination>
    </view>

    <u-modal :show="show" @confirm="submit" @close="show = false" :closeOnClickOverlay="true">
      <view class="slot-content">
        <u-form>
          <u--input placeholder="请输入剔出原因" border="surround" v-model="form.reason"></u--input>
        </u-form>
      </view>
    </u-modal>
  </view>
</template>

<script setup>
  import {
    listOnline,
    forceLogout
  } from '@/api/monitor/online.js'
  import {
    checkPermi,
    checkRole
  } from '@/utils/permission.js'
  import {
    onPullDownRefresh
  } from '@dcloudio/uni-app'
  import useSocketStore from '@/store/modules/socket'
  import {
    computed,
    getCurrentInstance,
    reactive,
    ref
  } from 'vue'

  const queryParams = reactive({
    pageNum: 1,
    pageSize: 20
  })
  const {
    proxy
  } = getCurrentInstance()
  const totalNum = ref(0)
  const dataList = ref([])
  const show = ref(false)
  const form = reactive({
    reason: '',
    time: 1,
    userId: undefined,
    connnectionId: undefined,
    clientId: ''
  })
  const myConnId = computed(() => {
    return useSocketStore().connId
  })

  function getList() {
    listOnline(queryParams).then((res) => {
      const {
        code,
        data
      } = res
      if (res.code == 200) {
        totalNum.value = data.totalNum;

        if (queryParams.pageNum <= 1) {
          dataList.value = data.result;
        } else {
          dataList.value = [...dataList.value, ...data.result];
        }
      }
    })
  }

  function handleToLock(item) {
    show.value = true
    form.userId = item.userid
    form.connnectionId = item.connnectionId
    form.clientId = item.name
  }

  function submit() {
    show.value = false
    if (form.connnectionId == myConnId.value) {
      proxy.$modal.msg('不能剔出自己');
      return
    }
    forceLogout(form).then(res => {
      proxy.$modal.msg('剔出成功')
      getList()
    })
  }

  function getData(e) {
    queryParams.pageNum = e.current
    getList()
  }
  /**
   * 下拉刷新回调函数
   */
  onPullDownRefresh(() => {
    getList()
    uni.stopPullDownRefresh()
  })
  getList()
</script>

<style scoped lang="scss">
  @import "@/static/scss/page.scss";
</style>
