<template>
  <view class="container">
    <qf-image-cropper :width="500" :height="500" :src="imageSrc" :radius="0" @crop="handleCrop"></qf-image-cropper>
  </view>
</template>

<script setup>
  import config from '@/config'
  import useUserStore from '@/store/modules/user'
  import {
    uploadAvatar
  } from "@/api/system/user"
  import {
    computed
  } from 'vue';

  const imageSrc = computed(() => {
    return useUserStore().avatar
  })

  function handleCrop(res) {
    // uni.previewImage({
    //   urls: [e.tempFilePath],
    //   current: 0
    // });
    let data = {
      name: 'picture',
      filePath: res.tempFilePath
    }
    uploadAvatar(data).then(response => {
      useUserStore().saveAvatar(response.data.imgUrl)
      uni.showToast({
        title: "修改成功",
        icon: 'success'
      })
      uni.$emit('refresh');
      uni.navigateBack();
    })
  }
</script>
