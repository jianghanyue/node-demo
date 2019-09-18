const send = require('koa-send');
const multer = require('koa-multer');

//配置
var storage = multer.diskStorage({
	//文件保存路径
	destination:function (req,file,cb) {
		cb(null,'./public/uploads/avatar/')
	},
	filename:function (req,file,cb){
		console.log(file)
		var fileFormat = (file.originalname).split(".");
		cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
})
var upload = multer({storage:storage});

module.exports = {
	'GET /api/download/:name': async (ctx, next) => {
		const name = ctx.params.name;
		const path = `/public/uploads/${name}`;
		ctx.attachment(path);
		await send(ctx, path);
	},
}