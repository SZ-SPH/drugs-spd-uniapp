<template>
  <view class="page">
    <up-navbar title="发布" :autoBack="false" :placeholder="true">
      <template #left>
        <view class="font-13" @click="goBack">
          取消
        </view>
      </template>
    </up-navbar>
    <u--form label-width="110px" v-model="form">
      <view style="padding: 9px;">
        <u-input placeholder="填写标题" maxlength="20" border="none" v-model="form.title"></u-input>
      </view>
      <view class="input-wrap">
        <u-textarea placeholder="请写下这一刻的想法" :confirmType="null" count maxlength="500" height="160" type="textarea"
          border="none" v-model="form.content"></u-textarea>
      </view>
      <view class="img-wrap padding-bottom">
        <uploadImage v-model="form.coverUrl" :limit="9" v-if="form.coverUrl">
        </uploadImage>
        <uploadImage :previewImage="false" :limit="9" v-model="form.coverUrl">
          <template #default>
            <up-icon name="photo" size="25"></up-icon>
          </template>
        </uploadImage>
      </view>

      <u-line color="#eee"></u-line>
      <u-form-item label="公开可见" prop="isPublic" ref="item1" left-icon="lock-open">
        <template #right>
          <u-switch v-model="form.isPublic" size="20" :active-value="1" :inactive-value="0"></u-switch>
        </template>
      </u-form-item>
      <u-line color="#eee"></u-line>
      <u-form-item label="选择圈子" prop="categoryId" labelAlign="right" left-icon="moments">

        <template #right>
          <view class="flex" v-if="!form.categoryId">
            <text class="text-muted" @click="show = true">点击选择</text>
            <up-icon name="arrow-right"></up-icon>
          </view>
          <u-tag v-else :text="circleInfo" icon="moments" border-color="none" size="mini" plain=""
            @click="show = true"></u-tag>
        </template>
      </u-form-item>
      <u-line color="#eee"></u-line>
      <view>
        <u-form-item label="添加话题" prop="topic" ref="item2" left-icon="tags">
          <template #right>
            <u-tag :text="form.topicName" icon="tags" size="mini" plain="" v-if="form.topicName"></u-tag>
          </template>
        </u-form-item>

        <view class="topic-wrap">
          <!-- <view class="u-page__tag-item" style="color: #000;" @click="show = true">
            # 参与话题 <up-icon name="arrow-right"></up-icon>
          </view> -->
          <view class="u-page__tag-item" @click="handleTopic(item)" :class="{'active': form.topicId == item.topicId}"
            v-for="(item, index) in topicList" :key="index">
            {{item.topicName}}
          </view>
        </view>
      </view>
    </u--form>
  </view>

  <view class="btn-send">
    <u-button type="primary" shape="circle" @click="submit()">发布</u-button>
  </view>

  <u-popup :show="show" round="10px" :closeable="true" @close="show = false">
    <view class="topic-header">
      选择圈子
    </view>
    <view class="topic-list">
      <scroll-view scroll-y="true" class="scroll-wrap">
        <view class="topic-item" v-for="item in circleList" @click="handleSelectedCircle(item)">
          <view class="title flex u-flex-row" :class="{ 'text-danger': item.categoryId == form.categoryId}">
            <up-avatar :src="item.icon" size="25" shape="square"></up-avatar>
            <text class="margin-left-sm">
              {{item.name}}
            </text>
          </view>
          <view class="value">
            {{ item.articleNum}}人参与
          </view>
        </view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script setup>
  import {
    addArticle
  } from '@/api/article/moment.js'

  import {
    listArticleTopic,
    listArticleCategory
  } from '@/api/article/article.js'

  import {
    computed,
    getCurrentInstance,
    reactive,
    ref,
    toRefs,
    watch
  } from 'vue';
  import useUserStore from '@/store/modules/user';
  import storage from '@/utils/storage';
  const {
    proxy
  } = getCurrentInstance()
  const form = reactive({
    isPublic: 1,
    coverUrl: '',
    articleType: 2,
    title: '',
    content: '',
    status: '1',
    topicName: '',
    topicId: undefined,
    categoryId: undefined,
    phoneModel: uni.getSystemInfoSync().brand
  })

  function goBack() {

    if (!uni.$u.test.isEmpty(form.content) || !uni.$u.test.isEmpty(form.coverUrl)) {
      uni.showModal({
        content: '是否要放弃发布吗',
        success(val) {
          console.log(val)
          if (val.confirm) {
            uni.navigateBack()
          }
        }
      })
    } else {
      uni.navigateBack()
    }
  }

  function handleBack() {
    uni.redirectTo({
      url: '/pages/moments/my'
    })
  }
  const loading = ref(false)

  function submit() {
    if (uni.$u.test.isEmpty(form.content) && uni.$u.test.isEmpty(form.coverUrl)) {
      proxy.$modal.msg('内容或图片不能为空')
      return
    }

    loading.value = true
    addArticle(form).then((res) => {
      const {
        coe,
        data
      } = res
      proxy.$modal.msg('发布成功')
      uni.redirectTo({
        url: '/pages/moments/details?cid=' + data.cid
      })
    }).finally(() => {
      loading.value = false
    })
  }

  function handleTopic(item) {
    if (item.topicId == form.topicId) {
      form.topicId = undefined
      form.topicName = ''
    } else {
      form.topicId = item.topicId
      form.topicName = item.topicName
    }
  }

  function handleSelectedCircle(item) {
    if (item.categoryId == form.categoryId) {
      form.categoryId = undefined
    } else {
      form.categoryId = item.categoryId
    }
    show.value = false
  }
  const circleInfo = computed(() => {
    var info = circleList.value.find(x => x.categoryId == form.categoryId)
    if (info) {
      return info.name
    }
    return ''
  })
  const topicList = ref([])
  const circleList = ref([])
  listArticleTopic().then((res) => {
    topicList.value = res.data
  })
  listArticleCategory({
    categoryType: 1
  }).then(res => {
    const {
      code,
      data
    } = res
    circleList.value = data.result
  })
  const show = ref(false)
  useUserStore().getInfo()
</script>

<style lang="scss" scoped>
  .page {
    padding: 10px;
    padding-bottom: 100px;
    background-color: #fff;
    // margin-top: 40px;

    .input-wrap {
      min-height: 100px;
    }
  }

  .btn-send {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 20px;
  }

  .topic-wrap {
    width: 100%;
    margin: 0 auto;
    position: relative;
    display: flex;
    overflow-x: scroll;
    align-items: center;

    .u-page__tag-item {
      margin-right: 5px;
      display: inline-flex;
      align-items: center;
      text-wrap: nowrap;
      white-space: nowrap;
      background-color: #f6f6f6;
      border-radius: 12px;
      padding: 3px 10px;
      color: #b1b1b1;
      font-size: 13px;
    }

    .active {
      background-color: #3c9cff;
      color: #fff;
    }

  }

  .topic-header {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    padding: 20px 0;
  }

  .scroll-wrap {
    height: 100%;
  }

  .topic-list {
    height: 50vh;
    overflow: hidden;

    .topic-item {
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      margin-bottom: 10px;
    }
  }
</style>
