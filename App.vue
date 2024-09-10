<style lang="scss">
  @import "@/uni_modules/uview-plus/index.scss";
  @import '@/static/scss/index.scss';
  @import "@/static/font/iconfont.css";
</style>

<script>
  // #ifdef H5
  import {
    computed,
    getCurrentInstance,
    watch
  } from 'vue'
  import {
    getToken,
    checkWhite
  } from '@/utils/auth'
  import signalR from '@/signalr/signalr.js'
  // #endif

  export default {
    onLaunch: function() {
      console.log('App Launch')
      this.initApp()
    },
    onShow: function() {
      console.log('App Show')
      // #ifdef H5

      const {
        proxy
      } = getCurrentInstance()
      var token = computed(() => {
        return getToken()
      })

      watch(() => token, (val) => {
        proxy.$nextTick(() => {
          signalR.start()
        });
      }, {
        immediate: true
      })
      // #endif
    },
    onHide: function() {
      console.log('App Hide')
    },
    methods: {
      // 初始化应用
      initApp() {
        // 初始化路由配置
        this.initRouter()
        // 初始化应用配置
        // this.initConfig()
        // 检查用户登录状态
        //#ifdef H5
        // this.checkLogin()
        //#endif
      },
      initRouter(){
        checkLogin();
      },
      checkLogin() {
        var whiteList = ['#/pages/socialLogin', '#/pages/register']
        if (!getToken() && !checkWhite(window.location.hash, whiteList)) {
          var url = window.location.href
          var redirectUrl = ''

          if (url.indexOf('#') !== -1 && url.indexOf('/pages/index') != -1) {
            redirectUrl = url.substr(url.indexOf('#') + 1)
          }

          this.$tab.navigateTo('/pages/login?redirectUrl=' + redirectUrl)
        }
      }
    }
  }
</script>
<style lang="scss">
  page {
    background-color: #f5f6f7;
  }
</style>
