<template>
  <u-upload ref="fileUpload" :previewImage="previewImage" :fileList="fileList1" @afterRead="afterRead"
    @delete="deletePic" name="1" multiple :maxCount="limit" accept="image" :uploadText="uploadText">
    <slot>
      <view class="upload-place">
        <up-icon name="plus" size="20"></up-icon>
        <text>{{uploadText}}</text>
      </view>
    </slot>
  </u-upload>
</template>

<script setup>
  import upload from '@/utils/upload.js'
  import config from '@/config.js'
  import {
    ref,
    defineProps,
    defineEmits,
    defineExpose,
    watch,
    getCurrentInstance
  } from 'vue';
  const {
    proxy
  } = getCurrentInstance()
  const emits = defineEmits()
  const props = defineProps({
    limit: {
      type: Number,
      default: 5
    },
    uploadText: {
      type: String,
      default: ''
    },
    // 上传携带的参数
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    // 上传地址
    uploadUrl: {
      type: String,
      default: '/common/UploadFile'
    },
    modelValue: {
      type: [String, null, Array]
    },
    // 自动上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    previewImage: {
      type: Boolean,
      default: true
    }
  })

  const fileList1 = ref([])

  watch(() => props.modelValue, (val) => {
    if (val) {
      // 首先将值转为数组
      const list = Array.isArray(val) ? val : props.modelValue.split(',')
      // 然后将数组转为对象数组
      fileList1.value = list.map((item) => {
        if (typeof item === 'string') {
          item = {
            name: item,
            url: item,
            status: 'success'
          }
        }
        return item
      })
    } else {
      fileList1.value = []
      return []
    }
  }, {
    immediate: true,
    deep: true
  })

  // 删除图片
  const deletePic = (event) => {
    fileList1.value.splice(event.index, 1);
    listToString()
  };

  // 新增图片
  const afterRead = async (event) => {
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    let lists = [].concat(event.file);
    let fileListLen = fileList1.value.length;
    lists.map((item) => {
      fileList1.value.push({
        ...item,
        status: 'uploading',
        message: '上传中',
      });
    });
    for (let i = 0; i < lists.length; i++) {
      uploadFilePromise(lists[i].url).then((result) => {
        let item = fileList1.value[fileListLen];
        fileList1.value.splice(fileListLen, 1, {
          ...item,
          status: 'success',
          message: '',
          url: result,
        });
        listToString()
        fileListLen++;
      }).catch(() => {
        deletePic(event)
      });
    }
  };
  // 对象转成指定字符串分隔
  function listToString(separator = ',') {
    let strs = ''
    var list = fileList1.value
    for (const i in list) {
      strs += list[i].url + separator
    }
    var result = strs != '' ? strs.substr(0, strs.length - 1) : ''

    emits('update:modelValue', result)
    // emits('update:success', fileList1.value)
    return result
  }

  function uploadFilePromise(url) {
    return new Promise((resolve, reject) => {
      upload({
        filePath: url,
        formData: props.data,
        url: props.uploadUrl
      }).then(res => {
        if (res.code == 200) {
          resolve(res.data.url)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }
</script>
<style lang="scss">
  .upload-place {
    width: 80px;
    height: 94%;
    background-color: $uni-border-color;
    border-radius: 5px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 13px;
  }
</style>
