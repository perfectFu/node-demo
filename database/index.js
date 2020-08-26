const mongo = require('./models/db')

mongo.once('connect', async () => {
    console.log('数据库链接成功')
    const fruits = mongo.col('fruits')
    await fruits.deleteMany()
    const data = new Array(100).fill().map((v, i) => {
        return {
            name: 'XXX-' + i,
            price: i,
            category: Math.random() > 0.5 ? '蔬菜' : '水果'
        }
    })
    fruits.insertMany(data)
    console.log('插入数据成功')
})