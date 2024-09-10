import config from '@/config'
import {
  defineStore
} from 'pinia';
import {
  login,
  logout,
  getInfo,
  miniLogin,
  oauthCallback
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

const useUserStore = defineStore('user', {
  unistorage: {
    key: "user", // 缓存的键，默认为该 store 的 id，这里是 user,
    paths: ['roles', 'permissions', 'userInfo',
      'userId'
    ], // 需要缓存的路径，这里设置 foo 和 nested 下的 data 会被缓存
  },
  state: () => {
    return {
      token: getToken(),
      roles: [],
      permissions: [],
      userInfo: '',
      authSource: '',
      connId: '',
      hasLogin: false,
      //登录回调地址
      redirectUrl: ''
    }
  },
  getters: {
    userId() {
      return this.userInfo.userId
    },
    avatar() {
      return this.userInfo.avatar
    },
    name() {
      return this.userInfo.userName
    }
  },
  actions: {
    saveName(val) {
      this.userInfo.name = val
    },
    saveRoles(val) {
      this.roles = val
    },
    savePermi(value) {
      this.permissions = value
    },
    saveAvatar(value) {
      this.userInfo.avatar = value
    },
    saveUserInfo(value) {
      this.userInfo = value
    },
    login(userInfo) {
      const username = userInfo.username
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.data)
          this.token = res.data
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    showLogin(val) {
      this.hasLogin = val
    },
    checkLogin() {
      if (!this.userId || this.userId == undefined || this.userId <= 0) {
        this.hasLogin = true
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        throw Error('请登录')
      }
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const data = res.data
          const user = res.data.user

          const avatar = user.avatar
          const username = user.userName
          if (data.roles && data.roles.length > 0) {
            this.saveRoles(data.roles)
            this.savePermi(data.permissions)
          } else {
            this.saveRoles(['ROLE_DEFAULT'])
            this.savePermi([])
          }
          this.saveUserInfo(data.user)
          resolve(res)
        }).catch(error => {
          removeToken()
          this.saveUserInfo({})
          this.saveRoles(['ROLE_DEFAULT'])
          this.savePermi([])
          this.token = ''
          // storage.clean()
          reject(error)
        })
      })
    },

    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token).then(() => {
          this.token = ''
          this.roles = []
          this.permissions = []
          this.clean()
          removeToken()
          // storage.clean()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 微信小程序登录
    miniProgramLogin(userInfo) {
      return new Promise((resolve, reject) => {
        miniLogin(userInfo).then(res => {
          const {
            code,
            data
          } = res
          if (code == 200) {
            setToken(data.token)
            // commit('SET_TOKEN', data.token)
            this.token = data.token
            resolve(res) //then处理
          } else {
            console.log('login error ', res)
            reject(res) //catch处理
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    /**
     * 三方授权登录回调
     * @param {*} data
     * @param {*} param { authSource : ''}
     * @returns
     */
    oauthLogin(param) {
      return new Promise((resolve, reject) => {
        oauthCallback(param)
          .then((res) => {
            const {
              code,
              data
            } = res
            if (code == 200) {
              setToken(data.token)
              this.token = data.token
              resolve(res) //then处理
            } else {
              console.log('login error ', res)
              reject(res) //catch处理
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    clean() {
      this.token = ''
      this.roles = []
      this.permissions = []

      this.saveUserInfo({})
    }
  }
})
export default useUserStore
