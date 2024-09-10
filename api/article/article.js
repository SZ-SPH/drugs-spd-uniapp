import request from '@/utils/request'

// 查询文章列表
export function listArticle(query) {
  return request({
    url: '/front/article/homeList',
    method: 'get',
    data: query
  })
}
// 查询文章详细
export function getArticleDetails(Id) {
  return request({
    url: '/front/article/' + Id,
    method: 'get'
  })
}

// 删除
export function delArticle(id) {
  return request({
    url: '/front/article/del/' + id,
    method: 'delete'
  })
}
// 置顶
export function topArticle(data) {
  return request({
    url: '/front/article/top',
    method: 'put',
    data: data
  })
}
// 切换状态
export function changeArticlePublic(data) {
  return request({
    url: '/front/article/ChangePublic',
    method: 'put',
    data: data
  })
}

// 点赞
export function praiseArticle(Id, data) {
  return request({
    url: '/front/article/praise/' + Id + '?authorId=' + data?.authorId,
    method: 'post',
    data: data,
    headers: {
      checkLogin: true
    }
  })
}

// 查询详细
export function getInfo() {
  return request({
    url: '/monent/getInfo',
    method: 'get'
  })
}

/**
 * 文章目录分页查询
 * @param {查询条件} data
 */
export function listArticleCategory(query) {
  return request({
    url: '/article/ArticleCategory/list',
    method: 'get',
    data: query
  })
}

/**
 * 查询目录
 * @param {Object} query
 */
export function queryArticleCategory(id) {
  return request({
    url: '/article/ArticleCategory/' + id,
    method: 'get'
  })
}

// 查询话题列表
export function listArticleTopic(query) {
  return request({
    url: '/front/article/topicList',
    method: 'get',
    data: query
  })
}

// 查询话题详细
export function getTopicInfo(id) {
  return request({
    url: '/front/article/topic/' + id,
    method: 'get',
  })
}
