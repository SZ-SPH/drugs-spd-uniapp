import modal from './modal'
import auth from './auth'
import tab from './tab'
import {
  parseTime
} from '@/utils/index.js'
export default function installPlugins(app) {
  // 模态框对象
  app.config.globalProperties.$modal = modal
  app.config.globalProperties.$tab = tab
  app.config.globalProperties.parseTime = parseTime
  // app.config.globalProperties.$auth = auth
}
