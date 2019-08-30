

const express = require('express');
const router = express.Router();


/**
 * 自定义 http控制器
 */
var _controlName = ''
module.exports =  class Control {
    
    
    constructor(controlName,app){
        _controlName = controlName
        const route = this.initRouter()
        app.use('/'+controlName, this.initIntercept ,route)
        app.use(this.logErrors)
        app.use(this.clientErrorHandler)
        app.use(this.errorHandler)
        console.log(controlName + " control init");
    }

    /**
     * 初始化自定义拦截器
     * @param {*} req 请求参数
     * @param {*} res 返回参数
     * @param {*} next 下一个中间件方法
     */
    initIntercept(req, res, next){
        //自定义拦截器
        next();
    }
    /**
     * 初始化路由
     */
    initRouter(){
        const _router =  router.get('/',function (req, res) {
            res.send('this is '+ _controlName );
         })
         return _router
    }

    failReturn(res,return_obc={},return_msg="fail",return_code="fail"){
        res.json({ return_code, return_msg, return_obc})
    }
    
    successReturn(res,return_obc={},return_msg="success",return_code="success"){
        res.json({ return_code, return_msg, return_obc})
    }
    logErrors (err, req, res, next) {
        console.error("logErrors",err.stack)
        next(err)
    }

    clientErrorHandler (err, req, res, next) {
        if (req.xhr) {
            res.status(500).send({ error: 'Something failed!' })
        } else {
            next(err)
        }
    }

    errorHandler (err, req, res, next) {
        res.status(500)
        res.render('error', { error: err })
    }
      
      
}