const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const router = require('koa-router')()
const jwtKoa = require('koa-jwt')
const controller = require('./controllers')
const rest = require('./rest')
const cors = require('koa2-cors');

// error handler
onerror(app)

// 处理前端跨域的配置
app.use(cors({
  origin: function (ctx) {
    if (ctx.url === '/login') {
      return "*"; // 允许来自所有域名请求
    }
    return "*";
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(rest.restify())
app.use(router.routes());
app.use((ctx, next) => {
  return next().catch((err) => {
    if(err.status === 403){
      ctx.status = 403;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    }else{
      throw err;
    }
  })
})
app.use(jwtKoa({
  secret: 'koa-login'
}).unless({
  path: [/\/api\/login/,/\/api\/register/,/\/api/]
}));
app.use(controller());
app.use(json())
app.use(logger())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
