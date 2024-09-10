import request from '@/utils/request'

// 查询列表
export function listMessage(query) {
  return request({
    url: '/front/comment/list',
    method: 'get',
    data: query
  })
}

// 新增
export function addMessage(data) {
  return request({
    url: '/front/comment/add',
    method: 'post',
    data: data,
    headers: {
      checkLogin: true
    }
  })
}

// 删除消息
export function delMessage(id) {
  return request({
    url: '/front/comment/delete/' + id,
    method: 'delete',
    headers: {
      checkLogin: true
    }
  })
}

// 点赞
export function praiseMessage(data) {
  return request({
    url: '/front/comment/praise',
    method: 'post',
    data: data,
    headers: {
      checkLogin: true
    }
  })
}
// 查询我的评论列表
export function listMyMessage(query) {
  return request({
    url: '/front/comment/mylist',
    method: 'get',
    data: query
  })
}

// 置顶
export function topMessage(data) {
  return request({
    url: '/front/comment/top',
    method: 'put',
    data: data
  })
}
