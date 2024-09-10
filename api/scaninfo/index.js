import request from '@/utils/request'

// 查询入库单列表
export function listWarehouseReceipt(query) {
  return request({
    url: '/business/WarehouseReceipt/list',
    method: 'get',
    data: query
  })
}
