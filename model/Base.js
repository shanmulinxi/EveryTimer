const Mysql = require('../mysql/index')
const Moment = require('moment')

module.exports = class Base {
  constructor(obcdata) {}

  static getTabel() {
    return 'Base'
  }

  static test() {
    console.log(this.getTabel())
  }

  /**
   *根据id获取数据
   *
   * @param {*} id
   * @returns
   */
  static getDataFormId(id) {
    const sqlcommand = `SELECT * FROM ` + this.getTabel() + ` WHERE id = ?`
    return Mysql.run(sqlcommand, [id])
  }
}
