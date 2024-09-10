import request from '@/utils/request'

/**
 * 配置表分页查询
 * @param {查询条件} data
 */
export function listConfig(query) {
  return request({
    url: '/system/Config/list',
    method: 'get',
    data: query,
  })
}

/**
 * 新增配置表
 * @param data
 */
export function addConfig(data) {
  return request({
    url: '/system/Config',
    method: 'post',
    data: data,
  })
}
/**
 * 修改配置表
 * @param data
 */
export function updateConfig(data) {
  return request({
    url: '/system/Config',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取配置表详情
 * @param {Id}
 */
export function getConfig(id) {
  return request({
    url: '/system/Config/' + id,
    method: 'get'
  })
}

/**
 * 删除配置表
 * @param {主键} pid
 */
export function delConfig(pid) {
  return request({
    url: '/system/Config/' + pid,
    method: 'delete'
  })
}