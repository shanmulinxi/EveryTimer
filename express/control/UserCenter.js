const Control = require('../class/Control')
const ControlName = 'UserCenter'
const Moment = require('moment')
const Base_User = require('../../model/Base_User')
const ErrorCode = require('../common/errorcode')
    /**
     * 用户控制器
     */
module.exports = class UserCenter extends Control {
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
            _router.get('/getInfo', (req, res) => {
                this.getUserInfo(req, res)
            })
            _router.post('/updateUserInfo', (req, res) => {
                this.updateUserInfo(req, res)
            })
            _router.post('/changePassword', (req, res) => {
                this.changePassword(req, res)
            })
            return _router
        }
        //更新用户信息
    updateUserInfo(req, res) {
        const reqUser = req.body.user || null
        const reqData = req.body.data || null
        if (!reqUser || !reqData) {
            this.failReturn(res, 'NullReqData')
            return
        }

        const info = {
            userName: null,
            message: null,
            remark: null,
            smallName: null,
            birthday: null
        }

        let keylist = Object.keys(info)
        const id = reqUser.id
        Object.assign(reqUser, reqData)
        reqUser.id = id
        Base_User.updateUser(reqUser, keylist)
            .then(result => {
                this.successReturn(res)
                return
            })
            .catch(err => {
                this.failReturn(res, 'SQLError')
                return
            })
    }

    getUserInfo(req, res) {
        const reqUser = req.body.user || null
        if (!reqUser) {
            this.failReturn(res, 'NullReqData')
            return
        }
        const info = {
            loginName: null,
            userName: null,
            message: null,
            remark: null,
            loginTime: 0,
            loginError: 0,
            smallName: null,
            birthday: null
        }

        const keylist = Object.keys(info)
        for (let i = 0; i < keylist.length; i++) {
            info[keylist[i]] = reqUser[keylist[i]]
        }

        const capuleid = reqUser['capuleid']
        if (capuleid != null) {
            Base_User.getDataFormId(capuleid)
                .then(result => {
                    if (!result[0]['isDelete']) {
                        const capule = {}
                        for (let i = 0; i < keylist.length; i++) {
                            capule[keylist[i]] = result[0][keylist[i]]
                        }
                        info['capule'] = capule
                    } else {
                        info['capule'] = null
                    }
                    this.successReturn(res, {
                        return_obc: info
                    })
                })
                .catch(err => {
                    console.log(err)
                    this.failReturn(res, 'SQLError')
                })
        } else {
            info['capule'] = null
            this.successReturn(res, {
                return_obc: info
            })
        }
    }
    changePassword(req, res) {
        const reqData = req.body.data || null
        const reqUser = req.body.user || null
        if (!reqData || !reqUser) {
            this.failReturn(
                res,
                ErrorCode.UserCenter_changePassword_NullReqData,
                '??没有请求的数据呀'
            )
            return
        }

        let { password } = reqData

        if (!Base_User.verifyData({
                password
            }, ['password'])) {
            this.failReturn(res, ErrorCode.UserCenter_changePassword_VerifyData)
            return
        }
        //对密码进行加盐加密
        password = Base_User.passwordAddSalt(password)
        password = Base_User.creatMD5(password)

        const filter = [{
            field: 'id',
            operate: 'equal',
            value: reqUser['id']
        }]
        const updateObc = {
            password,
            authorization: null,
            loginError: 0,
            editTime: Moment().format('YYYY-MM-DD HH:mm:ss')
        }
        Base_User.updateFormFilter(updateObc, Object.keys(updateObc), filter)
            .then(result => {
                this.successReturn(res, {})
                return
            })
            .catch(err => {
                this.failReturn(res, ErrorCode.UserCenter_changePassword_SQLError)
                return
            })
    }
}