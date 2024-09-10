<template>
  <view class="container">
    <view class="search-bar">
      总：{{total}}
      <view class="iconfont icon-filter icon" @click="show = true"> </view>
    </view>
    <u-gap height="5"></u-gap>
    <view class="info-item" v-for="(item,index) in dataList" :key="index">
      <view class="info-line align-center">
        <view class="avatar-wrap margin-right">
          <up-avatar :src="item.avatar"></up-avatar>
        </view>

        <view class="flex">
          {{item.nickName}}
          <up-copy :content="item.userName + ''">
            ({{item.userName}})
          </up-copy>
          <view class="sex-wrap">
            <user-sex v-model="item.sex"></user-sex>
          </view>
        </view>
      </view>

      <up-row>
        <up-col :span="6">
          <view class="info-line">
            <text class="label-name">用户ID</text>
            <text>{{item.userId}}</text>
          </view>
        </up-col>

        <up-col :span="6">
          <view class="info-line">
            <text class="label-name">帐号状态</text>
            <dictTag :options="statusOptions" :config="{ label: 'text' , value: 'value' }" :value="item.status" />
          </view>
        </up-col>
      </up-row>

      <up-row>
        <up-col :span="6">
          <view class="info-line">
            <text class="label-name">手机号码</text>
            <text>{{item.phonenumber}}</text>
          </view>
        </up-col>

        <up-col :span="6">
          <view class="info-line">
            <text class="label-name">用户邮箱</text>
            <up-copy :content="item.email + ''">
              {{item.email}}
            </up-copy>
          </view>
        </up-col>
      </up-row>

      <up-row>
        <up-col :span="12">
          <view class="info-line">
            <text class="label-name">登录时间</text>
            <text>{{parseTime(item.loginDate,'YYYY-MM-DD')}}</text>
          </view>
        </up-col>
      </up-row>

      <up-row>
        <up-col :span="6">
          <view class="info-line">
            <text class="label-name">登录IP</text>
            <text>{{item.loginIP || '-'}}</text>
          </view>
        </up-col>
        <up-col :span="6">
          <view class="info-line">
            <text class="label-name">登录地点</text>
            <text>{{item.city || '-'}}</text>
          </view>
        </up-col>
      </up-row>
      <view class="info-line">
        <text class="label-name">备注</text>
        <text>{{item.remark}}</text>
      </view>
      <view class="info-btn-wrap justify-end">
        <view class="tag-item" v-if="item.userId != 1">
          <u-tag text="重置密码" plain shape="circle" type="primary" @click="handleResetPwd(item)"
            v-if="checkPermi(['system:user:resetPwd'])"></u-tag>
        </view>
        <view class="tag-item" v-if="item.userId != 1">
          <u-tag text="删除" class="tag-item" plain shape="circle" type="error" v-if="checkPermi(['system:user:remove'])"
            @click="handleDelete(item)"></u-tag>
        </view>
        <view class="tag-item" v-if="item.userId != 1">
          <u-tag text="禁用" class="tag-item" plain shape="circle" type="warning"
            v-if="checkPermi(['system:user:edit']) && item.status == 0" @click="handleChangUserStatus(item, 1)"></u-tag>

          <u-tag text="启用" class="tag-item" plain shape="circle" type="primary"
            v-if="checkPermi(['system:user:edit']) && item.status == 1" @click="handleChangUserStatus(item, 0)"></u-tag>
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
          <u-form-item label="用户状态" prop="status" borderBottom>
            <u-radio-group v-model="queryParams.status">
              <u-radio label="正常" :name="0" :customStyle="{marginRight: '20px'}"></u-radio>
              <u-radio label="禁用" :name="1"></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-gap height="30"></u-gap>

          <u-form-item label="用户ID" prop="userId" borderBottom ref="item1">
            <u--input v-model="queryParams.userId" border="none" placeholder="请输入用户ID"></u--input>
          </u-form-item>

          <u-form-item label="用户名" prop="userName" borderBottom ref="item1">
            <u--input v-model="queryParams.userName" border="none" placeholder="请输入用户账号"></u--input>
          </u-form-item>

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

<script setup>
  import {
    checkPermi
  } from '@/utils/permission.js'
  import {
    listUser,
    delUser,
    resetUserPwd,
    changeUserStatus
  }
  from '@/api/system/user.js'
  import dayjs from 'dayjs';
  import {
    getCurrentInstance,
    reactive,
    ref,
    toRefs
  } from 'vue';
  const {
    proxy
  } = getCurrentInstance()
  const scrollTop = ref(0)

  const dataList = ref([])
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    sortType: 'desc',
    sort: undefined,
    userId: undefined,
    deptId: undefined,
    userName: undefined,
    nickName: undefined,
    sex: undefined,
    delFlag: undefined,
    status: 0
  })

  const total = ref(0)
  const show = ref(false)
  const loading = ref(false)
  const options = reactive({
    // 用户类型（00系统用户）选项列表 格式 eg:{ label: '标签', value: '0'}
    userTypeOptions: [],
    statusOptions: [{
        text: '正常',
        value: '0',
        cssClass: 'text-success'
      },
      {
        text: '停用',
        value: '1'
      }
    ],
    sortOptions: [{
        text: '用户id',
        value: 'userId'
      },
      {
        text: '登录时间',
        value: 'u.update_time'
      }
    ]
  })

  const {
    sortOptions,
    statusOptions,
    userTypeOptions
  } = toRefs(options)

  function getList() {
    listUser(queryParams).then(res => {
      if (res.code == 200) {

        dataList.value = [...dataList.value, ...res.data.result]
        total.value = res.data.totalNum;
        // this.loading = false;
      }
    })
  }

  function handleAdd() {
    proxy.$tab.navigateTo('./edit?opertype=1')
  }

  function handleEdit(e) {
    proxy.$tab.navigateTo('./edit?opertype=2&userId=' + e.id)
  }

  function handleDelete(row) {
    const Ids = row.userId;

    proxy.$modal.confirm('你确定要删除吗?').then(() => {
        return delUser(Ids);
      })
      .then(() => {
        handleQuery();
        proxy.$modal.msgSuccess("删除成功");
      })
  }

  function handleChangUserStatus(row, status) {
    let text = status == '0' ? '启用' : '停用'

    proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(() => {
        return changeUserStatus(row.userId, status);
      })
      .then(() => {
        handleQuery();
        proxy.$modal.msgSuccess(text + "成功");
      })
  }

  function resetQuery() {
    proxy.$refs.uForm.resetFields()
  }

  function handleQuery() {
    queryParams.pageNum = 1;
    dataList.value = []
    uni.startPullDownRefresh();
    getList()
    show.value = false
  }

  function handleResetPwd(row) {
    var pwd = randomPwd(6)

    uni.showModal({
      title: `是否将密码重置为${pwd}`,
      success: ((res) => {
        if (res.confirm) {
          resetUserPwd(row.userId, pwd).then((result) => {
            if (result.code == 200) {
              uni.showModal({
                title: '重置密码成功',
                content: `密码已被重置为${pwd}`,
                showCancel: false,
                success() {
                  uni.setClipboardData({
                    data: pwd,
                    success: function() {
                      console.log('success');
                    }
                  });
                }
              })
            }
          })
        }
      })
    })
  }

  function randomPwd(length = 8) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }

  function getData(e) {
    queryParams.pageNum = e.current
    getList()
  }

  function onPullDownRefresh() {
    uni.stopPullDownRefresh()
    handleQuery()
  }

  function onPageScroll(e) {
    scrollTop.value = e.scrollTop;
  }
  handleQuery()
</script>

<style lang="scss">
  @import "@/static/scss/page.scss";

  .container {
    padding-bottom: 20px;
  }

  .avatar-wrap {
    position: relative;

    .sex-wrap {
      position: absolute;
      bottom: 0;
      right: -10px;
    }
  }
</style>
