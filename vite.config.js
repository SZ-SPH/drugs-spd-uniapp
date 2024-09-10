import {
  defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig(() => {
  return {
    server: {
      port: 8886
    },
    plugins: [
      uni()
    ],
  }
})
