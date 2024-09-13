<template>
  <view>
    <!-- 扫码盘点组件 -->
    <index></index>
    扫码盘点组件
    {{codeInfo}}
  </view>
</template>

<script setup>
  import index from '@/components/pdaScan/index'
  import { getCodeInfo } from '@/api/scaninfo/index'
  import {
    ref,
    reactive
  } from 'vue';
  import {
    onLoad,
    onShow,
    onHide,
    onUnload
  } from '@dcloudio/uni-app';


 const codeInfo = reactive([{
   //physic_name
   "drugName": "",
   //drug_ent_base_info_id
   "drugCode": "",
   //physic_name
   "drugMnemonicCode": "",
   //pkg_spec_crit
   "drugSpecifications": "",
   //physic_type_desc
   "drugCategory": "",
   //physic_name
   "drugVarietyName": null,
   //package_level
   "drugClassification": 0,
   //code
   "tracingSourceCode": null,
   //batch_no
   "drugBatchNumber": null,
   //pkg_amount
   "minunit": "",
   //ent_name
   "produceName": "",
   //pkg_amount
   "packageRatio": 1,
   //pkg_spec_crit
   "packageUnit": "支",
   "ReceiptId": ""
 }]);

  const getCodeInfoByScan = (data) => {
    uni.showLoading({
      title:"处理中",
      mask :true
    })
    getCodeInfo({ codes:data }).then((res) => {
      if(res.code != 200) return uni.showToast({
        title:res.msg,
        icon:'error'
      })

      const { pUserEntDTO,drugEntBaseDTO,packageLevel,codeProduceInfoDTO,code } = res.data.models[0]
      codeInfo[0].drugName = drugEntBaseDTO.physicName;
      codeInfo[0].drugCode = drugEntBaseDTO.drugEntBaseInfoId;
      codeInfo[0].drugMnemonicCode = drugEntBaseDTO.physicName;
      codeInfo[0].drugSpecifications = drugEntBaseDTO.pkgSpecCrit
      codeInfo[0].drugCategory = drugEntBaseDTO.physicTypeDesc
      codeInfo[0].drugVarietyName = drugEntBaseDTO.physicName
      codeInfo[0].drugClassification = packageLevel
      codeInfo[0].tracingSourceCode = code
      codeInfo[0].drugBatchNumber = codeProduceInfoDTO.produceInfoList[0].batchNo
      codeInfo[0].minunit = codeProduceInfoDTO.produceInfoList[0].pkgAmount
      codeInfo[0].produceName = pUserEntDTO.entName
      codeInfo[0].packageRatio = codeProduceInfoDTO.produceInfoList[0].pkgAmount
      codeInfo[0].packageUnit = drugEntBaseDTO.pkgSpecCrit
      codeInfo[0].ReceiptId = receiptId.value
    }).finally(() => {
      uni.hideLoading()
    })
  }

  onShow(() => {
    uni.$on('scancode', function(data) {
      getCodeInfoByScan(data.code)
    })
  })

  onHide(() => {
    // 移除监听事件
    uni.$off('scancode')
  })

  onUnload(() => {
    // 移除监听事件
    uni.$off('scancode')
  })


  const receiptId = ref(null)
  //页面初始化方法
  onLoad((data) => {
    receiptId.value = data.id
  })

</script>

<style>

</style>
