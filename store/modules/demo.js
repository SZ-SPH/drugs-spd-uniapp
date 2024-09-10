import {
  defineStore
} from 'pinia';
const useDemoStore = defineStore('demo', {
  state: () => {
    return {
      count: 0
    }
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

export default useDemoStore
