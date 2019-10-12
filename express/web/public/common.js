/**
 * 设置简易console输出环境
 */
var c = console

function commontest() {
  c.log('commontest')
}

function commonReady(params) {
  $(document).ready(function() {
    // 在DOM加载完成时运行的代码
    var sf = new Snowflakes({
      color: '#FFFFFF',
      count: 75,
      minOpacity: 0.2,
      maxOpacity: 0.6
    })
  })
}

//设置cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + '; ' + expires
}

//获取cookie
function getCookie(cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1)
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
  }
  return ''
}

//清除cookie
function clearCookie(name) {
  setCookie(name, '', -1)
}
