<template>
  <view class="container">
    <u-gap height="5"></u-gap>
    <uni-section title="服务器信息" type="line">
      <uni-card :is-shadow="false">
        <view class="info-item">
          <view class="info-line">
            <text class="label-name">服务器名</text>
            <text>{{sysInfo.computerName}}</text>
          </view>
          <view class="info-line">
            <text class="label-name">服务器IP</text>
            <text>{{sysInfo.serverIP}}</text>
          </view>
          <view class="info-line">
            <text class="label-name">操作系统</text>
            <text>{{sysInfo.osName}}</text>
          </view>
          <view class="info-line">
            <text class="label-name">系统运行时长</text>
            <text>{{sysInfo.runTime}}</text>
          </view>
        </view>
      </uni-card>
    </uni-section>

    <uni-section title=".NET信息" type="line">
      <uni-card :is-shadow="false">
        <view class="info-item">
          <view class="info-line">
            <text class="label-name">环境变量</text>
            <text>{{appInfo.name}}</text>
          </view>
          <view class="info-line">
            <text class="label-name">.NET版本</text>
            <text>{{appInfo.version}}</text>
          </view>
          <view class="info-line">
            <text class="label-name">启动时间</text>
            <text>{{appInfo.startTime}}</text>
          </view>
          <view class="info-line">
            <text class="label-name">运行时长</text>
            <text>{{appInfo.runTime}}</text>
          </view>
          <view class="info-line">
            <text class="label-name">占用内存</text>
            <text>{{appInfo.appRAM}}</text>
          </view>
          <view class="info-line">
            <text class="label-name">启用地址</text>
            <text>{{appInfo.host}}</text>
          </view>

        </view>
      </uni-card>
    </uni-section>
    <!--    <uni-section title="CPU/内存" type="line" titleFontSize="16px">
      <view class="charts-box">
        <div class="chat-item">
          <qiun-data-charts width="200" type="arcbar" :opts="opts" :chartData="chartData" />
          <div></div>
        </div>
        <div class="chat-item">
          <qiun-data-charts width="200" type="arcbar" :opts="ramopts" :chartData="ramData" />
          <div>
            {{cpuInfo.usedRam}}/ {{ cpuInfo.totalRAM}}
          </div>
        </div>
      </view>
    </uni-section> -->

    <uni-section title="磁盘信息" type="line" titleFontSize="16px">
      <view class="margin-bottom-lg padding" v-for="(item, index) in diskList" :key="index">
        <view class="margin-bottom-sm">
          {{item.diskName}}
        </view>
        <u-line-progress activeColor="#333" :percentage="item.availablePercent" :height="15"></u-line-progress>
        <view class="margin-bottom-sm">
          {{ item.used}}G 已用，共{{ item.totalSize}}G
        </view>
      </view>
    </uni-section>
  </view>
</template>

<script>
  import {
    getServer
  } from '@/api/monitor/server.js'
  export default {
    data() {
      return {
        intervalId: null,
        chartData: {},
        ramData: {},
        //您可以通过修改 config-ucharts.js 文件中下标为 ['arcbar'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
        opts: {
          // color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
          // padding: undefined,
          title: {
            name: "44",
            fontSize: 25,
            color: "#2fc25b"
          },
          subtitle: {
            name: "CPU使用率",
            fontSize: 15,
            color: "#666666"
          },
        },
        ramopts: {
          // color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
          // padding: undefined,
          title: {
            name: "44",
            fontSize: 25,
            color: "#2fc25b"
          },
          subtitle: {
            name: "内存使用率",
            fontSize: 15,
            color: "#666666"
          },
          extra: {
            arcbar: {
              type: "default",
              width: 12,
              backgroundColor: "#E9E9E9",
              startAngle: 0.75,
              endAngle: 0.25,
              gap: 2,
              linearType: "custom"
            }
          }
        },
        cpuInfo: {},
        sysInfo: {},
        appInfo: {},
        diskList: []
      }
    },
    methods: {
      dataRefreh() {
        if (this.intervalId != null) {
          return
        }
        var that = this
        this.intervalId = setInterval(() => {
          that.getServerData()
        }, 10000)
      },
      clear() {
        clearInterval(this.intervalId)
        this.intervalId = null
      },
      getServerData() {
        uni.showLoading({
          title: 'loading'
        })
        setTimeout(() => {
          getServer().then(res => {
            const {
              cpu,
              disk,
              sys,
              app,
            } = res.data
            this.sysInfo = sys
            this.appInfo = app
            this.cpuInfo = cpu
            this.diskList = disk

            let cpuInfo = {
              series: [{
                color: "#2fc25b",
                data: parseInt(cpu.cpuRate) / 100
              }]
            };

            let ramInfo = {
              series: [{
                color: "#2fc25b",
                data: parseInt(cpu.ramRate) / 100
              }]
            };
            this.opts.title.name = cpu.cpuRate
            this.ramopts.title.name = cpu.ramRate
            this.chartData = JSON.parse(JSON.stringify(cpuInfo));
            this.ramData = JSON.parse(JSON.stringify(ramInfo));
            uni.hideLoading()
          })
        }, 500);
      },
    },
    onLoad() {
      this.getServerData()
      // this.dataRefreh()
    }
  }
</script>
<style lang="scss" scoped>
  @import "@/static/scss/page.scss";

  .container {
    // margin: 0 10px;
    padding-bottom: 20rpx;
  }

  .charts-box {
    /* #ifdef H5 */
    display: grid;
    grid-template-columns: 1fr 1fr; //有几列
    /* #endif */

    .chat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      /* #ifdef H5 */
      width: 150px;
      height: 150px;
      /* #endif */

      margin: 0 auto;
    }
  }

  .info-item {
    padding: unset;
  }
</style>
