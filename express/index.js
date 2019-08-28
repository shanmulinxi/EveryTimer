


function init(expressApp) {
    console.log("expressApp init");
    initModel(expressApp)


    var server = expressApp.listen(6689, function () {
 
        var host = server.address().address
        var port = server.address().port
       
        console.log("应用实例，访问地址为 http://%s:%s", host, port)
       
      })
}

//初始化模块
function initModel(app){
    const intercept = require("./intercept");
    intercept.load(app)

    // const common = require("./common/common");
    // common.load(app)

    const auth = require("./control/auth");
    // auth.load(app)
    const test = new auth(app)

}
   
exports.init = init;
  