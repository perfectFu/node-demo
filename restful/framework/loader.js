const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')

// 加载model下的文件
function load(dir, cb) {
    // 获取绝对路径
    const url = path.resolve(__dirname, dir)
    const files = fs.readdirSync(url)
    console.log(files)
    files.forEach(filename => {
        // 去掉后缀名
        filename = filename.replace('.js', '')
        // 导入文件
        const file = require(url + '/' + filename)
        // 执行逻辑
        cb(filename, file)
    })
}

const loadModel = (config) => (app) => {
    mongoose.connect(config.url, {
        useNewUrlParser: true
    })
    const conn = mongoose.connection
    conn.on('error', err => {
        console.error('数据库连接失败')
    })

    app.$model = {}
    load('../model', (filename, {schema}) => {
        console.log('load model', filename, schema)
        app.$model[filename] = mongoose.model(filename, schema)
    })
}

module.exports = {loadModel}

// load('../model')