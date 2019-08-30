

/**
 * 拦截器
 * @param {*} app 
 */
function load(app) {
    console.log("intercept init");
    app.use(function (req, res, next) {
        // console.log('originalUrl',req.originalUrl); // '/admin/new'
        // console.log('baseUrl',req.baseUrl); // '/admin'
        console.log('拦截',req.originalUrl);// '/new'
        next()
     })
} 
exports.load = load;

