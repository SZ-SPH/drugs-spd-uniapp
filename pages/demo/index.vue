<template>
  <view>
    <view class="item">
      <uni-section title="动态字典数据" type="line">
      </uni-section>

      <dictTag :options="options.sys_oper_type" :value="['0','1','5']" />
    </view>
    <view class="item">
      <uni-section title="静态自定义字典数据" type="line">
      </uni-section>

      <dictTag :options="dataList" :config="{ label: 'label' , value: 'value' }" :value="['2','3']" />

      <view>:config="{ label: 'label' , value: 'value' }"</view>
    </view>

    <view class="item">
      <uni-section title="字典数据" type="line">
      </uni-section>

      <view v-for="dict in options.sys_user_sex" :key="dict.dictValue"> {{dict.dictLabel}}</view>
    </view>
    <view class="item">
      <uni-section title="上传演示" type="line">
      </uni-section>
      <uploadImage v-model="icon"></uploadImage>
    </view>
    <view class="item">
      <uni-section title="图片演示" type="line">
      </uni-section>
      <imagePreview src="https://www.izhaorui.cn/uploads/pay.jpg,http://www.izhaorui.cn/uploads/logo.png">
      </imagePreview>
    </view>

    <view class="item">
      <uni-section title="复制" type="line"></uni-section>
      <u-button @click="handleCopy">复制</u-button>

      <u-parse content="长按可复制我" :selectable="true"></u-parse>
    </view>

    <view class="item">
      <uni-section title="弹框演示" type="line"></uni-section>
      <view class="t-btn">
        <u-button @click="handleToast(1)">toast</u-button>
        <u-button @click="handleToast(2)" type="error">错误消息</u-button>
        <u-button @click="handleToast(3)" type="success">成功消息</u-button>
        <u-button @click="handleToast(4)">alert提示消息</u-button>
        <u-button @click="handleToast(5)">show toast</u-button>
        <u-button @click="handleToast(6)">确认弹框</u-button>
      </view>
    </view>
    <view class="item">
      <uni-section title="dayjs" type="line"></uni-section>

      <view class="">
        当前时间：{{time}}
      </view>

      <view class="">
        当前时间戳：{{time2}}
      </view>
      <view class="">
        自定义时间格式：{{dayjs().format('YYYY-MM-DD')}}
      </view>
      <view class="">
        指定日期转时间戳：{{dayjs('2024-04-03').unix()}}('2024-04-03')
      </view>
    </view>

    <view class="item">
      <uni-section title="pinia使用" type="line"></uni-section>

      {{counter}}

      <u-button @click="handleIncrement">增加</u-button>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed,
    getCurrentInstance,
    toRefs,
    reactive
  } from 'vue';
  import useDemoStore from '@/store/modules/demo.js'
  import dayjs from 'dayjs';
  const {
    proxy
  } = getCurrentInstance()
  const icon = ref('')
  var dictParams = ['sys_oper_type', 'sys_user_sex']
  const state = reactive({
    options: {
      sys_user_sex: [],
      sys_oper_type: []
    }
  })
  const {
    options
  } = toRefs(state)
  proxy.getDicts(dictParams).then((response) => {
    response.data.forEach((element) => {
      state.options[element.dictType] = element.list
    })
  })
  const time = ref('')
  const time2 = ref('')
  const time3 = ref('')
  time.value = dayjs()
  time2.value = dayjs().valueOf()


  function handleCopy() {
    uni.setClipboardData({
      data: "我是复制的内容",
      success: function() {
        console.log('success');
      }
    });
  }

  function handleToast(type) {
    switch (type) {
      case 1:
        proxy.$modal.msg('toast')
        break;
      case 2:
        proxy.$modal.msgError('错误消息提示')
        break;
      case 3:
        proxy.$modal.msgSuccess('成功消息提示')
        break;
      case 4:
        proxy.$modal.alert('alert消息')
        break;
      case 5:
        proxy.$modal.showToast('toast消息 2.5秒消失')
        break;
      case 6:
        proxy.$modal.confirm('我是弹框，确认弹框')
        break;
      default:
        break;
    }
  }

  const dataList = ref([{
      label: '篮球',
      value: "1"
    },
    {
      label: '羽毛球',
      value: "2"
    },
    {
      label: '足球',
      value: "3"
    }
  ])


  const counter = computed(() => {
    return useDemoStore().count
  })

  function handleIncrement() {
    useDemoStore().increment()
  }
</script>
<style lang="scss" scoped>
  .item {
    background-color: #fff;
    padding: 0 0 20px 10px;
    margin: 5px 0;
  }

  .t-btn .u-button {

    margin-bottom: 20px;
  }
</style>
