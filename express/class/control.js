

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

    toString(){
        console.log("CONTROL")
    }
}