



let MysqlConnection = null
/**
 *初始化MYSQL并连接
 *
 */
function initMysql(){
    const Mysql = require('mysql');
    const _debug_mysql =  {
        host     : '49.232.6.80',
        user     : 'com',
        port		 : '3306',
        password : 'combao-926',
        database : 'websites'
    }
    const MysqlConfig = global.config.debug ? _debug_mysql : global.config.mysql
    console.log("Mysql",MysqlConfig)
    MysqlConnection = Mysql.createConnection(MysqlConfig);
    MysqlConnection.connect();
}


/**
 * 检查MYSQL连接状态
 */

function checkConnection(){
  if(MysqlConnection === null){
    console.error("MysqlConnection is null")
    return false
  }
  return true
}

/**
 *关闭MYSQL连接
 *
 */
function closeMysql(){
  if(!checkConnection())return
  MysqlConnection.end();
}

function selectData(){

}

exports.initMysql = initMysql
exports.closeMysql = closeMysql


//查询数据
// var  sql = 'SELECT * FROM websites';
// Connection.query(sql,function (err, result) {
//   if(err){
//     console.log('[SELECT ERROR] - ',err.message);
//     return;
//   }
//  console.log('--------------------------SELECT----------------------------');
//  console.log(result);
//  console.log('------------------------------------------------------------\n\n');
// });


//插入数据
// var  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
// var  addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
// //增
// connection.query(addSql,addSqlParams,function (err, result) {
//         if(err){
//          console.log('[INSERT ERROR] - ',err.message);
//          return;
//         }        
 
//        console.log('--------------------------INSERT----------------------------');
//        //console.log('INSERT ID:',result.insertId);        
//        console.log('INSERT ID:',result);        
//        console.log('-----------------------------------------------------------------\n\n');  
// });


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


