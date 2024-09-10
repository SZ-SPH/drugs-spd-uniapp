<template>
  <view class="container">
    <view class="search-bar">
      总：{{total}}

      <view class="right">
        <view class="iconfont margin-right" v-if="checkPermi(['system:config:add'])" @click="handleAdd">新增
        </view>
        <view class="iconfont icon-filter icon" @click="show = true">筛选 </view>
      </view>
    </view>
    <u-gap height="5"></u-gap>

    <view class="info-item" v-for="(item,index) in dataList" :key="index">
      <view class="info-line">
        <text class="label-name">配置id</text>
        <text>{{item.configId}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">参数名称</text>
        <text>{{item.configName}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">参数键名</text>
        <text>{{item.configKey}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">参数键值</text>
        <text>{{item.configValue}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">系统内置</text>
        <dictTag :options="options.sys_yes_no " :value="item.configType" />
      </view>

      <!--      <view class="info-line">
        <text class="label-name">创建人</text>
        <text>{{item.createBy}}</text>
      </view>

      <view class="info-line">
        <text class="label-name">更新人</text>
        <text>{{item.updateBy}}</text>
      </view> -->

      <view class="info-line">
        <text class="label-name">备注</text>
        <text>{{item.remark}}</text>
      </view>
      <view class="info-btn-wrap justify-end">
        <view class="tag-item">
          <u-tag text="编辑" plain shape="circle" icon="edit-pen" @click="handleEdit(item)"
            v-if="checkPermi(['system:config:edit'])"></u-tag>
        </view>
        <view class="tag-item">
          <u-tag text="删除" class="tag-item" plain shape="circle" type="error" icon="trash"
            v-if="checkPermi(['userinfo:delete'])" @click="handleDelete(item)"></u-tag>
        </view>
      </view>
      <u-line dashed></u-line>
    </view>
    <view class="page-footer">
      <u-empty mode="list" :marginTop="140" v-if="total == 0"></u-empty>
      <uni-pagination v-else show-icon="true" :total="total" :pageSize="queryParams.pageSize"
        :current="queryParams.pageNum" @change="getData"></uni-pagination>
    </view>

    <u-popup :show="show" mode="bottom" @close="show = false" @open="show = true">
      <view class="search-form">
        <view class="search-title">搜索</view>
        <u--form labelPosition="left" :model="queryParams" labelWidth="100px" ref="uForm">
          <u-form-item label="排序字段" prop="sort" borderBottom>
            <uni-data-select v-model="queryParams.sort" :clear="true" :localdata="options.sortOptions"
              format="{text}"></uni-data-select>
          </u-form-item>

          <u-form-item label="排序方式" prop="sortType" borderBottom ref="item1">
            <u-radio-group v-model="queryParams.sortType">
              <u-radio label="升序" name="asc" :customStyle="{marginRight: '20px'}"></u-radio>
              <u-radio label="倒序" name="desc"></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-gap height="30"></u-gap>
        </u--form>

        <view class="btn-group">
          <u-button text="重置" icon="reload" :customStyle="{marginRight: '10px'}" shape="circle" type="success"
            @click="resetQuery"></u-button>
          <u-button text="搜索" icon="search" shape="circle" type="primary" @click="handleQuery"></u-button>
        </view>
      </view>
    </u-popup>
    <u-back-top :scroll-top="scrollTop" :bottom="180"></u-back-top>
  </view>
</template>

<script>
  import {
    checkPermi
  } from '@/utils/permission.js'
  import {
    listConfig,
    delConfig,
  }
  from '@/api/system/config.js'

  export default {
    data() {
      return {
        scrollTop: 0,
        dataList: [],
        queryParams: {
          pageNum: 1,
          pageSize: 20,
          sortType: 'desc',
          sort: undefined,
        },
        total: 0,
        show: false,
        loading: false,
        options: {
          // 排序集合 格式 eg:{ label: '名称', value: 'userId'}
          sortOptions: [{
            text: '配置id',
            value: 'configId'
          }],
          sys_yes_no: [],
          sys_user_sex: []
        }
      }
    },
    onLoad() {
      this.getList()
      var dictParams = ['sys_yes_no']

      this.getDicts(dictParams).then((response) => {
        dictParams.forEach((ele) => {
          this.options[ele] = response.data.find(x => x.dictType == ele).list
        })
      })
    },
    methods: {
      checkPermi,
      getList() {
        listConfig(this.queryParams).then(res => {
          if (res.code == 200) {
            this.dataList = [...this.dataList, ...res.data.result]
            this.total = res.data.totalNum;
          }
        })
      },
      handleAdd() {
        this.$tab.navigateTo('./edit?opertype=1')
      },
      handleEdit(e) {
        this.$tab.navigateTo('./edit?opertype=2&configId=' + e.configId)
      },
      handleDelete(row) {
        const Ids = row.configId;

        this.$modal.confirm('你确定要删除吗?').then(() => {
            return delConfig(Ids);
          })
          .then(() => {
            this.handleQuery();
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
      },
      resetQuery() {
        this.$refs.uForm.resetFields()
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
        uni.stopPullDownRefresh()
        this.handleQuery()
      },
      onPageScroll(e) {
        this.scrollTop = e.scrollTop;
      }
    }
  }
</script>
<style lang="scss">
  @import "@/static/scss/page.scss";
</style>
