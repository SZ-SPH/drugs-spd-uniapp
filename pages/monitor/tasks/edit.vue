<template>
  <view class="edit-wrap">
    <view class="edit-form">
      <u--form labelPosition="left" :model="form" labelWidth="110px" :rules="rules" ref="uForm">

        <u-form-item label="任务id" prop="id" v-if="opertype != 1">
          <u--input type="number" v-model.number="form.id" placeholder="请输入任务id" :disabled="opertype != 1"></u--input>
        </u-form-item>

        <u-form-item label="任务名称" prop="name">
          <u--input v-model="form.name" placeholder="请输入任务名称" :disabled="opertype == 3" />
        </u-form-item>
        <u-form-item label="任务类型" prop="taskType">
          <dictTag :options="options.sys_job_type" :value="form.taskType" />
        </u-form-item>

        <u-form-item label="任务分组" prop="jobGroup">
          <uni-data-select v-model="form.jobGroup" :clear="true" :localdata="options.sys_job_group"
            format="{label}"></uni-data-select>
        </u-form-item>

        <u-form-item label="触发器类型" prop="triggerType">
          <uni-data-select v-model.number="form.triggerType" :clear="true" :localdata="triggerTypeOptions"
            format="{label}"></uni-data-select>
        </u-form-item>

        <u-form-item label="时间表达式" prop="cron">
          <u--input v-model="form.cron" placeholder="请输入时间表达式" />
        </u-form-item>

        <template v-if="form.taskType == 1">
          <u-form-item label="程序集名称" prop="assemblyName">
            <u--input v-model="form.assemblyName" placeholder="请输入程序集名称" />
          </u-form-item>

          <u-form-item label="任务所在类" prop="className">
            <u--input v-model="form.className" placeholder="请输入任务所在类" />
          </u-form-item>
        </template>
        <u-form-item label="执行次数" prop="runTimes">
          <u--input v-model.number="form.runTimes" placeholder="请输入执行次数" disabled="" />
        </u-form-item>

        <u-form-item label="开始时间" prop="beginTime">
          <uni-datetime-picker v-model="form.beginTime" :disabled="opertype == 3" />
        </u-form-item>

        <u-form-item label="结束时间" prop="endTime">
          <uni-datetime-picker v-model="form.endTime" :disabled="opertype == 3" />
        </u-form-item>

        <u-form-item label="执行间隔时间" prop="intervalSecond" v-if="form.triggerType == 0">
          <u--input v-model.number="form.intervalSecond" placeholder="请输入执行间隔时间" :disabled="opertype == 3" />
        </u-form-item>

        <u-form-item label="是否启动" prop="isStart">
          <dictTag :options="isStartOptions" :value="form.isStart" />
        </u-form-item>

        <u-form-item label="最后执行时间" prop="lastRunTime">
          {{form.lastRunTime}}
        </u-form-item>

        <u-form-item label="请求方法" prop="requestMethod" v-if="parseInt(form.taskType) == 2">
          <u-radio-group v-model="form.requestMethod">
            <u-radio v-for="item in requestMethodOptions" :name="item.value" :key="item.value"
              class="margin-right-xl">{{item.label}}</u-radio>
          </u-radio-group>
        </u-form-item>

        <u-form-item label="api执行地址" prop="apiUrl" v-if="parseInt(form.taskType) == 2">
          <u--input v-model="form.apiUrl" placeholder="请输入api执行地址">
            <uni-data-select v-model="form.requestMethod" :clear="true" :key="{value}" :localdata="requestMethodOptions"
              format="{label} - {value}"></uni-data-select>
          </u--input>
        </u-form-item>

        <u-form-item label="执行sql" prop="sqlText" v-if="parseInt(form.taskType) == 3">
          <u--textarea v-model="form.sqlText" placeholder="请输入内容"></u--textarea>
        </u-form-item>

        <u-form-item label="传入参数" prop="jobParams">
          <u--input v-model="form.jobParams" placeholder="请输入传入参数" />
        </u-form-item>

        <u-form-item label="任务描述" prop="remark">
          <u--input v-model="form.remark" placeholder="请输入任务描述" />
        </u-form-item>

      </u--form>
    </view>
    <view class="form-footer">
      <view class="btn_wrap">
        <view class="btn-item">
          <u-button text="取消" shape="circle" type="info" @click="handleCancel"></u-button>
        </view>
        <view class="btn-item" v-if="opertype != 3">
          <u-button text="确定" shape="circle" type="primary" @click="submit"></u-button>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
  import {
    getTasks,
    addTasks,
    updateTasks,
  }
  from '@/api/system/tasks.js'

  export default {
    data() {
      return {
        form: {
          name: undefined,
          id: undefined,
          jobGroup: undefined,
          triggerType: 1,
          cron: undefined,
          assemblyName: 'ZR.Tasks',
          className: undefined,
          runTimes: undefined,
          beginTime: undefined,
          endTime: undefined,
          intervalSecond: 1,
          isStart: undefined,
          jobParams: undefined,
          createTime: undefined,
          updateTime: undefined,
          lastRunTime: undefined,
          requestMethod: 'GET',
          apiUrl: '',
          taskType: '1',
          sqlText: '',
          remark: '',
        },
        rules: {
          name: [{
            required: true,
            message: "任务名称不能为空",
            trigger: ['change', 'blur'],

          }],
          // id: [{
          //   required: true,
          //   message: "任务id不能为空",
          //   trigger: ['change', 'blur'],

          // }],
          jobGroup: [{
            required: true,
            message: "任务分组不能为空",
            trigger: ['change', 'blur'],

          }],
          triggerType: [{
            required: true,
            message: "触发器类型不能为空",
            trigger: ['change', 'blur'],
            type: "number"
          }],
          assemblyName: [{
            required: true,
            message: "程序集名称不能为空",
            trigger: ['change', 'blur'],

          }],
          className: [{
            required: true,
            message: "任务所在类不能为空",
            trigger: ['change', 'blur'],

          }],
          intervalSecond: [{
            required: true,
            message: "执行间隔时间不能为空",
            trigger: ['change', 'blur'],
            type: "number"
          }],
          // isStart: [{
          //   required: true,
          //   message: "是否启动不能为空",
          //   trigger: ['change', 'blur'],
          // }],
        },
        opertype: 0,
        // 触发器类型选项列表 格式 eg:{ label: '标签', value: '0'}
        triggerTypeOptions: [{
            label: '普通',
            value: 0
          },
          {
            label: '表达式',
            value: 1
          }
        ],
        // 是否启动选项列表 格式 eg:{ label: '标签', value: '0'}
        isStartOptions: [{
            label: '运行中',
            value: "1",
            listClass: 'success'
          },
          {
            label: '已停止',
            value: "0",
            listClass: 'danger'
          }
        ],
        // 请求方法选项列表 格式 eg:{ label: '标签', value: '0'}
        requestMethodOptions: [{
            label: 'GET',
            value: 'GET'
          },
          {
            label: 'POST',
            value: 'POST'
          }
        ],
        // 任务类型选项列表 格式 eg:{ label: '标签', value: '0'}
        taskTypeOptions: [],
        options: []
      }
    },
    onReady() {
      // 需要在onReady中设置规则
      // setTimeout(() => {
      this.$refs.uForm.setRules(this.rules)
      // }, 300)
    },
    onLoad(e) {
      this.opertype = e.opertype
      if (e.id) {
        getTasks(e.id).then(res => {
          const {
            code,
            data
          } = res
          if (code == 200) {
            this.form = {
              ...data,
            }
          }
        })
      } else {
        this.reset()
      }

      var dictParams = ["sys_job_group", "sys_job_type", ]

      this.getDicts(dictParams).then((response) => {
        dictParams.forEach((ele) => {
          this.options[ele] = response.data.find(x => x.dictType == ele).list
        })
      })
    },
    methods: {
      reset() {
        this.form = {
          name: undefined,
          id: undefined,
          jobGroup: undefined,
          triggerType: 1,
          cron: undefined,
          assemblyName: 'ZR.Tasks',
          className: undefined,
          runTimes: undefined,
          beginTime: undefined,
          endTime: undefined,
          intervalSecond: 1,
          isStart: undefined,
          jobParams: undefined,
          createTime: undefined,
          updateTime: undefined,
          createBy: undefined,
          updateBy: undefined,
          lastRunTime: undefined,
          requestMethod: 'GET',
          apiUrl: undefined,
          taskType: '1',
          sqlText: undefined,
          remark: undefined,
        };
      },
      submit() {
        this.$refs.uForm.validate().then(res => {
          this.$modal.msg('表单校验通过')

          if (this.form.id != undefined && this.opertype == 2) {
            updateTasks(this.form).then((res) => {
                this.$modal.msgSuccess("修改成功")
              })
              .catch(() => {})
          } else {
            addTasks(this.form).then((res) => {
                this.$modal.msgSuccess("新增成功")
              })
              .catch(() => {})
          }
        }).catch(errors => {
          this.$modal.msg('表单校验失败')
        })
      },
      handleCancel() {
        uni.navigateBack()
      },
      taskTypeSelect(e) {
        this.form.taskType = e.value
      },
      selectTriggerType(e) {
        this.form.triggerType = e.value
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "@/static/scss/page.scss";

  .tag-item {
    margin-right: 10px;
  }
</style>
