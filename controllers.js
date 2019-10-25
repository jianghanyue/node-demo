const fs = require('fs');
const jwt = require('jsonwebtoken');
const userInfoDb = require('./models/userInfo')

function addMapping(router, mapping) {
    for (let url in mapping) {
        if (url.startsWith('GET')) {
            let path = url.substring(4);
            router.get(path,mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST')) {
            let path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT')) {
            let path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: Put ${path}`);
        } else if (url.startsWith('DELETE')) {
            let path = url.substring(7);
            router.delete(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router,controllers_dir) {
    var files = fs.readdirSync(__dirname + `/${controllers_dir}`);
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });
    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + `/${controllers_dir}/` + f);
        addMapping(router, mapping)
    }
}

function addUploadFile(router) { //文件上传
    const multer = require('koa-multer');
    //配置
    var storage = multer.diskStorage({
        //文件保存路径
        destination:function (req,file,cb) {
            cb(null,'./public/uploads/')
        },
        filename:function (req,file,cb){
            console.log(file)
            var fileFormat = (file.originalname).split(".");
            cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    })
    var upload = multer({storage:storage});
    //upload.single('file')这里面的file是上传空间的name<input type="file" name="file"/>
    router.post('/api/uploadFile',upload.single('file'),async (ctx,next) => {
        ctx.rest({data: {url: 'api/download/' + ctx.req.file.filename}})
    })
    router.post('/api/avatarFile',upload.single('file'),async (ctx,next) => {
        let token = ctx.request.headers['authorization']
        let payload = jwt.decode(token.split(' ')[1],'koa-login')
        var id = payload.id
        await userInfoDb.update({avatar: 'download/' + ctx.req.file.filename}, {where: {id: id}})
        ctx.rest({data: {msg: '上传成功！'}})
    })
    console.log(`register URL mapping: POST /uploadFile`);
}

module.exports = function (dir) {
    let controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    addUploadFile(router);
    return router.routes();
}