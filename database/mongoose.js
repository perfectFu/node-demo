const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/faq", {
    useNewUrlParser: true
})
const conn = mongoose.connection
conn.on('error', () => {
    console.log('数据库链接失败')
})
conn.once('open', async () => {
    const Schema = mongoose.Schema({
        name: String,
        age: Number
    })
    const Model = mongoose.model('users', Schema)
    let r = await Model.create({
        name: '张三',
        age: 10
    })
    r = await Model.find()
    // r = await Model.updateMany({name: '富奥奇'}, {
    //     $set: {
    //         name: '付'
    //     }
    // })
    // r = await Model.deleteOne({name: '付奥奇'})
    console.log('reuslt:', r)
}) 