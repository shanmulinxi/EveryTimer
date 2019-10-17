const Moment = require('moment')
const Base = require('./Base')
module.exports = class Request_Log extends Base {
  static getTabel() {
    return 'request_log'
  }

  //获取基础模型
  static getBaseModel() {
    const nowtime = Moment().format('YYYY-MM-DD HH:mm:ss')
    return {
      id: 0,
      hostname: null,
      originalUrl: null,
      ip: null,
      time: nowtime,
      protocol: null,
      headers: null,
      params: null,
      method: null,
      body: null,
      fresh: null,
      xhr: null,
    }
  }

  constructor(obcdata) {
    super(obcdata)
    const operateData = Base_User.getOperateModel()
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
  static insertData(obcdata) {

    const operateData = this.getBaseModel()
    const operateDataKeys = Object.keys(operateData)
    operateDataKeys.map(key => {
      if (obcdata[key] != undefined) {
        operateData[key] = obcdata[key]
      }
    })
    operateData.id = 0
    return this.insertBaseData(operateData)
  }


}