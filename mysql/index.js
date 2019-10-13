var MysqlMap = require('./map')

let InitPoll = false
let MysqlPool = null
let MysqlConnection = null

exports.mysqlCon = MysqlConnection

/**
 *初始化MYSQL并连接//X
 *初始化MYSQL
 * @param {boolean} [pools=false] 使用连接池
 */
function initMysql(pools = false) {
  const Mysql = require('mysql')
  const MysqlConfig =
    global.config.Debug === false ?
    global.config.Mysql :
    global.config.DebugMysql
  if (!pools) {
    //不使用连接池的情况
    console.log('Mysql connecting')

    MysqlConnection = Mysql.createConnection(MysqlConfig)
    MysqlConnection.connect(function (err) {
      if (err) {
        setTimeout(() => {
          initMysql()
        }, 2000);
      }
    });

    /**
     * 当MySQL连接丢失时会抛出一个异常，
     * 这个异常的code就是‘PROTOCOL_CONNECTION_LOST’当捕捉的这个异常的时候就执行重新连接，
     * 这样就能解决连接丢失的问题
     * * */
    MysqlConnection.on('error', function (err) {
      console.error('db error', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('db error执行重连:' + err.message);
        initMysql();
      } else {
        throw err;
      }
    })
    console.log('Mysql connect finish')
  } else {
    //使用连接池的情况
    InitPoll = true
    MysqlPool = Mysql.createPool(MysqlConfig)

  }

}

exports.initMysql = initMysql

/**
 * 检查MYSQL连接状态
 */

function checkConnection() {
  if (MysqlConnection === null) {
    console.error('MysqlConnection is null')
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
  MysqlConnection.end()
}
exports.closeMysql = closeMysql

var query = function (sql, options, callback) {

  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err, null, null);
    } else {
      conn.query(sql, options, function (err, results, fields) {
        //事件驱动回调
        callback(err, results, fields);
      });
      //释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
      conn.release();
    }
  });
}

/**
 * 直接运行MYSQL命令
 * @param {*} sql
 * @param {*} param
 */
function run(sql, options = []) {

  //判断是否使用了连接池
  if (!InitPoll) {
    //不使用
    return new Promise(function (resolve, reject) {
      MysqlConnection.query(sql, options, function (err, result) {
        if (err) {
          console.log('[INSERT ERROR] - ', err.message)
          reject(err)
        }
        resolve(result)
      })
    })

  } else {
    //使用
    return new Promise(function (resolve, reject) {
      MysqlPool.getConnection(function (err, conn) {

        if (err) {
          resolve(err)
        } else {
          conn.query(sql, options, function (err, result) {
            // console.log(fields[0], fields.length)
            if (err) {
              console.log('[INSERT ERROR] - ', err.message)
              reject(err)
            }
            resolve(result)
          });
          //释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
          // console.log("release")
          conn.release()
        }
      })
    })
  }

}
exports.run = run


function selectData(tableName, whereList = {}, limitSize = 1) {
  //查询数据
  const sql =
    'SELECT * FROM ' + MysqlMap.g_table(tableName) + ' LIMIT ' + limitSize

  return new Promise(function (resolve, reject) {
    MysqlConnection.query(sql, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message)
        return
        reject({
          state: false,
          code: 'false',
          err: err
        })
      }
      resolve({
        state: true,
        code: 'true',
        result
      })
    })
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
  var addSql =
    'INSERT INTO ' +
    MysqlMap.g_table(tableName) +
    '(' +
    obcKey.join(',') +
    ') VALUES(' +
    obcParam.join(',') +
    ')'

  return new Promise(function (resolve, reject) {
    //增
    MysqlConnection.query(addSql, obcValue, function (err, result) {
      if (err) {
        console.log('[INSERT ERROR] - ', err.message)
        reject({
          state: false,
          code: 'false',
          err: err
        })
      }
      resolve({
        state: true,
        code: 'true',
        result: result
      })
    })
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