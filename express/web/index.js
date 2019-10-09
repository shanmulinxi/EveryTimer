var express = require('express')
const Control = require('../class/Control')

const ControlName = 'page'

const PagePath = __dirname + '/page'
/**
 * 静态页面控制器
 */
module.exports = class staticPage extends Control {
  constructor(app) {
    super(ControlName, app)
  }
  initIntercept(req, res, next) {
    //自定义拦截器
    next()
  }
  initRouter() {
    const _router = super.initRouter()
    _router.get('/', (req, res) => {
      var deviceAgent = req.headers['user-agent'].toLowerCase()
      var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/)
      if (agentID) {
        console.log('手机访问')
      } else {
        console.log('电脑访问')
      }
      res.sendFile(PagePath + '/static/static.html')
    })
    _router.get('/index', (req, res) => {
      res.sendFile(PagePath + '/index.html')
    })

    _router.get('/home', (req, res) => {
      if (this.checkCookies(req) === null) {
        this.failReturn(res, {
          return_msg: 'USER VERIFY ERROR',
          return_code: 20000
        })
        return
      }
      res.sendFile(PagePath + '/home.html')
    })

    return _router
  }
}

// exports.load = load;
