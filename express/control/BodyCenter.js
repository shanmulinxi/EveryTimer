const Moment = require('moment')
const Control = require('../class/Control')

const Base_Body = require('../../model/Base_Body')
const Base_User = require('../../model/Base_User')
const ErrorCode = require('../common/errorcode')

const ControlName = 'BodyCenter'

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
        //添加数据到body中
        req.body.user = {}
        Object.assign(req.body.user, result)

        next()
        return
      })
      .catch(err => {
        this.failReturn(res, ErrorCode.LoginError)
        return
      })
    //自定义拦截器
  }
  initRouter() {
    const _router = super.initRouter()
    _router.post('/insertbody', (req, res) => {
      this.insertBodyData(req, res)
    })
    _router.post('/deletebody', (req, res) => {
      this.deleteBodyData(req, res)
    })
    _router.post('/updatebody', (req, res) => {
      this.updateBodyData(req, res)
    })
    _router.post('/searchbody', (req, res) => {
      this.searchBodyData(req, res)
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
      this.failReturn(
        res,
        ErrorCode.BodyCenter_Insert_NullReqData,
        '??没有请求的数据呀'
      )
      return
    }
    // 通过basebody类构建数据对象
    const base_body = new Base_Body(reqData)
    //获取数据
    const operateData = base_body.getData()
    const verifymsg = Base_Body.verifyData(operateData)
    if (verifymsg != true) {
      this.failReturn(res, ErrorCode.BodyCenter_Insert_VerifyAllData, verifymsg)
      return
    }
    if (!base_body.setUserId(reqUser.id)) {
      this.failReturn(res, ErrorCode.BodyCenter_Insert_SetUserId)
      return
    }

    console.log(operateData)
    Base_Body.insertData(operateData)
      .then(result => {
        console.log(result)
        this.successReturn(res, {
          return_obc: {
            id: result.insertId,
            ...operateData
          }
        })
        return
      })
      .catch(err => {
        console.log(err)
        this.failReturn(
          res,
          ErrorCode.BodyCenter_Insert_InsertSQL,
          '抱歉出错啦!'
        )
        return
      })
  }

  deleteBodyData(req, res) {
    const reqData = req.body.data || null
    const reqUser = req.body.user || null
    if (!reqData || !reqUser) {
      this.failReturn(
        res,
        ErrorCode.BodyCenter_Delete_NullReqData,
        '??没有请求的数据呀'
      )
      return
    }
    //获取数据
    Base_Body.getDataFormId(reqData['id'])
      .then(searchR => {
        if (searchR.length == 0) {
          this.failReturn(res, ErrorCode.BodyCenter_DeleteBody_NoSearchBody)
          return
        } else if (searchR.length >= 2) {
          this.failReturn(res, ErrorCode.BodyCenter_DeleteBody_ServerError)
          return
        }
        // 找到唯一可操作数据
        const operateData = searchR[0]

        if (operateData['isDelete']) {
          this.failReturn(res, ErrorCode.BodyCenter_DeleteBody_HaveBeenDelete)
          return
        } else if (Number(operateData['userid']) != Number(reqUser.id)) {
          this.failReturn(res, ErrorCode.BodyCenter_DeleteBody_NoAuthority)
          return
        }

        operateData['isDelete'] = true
        operateData['editTime'] = Moment().format('YYYY-MM-DD HH:mm:ss')
        Base_Body.updateBody(operateData, ['isDelete', 'editTime'])
          .then(result => {
            this.successReturn(res, {})
          })
          .catch(err => {
            console.log(err)
            this.failReturn(res, ErrorCode.BodyCenter_DeleteBody_SQLERROR)
          })
      })
      .catch(err => {
        console.log(err)
        this.failReturn(res, ErrorCode.BodyCenter_DeleteBody_SQLERROR)
      })
  }
  /**
   * 修改body数据方法
   */
  updateBodyData(req, res) {
    const reqData = req.body.data || null
    const reqUser = req.body.user || null
    if (!reqData || !reqUser) {
      this.failReturn(
        res,
        ErrorCode.BodyCenter_Delete_NullReqData,
        '??没有请求的数据呀'
      )
      return
    }

    //获取数据
    Base_Body.getDataFormId(reqData['id'])
      .then(searchR => {
        if (searchR.length == 0) {
          this.failReturn(res, ErrorCode.BodyCenter_UpdateBody_NoSearchBody)
          return
        } else if (searchR.length >= 2) {
          this.failReturn(res, ErrorCode.BodyCenter_UpdateBody_ServerError)
          return
        }

        // 找到唯一可操作数据
        const operateData = searchR[0]

        if (operateData['isDelete']) {
          this.failReturn(res, ErrorCode.BodyCenter_UpdateBody_HaveBeenDelete)
          return
        } else if (Number(operateData['userid']) != Number(reqUser.id)) {
          // 非添加人员 禁止修改 // TODO 可能增加权限控制
          this.failReturn(res, ErrorCode.BodyCenter_UpdateBody_NoAuthority)
          return
        }
        // 可操作KeyList
        const operateKeyList = Object.keys(Base_Body.getOperate())
        // 提交数据KeyList
        const dataKeyList = Object.keys(reqData)
        // 修改数据KeyList
        const sqlList = []
        for (let key of dataKeyList) {
          if (operateKeyList.includes(key)) {
            sqlList.push(key)
            operateData[key] = reqData[key]
          }
        }
        // 数据正确性验证
        const verifymsg = Base_Body.verifyData(operateData, sqlList)
        if (verifymsg != true) {
          this.failReturn(
            res,
            ErrorCode.BodyCenter_UpdateBody_VerifyAllData,
            verifymsg
          )
          return
        }
        // 调整修改时间
        operateData['editTime'] = Moment().format('YYYY-MM-DD HH:mm:ss')
        Base_Body.updateBody(operateData, [...sqlList, 'editTime'])
          .then(result => {
            this.successReturn(res, {})
          })
          .catch(err => {
            console.log(err)
            this.failReturn(res, ErrorCode.BodyCenter_UpdateBody_SQLERROR)
          })
      })
      .catch(err => {
        console.log(err)
        this.failReturn(res, ErrorCode.BodyCenter_UpdateBody_SQLERROR)
      })
  }

  /**
   * 查找body数据方法
   */
  searchBodyData(req, res) {
    const reqData = req.body.data || null
    const reqUser = req.body.user || null
    if (!reqData || !reqUser) {
      this.failReturn(
        res,
        ErrorCode.BodyCenter_SearchBody_NullReqData,
        '??没有请求的数据呀'
      )
      return
    }

    let { capule, filter, order } = reqData
    if (!order) {
      order = null
    }
    let searchUserId = reqUser['id']
    Base_User.getDataFormId(reqUser['id'])
      .then(userR => {
        if (capule === true) {
          searchUserId = userR[0]['capuleid']
          if (searchUserId === null) {
            this.failReturn(res, ErrorCode.BodyCenter_SearchBody_NoCapule)
            return
          }
        }

        // 设置userid  只有本人或联结对象
        // 设置isDelete 默认获取未删除的
        filter.push({
          field: 'userid',
          operate: 'equal',
          value: searchUserId
        })
        filter.push({
          field: 'isDelete',
          operate: 'equal',
          value: 'false'
        })

        Base_Body.getDataFormFilter({
          filter,
          order
        }).then(result => {
          this.successReturn(res, {
            return_obc: result
          })
          return
        })
      })
      .catch(err => {
        console.log(err)
        this.failReturn(res, ErrorCode.BodyCenter_SearchBody_SQLERROR)
        return
      })
    return
  }
}
