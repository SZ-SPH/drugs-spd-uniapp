<template>
  <view class="my-swiper" v-if="data.length > 0">
    <up-swiper :list="data" :show-title="showTitle" keyName="imgUrl" previousMargin="20" nextMargin="20"
      :indicator="true" circular :autoplay="true" radius="5" bgColor="#ffffff" @click="click"></up-swiper>
  </view>
</template>

<script setup>
  import {
    ref,
    defineProps
  } from 'vue';
  import {
    getBanners
  } from '@/api/common.js'
  const props = defineProps({
    adtype: {
      type: [Number]
    },
    showTitle: {
      type: [Boolean],
      default: false
    }
  })
  const data = ref([]);

  function click(e) {
    var info = data.value[e]

    if (!info) return

    switch (info.jumpType) {
      case 2:
        uni.navigateTo({
          url: info.link
        })
        break;
      case 1:
        uni.navigateTo({
          url: `/pages/common/webview/index?title=${info.title}&url=${info.link}`
        });
        break;
      default:
        break;
    }
  }
  getBanners({
    adType: props.adtype
  }).then(res => {
    const {
      list
    } = res.data
    data.value = list
  })
</script>

<style>
  .swiper-item {
    height: 100%;
  }
</style>
