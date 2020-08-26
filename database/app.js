const Koa = require('koa')
const KoaRouter = require('koa-router')

const app = new Koa()
const router = new KoaRouter()
const mongo = require('./models/db')

router.get('/api/list', async ctx => {
    const { page, category, keyword } = ctx.query
    try {
        const condition = {}
        if(category) {
            condition.category = category
        }
        if(keyword) {
            condition.name = {
                $regex: new RegExp(keyword)
            }
        }
        const fruits = mongo.col('fruits')
        const total = fruits.find().count
        const data = await fruits
            .find(condition)
            .skip((page - 1) * 5)
            .limit(5)
            .toArray()
        ctx.body = {
            ok: 1,
            data: {
                total,
                list: data
            }
        }
    } catch (error) {
        
    }
    
})

router.get('/api/category', async ctx => {
    const fruits = mongo.col('fruits')
    const data = await fruits.distinct('category')
    ctx.body = {
        ok: 1,
        data
    }
})

app.use(router.routes())

app.listen(3000)