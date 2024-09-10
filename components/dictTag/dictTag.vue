<template>
  <view class="dict-wrap">
    <template v-for="(item, index) in dictList">
      <template v-if="values.includes(item.dictValue)">
        <view class="tag-item" v-if="dictValues.includes(item.listClass)">
          <u-tag :text="item.dictLabel" plain size="mini" :type="getTagType(item.listClass)"></u-tag>
        </view>

        <span :key="item.dictValue" class="el-tag" :index="index" v-else-if="item && item.cssClass != ''"
          :class="item.cssClass">{{ item.dictLabel }}</span>

        <span class="el-tag" :index="index" v-else>{{item.dictLabel}}</span>
      </template>
    </template>
  </view>
</template>

<script setup>
  import {
    defineProps,
    computed,
    ref,
    onMounted
  } from 'vue';
  const props = defineProps({
    options: {
      type: Array,
      default: null,
    },
    value: [Number, String, Array],
    showValue: false,
    split: {
      type: String,
      default: null
    },
    //自定义属性值 例如：{ label: 'name', value: 'id'}
    config: {
      type: Object,
      default: null
    }
  })

  const dictList = computed(() => {
    if (props.config) {
      let config = props.config
      var newList = []

      for (let d of props.options) {
        let label = d[config.label]
        let value = d[config.value]

        newList.push({
          dictLabel: label,
          dictValue: value,
          ...d
        })
      }
      return newList
    }
    return props.options
  })
  const values = computed(() => {
    if (props.value !== null && typeof props.value !== 'undefined') {
      if (props.split != null && props.split != '') {
        return props.value.split(props.split) ?? []
      } else {
        return Array.isArray(props.value) ? props.value : [String(props.value)]
      }
    } else {
      return []
    }
  })

  function getTagType(val) {
    return val
  }
  const dictValues = ref(['primary', 'error', 'warning', 'info', 'success'])
</script>

<style lang="scss" scoped>
  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .dict-wrap {
    display: inline-flex;
    /* display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-around; */

    .tag-item+.tag-item {
      margin-left: 10px;
    }
  }
</style>
