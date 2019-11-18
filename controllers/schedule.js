const schedule = require('../models/schedule.js')
let tool = require('../public/tool')
var url = require('url');
const Sequelize = require('sequelize');

module.exports = {
	'POST /api/schedule': async (ctx, next) => {
		let info = await tool.deCode(ctx.request.headers['authorization'])
		let result = await schedule.create({
			schedule: ctx.request.body.schedule,
			isSuccess: false,
			userId: info.id,
			endTime: ctx.request.body.endTime || 0,
			urgent: ctx.request.body.urgent || 0,
			remarks: ctx.request.body.remarks || '',
			projectId: ctx.request.body.projectId || '',
		})
		ctx.rest({result})
	},
	'PUT /api/schedule': async (ctx, next) => {
		let result = await schedule.update({
			schedule: ctx.request.body.schedule,
			isSuccess: ctx.request.body.isSuccess,
			endTime: ctx.request.body.endTime || 0,
			urgent: ctx.request.body.urgent || 0,
			remarks: ctx.request.body.remarks || '',
			projectId: ctx.request.body.projectId || '',
		}, {
			where: {
				id: ctx.request.body.id,
			}
		})
		ctx.rest({result})
	},
	'GET /api/schedule': async (ctx, next) => {
		let params = url.parse(ctx.url, true).query
		let info = await tool.deCode(ctx.request.headers['authorization'])
		let condition = {
			where: {
				userId: info.id
			}
		}
		if (params.projectId) {
			condition.where = {
				projectId: params.projectId
			}
		}
		if (params.today) {
			let todayStartTime = tool.todayStartTime
			let todayEndTime = tool.todayEndTime
			condition.where.endTime = {$gte: todayStartTime, $lte: todayEndTime}
		}
		if (params.title) {
			condition.where.schedule = {$like: '%' +params.title + '%'}
		}
		let scheduleList = await schedule.findAll(condition);
		ctx.rest({list: scheduleList})
	},
	'GET /api/schedule/detail': async (ctx, next) => {
		// console.log(ctx.request.params)
		let scheduleDetail = await schedule.find({
			where: {
				id: url.parse(ctx.url, true).query.id
			}
		});
		ctx.rest({data: scheduleDetail})
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