let BASE_URL = ''
let MSG_HUB_URL = ''
if (import.meta.env.DEV) {
  BASE_URL = `http://192.168.247.19:8888`
  //  #ifdef H5
  BASE_URL = `http://192.168.247.19:8888`
  //  #endif
  MSG_HUB_URL = BASE_URL
} else {
  BASE_URL = 'http://api.xxx.cn/uni-api'
  MSG_HUB_URL = BASE_URL
  //  #ifdef H5
  BASE_URL = '/prod-api'
  MSG_HUB_URL = ''
  //  #endif
}
const configService = {
  apiUrl: BASE_URL,
  msgHubUrl: MSG_HUB_URL
}

export default configService
