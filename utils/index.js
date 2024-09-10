import dayjs from "dayjs"
/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (!time) return ''
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' // + d.getHours() + '时' + d.getMinutes() + '分'
  }
}


/**
 * 日期格式化
 * @param {*} time
 * @param {* } pattern 'YYYY-MM-DD HH:mm:ss'
 * @returns
 */
export function parseTime(time, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (arguments.length === 0 || !time) {
    return null
  }

  return dayjs(time).format(pattern)
}
/**
 * 自动识别链接
 * @param {*} str
 * @returns
 */
export function replaceStr(str) {
  if (str == null || str == undefined || str.length <= 4) return str

  var linkRegex = /(http:\/\/|https:\/\/|www\.)((\w|=|\?|\.|\/|&|-)+)/g
  // 创建一个正则表达式来匹配以#开头和结尾的字符
  var reg2 = /^#\s.*?\s/

  var replacedText = str.replace(linkRegex, function(url) {
    // 如果链接以 "www." 开头，添加 "http://" 前缀
    if (url.startsWith("www.")) {
      url = "http://" + url;
    }
    return `<a href='${url}'>${sub(url, 40)}</a>`
  })
  // 话题替换
  // replacedText = replacedText.replace(reg2, '<text style="color:var(--text-color)">#$1\s</text>')
  // 换行替换
  replacedText = replacedText.replace(/\n/g, '<br>');

  return replacedText
}

export function contentShow(str) {
  var content = sub(str, 100)
  var htmlContent = replaceStr(str)

  return {
    // c1: content,
    c2: htmlContent,
    show: str.length > 100
  }
}

export function sub(str, index) {
  if (!str) return str
  if (str.length <= index) return str

  return str.substring(0, index) + '...'
}
