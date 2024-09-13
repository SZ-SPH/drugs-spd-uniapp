<template>
  <view class="u-page">

    <uni-section title="入库单列表" type="line" padding>
      <!-- start -->
      <uni-card v-for="(item,index) in indexList" :key="index" :title="item.receiptCode" :extra="'状态：' + item?.state">
        <text class="uni-body">
          创建人：{{item.creator}}，创建时间{{item.creationTime}}
        </text>
        <view slot="actions" class="card-actions no-border">
          <view class="card-actions-item" @click="handleRouteClick(item)">
            <uni-icons type="plus" size="18" color="#999"></uni-icons>
            <text class="card-actions-item-text">扫码入库</text>
          </view>
          <view class="card-actions-item" @click="handleDeleteItem(item)">
            <uni-icons type="close" size="18" color="#999"></uni-icons>
            <text class="card-actions-item-text">删除</text>
          </view>
        </view>
      </uni-card>
      <!-- end -->
      <uni-pagination @change='handlePageSizeChange' :show-icon="true" :total="total" :value='pageNum'
        :current="current" :pageSize='pageSize' />
    </uni-section>
  </view>
</template>

<script setup>
  import {
    listWarehouseReceipt,
    deleteWarehouseReceipt
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

  //分页组件数据
  const pageSize = ref(4);
  const total = ref(0);
  const pageNum = ref(1);
  const current = ref(1);


  const handleRouteClick = (params) => {
    //处理路由跳转
    uni.navigateTo({
      url:`/pages/spd/traceItem/traceItem?id=${params.receiptId}`,
    })
  }

  const handlePageSizeChange = (data) => {
    current.value = data.current
    tableDataList({
      pageNum: current.value,
      pageSize: pageSize.value
    });
  }

  const deleteTableDataItem = (data) => {
    uni.showModal({
      title: '提示',
      content: '请确认是否要删除?',
      success: function(res) {
        if (res.confirm) {
          deleteWarehouseReceipt(data.receiptId).then((res) => {
            uni.showToast({
              title: '处理成功',
              icon: 'success',
              duration: 2000
            })
          }).catch((err) => {
            uni.showToast({
              title: err,
              icon: 'error',
              duration: 2000
            })
          }).finally(() => {
            current.value = 1
            tableDataList({
              pageNum: 1,
              pageSize: pageSize.value
            });
          })
        }
      }
    })
  }

  const handleDeleteItem = (data) => {
    deleteTableDataItem(data)
  }

  const tableDataList = ({
    pageNum,
    pageSize
  }) => {
    uni.showLoading({
      title: "正在加载中"
    })
    listWarehouseReceipt({
      pageNum: pageNum,
      pageSize: pageSize,
      sort: '',
      sortType: 'asc'
    }).then(res => {
      indexList.splice(0, indexList.length, ...res.data.result);
      // indexList = res.data.result
      total.value = res.data.totalNum;
    }).finally(() => {
      uni.hideLoading();
    })
  }


  const initIndexList = () => {
    tableDataList({
      pageNum: pageNum.value,
      pageSize: pageSize.value
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

  .card-actions {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 30px;
    border-top: 1px #eee solid;
  }

  .card-actions-item {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .card-actions-item-text {
    font-size: 12px;
    color: #666;
    margin-left: 5px;
  }

  .no-border {
    border-width: 0;
  }
</style>
