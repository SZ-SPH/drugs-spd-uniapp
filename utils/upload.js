// import store from '@/store'
import useUserStore from '../store/modules/user'
import config from '@/config'
import {
  getToken
} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {
  toast,
  showConfirm,
  tansParams
} from '@/utils/common'
import configService from '@/api/config.service'

let timeout = 10000
const baseUrl = configService.apiUrl //config.baseUrl

const upload = config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  config.header = config.header || {}
  if (getToken() && !isToken) {
    config.header['Authorization'] = 'Bearer ' + getToken()
  }
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      timeout: config.timeout || timeout,
      url: baseUrl + config.url,
      filePath: config.filePath,
      name: config.name || 'file',
      header: config.header,
      formData: config.formData,
      success: (response) => {
        const res = JSON.parse(response.data)
        const code = res.code
        const msg = res.msg // || errorCode[code] || errorCode['default']

        if (code == 401) {
          useUserStore().clean()
          showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
            if (res.confirm) {
              useUserStore().logOut().then(res => {
                uni.navigateTo({
                  url: '/pages/login'
                })
              })
            }
          })
          reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code == 200) {
          resolve(res)
        } else {
          toast(msg)
          reject(res)
        }
      },
      fail: (error) => {
        console.error(error)
        // let {
        //   message
        // } = error
        // if (message == 'Network Error') {
        //   message = '后端接口连接异常'
        // } else if (message.includes('timeout')) {
        //   message = '系统接口请求超时'
        // } else if (message.includes('Request failed with status code')) {
        //   message = '系统接口' + message.substr(message.length - 3) + '异常'
        // }
        // toast(message)
        reject(error)
      }
    })
  })
}

export default upload
