<template>
  <view class="container">
    <view class="search-bar">
      总：{{total}}

      <view class="right">
        <!--  <view class="iconfont icon-log icon margin-right" v-if="checkPermi(['monitor:job:query'])" @click="handleLog">日志
        </view> -->
        <view class="iconfont icon-filter icon" @click="show = true">筛选 </view>
      </view>
    </view>
    <u-gap height="5"></u-gap>
    <view class="info-item info-item2" v-for="(item,index) in dataList" :key="index">
      <view class="info-line">
        <text class="title">{{item.name}}</text>
      </view>
      <view class="info-line">
        <text class="label-name">任务id</text>
        <text class="text-black">{{item.id}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">任务分组</text>
        <dictTag :options="options.sys_job_group" :value="item.jobGroup" />
      </view>

      <view class="info-line">
        <text class="label-name">时间表达式</text>
        <text class="text-black">{{item.cron}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">程序集名称</text>
        <text>{{item.assemblyName}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">任务所在类</text>
        <text class="text-black">{{item.className}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">执行次数</text>
        <text class="text-black">{{item.runTimes}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">开始时间</text>
        <text class="text-black">{{item.beginTime}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">结束时间</text>
        <text class="text-black">{{item.endTime}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">最后执行时间</text>
        <text class="text-black">{{item.lastRunTime}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">触发器类型</text>
        <dictTag :options="triggerTypeOptions" :value="item.triggerType" />
      </view>

      <view class="info-line" v-if="item.triggerType == 0">
        <text class="label-name">执行间隔时间</text>
        <text class="text-black">{{item.intervalSecond}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">是否启动</text>
        <dictTag :options="isStartOptions" :value="item.isStart" />
      </view>

      <view class="info-line">
        <text class="label-name">任务类型</text>
        <dictTag :options="options.sys_job_type" :value="item.taskType" />
      </view>

      <view class="info-line" v-if="item.taskType == 2">
        <text class="label-name">api执行地址</text>
        <text class="text-danger">{{item.requestMethod}}</text>
        <text class="text-black">{{item.apiUrl}}</text>
      </view>

      <view class="info-line" v-if="item.taskType == 3">
        <text class="label-name">执行sql</text>
        <text class="text-black">{{item.sqlText}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">传入参数</text>
        <text class="text-black">{{item.jobParams}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">任务描述</text>
        <text class="text-black">{{item.remark}}</text>
      </view>

      <view class="info-btn-wrap justify-end">
        <view class="tag-item">
          <u-tag text="详情" plain shape="circle" type="info" icon="eye" @click="handleView(item)"
            v-if="checkPermi(['monitor:job:query'])"></u-tag>
        </view>
        <view class="tag-item">
          <u-tag text="日志" plain shape="circle" type="info" icon="file-text" @click="handleLog(item)"
            v-if="checkPermi(['monitor:job:query'])"></u-tag>
        </view>
        <view class="tag-item" v-if="!item.isStart">
          <u-tag text="启动" plain shape="circle" type="success" icon="play-right" @click="handleStart(item)"
            v-if="checkPermi(['monitor:job:start'])"></u-tag>
        </view>
        <view class="tag-item" v-if="item.isStart">
          <u-tag text="停止" plain shape="circle" type="error" icon="pause" @click="handleStop(item)"
            v-if="checkPermi(['monitor:job:stop'])"></u-tag>
        </view>
        <view class="tag-item" v-if="!item.isStart">
          <u-tag text="编辑" plain shape="circle" icon="edit-pen" @click="handleEdit(item)"
            v-if="checkPermi(['monitor:job:edit'])"></u-tag>
        </view>
        <view class="tag-item" v-if="!item.isStart">
          <u-tag text="删除" class="tag-item" plain shape="circle" type="error" icon="trash"
            v-if="checkPermi(['monitor:job:delete'])" @click="handleDelete(item)"></u-tag>
        </view>
      </view>
      <u-line dashed></u-line>
    </view>
    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="total == 0"></u-empty>
      <uni-pagination v-else show-icon="true" :total="total" :pageSize="queryParams.pageSize"
        :current="queryParams.pageNum" @change="getData"></uni-pagination>
    </view>

    <u-popup :show="show" mode="bottom" @close="show = false" @open="show = true">
      <view class="search-form">
        <view class="search-title">搜索</view>
        <u--form labelPosition="left" :model="queryParams" labelWidth="100px" ref="uForm">
          <u-form-item label="排序字段" prop="sort" borderBottom>
            <uni-data-select v-model="queryParams.sort" :clear="true" :localdata="sortOptions"
              format="{label}"></uni-data-select>
          </u-form-item>

          <u-form-item label="排序方式" prop="sortType" borderBottom ref="item1">
            <u-radio-group v-model="queryParams.sortType">
              <u-radio label="升序" name="asc" :customStyle="{marginRight: '20px'}"></u-radio>
              <u-radio label="倒序" name="desc"></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-gap height="30"></u-gap>

          <u-form-item label="任务名称" prop="name" borderBottom ref="item1">
            <u--input v-model="queryParams.name" border="none" placeholder="请输入任务名称"></u--input>
          </u-form-item>

          <u-form-item label="是否启动" prop="isStart" borderBottom ref="item2">
            <view class="tag-wrap">
              <view class="tag-item">
                <u-tag text="全部" :plain="null != queryParams.isStart" name="" @click="queryParams.isStart = null">
                </u-tag>
              </view>
              <view class="tag-item" v-for="(item, index) in  isStartOptions" :key="index">
                <u-tag :text="item.label" :plain="item.value != queryParams.isStart" :name="item.value"
                  @click="isStartSelect(item)">
                </u-tag>
              </view>
            </view>
          </u-form-item>

          <u-form-item label="任务类型" prop="taskType" borderBottom ref="item2">
            <view class="tag-wrap">
              <view class="tag-item">
                <u-tag text="全部" :plain="null != queryParams.taskType" @click="queryParams.taskType = null">
                </u-tag>
              </view>
              <view class="tag-item" v-for="(item, index) in options.sys_job_type" :key="index">
                <u-tag :text="item.label" :plain="item.value != queryParams.taskType" :name="item.value"
                  @click="taskTypeSelect(item)">
                </u-tag>
              </view>
            </view>
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
    listTasks,
    delTasks,
    stopTasks,
    startTasks
  }
  from '@/api/system/tasks.js'

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
          name: undefined,
          jobGroup: undefined,
          isStart: undefined,
          taskType: undefined,
        },
        total: 0,
        show: false,
        loading: false,
        // 触发器类型选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
        triggerTypeOptions: [{
            label: '普通',
            value: '0'
          },
          {
            label: '表达式',
            value: '1'
          }
        ],
        // 是否启动选项列表
        isStartOptions: [{
            label: '运行中',
            value: '1',
            listClass: 'success'
          },
          {
            label: '已停止',
            value: '0',
            listClass: 'danger'
          }
        ],
        // 任务类型选项列表
        taskTypeOptions: [],
        sortOptions: [{
            label: '任务状态',
            value: 'isStart'
          },
          {
            label: '任务id',
            value: 'id'
          }
        ],
        options: []
      }
    },
    onLoad() {
      this.getList()

      var dictParams = ["sys_job_group", "sys_job_type", ]

      this.getDicts(dictParams).then((response) => {
        dictParams.forEach((ele) => {
          this.options[ele] = response.data.find(x => x.dictType == ele).list
        })
      })
    },
    methods: {
      checkPermi,
      getList() {
        listTasks(this.queryParams).then(res => {
          if (res.code == 200) {
            this.dataList = res.data.result;
            this.total = res.data.totalNum;
            this.loading = false;
          }
        })
      },
      handleAdd() {
        this.$tab.navigateTo('./edit?opertype=1')
      },
      handleEdit(e) {
        this.$tab.navigateTo('./edit?opertype=2&id=' + e.id)
      },
      handleView(e) {
        this.$tab.navigateTo('./edit?opertype=3&id=' + e.id)
      },
      handleLog(e) {
        if (e) {
          this.$tab.navigateTo('./joblog?id=' + e.id)
        } else {
          this.$tab.navigateTo('./joblog')
        }
      },
      handleDelete(row) {
        const Ids = row.id;

        this.$modal.confirm('你确定要删除吗?').then(() => {
            return delTasks(Ids);
          })
          .then(() => {
            this.handleQuery();
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
      },
      //停止任务
      handleStop(row) {
        stopTasks(row.id).then((response) => {
          if (response.code === 200) {
            this.$modal.msgSuccess(response.msg)

            this.getList()
          }
        })
      },
      handleStart(row) {
        startTasks(row.id).then((response) => {
          if (response.code === 200) {
            this.$modal.msgSuccess(response.msg)
            this.getList()
          }
        })
      },
      resetQuery() {
        this.$refs.uForm.resetFields()
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
      isStartSelect(e) {
        this.queryParams.isStart = e.value
      },
      taskTypeSelect(e) {
        this.queryParams.taskType = e.value
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
