const TokenKey = 'ZR-Token'

export function getToken() {
  return uni.getStorageSync(TokenKey)
}

export function setToken(token) {
  return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey)
}

// 检查地址白名单
/**
 * @param {Object} url url地址
 * @param {Object} whiteList 白名单地址列表
 */
export function checkWhite(url, whiteList) {
  const path = url.split('?')[0]
  return whiteList.indexOf(path) !== -1
}
