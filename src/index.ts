// import router from '../router'
import { RouteLocationNormalized, Router } from 'vue-router/dist/vue-router'

const history = window.sessionStorage
history.clear()
history.setItem('/', '0')
let flag = true

function isNumber (val) {
  return Object.prototype.toString.call(val) === '[object Number]'
}

function setCount (to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (!flag) {
    return
  }
  flag = false
  const count = history.getItem('count') || '0'
  let historyCount = parseInt(count)
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  if (toIndex) {
    // 进入的路由存在索引
    if (toIndex === '0' && fromIndex === '0') {
      // 第一次进入根路由
    } else {
      // 删除当前路由索引
      history.removeItem(from.path)
      --historyCount
      history.setItem('count', historyCount.toString())
    }
  } else {
    // 进入的路由不存在索引就是forward
    ++historyCount
    history.setItem('count', historyCount.toString())
    history.setItem(to.path, historyCount.toString())
  }
}

function deleCurrent () {
  const count = history.getItem('count') || '0'
  let historyCount = parseInt(count)
  --historyCount
  sessionStorage.setItem('count', historyCount.toString())
  let path = ''
  if (this.history) {
    path = this.history.current && this.history.current.path
  } else {
    path = this.currentRoute.value.path
  }
  sessionStorage.removeItem(path)
}

interface callBackInterface {
  (): void
}

function deleHistory (step: number, callback: callBackInterface) {
  // 重置count
  const count = history.getItem('count') || '0'
  const historyCount = parseInt(count)
  if (Math.abs(step) >= historyCount) {
    // back方法内部会执行go(-1)，invoked避免callback在两个方法里重复调用
    callback()
    return
  }
  const newCount = historyCount + step + 1
  sessionStorage.setItem('count', newCount.toString())
  // 重置item
  const len = sessionStorage.length
  const keyArr: string[] = []
  for (let i = 0; i < len; i++) {
    const key = sessionStorage.key(i)
    if (key) {
      const value = sessionStorage.getItem(key) || '0'
      if (parseInt(value) < historyCount && parseInt(value) >= newCount && key !== 'count') {
        keyArr.push(key)
      }
    }
    
  }
  for (let i = 0; i < keyArr.length; i++) {
    const key = keyArr[i]
    sessionStorage.removeItem(key)
  }
}

function routerCount (router: Router, callback: callBackInterface) {
  router.beforeEach((to, from, next) => {
    setCount(to, from)
    next()
  })

  router.afterEach(() => {
    flag = true
  })

  // router.back = (function () {
  //     const back = router.back;
  //     return function () {
  //         if (sessionStorage.getItem('count') === '1') {
  //             callback();
  //         }
  //         return back.apply(this, arguments);
  //     };
  // })();

  router.replace = (function () {
    const replace = router.replace
    return function (...arg) {
      deleCurrent.call(this)
      return replace.apply(this, arg)
    }
  })()

  router.go = (function () {
    const go = router.go
    return function (...arg) {
      const step = arg[0]
      if (step === 0) {
        deleCurrent.call(this)
      }
      if (isNumber(step) && step < 0) {
        deleHistory(step, callback)
      }
      return go.apply(this, arg)
    }
  })()
}

export default routerCount
