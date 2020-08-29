const Koa = require('koa')
const body = require('koa-body')
const {loadModel} = require('./framework/loader')
const config = require('./config/conf')
const routes = require('./framework/router')

const app = new Koa()
loadModel(config)(app)


app.use(body())
app.use(routes)

app.listen(4002)