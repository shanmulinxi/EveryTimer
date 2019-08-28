


const Control = require('../class/control')
const ControlName = 'auth'

module.exports =  class auth extends Control{
    constructor(app){
        super(ControlName,app)
        console.log("auth init");
    }

    initRouter(){
        
        const _router =  super.initRouter().get('/about',function (req, res) {
            res.send('auth World!');
         })
         console.log("initRouter")
         return _router
    }
}
   
// exports.load = load;