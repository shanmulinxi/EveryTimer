

var express = require('express');
var expressAPP = require("./express/index");
var app = express();
function start() {
  console.log("server start")
  expressAPP.init(app)
}
 
exports.start = start;
