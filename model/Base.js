const Mysql = require('../mysql/index')
const Moment = require('moment')
const Util = require('../tool/util')
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

  /**
   *根据条件获取数据
   *
   * @param {*} id
   * @param {number} [size=0]
   * @returns
   */
  static getDataFormFilter(filter, pagesize = null, page = null) {
    let limitcommand = ''
    if (pagesize != null) {
      page = page == null ? 0 : page
      limitcommand += ` LIMIT ${page * pagesize},${pagesize}`
    }
    const sqlfilter = Util.creatFilter(filter)
    const tablename = this.getTabel()
    const sqlcommand =
      `SELECT * FROM ${tablename} ` + sqlfilter.command + limitcommand

    return Mysql.run(sqlcommand, sqlfilter.param)
  }
}
