


const Control = require('../class/control')
const Jwt = require('jsonwebtoken');  //用来生成token

const Mysql = require("../../mysql/index")
const ControlName = 'auth'

/**
 * 登录控制器
 */
module.exports =  class auth extends Control{
    constructor(app){
        super(ControlName,app)
        
    }
    initIntercept(req, res, next){
        //自定义拦截器
        next();
    }
    initRouter(){
        const _router =  super.initRouter()
        
        _router.post('/about',function (req, res) {

            // let secretOrPrivateKey=global.config.TokenKey;// 这是加密的key（密钥）
            // let token = req.get("Authorization"); // 从Authorization中获取token
            // Jwt.verify(token, secretOrPrivateKey, (err, decode)=> {
            //     if (err) {  //  时间失效的时候 || 伪造的token
            //         console.log(err)
            //         res.send({'status':10010});
            //     } else {
            //         res.send({'status':10000});
            //     }
            // })
            Mysql.insertData("base_user")
            res.send({'status':10000});
         })

         _router.post('/userlogin',function (req,res){
             console.log(req.get("Authorization"))
             let tokenContent ={userName:req.body.userName,loginName:req.body.loginName}; // 要生成token的主题信息
             let secretOrPrivateKey=global.config.TokenKey;// 这是加密的key（密钥）
             let token = Jwt.sign(tokenContent, secretOrPrivateKey, {
                expiresIn: 60*60*1  // 1小时过期
            });

            res.json({status:1,mess:'ok',Authorization:token,userName:req.body.userName})
         })

         _router.post("/signUp",(req,res)=>{
            if(!this.verification(req.body.user)){
                this.failReturn(res,{},"user verification fail")
                return
            }
            
            res.send({'status':10000});
         })

         return _router
    }
    

    verification(user){
        if(user===undefined)return false
        if(user.userName===undefined)return false
        if(user.loginName===undefined)return false
        return true
    }
}
   
// exports.load = load;