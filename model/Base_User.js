const Mysql = require('../mysql/index')
const Moment = require('moment')
const Base = require('./Base')
const Crypto = require('crypto')
const Jwt = require('jsonwebtoken') //用来生成token
module.exports = class Base_User extends Base {
  static getTabel() {
    return 'base_user'
  }

  constructor(obcdata) {
    const operateData = {
      loginName: '',
      userName: '',
      password: '',
      message: null,
      remark: null
    }
    const operateDataKeys = Object.keys(operateData)
    operateDataKeys.map(key => {
      if (obcdata[key] != undefined) {
        operateData[key] = obcdata[key]
      }
    })

    this.data = operateData
  }

  getData() {
    return this.data
  }

  /**
   * 数据插入
   * @param {*} operateData 可操作数据原型
   */
  static insertData(operateData) {
    const nowtime = Moment().format('YYYY-MM-DD HH:mm:ss')
    const baseuserData = {
      id: 0,
      creatTime: nowtime,
      editTime: nowtime,
      isDelete: false,
      loginTime: null,
      loginError: 0,
      authorization: null,
      capuleid: null
    }
    Object.assign(baseuserData, operateData)

    //对密码进行加盐加密
    const password = Base_User.passwordAddSalt(baseuserData.password)

    baseuserData.password = Base_User.creatMD5(password)

    const insertDataKeys = Object.keys(baseuserData)
    const placeholder = new Array(insertDataKeys.length).fill('?')
    const insertDataValues = Object.values(baseuserData)

    const sqlcommand = `INSERT INTO base_user ( ${insertDataKeys.join(
      ','
    )} ) VALUES ( ${placeholder.join(',')} )`

    console.log(sqlcommand)
    return Mysql.run(sqlcommand, insertDataValues)
  }

  /**
   *根据用户名获取数据
   *
   * @param {*} loginName
   * @param {number} [size=0]
   * @returns
   */
  static getDataFormLoginName(loginName, size = 0) {
    let extercommand = ''
    if (size > 0) {
      extercommand += ' LIMIT ' + size
    }
    const sqlcommand =
      `SELECT * FROM base_user WHERE loginName = ?` + extercommand
    return Mysql.run(sqlcommand, [loginName])
  }

  /**
   * 数据正确性验证
   */
  static verifyAllData(obc) {
    const t_Patt_Number = /[^0-9]/
    const t_Patt_LoginName = /\W/
    for (let key in obc) {
      switch (key) {
        case 'password':
        case 'loginName': {
          if (
            !obc[key] ||
            obc[key].length < 4 ||
            obc[key].length > 20 ||
            t_Patt_LoginName.test(obc[key])
          ) {
            return false
          }
        }
        default:
      }
    }
    return true
  }
  /**
   *更新用户信息
   *
   * @static
   * @param {*} user
   * @param {*} [array=[]]
   */
  static updateUser(user, array = 'ALL') {
    const updatelist = []
    const id = user.id
    delete user.id
    if (array === 'ALL') {
      array = Object.keys(user)
    }
    let extercommand = []
    for (let key of array) {
      updatelist.push(user[key])
      extercommand.push(` ${key} = ? `)
    }
    updatelist.push(id)

    const sqlcommand = `UPDATE base_user SET ${extercommand.join(
      ','
    )}WHERE id = ?`
    console.log(sqlcommand, updatelist)
    return Mysql.run(sqlcommand, updatelist)
  }

  /**
   *生成token信息
   *
   * @static
   * @param {*} user
   */
  static createToken(user) {
    const nowString = Moment().format('YYYY-MM-DD HH:mm:ss')
    let tokenContent = {
      id: user['id'],
      loginName: user['loginName'],
      loginTime: nowString
    } // 要生成token的主题信息
    let secretOrPrivateKey = global.config.TokenKey // 这是加密的key（密钥）
    let token = Jwt.sign(tokenContent, secretOrPrivateKey, {
      expiresIn: 60 * 60 * 24 * 365 //365 * 24小时过期
    })
    return token
  }
  /**
   *用户登录错误
   *
   */
  static loginPassError(user) {
    const loginTime = Moment().format('YYYY-MM-DD HH:mm:ss')
    const loginError = user.loginError + 1
    const userid = user.id
    const sqlcommand = `UPDATE base_user SET loginTime = ? , loginError = ? WHERE id = ?`
    console.log(sqlcommand, [loginTime, loginError, userid])
    return Mysql.run(sqlcommand, [loginTime, loginError, userid])
  }
  /**
   *输入伪密码进行对比
   *
   * @param {*} pseudoPassword
   */
  checkWithPassword(pseudoPassword) {
    const password = this.data.password
    const saltpass = Base_User.passwordAddSalt(password)
    const realpass = Base_User.creatMD5(saltpass).toUpperCase()
    return realpass === pseudoPassword
  }
  /**
   *密码加盐
   *
   * @param {*} poss
   */
  static passwordAddSalt(poss) {
    return poss.padStart(20, '~!@#$.%^&*()-=+_____')
  }

  /**密码md5加密 */
  static creatMD5(word) {
    return Crypto.createHash('MD5')
      .update(word)
      .digest('hex')
      .toUpperCase()
  }
  /**密码sha256加密 */
  static creatSHA256(word) {
    return Crypto.createHash('SHA256')
      .update(word)
      .digest('hex')
      .toUpperCase()
  }
}
