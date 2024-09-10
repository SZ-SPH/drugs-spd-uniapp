<template>
  <view class="container">
    <uni-datetime-picker :border="false" v-model="dateRange" type="daterange" @change="timeSelect" />
    <u-gap height="5"></u-gap>
    <view class="info-item margin-bottom-xs" v-for="(item, index) in dataList" :key="index">
      <view class="info-line">
        <text class="title">{{ item.title }}</text>
      </view>
      <view class="info-line">
        <text class="label-name">操作人</text>
        <text>{{ item.operName }}</text>
      </view>
      <view class="info-line">
        <text class="label-name">操作地址</text>
        <text>{{ item.operLocation }}({{ item.operIp }})</text>
      </view>
      <view class="info-line">
        <text class="label-name">接口地址</text>
        <text>{{ item.operUrl }}</text>
      </view>
      <view class="info-line">
        <text class="label-name">操作模块</text>
        <dictTag :options="options.sys_oper_type" :value="item.businessType" />
      </view>
      <view class="info-line">
        <text class="label-name">操作时间</text>
        <text>{{ item.operTime }}</text>
      </view>
      <view class="info-line" v-if="item.errorMsg">
        <text class="label-name">错误信息</text>
        <text class="text-danger">{{ item.errorMsg }}</text>
      </view>

      <u-collapse :border="false">
        <u-collapse-item :border="false">
          <text slot="value" class="u-page__item__title__slot-title text-blue"> </text>
          <view class="u-collapse-content">
            <view class="info-line">
              <text class="label-name">请求参数</text>
              <!--              <rich-text class="typo m-padded-lr-responsive m-padded-tb-large ql-editor"
                :nodes="item.operParam"></rich-text> -->
              <u-parse :content="item.operParam"></u-parse>
            </view>

            <view class="info-line">
              <text class="label-name">返回结果</text>
              <u-parse :content="item.jsonResult"></u-parse>
            </view>

          </view>
        </u-collapse-item>

      </u-collapse>

      <!-- <u-line dashed></u-line> -->
    </view>

    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="totalNum == 0"></u-empty>
      <uni-pagination v-else show-icon="true" :total="totalNum" :pageSize="queryParams.pageSize"
        :current="queryParams.pageNum" @change="getData"></uni-pagination>
    </view>

    <view class="text-grey padding text-center"> 共 {{ totalNum }}条数据 </view>
  </view>
</template>

<script>
  import {
    list
  } from "@/api/monitor/operlog.js";
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
        dateRange: [],
        options: {
          sys_user_sex: [],
          sys_oper_type: []
        }
      };
    },
    onReady() {
      this.queryParams.userName = useUserStore().name
      this.getList();

      var dictParams = ['sys_oper_type']

      this.getDicts(dictParams).then((response) => {
        response.data.forEach((element) => {
          this.options[element.dictType] = element.list
        })
      })

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
