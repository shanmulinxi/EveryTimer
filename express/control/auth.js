const Control = require('../class/control')
const Jwt = require('jsonwebtoken'); //用来生成token

const Mysql = require("../../mysql/index")
const ControlName = 'auth'
const Moment = require('moment')

const Crypto = require('crypto');
/**
 * 登录控制器
 */
module.exports = class auth extends Control {
    constructor(app) {
        super(ControlName, app)
    }
    initIntercept(req, res, next) {
        //自定义拦截器
        next();
    }
    initRouter() {
        const _router = super.initRouter()

        _router.all('/about', (req, res) => {

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
            Mysql.selectData("base_user").then(result => {
                this.successReturn(res, result.result)
            }).catch((result) => {
                this.failReturn(res, result.err)
            })

        })
        _router.post('/signIn', (req, res) => {
            console.log(req.cookies)
            const bodyloginName = req.body.loginName
            const bodypassword = req.body.password
            //登录名称初步验证
            if (bodyloginName == undefined || bodyloginName.length == 0) {
                this.failReturn(res, {
                    return_msg: "LOGINNAME ERROR",
                    return_code: 10001
                })
                return
            }
            //密码初步验证
            if (bodypassword == undefined || bodypassword.length == 0) {
                this.failReturn(res, {
                    return_msg: "PASSWORD ERROR",
                    return_code: 10002
                })
                return
            }

            Mysql.run("SELECT * FROM base_user WHERE loginName = ? LIMIT 0,2", [bodyloginName]).then(
                result => {
                    console.log(result)
                    if (result.length == 0) {
                        this.failReturn(res, {
                            return_msg: "LOGINNAME ERROR",
                            return_code: 10003
                        })
                        return
                    }
                    if (result.length >= 2) {
                        this.failReturn(res, {
                            return_msg: "SEVER ERROR",
                            return_code: 10004
                        })
                        return
                    }
                    const userdata = result[0]
                    const postpassword = this.creatMD5(bodypassword).toUpperCase()
                    // console.log(postpassword)
                    if (userdata["password"].toUpperCase() === postpassword) {
                        let tokenContent = {
                            userName: userdata["userName"],
                            loginName: userdata["loginName"]
                        }; // 要生成token的主题信息
                        let secretOrPrivateKey = global.config.TokenKey; // 这是加密的key（密钥）
                        let token = Jwt.sign(tokenContent, secretOrPrivateKey, {
                            expiresIn: 60 * 60 * 1 // 1小时过期
                        });
                        const sql = "UPDATE base_user SET authorization = ? , loginTime = ? , loginError = ? WHERE id = ?"
                        Mysql.run(sql,
                            [
                                token,
                                Moment().format('YYYY-MM-DD hh:mm:ss'),
                                0,
                                userdata["id"]
                            ])
                        this.successReturn(res, {
                            return_obc: {
                                authorization: token,
                                username:userdata["userName"]
                            }
                        })
                        return
                    } else {
                        const sql = "UPDATE base_user SET loginTime = ? , loginError = ? WHERE id = ?"
                        Mysql.run(sql,
                            [
                                Moment().format('YYYY-MM-DD hh:mm:ss'),
                                userdata["loginError"]+1,
                                userdata["id"]
                            ])
                        this.failReturn(res, {
                            return_msg: "PASSWORD ERROR",
                            return_code: 10005
                        })
                        return
                    }
                }
            ).catch(error=>{
                this.failReturn(res, {
                    return_code: 10006,
                    return_obc:error
                })
            })


            // // res.json({status:1,mess:'ok',Authorization:token,userName:req.body.userName})
            // res.json({
            //     status: 1,
            //     mess: 'ok'
            // })
        })

        _router.post("/signUp", (req, res) => {
            console.log(req.body.user)
            const data = req.body.user
            if (!this.verification(data)) {
                this.failReturn(res, {}, "user verification fail")
                return
            }
            const insertUser = {
                id: 0,
                loginName: data.loginName,
                userName: data.userName,
                password: this.creatSHA256(data.password),
                creatTime: Moment().format('YYYY-MM-DD hh:mm:ss'),
                editTime: Moment().format('YYYY-MM-DD hh:mm:ss'),
                isDelete: false,

            }
            Mysql.insertData("base_user", insertUser).then((result) => {
                this.successReturn(res, result.result)
            }).catch((result) => {
                this.failReturn(res, result.err)
            })
        })

        return _router
    }


    verification(user) {
        if (user === undefined) return false
        if (user.userName === undefined) return false
        if (user.loginName === undefined) return false
        return true
    }
    creatMD5(word) {
        return Crypto.createHash('MD5').update(word).digest('hex')
    }
    creatSHA256(word) {
        return Crypto.createHash('SHA256').update(word).digest('hex')
    }
}

// exports.load = load;