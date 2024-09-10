<template>
  <view class="u-page">
    <up-toast ref="uToastRef"></up-toast>
    <view class="u-demo-block">
      <view class="u-demo-block__content">
        <up-row customStyle="margin-bottom: 10px">
          <up-col span="12">
            <view class="bg-purple-light">
              <up-list>
                <up-list-item v-for="(item, index) in indexList" :key="index">
                  <up-cell @click="handleRouteClick(item)" :title="`入库单号：${item.receiptCode}`">
                  </up-cell>
                </up-list-item>
              </up-list>
            </view>
          </up-col>
        </up-row>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    listWarehouseReceipt
  } from '@/api/scaninfo/index'

  import {
    ref,
    reactive
  } from 'vue';

  import {
    onLoad,
    onShow
  } from '@dcloudio/uni-app';

  const indexList = reactive([]);

  onLoad(() => {
    initIndexList()
  });

  const uToastRef = ref(null)


  const handleRouteClick = (params) => {
    console.log(params)
  }

  const showToast = (params) => {
    uToastRef.value.show({
      ...params,
      complete() {
        params.url && uni.navigateTo({
          url: params.url
        });
      }
    })
  }

  const initIndexList = () => {
    listWarehouseReceipt({
      page: 1,
      size: 999999999,
      sort: '',
      sortType: 'desc'
    }).then(res => {
      showToast({
        type: 'success',
        message: "处理成功",
      })
      indexList.push(...res.data.result);
    })
  }
</script>

<style lang="scss">
  .wrap {
    padding: 12px;
  }

  .demo-layout {
    height: 25px;
    border-radius: 4px;
  }

  .bg-purple {
    background: #CED7E1;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }
</style>
