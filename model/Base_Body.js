const Mysql = require('../mysql/index')
const Moment = require('moment')

module.exports = class Base_Body {
  constructor(obcdata) {
    const operateData = {
      weight: 0,
      bmi: 0,
      visceralFat: 0,
      fatPercent: 0,
      waterPercent: 0,
      proteinPercent: 0,
      baseMetabolism: 0,
      bone: 0,
      muscle: 0,
      bodytype: 0,
      remark: ''
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
   * 设置使用者,通过则返回true
   * @param {用户id} userid
   */
  setUserId(userid) {
    this.data.userid = userid
    return true
  }

  /**
   * 数据插入
   * @param {*} operateData 可操作数据原型
   */
  insertData(operateData) {
    const basebodyData = {
      id: 0,
      userid: 0,
      bodyTime: Moment().format('YYYY-MM-DD hh:mm:ss'),
      creatTime: Moment().format('YYYY-MM-DD hh:mm:ss'),
      editTime: Moment().format('YYYY-MM-DD hh:mm:ss'),
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
  verifyAllData() {
    const t_Patt_Number = /[^0-9]/
    const obc = this.data
    for (let key in obc) {
      switch (key) {
        case 'bodytype':
        case 'muscle':
        case 'bone':
        case 'baseMetabolism':
        case 'visceralFat':
        case 'fatPercent':
        case 'waterPercent':
        case 'proteinPercent':
        case 'bmi':
        case 'weight': {
          if (t_Patt_Number.test(obc[key])) {
            return false
          }
          break
        }
      }
    }
    return true
  }
}