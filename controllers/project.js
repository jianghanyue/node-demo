const project = require('../models/project')
const projectUser = require('../models/projectUser')
let tool = require('../public/tool')

module.exports = {
	'POST /api/project': async (ctx, next) => {
		let info = await tool.deCode(ctx.request.headers['authorization'])
		let projectData = await project.create({
			name: ctx.request.body.name,
			createdUser: info.id
		})
		let projectId = projectData.id
		projectUser.create({projectId: projectId, userId: info.id})
		ctx.rest({projectData})
	},
	'GET /api/project': async (ctx, next) => {
		let info = await tool.deCode(ctx.request.headers['authorization'])
		let projectId = await projectUser.findAll({
			where: {
				userId: info.id
			}
		})
		let projectList = await project.findAll({
			where: {
				id: {$in: projectId.map(t=>t.projectId)}
			}
		})
		ctx.rest({list: projectList})
	},
	'GET /api/myProject': async (ctx, next) => {
		let info = await tool.deCode(ctx.request.headers['authorization'])
		let projectList = await project.findAll({
			where: {
				createdUser: info.id
			}
		})
		ctx.rest({list: projectList})
	},
	'DELETE /api/project': async (ctx, next) => {
		let projectDel = await project.destroy({
			where: {
				id: ctx.request.body.id
			}
		});
		await projectUser.destroy({
			where: {
				projectId: ctx.request.body.id
			}
		});
		ctx.rest({message: projectDel===1?'删除成功':'删除失败',code: 1})
	},
}