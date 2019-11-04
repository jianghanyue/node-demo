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
app.use(
    cors({
        origin: function(ctx) { //设置允许来自指定域名请求
            if (ctx.url === '/test') {
                return '*'; // 允许来自所有域名请求
            }
            return '*'; //只允许http://localhost:8080这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
    })
);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(rest.restify())
app.use(router.routes());
app.use((ctx, next) => {
  return next().catch((err) => {
      console.log(err,err.name)
      if(err.status === 403||err.name==='TokenExpiredError'||err.message.indexOf('token')!==-1){
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
  path: [/\/api\/login/,/\/api\/register/,/\/api/,/\/api\/download/]
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
