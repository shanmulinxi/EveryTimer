const Control = require('../class/Control')
const ControlName = 'MessageCenter'
const Base_Message = require('../../model/Base_Message')
const Base_User = require('../../model/Base_User')
    /**
     * 用户控制器
     */
module.exports = class MessageCenter extends Control {
    constructor(app) {
        super(ControlName, app)
    }

    initIntercept(req, res, next) {
        //自定义拦截器

        super
            .checkHearder(req)
            .then(result => {
                //添加数据到body中
                req.body.user = {}
                Object.assign(req.body.user, result)
                next()
                return
            })
            .catch(err => {
                super.failReturn(res, 'LoginError')
            })
    }

    initRouter() {
        const _router = super.initRouter()
        _router.post('/sendMsgToCp', (req, res) => {
            this.sendMessageToCapule(req, res)
        })

        return _router
    }

    sendMessageToCapule(req, res) {
        const reqUser = req.body.user || null
        const reqData = req.body.data || null
        if (!reqUser || !reqData) {
            this.failReturn(res, 'NullReqData')
            return
        }
        const { id, capuleid } = reqUser
        const { message } = reqData
        if (!capuleid || !message) {
            this.failReturn(res, 'sendMessageNoCapule')
            return
        }
        reqUser.message = message

        Base_Message.insertData({ fromUserid: id, toUserid: capuleid, message })
            .then(result => {
                Base_User.updateUser(reqUser, ['message'])
                    .then(result => {
                        this.successReturn(res)
                        return
                    })
                    .catch(err => {
                        this.failReturn(res, 'SQLError')
                        return
                    })
            })
            .catch(err => {
                this.failReturn(res, 'SQLError')
                return
            })
    }
}