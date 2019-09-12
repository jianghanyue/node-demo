const user = require('../models/user.js')
const jwt = require('jsonwebtoken');
const APIError = require('../rest').APIError;
let bcrypt = require('bcryptjs');

module.exports = {
    'GET /api/user/:id': async (ctx, next) => {
        var id = ctx.params.id
        const result = await user.findAll({
            where: {
                id: id
            }
        });
        ctx.rest({result})
    },
    'POST /api/login': async (ctx, next) => {
        console.log(ctx.request.body)
        let name = ctx.request.body.name,
            password = ctx.request.body.password.toString()
        const result = await user.findOne({
            where: {
                user_name: name
            }
        });
        if (result) {
            if (!bcrypt.compareSync(password, result.password)) {
                ctx.response.status = 400;
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
            user_name = ctx.request.body.name

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
        })
        result.code = 0
        ctx.rest({result})
    }
}