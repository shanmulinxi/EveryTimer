


const Control = require('../class/control')
const Jwt = require('jsonwebtoken');  //用来生成token

const Mysql = require("../../mysql/index")
const ControlName = 'auth'
const Moment = require('moment')

const Crypto=require('crypto');
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
        
        _router.post('/about',(req, res)=>{

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
            Mysql.selectData("base_user").then(result=>{
                this.successReturn(res,result.result)
            }).catch((result)=>{
                this.failReturn(res,result.err)
            })
            
         })

         _router.post('/userlogin',(req,res)=>{
             console.log(req.get("Authorization"))
             let tokenContent ={userName:req.body.userName,loginName:req.body.loginName}; // 要生成token的主题信息
             let secretOrPrivateKey=global.config.TokenKey;// 这是加密的key（密钥）
             let token = Jwt.sign(tokenContent, secretOrPrivateKey, {
                expiresIn: 60*60*1  // 1小时过期
            });
            res.json({status:1,mess:'ok',Authorization:token,userName:req.body.userName})
         })

         _router.post("/signUp",(req,res)=>{
             console.log(req.body.user)
             const data = req.body.user
            if(!this.verification(data)){
                this.failReturn(res,{},"user verification fail")
                return
            }
            const insertUser = {
                id:0,
                loginName:data.loginName,
                userName:data.userName,
                password:this.creatSHA256(data.password),
                creatTime:Moment().format('YYYY-MM-DD hh:mm:ss'),
                editTime:Moment().format('YYYY-MM-DD hh:mm:ss'),
                isDelete:false,
                
            }
            Mysql.insertData("base_user",insertUser).then((result)=>{
                this.successReturn(res,result.result)
            }).catch((result)=>{
                this.failReturn(res,result.err)
            })
         })

         return _router
    }
    

    verification(user){
        if(user===undefined)return false
        if(user.userName===undefined)return false
        if(user.loginName===undefined)return false
        return true
    }

    creatSHA256(word){
        return Crypto.createHash('SHA256').update(word).digest('hex')
    }
}
   
// exports.load = load;