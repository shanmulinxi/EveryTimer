const express = require('express');

function init() {


    const app_g = express();
    console.log("express init");
    cors(app_g)
    initCookieParser(app_g)
    initBodyParser(app_g)
    initModel(app_g)


    var server = app_g.listen(6689, function () {

        var host = server.address().address
        var port = server.address().port

        console.log("应用实例，访问地址为 http://%s:%s", host, port)

    })
}

function initCookieParser(app) {
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
}
//body 解析器
function initBodyParser(app) {
    console.log("initBodyParser")
    const bodyParser = require('body-parser');
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({
        extended: true
    })); // for parsing application/x-www-form-urlencoded
}

//初始化模块
function initModel(app) {
    //设置网页图标返回文件，自动请求
    app.use('/favicon.ico', (req, res) => {
        res.sendFile(__dirname + "/web/public/favicon.ico");
    });
    //设置静态托管路径
    app.use('/public', express.static(__dirname + "/web/public"));

    const intercept = require("./intercept");
    intercept.load(app)

    const staticPage = require("./web/index")
    new staticPage(app)
    // const common = require("./common/common");
    // common.load(app)

    const auth = require("./control/auth");
    new auth(app)

}

//设置跨域访问，在其他设置前先设置这个
function cors(app) {


    //基础设置
    // app.all('*', function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");
    // next();
    // });

    //模块设置
    const cors = require('cors');
    app.use(cors());
}
exports.init = init;