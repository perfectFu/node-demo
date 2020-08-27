const mongo = require('../database/models/db')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const static = require('koa-static')
// const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')
const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')
const path = require('path')
const fs = require('fs')

const secret = 'this is a secret'

const app = new Koa()
const router = new KoaRouter()

app.use(
	koaBody({
		multipart: true
	})
)

// 登录接口
router.post('/api/login', async ctx => {
	const { username, password } = ctx.request.body
	const user = mongo.col('user', 'faq')
	const ret = await user.findOne({ username, password })
	console.log(JSON.stringify(ret))
	// 用户表中存在该用户
	if (ret) {
		const token = jwt.sign(
			{
				username: ret.username,
				exp: Math.floor(Date.now()) * 1000 + 60,
			},
			secret
		)
		ctx.body = {
			code: 2000,
			message: '登录成功',
			data: {
				token,
			},
		}
	} else {
		ctx.body = {
			code: 2001,
			message: '用户不存在',
			data: {},
		}
	}
})

// 注册接口
router.post('/api/regist', async ctx => {
	const { username, password } = ctx.request.body
	const user = mongo.col('user', 'faq')
	let ret = await user.findOne({ username, password })
	console.log(JSON.stringify(ret))
	if (ret) {
		// 用户已存在
		ctx.body = {
			code: 2001,
			message: '用户已存在，请直接登录',
			data: {},
		}
	} else {
		// 新用户就注册
		ret = await user.insertOne({
			username,
			password,
		})
		ctx.body = {
			code: 2000,
			message: '注册成功，请登录',
			data: {},
		}
	}
})

// 获取个人信息, 认证通过 用户信息会保存在ctx.state.user中，失败则返回401状态码
router.get(
	'/api/userinfo',
	jwtAuth({
		secret,
	}),
	async ctx => {
		console.log(ctx.state.user)
		const { username } = ctx.state.user
		const user = mongo.col('user')
		let ret = await user.findOne({ username })
		ctx.body = {
			code: 2000,
			message: '查询个人信息成功',
			data: {
				user: {
					...ret,
					password: '*******',
				},
			},
		}
	}
)

// 上传文件
router.post('/api/upload', async ctx => {
	try {
		const {file} = ctx.request.files
		let filename = file.name
		const rs = fs.createReadStream(file.path)
		const ws = fs.createWriteStream(
			path.resolve(__dirname, '../web/upload/' + filename)
		)
		rs.pipe(ws)

		ctx.body = {
			code: 200,
			messgae: '上传成功',
			data: {
				url: '/upload/' + filename,
			},
		}
	} catch (error) {
		console.log(error)
	}
})

app.use(static(path.resolve(__dirname, '../web')))

app.use(router.routes())

app.listen(4001)
