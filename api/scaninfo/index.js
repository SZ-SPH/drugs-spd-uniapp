import request from '@/utils/request'

// 查询入库单列表
export function listWarehouseReceipt(query) {
  return request({
    url: '/business/WarehouseReceipt/list',
    method: 'get',
    data: query
  })
}
// 删除入库单
export function deleteWarehouseReceipt(query) {
  return request({
    url: '/business/WarehouseReceipt/delete/' + query,
    method: 'delete',
  })
}

//获取溯源码信息
export function getCodeInfo(query) {
  return request({
    url: '/Mtaobo/codedetail',
    method: 'get',
    data:query
  })
}

