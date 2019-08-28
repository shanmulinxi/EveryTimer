
const server = require("./server");
const fs = require("fs");

// 异步读取配置文件
fs.readFile('config.json', function (err, data) {
    if (err) {
        return console.error(err);
    }
    const config  = JSON.parse(data)
    global.config = config
    

    const test = require("./mysql/index")
 });


 function run(config){
    if(!config['debug']){
        console.log = ()=>{}
    }
    console.log('RUNING')
    server.start();
 }
// var router = require("./router");
//  console.log = ()=>{}
// server.start();
