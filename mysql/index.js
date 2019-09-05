var MysqlMap = require("./map")
let MysqlConnection = null

exports.mysqlCon = MysqlConnection
/**
 *初始化MYSQL并连接
 *
 */
function initMysql() {
  const Mysql = require('mysql');
  const MysqlConfig = global.config.Debug === false ? global.config.Mysql : global.config.DebugMysql
  console.log("Mysql connecting")
  MysqlConnection = Mysql.createConnection(MysqlConfig);
  MysqlConnection.connect();
  console.log("Mysql connect finish")
}

exports.initMysql = initMysql

/**
 * 检查MYSQL连接状态
 */

function checkConnection() {
  if (MysqlConnection === null) {
    console.error("MysqlConnection is null")
    return false
  }
  return true
}

/**
 *关闭MYSQL连接
 *
 */
function closeMysql() {
  if (!checkConnection()) return
  MysqlConnection.end();
}
exports.closeMysql = closeMysql

/**
 * 直接运行MYSQL命令
 * @param {*} sql 
 * @param {*} param 
 */
function run(sql, param = []) {
  console.log(param)
  return new Promise(function (resolve, reject) {
    MysqlConnection.query(sql, param, function (err, result) {
      if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        reject(err)
      }
      resolve(result)
    });
  })
}
exports.run = run

function selectData(tableName, whereList = {}, limitSize = 1) {

  //查询数据
  const sql = 'SELECT * FROM ' + MysqlMap.g_table(tableName) + " LIMIT " + limitSize;

  return new Promise(function (resolve, reject) {
    MysqlConnection.query(sql, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
        reject({
          state: false,
          code: "false",
          err: err
        })
      }
      resolve({
        state: true,
        code: "true",
        result
      })
    });

  })

}

exports.selectData = selectData


function insertData(tableName, obc) {
  const obcKey = Object.keys(obc)
  const obcParam = []
  const obcValue = []
  for (let key of obcKey) {
    obcParam.push('?')
    obcValue.push(obc[key])
  }

  //插入数据
  var addSql = 'INSERT INTO ' + MysqlMap.g_table(tableName) + '(' + obcKey.join(',') + ') VALUES(' + obcParam.join(',') + ')';

  return new Promise(function (resolve, reject) {
    //增
    MysqlConnection.query(addSql, obcValue, function (err, result) {
      if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        reject({
          state: false,
          code: "false",
          err: err
        })
      }
      resolve({
        state: true,
        code: "true",
        result: result
      })

    });
  })



}

exports.insertData = insertData





//更新数据
// var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
// var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',6];
// //改
// connection.query(modSql,modSqlParams,function (err, result) {
//    if(err){
//          console.log('[UPDATE ERROR] - ',err.message);
//          return;
//    }        
//   console.log('--------------------------UPDATE----------------------------');
//   console.log('UPDATE affectedRows',result.affectedRows);
//   console.log('-----------------------------------------------------------------\n\n');
// });

//删除数据
// const delSql = 'DELETE FROM websites where id=6';
// //删
// Connection.query(delSql,function (err, result) {
//         if(err){
//           console.log('[DELETE ERROR] - ',err.message);
//           return;
//         }        

//        console.log('--------------------------DELETE----------------------------');
//        console.log('DELETE affectedRows',result.affectedRows);
//        console.log('-----------------------------------------------------------------\n\n');  
// });