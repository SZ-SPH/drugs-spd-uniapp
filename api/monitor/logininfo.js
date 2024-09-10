import request from "@/utils/request";

// 查询登录日志列表
export function list(query) {
  return request({
    url: "/monitor/logininfor/list",
    method: "get",
    data: query,
  });
}

// 导出登录日志
export function exportLogininfor(query) {
  return request({
    url: "/monitor/logininfor/export",
    method: "get",
    data: query,
  });
}
// 查询登录日志统计
export function queryLogininLogStati(query) {
  return request({
    url: "/monitor/logininfor/statiLoginLog",
    method: "get",
    data: query,
  });
}