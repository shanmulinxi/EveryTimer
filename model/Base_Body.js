const Mysql = require('../mysql/index')
const Moment = require('moment')
const Base = require('./Base')
module.exports = class Base_Body extends Base {
  constructor(obcdata) {
    super(obcdata)
    const operateDataKeys = Object.keys(Base_Body.getOperate())
    operateDataKeys.map(key => {
      if (obcdata[key] != undefined) {
        operateData[key] = obcdata[key]
      }
    })

    this.data = operateData
  }

  static getOperate() {
    return {
      weight: null,
      bmi: null,
      visceralFat: null,
      fatPercent: null,
      waterPercent: null,
      proteinPercent: null,
      baseMetabolism: null,
      bone: null,
      muscle: null,
      bodytype: null,
      remark: ''
    }
  }
  getData() {
    return this.data
  }

  /**
   * 设置使用者,通过则返回true
   * @param {用户id} userid
   */
  setUserId(userid) {
    this.data.userid = userid
    return true
  }

  /**
   *根据id获取数据
   *
   * @param {*} id
   * @param {number} [size=0]
   * @returns
   */
  static getDataFormId(id) {
    const sqlcommand = `SELECT * FROM base_body WHERE id = ?`
    return Mysql.run(sqlcommand, [id])
  }

  /**
   *根据条件获取数据
   *
   * @param {*} id
   * @param {number} [size=0]
   * @returns
   */
  static getDataFormFilter(filter, page = null, pagesize = null) {
    let limitcommand = ''
    if (page != null && pagesize != null) {
      limitcommand += ` LIMIT ${page * pagesize},${pagesize}`
    }
    const sqlcommand =
      `SELECT * FROM base_body WHERE userid = ? ` + limitcommand
    return Mysql.run(sqlcommand, [userid])
  }

  /**
   *更新body信息
   *
   * @static
   * @param {*} body
   * @param {*} [array=[]]
   */
  static updateBody(body, array = 'ALL') {
    const updatelist = []
    const id = body.id
    delete body.id
    if (array === 'ALL') {
      array = Object.keys(body)
    }
    let extercommand = []
    for (let key of array) {
      updatelist.push(body[key])
      extercommand.push(` ${key} = ? `)
    }
    updatelist.push(id)

    const sqlcommand = `UPDATE base_body SET ${extercommand.join(
      ','
    )}WHERE id = ?`
    console.log(sqlcommand, updatelist)
    return Mysql.run(sqlcommand, updatelist)
  }
  /**
   * 数据插入
   * @param {*} operateData 可操作数据原型
   */
  static insertData(operateData) {
    const basebodyData = {
      id: 0,
      userid: 0,
      bodyTime: Moment().format('YYYY-MM-DD HH:mm:ss'),
      creatTime: Moment().format('YYYY-MM-DD HH:mm:ss'),
      editTime: Moment().format('YYYY-MM-DD HH:mm:ss'),
      isDelete: false
    }
    Object.assign(basebodyData, operateData)
    const insertDataKeys = Object.keys(basebodyData)
    const placeholder = new Array(insertDataKeys.length).fill('?')
    const insertDataValues = Object.values(basebodyData)

    const sqlcommand = `INSERT INTO base_body ( ${insertDataKeys.join(
      ' , '
    )} ) VALUES ( ${placeholder.join(' , ')} )`

    console.log(sqlcommand)
    return Mysql.run(sqlcommand, insertDataValues)
  }

  /**
   * 数据正确性验证
   */
  static verifyAllData(obc) {
    const t_Patt_Number = /[^0-9]/

    console.log('verifyAllData', obc)
    for (let key in obc) {
      switch (key) {
        case 'weight': {
          if (obc[key] == null) continue
          if (t_Patt_Number.test(obc[key])) {
            return '体重只能输入数字哟(｡･ω･｡)'
          } else if (Number(obc[key]) > 200000 || Number(obc[key]) < 20000) {
            return '体重感觉不对哦~检查看看吧❥(^_-)'
          }
          break
        }
        case 'bodytype': {
          if (obc[key] == null) continue
          if (t_Patt_Number.test(obc[key])) {
            return '体型数据格式竟然格式出错了!?'
          } else if (Number(obc[key]) >= 9 || Number(obc[key]) < 0) {
            return '体型数据出错了!?'
          }
          break
        }
        case 'muscle': {
          if (obc[key] == null) continue
          if (t_Patt_Number.test(obc[key])) {
            return '肌肉量只能输入数字哟(｡･ω･｡)'
          } else if (Number(obc[key]) > 200000 || Number(obc[key]) < 20000) {
            return '肌肉量感觉不对哦~检查看看吧❥(^_-)'
          }
          break
        }
        case 'bone': {
          if (obc[key] == null) continue
          if (t_Patt_Number.test(obc[key])) {
            return '骨质量只能输入数字哟(｡･ω･｡)'
          } else if (Number(obc[key]) > 200000 || Number(obc[key]) < 20000) {
            return '骨质量感觉不对哦~检查看看吧❥(^_-)'
          }
          break
        }
        case 'baseMetabolism': {
          if (obc[key] == null) continue
          if (t_Patt_Number.test(obc[key])) {
            return '基础代谢只能输入数字哟(｡･ω･｡)'
          }
          break
        }
        case 'visceralFat':
        case 'fatPercent':
        case 'waterPercent':
        case 'proteinPercent':
        case 'bmi': {
          if (obc[key] != null && t_Patt_Number.test(obc[key])) {
            return false
          }
          break
        }
      }
    }
    return true
  }
}
