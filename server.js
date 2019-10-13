var ExpressAPP = require("./express/index");
var Mysql = require("./mysql/index")


function start() {
  console.log("server start")


  Mysql.initMysql(true)
  // require("./test")
  ExpressAPP.init()

}

exports.start = start;