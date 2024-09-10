// import store from '@/store'
import config from '@/config'
import configService from '@/api/config.service'
import useUserStore from '../store/modules/user'
console.log(configService.apiUrl)
import {
  getToken
} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {
  toast,
  showConfirm,
  tansParams,
  delEmptyQueryNodes
} from '@/utils/common'

let timeout = 10000
const baseUrl = configService.apiUrl

const request = config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  const checkLogin = (config.headers || {}).checkLogin === true
  config.header = config.header || {}
  if (getToken() && !isToken) {
    config.header['Authorization'] = 'Bearer ' + getToken()
    config.header['userid'] = useUserStore().userId
  }

  // 移除underfunded、null参数
  if (config.method.toLowerCase() === 'get') {
    config.data = delEmptyQueryNodes(config.data)
  }
  // 判断是否需要登录，如果需要登录就不继续往下走了
  if (checkLogin) {
    useUserStore().checkLogin()
  }

  return new Promise((resolve, reject) => {
    uni.request({
        method: config.method || 'GET',
        timeout: config.timeout || timeout,
        url: config.baseUrl || baseUrl + config.url,
        data: config.data,
        header: config.header,
        dataType: 'json'
      }).then(response => {
        const res = response
        const code = res.data.code
        const msg = res.data.msg || errorCode[code] || errorCode['default']

        if (code == 401) {
          useUserStore().clean()
          // showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
          //   if (res.confirm) {
          //     useUserStore().logOut().then(res => {
          //       uni.navigateTo({
          //         url: '/pages/login'
          //       })
          //     })
          //   }
          // })
          useUserStore().logOut().then(res => {
            uni.navigateTo({
              url: '/pages/login'
            })
          })
          reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code == 202) {
          showConfirm('根据《 网络安全法》等规定发帖评论等需要先绑定手机号哦').then(res => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/mine/phoneBind/index'
              })
            }
          })
          reject(msg)
        } else if (code !== 200) {
          toast(msg)
          reject(res.data)
        }
        resolve(res.data)
      })
      .catch(error => {
        console.error(error)
        let {
          errMsg
        } = error
        if (errMsg === 'Network Error') {
          errMsg = '后端接口连接异常'
        } else if (errMsg.includes('timeout')) {
          errMsg = '系统接口请求超时'
        } else if (errMsg.includes('Request failed with status code')) {
          errMsg = '系统接口' + errMsg.substr(errMsg.length - 3) + '异常'
        }
        uni.hideLoading();
        toast(errMsg)
        reject(error)
      })
  })
}

export default request
