const Control = require('../class/Control')

const Base_Body = require('../../model/Base_Body')
const ErrorCode = require('../common/errorcode')
const ControlName = 'BodyCenter'
const ControlIndex = 2
/**
 * 控制器
 */
module.exports = class BodyCenter extends Control {
  constructor(app) {
    super(ControlName, app)
  }

  initIntercept(req, res, next) {
    super
      .checkHearder(req)
      .then(result => {
        if (req.originalUrl.lastIndexOf('/insert') != -1) {
          //添加数据到body中
          req.body.user = {}
          Object.assign(req.body.user, result)
        }
        next()
      })
      .catch(err => {
        console.log(err)
        res.json('ERROR')
      })
    //自定义拦截器
  }
  initRouter() {
    const _router = super.initRouter()
    _router.post('/insert', (req, res) => {
      this.insertBodyData(req, res)
    })

    return _router
  }

  /**
   * 插入Body数据方法
   */
  insertBodyData(req, res) {
    const reqData = req.body.data || null
    const reqUser = req.body.user || null
    if (!reqData || !reqUser) {
      this.failReturn(res, ErrorCode.BodyCenter_Insert_NullReqData)
      return
    }
    // 通过basebody类构建数据对象
    const base_body = new Base_Body(reqData)

    if (!base_body.verifyAllData()) {
      this.failReturn(res, ErrorCode.BodyCenter_Insert_VerifyAllData)
      return
    }
    if (!base_body.setUserId(reqUser.id)) {
      this.failReturn(res, ErrorCode.BodyCenter_Insert_SetUserId)
      return
    }

    //获取数据
    const operateData = base_body.getData()
    console.log(operateData)
    base_body
      .insertData(operateData)
      .then(result => {
        console.log(result)
        this.successReturn(res, {})
        return
      })
      .catch(err => {
        console.log(err)
        this.failReturn(res, ErrorCode.BodyCenter_Insert_InsertSQL)
        return
      })
  }
}