<template>
  <view class="container">
    <view class="search-bar">
      <u-button type="primary" size="small" shape="circle" icon="plus" @click="handleAdd"
        :customStyle="{'width': '80px', 'margin': '10px'}">新增</u-button>
      <u-search :disabled="true" placeholder="请输入要搜索的内容" @click="show=true"></u-search>
    </view>
    <u-line dashed></u-line>
    <view class="info-item" v-for="(item,index) in dataList" :key="index">
      <view class="info-line">
        <text class="title">{{item.nickName}}</text>
      </view>
      <view class="info-line2">
        <text class="label-name">用户名(可复制)</text>
        <text class="text-success">
          <u-parse :content="item.userName" :selectable="true"></u-parse>
        </text>
      </view>
      <view class="info-line2">
        <text class="label-name">用户性别</text>
        <dictTag :options="options.sys_user_sex" :config="{ label: 'label' , value: 'value' }" :value="item.sex" />
      </view>
      <view class="info-line2">
        <text class="label-name">头像</text>
        <imagePreview :src="item.photo"></imagePreview>
      </view>
      <view class="info-line2">
        <text class="label-name">添加时间</text>
        <text>{{item.addTime}}</text>
      </view>
      <view class="info-line2">
        <text class="label-name">备注</text>
        <text>{{item.remark}}</text>
      </view>
      <view class="info-btn-wrap justify-end">
        <view class="tag-item">
          <u-tag text="编辑" shape="circle" @click="handleEdit(item)"></u-tag>
        </view>
        <view class="tag-item">
          <u-tag text="删除" class="tag-item" shape="circle" type="error" @click="handleDelete(item)"></u-tag>
        </view>
      </view>
      <u-line dashed></u-line>
    </view>

    <uni-pagination show-icon="true" :total="totalNum" :pageSize="queryParams.pageSize" :current="queryParams.pageNum"
      @change="getData"></uni-pagination>
    <u-back-top :scroll-top="scrollTop" :bottom="150"></u-back-top>

    <u-popup :show="show" mode="top" @close="show = false" @open="show = true">
      <view class="search-form">
        <u--form labelPosition="left" :model="queryParams" labelWidth="100px" ref="uForm">
          <u-form-item label="时间查询" borderBottom>
            <uni-datetime-picker :border="false" v-model="dateRange" type="daterange" @change="timeSelect" />
          </u-form-item>
          <u-form-item label="排序字段" prop="sort" borderBottom>
            <uni-data-select v-model="queryParams.sort" :clear="true" :localdata="actions"
              @change="sortSelect"></uni-data-select>
          </u-form-item>

          <u-form-item label="排序方式" prop="sortType" borderBottom ref="item1">
            <u-radio-group v-model="queryParams.sortType">
              <u-radio label="升序" name="asc" :customStyle="{marginRight: '20px'}"></u-radio>
              <u-radio label="倒序" name="desc"></u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="用户名" prop="userName" borderBottom ref="item1">
            <u--input v-model="queryParams.userName" border="none" placeholder="请输入用户名"></u--input>
          </u-form-item>

          <u-form-item label="性别" prop="sex" borderBottom ref="item1">
            <u-radio-group v-model="queryParams.sex">
              <u-radio :label="item.label" :name="item.value" :customStyle="{marginRight: '20px'}" v-for="(item, index) in
                options.sys_user_sex" :key="item.value"></u-radio>
            </u-radio-group>
          </u-form-item>

        </u--form>

        <view class="btn-group">
          <u-button text="重置" icon="reload" :customStyle="{marginRight: '10px'}" shape="circle" type="success"
            @click="resetQuery"></u-button>
          <u-button text="搜索" icon="search" shape="circle" type="primary" @click="handleQuery"></u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        scrollTop: 0,
        dataList: [{
            nickName: '用户名',
            userName: '用户名',
            addTime: '21点24分',
            sex: 1,
            remark: '我是备注，我是备注',
            photo: 'https://cdn.uviewui.com/uview/album/1.jpg'
          },
          {
            nickName: '用户名',
            userName: '用户名',
            addTime: '21点24分',
            sex: 1,
            remark: '我是备注，我是备注'
          },
          {
            nickName: '用户名',
            userName: '用户名',
            addTime: '21点24分',
            sex: 1,
            remark: '我是备注，我是备注'
          },
          {
            nickName: '用户名',
            userName: '用户名',
            addTime: '21点24分',
            sex: 2,
            remark: '我是备注，我是备注'
          },
          {
            nickName: '用户名',
            userName: '用户名',
            addTime: '21点24分',
            sex: 0,
            remark: '我是备注，我是备注'
          },
          {
            nickName: '用户名',
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
          sortType: 'desc',
          sort: 'id'
        },
        dateRange: [],
        totalNum: 0,
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
        ],
        options: {
          sys_user_sex: [{
              label: '男',
              value: "1"
            },
            {
              label: '女',
              value: "0"
            },
            {
              label: '未知',
              value: "2"
            }
          ]
        }
      }
    },
    onLoad() {
      this.getList()

    },
    methods: {
      getList() {

      },
      handleAdd() {
        this.$tab.navigateTo('/pages/demo/table/edit/edit?opertype=1')
      },
      handleEdit(e) {
        this.$tab.navigateTo('/pages/demo/table/edit/edit?id=1')
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
      }
    }
  }
</script>

<style lang="scss">
  @import "@/static/scss/page.scss";

  .container {
    padding-bottom: 20px;
  }

  // @import url("@/static/scss/page.scss");
</style>
