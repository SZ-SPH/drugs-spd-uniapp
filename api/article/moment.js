import request from '@/utils/request'

// 查询我的列表
export function listMyArticle(query) {
  return request({
    url: '/moment/myList',
    method: 'get',
    data: query
  })
}

// 查询列表
export function list(query) {
  return request({
    url: '/moment/momentList',
    method: 'get',
    data: query
  })
}

// 新增
export function addArticle(data) {
  return request({
    url: '/moment/publishMoment',
    method: 'post',
    data: data
  })
}
