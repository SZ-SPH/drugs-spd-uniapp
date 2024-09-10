import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid, clientId) {
  const data = {
    username,
    password,
    code,
    uuid,
    clientId
  }
  return request({
    'url': '/login',
    headers: {
      isToken: false
    },
    'method': 'post',
    'data': data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    'url': '/getInfo',
    'method': 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    'url': '/logout',
    'method': 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    'url': '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

//小程序登录
export function miniLogin(data) {
  return request({
    url: '/auth/miniLogin?code=' + data.code,
    headers: {
      isToken: false
    },
    method: 'post'
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

/**
 * 三方授权回调
 * @param {*} data
 * @returns
 */
export function oauthCallback(data) {
  return request({
    url: '/auth/callback?authSource=' + data?.authSource || '',
    method: 'post',
    data: data
  })
}

/**
 * 扫码登录
 * @param {*} data
 * @returns
 */
export function scanQrLogin(data) {
  return request({
    url: '/ScanLogin',
    method: 'post',
    data: data
  })
}

//查询我绑定的三方账号
export function getMyBindAccount() {
  return request({
    url: '/auth/GetMyOAuthAccountList',
    method: 'GET',
  })
}

// 判断手机号是否绑定
export function checkMobile(data) {
  return request({
    url: '/checkMobile',
    method: 'post',
    data: data
  })
}
/**
 * 绑定手机号
 * @param {Object} data
 */
export function bindMobile(data) {
  return request({
    url: '/PhoneBind',
    method: 'post',
    data: data
  })
}
