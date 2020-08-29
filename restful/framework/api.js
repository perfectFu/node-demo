
module.exports = {
    async init(ctx, next) {
        console.log(ctx.params)
        const model = ctx.app.$model[ctx.params.list]
        if(model) {
            ctx.list = model
            await next()
        } else {
            ctx.body = {
                code: 4004,
                message: 'model 不存在'
            }
        }
    },
    async get(ctx, next) {
        ctx.body = await ctx.list.find({_id: ctx.params.id})
    },

    async create(ctx, next) {
        console.log('create')
        const res = await ctx.list.create(ctx.request.body)
        ctx.body = res
    },
    async update(ctx) {
        const res = await ctx.list.updateOne({_id: ctx.params.id}, ctx.request.body)
        ctx.body = res
    },
    async del(ctx) {
        const res = await ctx.list.deleteOne({_id: ctx.params.id})
        ctx.body = res
    }
}