<template>
  <view class="container">
    <view class="search-bar">
      <u-search placeholder="日照香炉生紫烟" v-model="queryParams.keyword"></u-search>
    </view>

    <uni-table ref="table" border emptyText="暂无更多数据" @selection-change="selectionChange">
      <uni-tr>
        <uni-th align="center" width="90">用户名</uni-th>
        <uni-th align="center" width="90">姓名</uni-th>
        <uni-th align="center" width="40">头像</uni-th>
        <!-- <uni-th align="center">性别</uni-th> -->
        <uni-th align="center">备注</uni-th>
      </uni-tr>
      <uni-tr v-for="(item, index) in dataList" :key="index">
        <uni-td align="center">{{ item.userName }}</uni-td>
        <uni-td align="center">
          {{ item.nickName }}
        </uni-td>
        <uni-td align="center">
          <u--image :showLoading="true" shape="circle" :src="item.photo" width="40px" height="40px"></u--image>
        </uni-td>

        <uni-td align="center">
          {{item.remark}}
        </uni-td>
      </uni-tr>
    </uni-table>

    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="totalNum == 0"></u-empty>
      <uni-pagination v-else show-icon="true" :total="totalNum" :pageSize="queryParams.pageSize"
        :current="queryParams.pageNum" @change="getData"></uni-pagination>

      <view class="text-grey padding text-center"> 共 {{ totalNum }}条数据 </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        scrollTop: 0,
        dataList: [{
            nickName: 'xxx',
            userName: '用户名',
            addTime: '21点24分',
            sex: 1,
            remark: '我是备注，我是备注',
            photo: 'https://cdn.uviewui.com/uview/album/1.jpg'
          },
          {
            nickName: 'bbb',
            userName: '用户名',
            addTime: '21点24分',
            sex: 1,
            remark: '我是备注，我是备注'
          },
          {
            nickName: 'aaa',
            userName: '用户名',
            addTime: '21点24分',
            sex: 1,
            remark: '我是备注，我是备注'
          },
          {
            nickName: 'ddd',
            userName: '用户名',
            addTime: '21点24分',
            sex: 2,
            remark: '我是备注，我是备注'
          },
          {
            nickName: 'eee',
            userName: '用户名',
            addTime: '21点24分',
            sex: 0,
            remark: '我是备注，我是备注'
          },
          {
            nickName: 'fff',
            userName: '用户名',
            addTime: '21点24分',
            sex: 1,
            remark: '我是备注，我是备注'
          }
        ],
        queryParams: {
          pageNum: 1,
          pageSize: 20,
          sex: 1,
          userName: undefined,
          keyword: undefined,
          sortType: 'desc',
          sort: 'id'
        },
        dateRange: [],
        totalNum: 10,
        loadStatus: 'more',
        show: false,
        showSort: false,
        actions: [{
            text: '添加时间',
            value: 'addTime'
          },
          {
            text: 'id',
            value: 'id'
          }
        ]
      }
    },
    onLoad() {
      this.getList()
    },
    methods: {
      getList() {},
      handleEdit(e) {
        this.$tab.navigateTo('/pages/demo/table/edit/edit?id=' + e.id)
      },
      handleDelete(e) {
        this.$modal.confirm('你确定要删除吗?').then(() => {
          console.log('点了确定')
        })
      },
      resetQuery() {
        this.$refs.uForm.resetFields()
        this.show = false
        this.handleQuery()
      },
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.dataList = []
        uni.startPullDownRefresh();
        this.getList()
        this.show = false
      },
      getData(e) {
        this.queryParams.pageNum = e.current
        this.getList()
      },
      onPullDownRefresh() {
        console.log('refresh')
        uni.stopPullDownRefresh()
        this.handleQuery()
      },
      sortSelect(e) {
        this.queryParams.sort = e
      },
      timeSelect(e) {
        this.dateRange = e
        console.log(e)
      },
      onPageScroll(e) {
        this.scrollTop = e.scrollTop;
      },
      selectionChange() {}
    }
  }
</script>

<style lang="scss">
  @import "@/static/scss/page.scss";

  .container {
    // padding-bottom: 20px;
  }

  .uni-table {
    min-width: unset !important;
  }

  // @import url("@/static/scss/page.scss");
</style>
