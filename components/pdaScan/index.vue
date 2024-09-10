<template>
	<view>
	</view>
</template>

<script setup>
import { onShow,onHide,onLoad,onUnload } from '@dcloudio/uni-app'

let main, receiver, filter;
let _codeQueryTag = false;

const initScan = () => {
  main = plus.android.runtimeMainActivity(); //获取activity
  let IntentFilter = plus.android.importClass('android.content.IntentFilter');
  filter = new IntentFilter();
  filter.addAction("com.rfid.SCAN"); // 广播动作
  receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
    onReceive: function (context, intent) {
      plus.android.importClass(intent);
      let code = intent.getStringExtra("data"); // 广播标签
      console.log("进入了onReceive",code);
      queryCode(code);
    }
  });
};

// 启动扫描操作,将之前创建的广播接收器（receiver）注册到活动中,以便接收指定广播动作的结果
// filter 用于过滤广播消息，只有匹配过滤器中指定的广播动作的消息才会被接收和处理
const startScan = () => {
  main.registerReceiver(receiver, filter);
};

// 停止扫描操作,将之前注册的广播接收器（receiver）从活动中注销,以停止接收扫描结果的广播
const stopScan = () => {
  main.unregisterReceiver(receiver);
};

const queryCode = (code) => {
  //防重复
  if (_codeQueryTag) return false;
  _codeQueryTag = true;
  setTimeout(function () {
    _codeQueryTag = false;
  }, 150);
  // 触发自定义事件
  uni.$emit('scancode', { code: code });
};

onShow(() => {
  initScan();
  startScan();
});

onUnload(() => {
  stopScan();
});

onHide(()=>{
	stopScan();
});
</script>

<style>

</style>
