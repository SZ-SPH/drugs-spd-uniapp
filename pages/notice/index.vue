<template>
  <view class="page">
    <u-list>
      <u-empty mode="list" :marginTop="140" v-if="list.length == 0"></u-empty>
      <u-list-item v-for="(item, index) in list" :key="index">
        <view class="item-cell" @click="handleToDetails(item)">
          <!-- <view class="left">
            <view class="icon-wrap">
              <up-icon name="volume" size="26" color="#3c9cff"></up-icon>
            </view>
          </view> -->
          <view class="right">
            <view class="right-top ">
              <dictTag :options="options.sys_notice_type" :value="item.noticeType" />
              <u--text :lines="2" :text="item.noticeTitle" margin="5px"></u--text>
            </view>
            <view class="right-bm u-flex-between">
              <view class="content one-ellipsis">

              </view>
              <view>
                {{dayjs(item.createTime).format('YYYY-MM-DD')}}
              </view>
            </view>
          </view>
        </view>
        <view class="info-btn-wrap justify-end">
          <view class="tag-item">
            <u-tag text="删除" plain shape="circle" type="error" @click="handleDelete(item)"
              v-if="checkPermi(['system:notice:delete'])"></u-tag>
          </view>
        </view>
        <up-gap :height="5"></up-gap>
      </u-list-item>
    </u-list>
    <!-- #ifdef H5 -->
    <uni-fab ref="fab" v-if="checkPermi(['system:notice:add'])" :popMenu="false" size="small" horizontal="right"
      vertical="bottom" direction="horizontal" @fabClick="handlePublish" />
    <!-- #endif -->
  </view>
</template>

<script setup>
  import {
    queryNotice,
    delNotice
  } from '@/api/system/notice.js'
  import {
    onPullDownRefresh
  } from '@dcloudio/uni-app'
  import dayjs from 'dayjs'
  import {
    checkPermi
  } from '@/utils/permission.js'
  import {
    getCurrentInstance,
    reactive,
    ref
  } from 'vue';
  const {
    proxy
  } = getCurrentInstance()
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 20,
    totalPage: 0
  })

  const list = ref([])
  const totalNum = ref(0)
  const loading = ref(false)
  const options = reactive({
    sys_notice_type: []
  })
  var dictParams = ['sys_notice_type']

  proxy.getDicts(dictParams).then((response) => {
    response.data.forEach((element) => {
      options[element.dictType] = element.list
    })
  })

  function init(page) {
    queryNotice(queryParams).then(res => {
      const {
        code,
        data
      } = res
      if (code == 200) {
        list.value = data
      }
      uni.stopPullDownRefresh()
    })
  }
  onPullDownRefresh(() => {
    init(1)
    uni.stopPullDownRefresh()
  })

  function handleToDetails(item) {
    uni.navigateTo({
      url: '/pages/notice/details?noticeid=' + item.noticeId
    })
  }

  function handlePublish() {
    uni.navigateTo({
      url: '/pages/notice/publish'
    })
  }

  function handleDelete(item) {
    proxy.$modal.confirm('确认要删除吗?').then(() => {
        return delNotice(item.noticeId);
      })
      .then(() => {
        init(1)
        proxy.$modal.msgSuccess("删除成功");
      })

  }
  init(1)
</script>

<style lang="scss">
  @import "@/static/scss/page.scss";

  .info-btn-wrap {
    background-color: #fff;
    display: flex;
    // border-bottom: 1px solid #f4f6f8;
    padding: 3px 15px;
  }

  .item-cell {
    display: flex;
    padding: 0 5rpx;
    background-color: #fff;
    // margin: 3px 0;

    .icon-wrap {
      background: #eee;
      border-radius: 50%;
      padding: 6px;
    }

    .left {
      width: 80rpx;
      margin: auto 15rpx;
    }

    .right {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 5px;
    }

    .right-top {
      text-align: left;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .right-bm {
      display: flex;
      align-items: center;
      color: #ccc;
      margin-bottom: 10rpx;

      .content {
        width: 190px;
      }
    }
  }
</style>
