const express = require('express')
// const router = express.Router()
const Jwt = require('jsonwebtoken') //用来生成token
const Base_User = require('../../model/Base_User')
const ErrorCode = require('../common/errorcode')
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
  failReturn(res, errorcode = 'Error', message = null) {
    let error_obc = {}
    if (typeof errorcode === 'string') {
      error_obc = ErrorCode[errorcode]
    } else {
      error_obc = errorcode
    }

    let obc = {
      return_obc: {},
      return_msg: 'FAILURE',
      return_state: false,
      return_code: 500
    }
    if (error_obc) {
      Object.assign(obc, error_obc)
    }
    if (message) {
      obc.return_msg = message
    }
    res.json(obc)
  }

  /**
   *成功的返回
   *
   * @param {*} res
   * @param {*} {
   *       return_obc: {},
   *       return_msg: 'SUCCESS',
   *       return_state: true,
   *       return_code: 200
   *     }
   */
  successReturn(res, returnObject = {}) {
    let obc = {
      return_obc: {},
      return_msg: 'SUCCESS',
      return_state: true,
      return_code: 200
    }
    Object.assign(obc, returnObject)
    res.json(obc)
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
          reject(err)
        } else {
          const filter = [
            {
              field: 'id',
              operate: 'equal',
              value: decode['id']
            },
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
          Base_User.getDataFormFilter({
            filter,
            pagesize: 1
          })
            .then(userlist => {
              if (userlist.length == 1) {
                resolve(userlist[0])
              } else {
                reject('查询无效')
              }
            })
            .catch(error => {
              reject(error)
            })
        }
      })
    })
  }
}
