const childTask = require('../models/childTask.js')
let tool = require('../public/tool')

module.exports = {
	'POST /api/childTask': async (ctx, next) => {
		let info = await tool.deCode(ctx.request.headers['authorization'])
		let result = await childTask.create({
			name: ctx.request.body.name,
			isSuccess: false,
			userId: info.id,
			endTime: ctx.request.body.endTime || 0,
			taskId: ctx.request.body.taskId
		})
		ctx.rest({result})
	},
	'PUT /api/childTask': async (ctx, next) => {
		let result = await childTask.update({
			name: ctx.request.body.name,
			isSuccess: false,
			endTime: ctx.request.body.endTime || 0,
			urgent: ctx.request.body.endTime || 0,
			remarks: ctx.request.body.remarks || ''
		}, {
			where: {
				id: ctx.request.body.id
			}
		})
		ctx.rest({result})
	},
	'GET /api/childTask': async (ctx, next) => {
		let info = await tool.deCode(ctx.request.headers['authorization'])
		let childTaskList = await childTask.findAll({
			where: {
				userId: info.id
			}
		});
		ctx.rest({list: childTaskList})
	},
	'DELETE /api/childTask': async (ctx, next) => {
		let childTaskDel = await childTask.destroy({
			where: {
				id: ctx.request.body.id
			}
		});
		ctx.rest({message: childTaskDel===1?'删除成功':'删除失败',code: 1})
	},
}