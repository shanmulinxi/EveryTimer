


const Control = require('../class/control')
const ControlName = 'auth'

/**
 * 登录控制器
 */
module.exports =  class auth extends Control{
    constructor(app){
        super(ControlName,app)
        
    }

    initRouter(){
        const _router =  super.initRouter()
        _router.get('/about',function (req, res) {
            res.send('auth World!');
         })

         _router.post('/login',function (req,res){
             console.log(req.body)
            res.send('login World!');
         })
         return _router
    }
}
   
// exports.load = load;