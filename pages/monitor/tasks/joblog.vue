<template>
  <view class="container">
    <view class="search-bar">
      <u-search :disabled="true" placeholder="请输入要搜索的内容" @click="show=true"></u-search>
    </view>
    <u-gap height="5"></u-gap>
    <view class="info-item" v-for="(item,index) in dataList" :key="index">
      <view class="info-line">
        <view class="title">
          {{item.jobName}}
        </view>
      </view>

      <view class="info-line">
        <text class="label-name">日志Id</text>
        <text>{{item.jobLogId}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">任务Id</text>
        <text>{{item.jobId}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">任务分类</text>
        <!-- <text>{{item.jobName}}</text> -->
        <dictTag :options=" options.sys_job_group " :value="item.jobGroup" />
      </view>

      <view class="info-line">
        <text class="label-name">执行状态</text>
        <dictTag :options=" options.sys_job_status " :value="item.status" />
      </view>

      <view class="info-line">
        <text class="label-name">创建时间</text>
        <text>{{item.createTime}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">调用目标字符串</text>
        <text>{{item.invokeTarget}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">执行用时</text>
        <text class="text-green">{{item.elapsed}}</text>毫秒
      </view>

      <view class="info-line">
        <text class="label-name">日志信息</text>
        <text>{{item.jobMessage}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">异常信息</text>
        <text class="text-danger">{{item.exception}}</text>
      </view>

      <view class="info-btn-wrap justify-end">
        <!-- <view class="tag-item">
          <u-tag text="详情" plain shape="circle" type="info" icon="eye" @click="handleView(item)"
            v-if="checkPermi(['business:taskslog:query'])"></u-tag>
        </view> -->
      </view>
      <u-line dashed></u-line>
    </view>
    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="total == 0"></u-empty>
      <uni-pagination v-else show-icon="true" :total="total" :pageSize="queryParams.pageSize"
        :current="queryParams.pageNum" @change="getData"></uni-pagination>
      <view class="text-grey padding text-center"> 共 {{ total }}条数据 </view>
    </view>

    <u-popup :show="show" mode="bottom" @close="show = false" @open="show = true">
      <view class="search-form">
        <view class="search-title">搜索</view>
        <u--form labelPosition="left" :model="queryParams" labelWidth="100px" ref="uForm">
          <u-form-item label="任务Id" prop="jobId" borderBottom ref="item1">
            <u--input v-model="queryParams.jobId" border="none" placeholder="请输入任务Id"></u--input>
          </u-form-item>

          <u-form-item label="任务名" prop="jobName" borderBottom ref="item1">
            <u--input v-model="queryParams.jobName" border="none" placeholder="请输入任务名"></u--input>
          </u-form-item>

          <u-form-item label="任务分组" prop="jobGroup" borderBottom ref="item2">
            <view class="tag-item">
              <u-tag text="全部" :plain="null != queryParams.jobGroup" name="" @click="queryParams.jobGroup = null">
              </u-tag>
            </view>
            <view class="tag-item" v-for="(item, index) in options.sys_job_group " :key="index">
              <u-tag :text="item.label" :plain="item.value != queryParams.jobGroup" :name="item.value"
                @click="jobGroupSelect(item)">
              </u-tag>
            </view>
          </u-form-item>

          <u-form-item label="执行状态" prop="status" borderBottom ref="item2">
            <view class="tag-item">
              <u-tag text="全部" :plain="null != queryParams.status" name="" @click="queryParams.status = null">
              </u-tag>
            </view>
            <view class="tag-item" v-for="(item, index) in options.sys_job_status " :key="index">
              <u-tag :text="item.label" :plain="item.value != queryParams.status" :name="item.value"
                @click="statusSelect(item)">
              </u-tag>
            </view>
          </u-form-item>

          <u-form-item label="时间查询">
            <uni-datetime-picker :border="false" v-model="dateRangeCreateTime" type="daterange"
              @change="createTimeSelect" />
          </u-form-item>
        </u--form>

        <view class="btn-group">
          <u-button text="重置" icon="reload" :customStyle="{marginRight: '10px'}" shape="circle" type="success"
            @click="resetQuery"></u-button>
          <u-button text="搜索" icon="search" shape="circle" type="primary" @click="handleQuery"></u-button>
        </view>
      </view>
    </u-popup>
    <u-back-top :scroll-top="scrollTop" :bottom="150"></u-back-top>
  </view>
</template>

<script>
  import {
    checkPermi
  } from '@/utils/permission.js'
  import {
    listJobLog,
  }
  from '@/api/monitor/jobLog.js'

  export default {
    data() {
      return {
        scrollTop: 0,
        dataList: [],
        queryParams: {
          pageNum: 1,
          pageSize: 20,
          sortType: 'desc',
          sort: undefined,
          jobId: undefined,
          jobName: undefined,
          jobGroup: undefined,
          status: undefined,
          createTime: undefined,
        },
        total: 0,
        show: false,
        loading: false,
        //创建时间时间范围
        dateRangeCreateTime: [],
        sortOptions: [],
        options: []
      }
    },
    onLoad(e) {
      if (e) {
        this.queryParams.jobId = e.id
      }
      var dictParams = ["sys_job_group", "sys_job_status", ]

      this.getDicts(dictParams).then((response) => {
        dictParams.forEach((ele) => {
          this.options[ele] = response.data.find(x => x.dictType == ele).list
        })
      })
      this.getList()
    },
    methods: {
      checkPermi,
      getList() {
        this.addDateRange(this.queryParams, this.dateRangeCreateTime, 'CreateTime');
        listJobLog(this.queryParams).then(res => {
          if (res.code == 200) {
            this.dataList = res.data.result;
            this.total = res.data.totalNum;
            this.loading = false;
          }
        })
      },
      handleView(e) {
        this.$tab.navigateTo('./edit?opertype=3&jobLogId=' + e.id)
      },
      resetQuery() {
        this.$refs.uForm.resetFields()
        this.dateRangeCreateTime = []
      },
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.dataList = []
        uni.startPullDownRefresh();
        this.getList()
        this.show = false
      },
      getData(e) {
        this.queryParams.pageNum = e.current
        this.getList()
      },
      onPullDownRefresh() {
        uni.stopPullDownRefresh()
        this.handleQuery()
      },
      jobGroupSelect(e) {
        this.queryParams.jobGroup = e.value
      },
      statusSelect(e) {
        this.queryParams.status = e.value
      },
      createTimeSelect(e) {
        this.createTime = e
      },
      onPageScroll(e) {
        this.scrollTop = e.scrollTop;
      }
    }
  }
</script>

<style lang="scss">
  @import "@/static/scss/page.scss";

  .container {
    padding-bottom: 20px;
  }
</style>
