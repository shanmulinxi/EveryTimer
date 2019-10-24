const Moment = require('moment')
const Base = require('./Base')
module.exports = class Base_Message extends Base {
    static getTabel() {
        return 'base_message'
    }

    //获取基础模型
    static getBaseModel() {
        const nowtime = Moment().format('YYYY-MM-DD HH:mm:ss')
        return {
            id: 0,
            fromUserid: null,
            toUserid: null,
            message: null,
            creatTime: nowtime,
            editTime: nowtime,
            isDelete: false
        }
    }

    constructor(obcdata) {
        super(obcdata)
    }

    /**
     * 数据插入
     * @param {*} operateData 可操作数据原型
     */
    static insertData(obcdata) {
        const operateData = this.getBaseModel()
        const operateDataKeys = Object.keys(operateData)
        operateDataKeys.map(key => {
            if (obcdata[key] != undefined) {
                operateData[key] = obcdata[key]
            }
        })
        operateData.id = 0
        return this.insertBaseData(operateData)
    }
}