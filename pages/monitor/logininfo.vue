<template>
  <view class="container">
    <uni-datetime-picker :border="false" v-model="dateRange" type="daterange" @change="timeSelect" />
    <u-gap height="5"></u-gap>
    <view class="info-item margin-bottom-xs" v-for="(item, index) in dataList" :key="index">
      <view class="info-line">
        <text class="title">{{ item.userName }}</text>
      </view>
      <view class="info-line">
        <text class="label-name">登录地址</text>
        <text class="text-green">{{ item.loginLocation }}({{ item.ipaddr }})</text>
      </view>
      <view class="info-line">
        <text class="label-name">登录时间</text>
        <text>{{ item.loginTime }}</text>
      </view>
      <view class="info-line">
        <text class="label-name">状态</text>
        <text>{{ item.msg }}</text>
      </view>
      <view class="info-line">
        <text class="label-name">设备</text>
        <text>{{ item.os }}</text>
      </view>
    </view>
    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="totalNum == 0"></u-empty>
      <uni-pagination v-else show-icon="true" :total="totalNum" :pageSize="queryParams.pageSize"
        :current="queryParams.pageNum" @change="getData"></uni-pagination>

      <view class="text-grey padding text-center"> 共 {{ totalNum }}条数据 </view>
    </view>
  </view>
</template>

<script>
  import {
    list
  } from "@/api/monitor/logininfo.js";
  import useUserStore from "@/store/modules/user";
  export default {
    data() {
      return {
        dataList: [],
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: '',
          sortType: "desc",
          sort: "",
        },
        totalNum: 0,
        dateRange: []
      };
    },
    onReady() {
      this.queryParams.userName = useUserStore().name
      this.getList();
    },
    methods: {
      getList() {
        list(this.addDateRange(this.queryParams, this.dateRange, 'Time')).then((res) => {
          const {
            code,
            data
          } = res;

          this.totalNum = data.totalNum;

          if (this.queryParams.pageNum <= 1) {
            this.dataList = data.result;
          } else {
            this.dataList = [...this.dataList, ...data.result];
          }
        })
      },
      resetQuery() {
        this.$refs.uForm.resetFields();
        this.show = false;
        this.handleQuery();
      },
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.dataList = [];
        uni.startPullDownRefresh();
        this.getList();
      },
      onPullDownRefresh() {
        uni.stopPullDownRefresh();
        this.handleQuery();
      },
      getData(e) {
        this.queryParams.pageNum = e.current
        this.getList()
      },
      timeSelect(e) {
        this.dateRange = e

        this.handleQuery()
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/static/scss/page.scss";
</style>
