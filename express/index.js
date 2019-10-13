const express = require('express')
const fs = require("fs");

function init() {
  const app_g = express()
  console.log('express init')
  cors(app_g)
  initCookieParser(app_g)
  initBodyParser(app_g)
  initModel(app_g)
  initErrorHandler(app_g)

  const port = global.config["Debug"] ? 6689 : 80

  var server = app_g.listen(port, function () {
    // var host = server.address().address
    // var port = server.address().port
    // console.log('应用实例，访问地址为 http://%s:%s', host, port)
    console.log(`应用实例:启动端口号为[${port}]`)
  })
}

function initCookieParser(app) {
  const cookieParser = require('cookie-parser')
  app.use(cookieParser())
}
//body 解析器
function initBodyParser(app) {
  console.log('initBodyParser')
  const bodyParser = require('body-parser')
  app.use(bodyParser.json()) // for parsing application/json
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  ) // for parsing application/x-www-form-urlencoded
}

//初始化模块
function initModel(app) {
  //设置网页图标返回文件，自动请求
  app.use('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/web/public/favicon.ico')
  })

  //设置静态托管路径
  app.use('/public', express.static(__dirname + '/web/public'))

  const intercept = require('./intercept')
  intercept.load(app)

  const staticPage = require('./web/index')
  new staticPage(app)
  app.get('/', (req, res) => {
    res.redirect('/page')
  })

  const Auth = require('./control/Auth')
  new Auth(app)
  const UserCenter = require('./control/UserCenter')
  new UserCenter(app)
  const BodyCenter = require('./control/BodyCenter')
  new BodyCenter(app)
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
  const cors = require('cors')
  app.use(cors())
}

function initErrorHandler(app) {
  const logErrors = function (err, req, res, next) {
    console.error('logErrors', err.stack)
    const now = new Date()
    const errordate = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
    const errortime = `${now.getHours()}:${now.getMinutes()+1}:${now.getSeconds()}`
    const errorout = `time:  ${errordate} ${errortime}\n` +
      `ips: ${JSON.stringify(req.ips)}\n` +
      `headers: ${JSON.stringify(req.headers)}\n` +
      `protocol: ${req.protocol} \t\t originalUrl: ${req.originalUrl} \t\t params: ${JSON.stringify(req.params)} \t\t method: ${req.method}\n` +
      `body: ${JSON.stringify(req.body)}\n` +
      `fresh: ${req.fresh} \t\t xhr: ${req.xhr}\n ` +
      `errorinfo:\n` +
      `${JSON.stringify(err.stack)}\n\n`
    fs.writeFile(`Log/Error/${errordate}.txt`, errorout, {
      'flag': 'a'
    }, function (err) {
      if (err) {
        throw err;
      }
    })
    next(err)
  }

  const clientErrorHandler = function (err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({
        error: 'Something failed!'
      })
    } else {
      next(err)
    }
  }

  const errorHandler = function (err, req, res, next) {
    res.status(500)
    res.render('error', {
      error: err
    })
  }

  app.use(logErrors)
  app.use(clientErrorHandler)
  app.use(errorHandler)
}
exports.init = init