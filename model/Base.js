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
   * @param {filter} {
                      field: 'bodyTime',
                      operate: 'between',
                      value: '2019-10-07',
                    }
   * @param {order} {
                      field: 'bodyTime',
                      type: 'DESC'||'ASC',
                    }
   * @returns
   */
  static getDataFormFilter({
    filter = [],
    pagesize = null,
    page = null,
    order = null
  }) {
    let limitcommand = ''
    if (pagesize != null) {
      page = page == null ? 0 : page
      limitcommand += ` LIMIT ${page * pagesize},${pagesize}`
    }

    let ordercommand = ""
    if (order != null) {
      let orderParamASC = []
      let orderParamDESC = []
      order.map(item => {
        if (item.type == "DESC") {
          orderParamDESC.push(item.field)
        } else if (item.type == "ASC") {
          orderParamASC.push(item.field)
        }
      })
      if (orderParamASC.length > 0) {
        orderParamASC = [orderParamASC.join(', ') + " ASC "]
      }
      if (orderParamDESC.length > 0) {
        orderParamDESC = [orderParamDESC.join(', ') + " DESC "]
      }
      let orderParam = orderParamASC.concat(orderParamDESC)
      if (orderParam.length > 0) {
        ordercommand = " ORDER BY " + orderParam.join(', ')
      }

    }
    const sqlfilter = Util.creatFilter(filter)
    const tablename = this.getTabel()
    const sqlcommand =
      `SELECT * FROM ${tablename} ` + sqlfilter.command + limitcommand + ordercommand

    return Mysql.run(sqlcommand, sqlfilter.param)
  }

  static updateFormFilter(obc, list = null, filter = []) {
    const updatelist = []

    if (list === null) {
      list = Object.keys(obc)
    }
    let setcommand = []
    for (let key of list) {
      updatelist.push(obc[key])
      setcommand.push(` ${key} = ? `)
    }
    const sqlfilter = Util.creatFilter(filter)
    const tablename = this.getTabel()
    const sqlparam = updatelist.concat(sqlfilter.param)
    const sqlcommand =
      `UPDATE ${tablename} SET ` + setcommand.join(',') + sqlfilter.command
    return Mysql.run(sqlcommand, sqlparam)
  }
}