

var express = require('express');
const Control = require('../class/control')


const ControlName = 'page'

const PagePath = __dirname+'/page'
/**
 * 静态页面控制器
 */
module.exports =  class staticPage extends Control{
    constructor(app){
        app.use('/public', express.static(__dirname+"/public"));
        super(ControlName,app)
    }
    initIntercept(req, res, next){
        //自定义拦截器
        next();
    }
    initRouter(){
        const _router =  super.initRouter()
        _router.get('/',(req, res)=>{  
            res.sendFile( PagePath + "/index.html" );
         })
        _router.get('/index',(req, res)=>{
            res.sendFile( PagePath + "/index.html" );
         })

       

         return _router
    }
    
   
}
   
// exports.load = load;