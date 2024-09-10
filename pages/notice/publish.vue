<template>
  <view class="page">
    <u--form v-model="form">
      <view style="padding: 9px;">
        <u-form-item prop="noticeType" borderBottom>
          <u-radio-group v-model="form.noticeType" activeColor="orange">
            <u-radio :label="item.dictLabel" :name="item.dictValue" class="margin-right-xl"
              v-for="item in options.sys_notice_type"></u-radio>
          </u-radio-group>
        </u-form-item>
      </view>

      <view style="padding: 9px;">
        <u-input placeholder="填写标题" maxlength="20" border="none" v-model="form.noticeTitle"></u-input>
      </view>
      <up-line></up-line>

      <view class="">
        <sp-editor :toolbarConfig="toolbarConfig" @upinImage="upinImage" @input="handleInput"></sp-editor>
      </view>
    </u--form>

    <view class="btn-send">
      <u-button :disabled="loading" type="primary" shape="circle" @click="submit()">发布</u-button>
    </view>

  </view>
</template>

<script setup>
  import {
    addNotice
  } from '@/api/system/notice.js'
  import upload from '@/utils/upload';
  import {
    getCurrentInstance,
    reactive,
    ref
  } from 'vue';
  const {
    proxy
  } = getCurrentInstance()
  const toolbarConfig = reactive({
    excludeKeys: ['lineHeight', 'date', 'scriptSub', 'scriptSuper', 'direction', 'undo', 'redo', 'export',
      'letterSpacing', 'marginTop', 'marginBottom'
    ]
  })
  const form = reactive({
    noticeTitle: '',
    noticeContent: '',
    noticeType: '1'
  })
  const options = reactive({
    sys_notice_type: []
  })
  var dictParams = ['sys_notice_type']

  proxy.getDicts(dictParams).then((response) => {
    response.data.forEach((element) => {
      options[element.dictType] = element.list
    })
  })
  const loading = ref(false)

  function submit() {
    if (uni.$u.test.isEmpty(form.noticeContent) && uni.$u.test.isEmpty(form.noticeTitle)) {
      proxy.$modal.msg('内容或标题不能为空')
      return
    }
    loading.value = true
    addNotice(form).then(res => {
      const {
        code,
        data
      } = res
      proxy.$modal.msg('发布成功')
      uni.redirectTo({
        url: '/pages/notice/details?noticeid=' + data
      })
    }).finally(() => {
      loading.value = false
    })
  }
  /**
   * 直接运行示例工程插入图片无法正常显示的看这里
   * 因为插件默认采用云端存储图片的方式
   * 以$emit('upinImage', tempFiles, this.editorCtx)的方式回调
   * @param {Object} tempFiles
   * @param {Object} editorCtx
   */
  function upinImage(tempFiles, editorCtx) {
    /**
     * 本地临时插入图片预览
     * 注意：这里仅是示例本地图片预览，因为需要将图片先上传到云端，再将图片插入到编辑器中
     * 正式开发时，还请将此处注释，并解开下面 使用 uniCloud.uploadFile 上传图片的示例方法 的注释
     * @tutorial https://uniapp.dcloud.net.cn/api/media/editor-context.html#editorcontext-insertimage
     */
    // // #ifdef MP-WEIXIN
    // // 注意微信小程序的图片路径是在tempFilePath字段中
    // editorCtx.insertImage({
    //   src: tempFiles[0].tempFilePath,
    //   width: "80%", // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
    //   success: function() {},
    // });
    // // #endif

    // // #ifndef MP-WEIXIN
    // editorCtx.insertImage({
    //   src: tempFiles[0].path,
    //   width: "80%", // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
    //   success: function() {},
    // });
    // // #endif

    /**
     * 使用 uniCloud.uploadFile 上传图片的示例方法（可适用多选上传）
     * 正式开发环境中，请将上面 本地临时插入图片预览 注释后，模仿以下写法
     */
    tempFiles.forEach(async (item) => {
      uni.showLoading({
        title: '上传中请稍后',
        mask: true
      })
      // let upfile = await uniCloud.uploadFile({
      //   filePath: item.path,
      //   // 同名会导致报错 policy_does_not_allow_file_overwrite
      //   // cloudPath可由 想要存储的文件夹/文件名 拼接，若不拼文件夹名则默认存储在cloudstorage文件夹中
      //   cloudPath: `cloudstorage/${item.name}`,
      //   cloudPathAsRealPath: true
      // })
      upload({
        filePath: item.path,
        url: '/common/UploadFile'
      }).then(res => {
        if (res.code == 200) {
          editorCtx.insertImage({
            src: res.data.url,
            width: '80%', // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
            success: function() {
              uni.hideLoading()
            }
          })
        }
      })

    })
  }

  function handleInput(e) {
    form.noticeContent = e.html
  }
</script>

<style lang="scss" scoped>
  .page {
    padding-bottom: 80px;
    background-color: #fff;
    min-height: 100vh;
  }

  .btn-send {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px;
    background-color: #fff;
    z-index: 999;
  }
</style>
