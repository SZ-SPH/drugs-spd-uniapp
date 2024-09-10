<template>
  <view class="edit-wrap">
    <view class="edit-form">
      <u--form labelPosition="left" :model="form" labelWidth="90px" :rules="rules" ref="uForm">

        <u-form-item label="配置id" prop="configId" v-if="opertype != 1">
          <u--input type="number" v-model.number="form.configId" placeholder="请输入配置id" :disabled="true" />
        </u-form-item>

        <u-form-item label="参数键名" prop="configKey">
          <u--input v-model="form.configKey" placeholder="请输入参数键名" />
        </u-form-item>

        <u-form-item label="参数名称" prop="configName">
          <u--input v-model="form.configName" placeholder="请输入参数名称" />
        </u-form-item>

        <u-form-item label="参数键值" prop="configValue">
          <u--input v-model="form.configValue" placeholder="请输入参数键值" />
        </u-form-item>

        <u-form-item label="系统内置" prop="configType">
          <uni-data-select v-model="form.configType" :clear="true" :localdata="options.sys_yes_no"
            format="{label} - {value}"></uni-data-select>
        </u-form-item>

        <u-form-item label="备注" prop="remark">
          <u--textarea v-model="form.remark" placeholder="请输入内容" count></u--textarea>
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
    getConfig,
    addConfig,
    updateConfig,
  }
  from '@/api/system/config.js'

  export default {
    data() {
      return {
        form: {
          configId: undefined,
          configName: undefined,
          configKey: undefined,
          configValue: undefined
        },
        rules: {
          xxx: {},
          configName: [{
            required: true,
            message: "参数名称不能为空",
            trigger: ['change', 'blur'],

          }],
          configKey: [{
            required: true,
            message: "参数键名不能为空",
            trigger: ['change', 'blur'],

          }],
          configValue: [{
            required: true,
            message: "参数键值不能为空",
            trigger: ['change', 'blur'],

          }],
        },
        opertype: 0,
        options: []
      }
    },
    onReady() {
      // 需要在onReady中设置规则
      setTimeout(() => {
        this.$refs.uForm.setRules(this.rules)
      }, 300)
    },
    onLoad(e) {
      var dictParams = ['sys_yes_no']

      this.getDicts(dictParams).then((response) => {
        dictParams.forEach((ele) => {
          this.options[ele] = response.data.find(x => x.dictType == ele).list
        })
      })
      this.opertype = e.opertype
      if (e.configId) {
        getConfig(e.configId).then(res => {
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
    },
    methods: {
      reset() {
        this.form = {
          configId: undefined,
          configName: undefined,
          configKey: undefined,
          configValue: undefined,
          configType: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          remark: undefined,
        };
      },
      submit() {
        this.$refs.uForm.validate().then(res => {
          this.$modal.msg('表单校验通过')

          if (this.form.configId != undefined && this.opertype == 2) {
            updateConfig(this.form).then((res) => {
                this.$modal.msgSuccess("修改成功")
              })
              .catch(() => {})
          } else {
            addConfig(this.form).then((res) => {
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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "@/static/scss/page.scss";
</style>
