const express = require('express')
// const router = express.Router()
const Jwt = require('jsonwebtoken') //用来生成token
const Base_User = require('../../model/Base_User')
/**
 * 自定义 http控制器
 */
module.exports = class Control {
  constructor(controlName = '', app) {
    const route = this.initRouter(controlName)
    app.use('/' + controlName, this.initIntercept, route)
    // app.use(this.logErrors)
    // app.use(this.clientErrorHandler)
    // app.use(this.errorHandler)
    console.log(controlName + ' control init')
  }

  /**
   * 初始化自定义拦截器
   * @param {*} req 请求参数
   * @param {*} res 返回参数
   * @param {*} next 下一个中间件方法
   */
  initIntercept(req, res, next) {
    //自定义拦截器
    next()
  }
  /**
   * 初始化路由
   */
  initRouter() {
    const _router = express.Router()
    return _router
  }

  /**
   *失败的返回
   *
   * @param {*} res
   * @param {*} {
   *       return_obc = {},
   *       return_msg = 'FAILURE',
   *       return_state = false,
   *       return_code = 500
   *     }
   */
  failReturn(
    res,
    {
      return_obc = {},
      return_msg = 'FAILURE',
      return_state = false,
      return_code = 500
    },
    message
  ) {
    console.log('failReturn', {
      return_state,
      return_code,
      return_msg,
      return_obc
    })
    res.json({
      return_state,
      return_code,
      return_msg: message || return_msg,
      return_obc
    })
  }
  /**
   *成功的返回
   *
   * @param {*} res
   * @param {*} {
   *       return_obc = {},
   *       return_msg = 'FAILURE',
   *       return_state = false,
   *       return_code = 500
   *     }
   */
  successReturn(
    res,
    {
      return_obc = {},
      return_msg = 'SUCCESS',
      return_state = true,
      return_code = 200
    }
  ) {
    console.log('successReturn', {
      return_state,
      return_code,
      return_msg,
      return_obc
    })
    res.json({
      return_state,
      return_code,
      return_msg,
      return_obc
    })
  }

  checkCookies(req) {
    let token = req.cookies['authorization'] // 从Authorization中获取token
    return Control.verifyToken(token)
  }

  checkHearder(req) {
    let token = req.get('authorization') // 从Authorization中获取token
    return Control.verifyToken(token)
  }

  static verifyToken(token) {
    let secretOrPrivateKey = global.config.TokenKey // 这是加密的key（密钥）
    return new Promise(function(resolve, reject) {
      Jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) {
          //  时间失效的时候 || 伪造的token
          console.log(err)
          reject(err)
        } else {
          const filter = [
            { field: 'id', operate: 'equal', value: decode['id'] },
            {
              field: 'authorization',
              operate: 'equal',
              value: token
            },
            {
              field: 'isDelete',
              operate: 'equal',
              value: false
            }
          ]
          Base_User.getDataFormFilter({ filter, pagesize: 1 })
            .then(userlist => {
              console.log(userlist)
              if (userlist.length == 1) {
                resolve(userlist[0])
              } else {
                reject('查询无效')
              }
            })
            .catch(error => {
              console.log(error)
              reject(error)
            })
        }
      })
    })
  }

  logErrors(err, req, res, next) {
    console.error('logErrors', err.stack)
    next(err)
  }

  clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({
        error: 'Something failed!'
      })
    } else {
      next(err)
    }
  }

  errorHandler(err, req, res, next) {
    res.status(500)
    res.render('error', {
      error: err
    })
  }
}
