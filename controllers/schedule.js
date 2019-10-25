const schedule = require('../models/schedule.js')
let tool = require('../public/tool')

module.exports = {
	'POST /api/schedule': async (ctx, next) => {
		let info = await tool.deCode(ctx.request.headers['authorization'])
		let result = await schedule.create({
			schedule: ctx.request.body.schedule,
			isSuccess: false,
			userId: info.id
		})
		ctx.rest({result})
	},
	'PUT /api/schedule': async (ctx, next) => {
		let result = await schedule.update({
			schedule: ctx.request.body.schedule,
			isSuccess: ctx.request.body.isSuccess
		}, {
			where: {
				id: ctx.request.body.id
			}
		})
		ctx.rest({result})
	},
	'GET /api/schedule': async (ctx, next) => {
		let info = await tool.deCode(ctx.request.headers['authorization'])
	    let scheduleList = await schedule.findAll({
		    where: {
			    userId: info.id
		    }
	    });
	    ctx.rest({list: scheduleList})
	},
	'DELETE /api/schedule': async (ctx, next) => {
		let scheduleDel = await schedule.destroy({
			where: {
				id: ctx.request.body.id
			}
		});
		ctx.rest({message: scheduleDel===1?'删除成功':'删除失败',code: 1})
	},
}