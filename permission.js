import {
  getToken,
  checkWhite
} from '@/utils/auth'

// 登录页面
const loginPage = "/pages/login"

// 页面白名单
const loginList = [
  '/pages/moments/publish',
  '/pages/mine/setting/index',
  '/pages/mine/thirdBind/index',
  '/pages/mine/pwd/index',
  '/pages/mine/phoneBind/index'
]
// 页面跳转验证拦截器
let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"]
list.forEach(item => {
  uni.addInterceptor(item, {
    invoke(to) {
      if (getToken()) {
        if (to.path === loginPage) {
          uni.reLaunch({
            url: "/"
          })
        }
        return true
      } else {
        console.log('to login', to.url)
        if (checkWhite(to.url, loginList)) {
          uni.navigateTo({
            url: loginPage + '?redirect=' + to.url,
          })
          return false
        }

        return true
      }
    },
    fail(err) {
      uni.showToast({
        title: '访问页面失败',
        icon: 'none'
      })
      console.log(err)
    }
  })
})
