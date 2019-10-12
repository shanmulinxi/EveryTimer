const Control = require('../class/Control')
const ControlName = 'UserCenter'
const Moment = require('moment')
const Base_User = require('../../model/Base_User')
const ErrorCode = require('../common/errorcode')
/**
 * 用户控制器
 */
module.exports = class UserCenter extends Control {
  constructor(app) {
    super(ControlName, app)
  }

  initIntercept(req, res, next) {
    //自定义拦截器

    super
      .checkHearder(req)
      .then(result => {
        //添加数据到body中
        req.body.user = {}
        Object.assign(req.body.user, result)
        next()
        return
      })
      .catch(err => {
        res.json('ERROR')
      })
  }

  initRouter() {
    const _router = super.initRouter()
    _router.post('/changePassword', (req, res) => {
      this.changePassword(req, res)
    })
    return _router
  }

  changePassword(req, res) {
    const reqData = req.body.data || null
    const reqUser = req.body.user || null
    if (!reqData || !reqUser) {
      this.failReturn(
        res,
        ErrorCode.UserCenter_changePassword_NullReqData,
        '??没有请求的数据呀'
      )
      return
    }

    let { password } = reqData

    if (!Base_User.verifyData({ password }, ['password'])) {
      this.failReturn(res, ErrorCode.UserCenter_changePassword_VerifyData)
      return
    }
    //对密码进行加盐加密
    password = Base_User.passwordAddSalt(password)
    password = Base_User.creatMD5(password)

    const filter = [{ field: 'id', operate: 'equal', value: reqUser['id'] }]
    const updateObc = {
      password,
      authorization: null,
      loginError: 0,
      editTime: Moment().format('YYYY-MM-DD HH:mm:ss')
    }
    Base_User.updateFormFilter(updateObc, Object.keys(updateObc), filter)
      .then(result => {
        this.successReturn(res, {})
        return
      })
      .catch(err => {
        this.failReturn(res, ErrorCode.UserCenter_changePassword_SQLError)
        return
      })
  }
}
