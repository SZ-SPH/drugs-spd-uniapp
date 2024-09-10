import request from '@/utils/request'

/**
 * 计划任务分页查询
 * @param {查询条件} data
 */
export function listTasks(query) {
  return request({
    url: '/system/Tasks/list',
    method: 'get',
    data: query,
  })
}

/**
 * 新增计划任务
 * @param data
 */
export function addTasks(data) {
  return request({
    url: '/system/Tasks/create',
    method: 'post',
    data: data,
  })
}
/**
 * 修改计划任务
 * @param data
 */
export function updateTasks(data) {
  return request({
    url: '/system/Tasks/update',
    method: 'post',
    data: data,
  })
}
/**
 * 获取计划任务详情
 * @param {Id}
 */
export function getTasks(id) {
  return request({
    url: '/system/tasks/get?id=' + id,
    method: 'get'
  })
}

/**
 * 删除计划任务
 * @param {主键} pid
 */
export function delTasks(pid) {
  return request({
    url: '/system/Tasks/delete?id=' + pid,
    method: 'delete'
  })
}


/**
 * 启动任务
 * @param {*} id
 * @returns
 */
export function startTasks(id) {
  return request({
    url: '/system/tasks/start?id=' + id,
    method: 'get'
  })
}

/**
 * 停止任务
 * @param {*} id
 * @returns
 */
export function stopTasks(id) {
  return request({
    url: '/system/tasks/stop?id=' + id,
    method: 'get'
  })
}

/**
 * 运行一次
 * @param {*} id
 * @returns
 */
export function runTasks(id) {
  return request({
    url: '/system/tasks/run?id=' + id,
    method: 'get'
  })
}
