const Control = require('../class/Control')
const ControlName = 'Auth'
const Moment = require('moment')
const Base_User = require('../../model/Base_User')
const ErrorCode = require('../common/errorcode')
/**
 * 登录控制器
 */
module.exports = class Auth extends Control {
  constructor(app) {
    super(ControlName, app)
  }

  initIntercept(req, res, next) {
    console.log(req.originalUrl)
    //自定义拦截器
    if (req.originalUrl.startsWith('user')) {
      super
        .checkHearder(req)
        .then(result => {
          //添加数据到body中
          req.body.user = {}
          Object.assign(req.body.user, result)
          next()
        })
        .catch(err => {
          console.log(err)
          res.json('ERROR')
        })
    } else {
      next()
    }
  }
  initRouter() {
    const _router = super.initRouter()
    _router.post('/signIn', (req, res) => {
      this.signInForPassword(req, res)
    })
    _router.post('/signUp', (req, res) => {
      this.signUpForPassword(req, res)
    })
    _router.post('/signInForNameBirth', (req, res) => {
      this.signInForNameBirth(req, res)
    })
    return _router
  }

  //TODO 增加名称缩写加诞辰登录
  /** 小名与生日一次性登录绑定 */
  signInForNameBirth(req, res) {
    const reqData = req.body.data || null
    if (!reqData) {
      this.failReturn(res, ErrorCode.Auth_SignInForNameBirth_NullReqData)
      return
    }
  }
  /**密码登录 */
  signInForPassword(req, res) {
    const reqData = req.body.data || null
    if (!reqData) {
      this.failReturn(res, ErrorCode.Auth_SignIn_NullReqData)
      return
    }
    // 通过baseuser类构建对象
    const base_user = new Base_User(reqData)
    //获取数据
    const operateData = base_user.getData()
    // 登录body校验
    if (!Base_User.verifyAllData(operateData)) {
      this.failReturn(res, ErrorCode.Auth_SignIn_VerifyAllData)
      return
    }

    Base_User.getDataFormLoginName(operateData.loginName, 2)
      .then(loginsearch => {
        if (loginsearch.length == 0) {
          this.failReturn(res, ErrorCode.Auth_SignIn_NoSearchUser)
          return
        } else if (loginsearch.length >= 2) {
          this.failReturn(res, ErrorCode.Auth_SignIn_OneMoreUser)
          return
        }
        //找到唯一用户
        const userdata = loginsearch[0]

        // TODO 依照获取的用户信息，判断登录错误次数，达到一定次数，暂时停止登录尝试
        console.log(loginsearch)
        // 用户密码校验
        if (!base_user.checkWithPassword(userdata.password)) {
          Base_User.loginPassError(userdata)
          this.failReturn(res, ErrorCode.Auth_SignIn_PasswordError)
          return
        } else {
          // 生成token
          userdata['authorization'] = Base_User.createToken(userdata)
          //清空登录错误
          userdata['loginError'] = 0
          userdata['loginTime'] = Moment().format('YYYY-MM-DD HH:mm:ss')
          //所有校验完成，返回结果
          Base_User.updateUser(userdata, [
            'authorization',
            'loginTime',
            'loginError'
          ])
            .then(updateR => {
              console.log(updateR)
              this.successReturn(res, {
                return_obc: {
                  authorization: userdata['authorization'],
                  username: userdata['userName']
                }
              })
              return
            })
            .catch(err => {
              this.failReturn(res, ErrorCode.Auth_SignIn_UpdateSQLError)
              return
            })
        }
      })
      .catch(err => {
        console.log(err)
        this.failReturn(res, ErrorCode.Auth_SignIn_SearchLoginName)
        return
      })
  }
  /**
   *密码注册
   *
   * @param {*} req
   * @param {*} res
   * { data : {...Base_User.operateData}}
   */
  signUpForPassword(req, res) {
    const reqData = req.body.data || null
    if (!reqData) {
      this.failReturn(res, ErrorCode.Auth_SignUp_NullReqData)
      return
    }
    // 通过baseuser类构建对象
    const base_user = new Base_User(reqData)
    //获取数据
    const operateData = base_user.getData()
    if (!Base_User.verifyAllData(operateData)) {
      this.failReturn(res, ErrorCode.Auth_SignUp_VerifyAllData)
      return
    }
    // 检查用户唯一性
    Base_User.getDataFormLoginName(operateData.loginName, 1)
      .then(searchR => {
        if (searchR && searchR.length > 0) {
          //查找到用户名不唯一
          this.failReturn(res, ErrorCode.Auth_SignUp_LoginNameNoOnly)
          return
        } else {
          Base_User.insertData(operateData)
            .then(result => {
              console.log(result)
              this.successReturn(res, {})
              return
            })
            .catch(result => {
              console.log(err)
              this.failReturn(res, ErrorCode.Auth_SignUp_InsertSQL)
              return
            })
        }
      })
      .catch(err => {
        this.failReturn(res, ErrorCode.Auth_SignUp_SearchLoginName)
        return
      })
  }
}
