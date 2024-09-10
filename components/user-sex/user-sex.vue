<template>
  <up-icon class="sex" name="man" color="#3c9cff" v-if="props.modelValue == 0"></up-icon>
  <up-icon class="sex" name="woman" color="pink" v-if="props.modelValue == 1"></up-icon>
</template>

<script setup>
  import {
    defineProps,
  } from 'vue';
  const props = defineProps({
    modelValue: {
      type: [Number],
      default: 2
    }
  })
</script>

<style>

</style>
