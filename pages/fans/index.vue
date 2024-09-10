<template>
  <view class="page">
    <up-navbar title="动态" :autoBack="true" :placeholder="true">
      <template #center>
        <u-tabs :list="tabList" @click="handleTabClick" lineColor="#000" :current="current"></u-tabs>
      </template>
      <!-- <template #left>
        <up-button icon="plus" color="#000" iconColor="#fff" size="mini" @click="handlePublish">发布</up-button>
      </template> -->
    </up-navbar>

    <up-empty></up-empty>
  </view>
</template>

<script setup>
  import {
    ref,
    defineProps,
    reactive,
    computed
  } from 'vue';
  const props = defineProps({
    id: {
      type: String
    }
  })
  const queryParams = reactive({
    id: props.id
  })
  console.log(props.id)
  const tabList = ref([{
    name: '关注',
    id: 1
  }, {
    name: '粉丝',
    id: 2
  }])
  const current = computed(() => {
    var index = tabList.value.findIndex(x => x.id == props.id)

    return index
  })

  function handleTabClick(item) {
    uni.setNavigationBarTitle({
      title: item.name
    })
  }
</script>

<style>

</style>
