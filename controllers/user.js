const user = require('../models/user.js')
const userInfoDb = require('../models/userInfo.js')
const APIError = require('../rest').APIError;
let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs');
let tool = require('../public/tool')

module.exports = {
    'GET /api/user/:id': async (ctx, next) => {
        var id = ctx.params.id
        const result = await userInfoDb.findAll({
            where: {
                id: id
            }
        });
        ctx.rest({result})
    },
    'GET /api/userInfo': async (ctx, next) => {
        let token = ctx.request.headers['authorization']
        let payload = await tool.deCode(token)
        var id = payload.id
        let userInfo = await userInfoDb.find({
            where: {
                id: id
            }
        });
        if (ctx.headers.host.indexOf('http')>0) {
            userInfo.avatar = `${ctx.headers.host}/api/${userInfo.avatar}`
        } else {
            userInfo.avatar = `http://${ctx.headers.host}/api/${userInfo.avatar}`
        }
        ctx.rest({data: userInfo})
    },

    'POST /api/login': async (ctx, next) => {
        let name = ctx.request.body.username,
            password = ctx.request.body.password.toString()
        const result = await user.findOne({
            where: {
                user_name: name
            }
        });
        if (result) {
            if (!bcrypt.compareSync(password, result.password)) {
                ctx.response.status = 200;
                ctx.rest({info: '密码错误!'})
            } else {
                let userToken = {
                    name: name,
                    id: result.id,
                }
                const access_secret = 'koa-login'
                const access_token = jwt.sign(userToken, access_secret, { expiresIn: '1d' })
                const refresh_secret = 'refresh-token'
                const refresh_token = jwt.sign(userToken, refresh_secret, { expiresIn: '7d' })
                ctx.rest({access_token: access_token, refresh_token: refresh_token})
            }
        } else {
            throw new APIError('0', '用户不存在');
        }
    },
    'POST /api/register': async (ctx, next) => {
        let password = ctx.request.body.password,
            user_name = ctx.request.body.username,
            name = ctx.request.body.name
        console.log(ctx.request.body,password)
        // try {
            let user_ver = await user.findOne({
                where: {
                    user_name: user_name
                }
            });
        // } catch (e) {
        //     console.log(e)
        // }

        if (user_ver) {
            ctx.rest({code: 0,info: '账号名重复!'})
            return
        }

        if (!password) {
            ctx.rest({code: 0,info: '请填写密码!'})
            return
        }

        if (!user_name) {
            ctx.rest({code: 0,info: '请填写姓名!'})
            return
        }
        //生成加密密码
        //  bcrypt.genSalt(10, function(err, salt) {
        //     bcrypt.hash(password, salt, function(err, hash) {
        //         console.log(password,hash,'11111')
        //         password = hash
        //     });
        // });
        var bcryptPro = await new Promise(function (resolve, reject) {
            bcrypt.hash(password, 8, (err, hash) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(hash)
                }
            })
        })
        var result = await user.create({
            password: bcryptPro,
            user_name: user_name,
            name: name,
            roles: 'member'
        })
        result.code = 0
        ctx.rest({result})
    }
}