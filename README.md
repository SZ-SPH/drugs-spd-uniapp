# vue2升级vue3指南
[指南](https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html)

# 通过 props 来获取页面参数
vue3 全平台新增：通过 props 来获取页面参数的使用方式

```js
<script setup>
  // 页面可以通过定义 props 来直接接收 url 传入的参数
  // 如：uni.navigateTo({ url: '/pages/index/index?id=10' })
  const props = defineProps({
    id: String,
  });
  console.log("id=" + props.id); // id=10
</script>
```