<template>
  <up-image :showLoading="true" radius="3" @click="preview()" :src="realSrc" :width="`${realWidth}`"
    :height="`${realHeight}`">
    <template #error>
      <view style="font-size: 16rpx;">加载失败</view>
    </template>
  </up-image>
</template>

<script>
  import {
    isExternal,
    isArray
  } from '@/utils/common.js'
  export default {
    name: "imagePreview",
    props: {
      src: {
        type: [String, null],
        default: ''
      },
      width: {
        type: [String, Number],
        default: '50'
      },
      height: {
        type: [String, Number],
        default: '50'
      },
      shape: {
        type: String,
        default: ''
      },
      //是否可以预览
      canPreview: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      realSrc() {
        if (!this.src || this.src == null || this.src == undefined) {
          return;
        }
        let real_src = this.src.split(",");
        if (real_src && isArray(real_src)) {
          var url0 = real_src[0]
          return url0
        }
        return real_src;
      },
      realSrcList() {
        if (!this.src || this.src == null || this.src == undefined) {
          return;
        }
        let real_src_list = this.src.split(",");
        let srcList = [];
        real_src_list.forEach(item => {
          return srcList.push(item);
        });
        return srcList;
      },
      realWidth() {
        return typeof this.width == "string" ? this.width : `${this.width}px`;
      },
      realHeight() {
        return typeof this.height == "string" ? this.height : `${this.height}px`;
      }
    },
    methods: {
      preview() {
        if (!this.canPreview) return

        if (this.realSrcList) {
          uni.previewImage({
            urls: this.realSrcList,
          });
        } else {
          uni.showToast({
            title: '预览失败',
            icon: 'none'
          })
        }
      }
    }
  }
</script>

<style>

</style>
