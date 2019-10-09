function load(app) {
  console.log('common init')
  app.get('/', function(req, res) {
    res.send('Hello World')
  })
}

exports.load = load
