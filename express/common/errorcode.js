module.exports = {
  BodyCenter_Insert_NullReqData: {
    return_code: 30000,
    return_msg: '没有请求数据'
  },
  BodyCenter_Insert_VerifyAllData: {
    return_code: 30001,
    return_msg: '数据校验失败'
  },
  BodyCenter_Insert_SetUserId: {
    return_code: 30002,
    return_msg: '添加数据失败'
  },
  BodyCenter_Insert_InsertSQL: {
    return_code: 30003,
    return_msg: '添加数据失败'
  },
  BodyCenter_Delete_NullReqData: {
    return_code: 30004,
    return_msg: '没有请求数据'
  },
  BodyCenter_DeleteBody_NoSearchBody: {
    return_code: 30005,
    return_msg: '单据不存在'
  },
  BodyCenter_DeleteBody_ServerError: {
    return_code: 30006,
    return_msg: '服务器错误'
  },
  BodyCenter_DeleteBody_HaveBeenDelete: {
    return_code: 30007,
    return_msg: '单据不存在'
  },
  BodyCenter_DeleteBody_NoAuthority: {
    return_code: 30008,
    return_msg: '无权限'
  },
  BodyCenter_DeleteBody_SQLERROR: {
    return_code: 30009,
    return_msg: '数据库错误'
  },
  BodyCenter_UpdateBody_NoSearchBody: {
    return_code: 30010,
    return_msg: '单据不存在'
  },
  BodyCenter_UpdateBody_ServerError: {
    return_code: 30011,
    return_msg: '服务器错误'
  },
  BodyCenter_UpdateBody_HaveBeenDelete: {
    return_code: 30012,
    return_msg: '单据不存在'
  },
  BodyCenter_UpdateBody_NoAuthority: {
    return_code: 30013,
    return_msg: '无权限'
  },
  BodyCenter_UpdateBody_SQLERROR: {
    return_code: 30014,
    return_msg: '数据库错误'
  },
  BodyCenter_UpdateBody_VerifyAllData: {
    return_code: 30015,
    return_msg: '数据校验失败'
  },
  BodyCenter_SearchBody_NullReqData: {
    return_code: 30016,
    return_msg: '没有请求数据'
  },
  BodyCenter_SearchBody_SQLERROR: {
    return_code: 30017,
    return_msg: '数据库错误'
  },
  BodyCenter_SearchBody_NoCapule: {
    return_code: 30018,
    return_msg: '没有设置联结对象'
  },
  Auth_SignUp_NullReqData: {
    return_code: 20000,
    return_msg: '没有请求数据'
  },
  Auth_SignUp_VerifyAllData: {
    return_code: 20001,
    return_msg: '数据校验失败'
  },
  Auth_SignUp_InsertSQL: {
    return_code: 20002,
    return_msg: '添加数据失败'
  },
  Auth_SignUp_LoginNameNoOnly: {
    return_code: 20003,
    return_msg: '用户名不唯一'
  },
  Auth_SignUp_SearchLoginName: {
    return_code: 20004,
    return_msg: '查询失败'
  },

  Auth_SignIn_NullReqData: {
    return_code: 20005,
    return_msg: '没有请求数据'
  },
  Auth_SignIn_VerifyAllData: {
    return_code: 20006,
    return_msg: '数据校验失败'
  },
  Auth_SignIn_NoSearchUser: {
    return_code: 20007,
    return_msg: '没有找到用户'
  },
  Auth_SignIn_OneMoreUser: {
    return_code: 20008,
    return_msg: '服务器错误'
  },
  Auth_SignIn_SearchLoginName: {
    return_code: 20009,
    return_msg: '查询失败'
  },
  Auth_SignIn_PasswordError: {
    return_code: 20010,
    return_msg: '密码错误'
  },
  Auth_SignIn_UpdateSQLError: {
    return_code: 20011,
    return_msg: '更新错误'
  },
  Auth_SignInForNameBirth_NullReqData: {
    return_code: 20012,
    return_msg: '没有请求数据'
  }
}
