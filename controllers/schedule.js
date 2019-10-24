const schedule = require('../models/schedule.js')

module.exports = {
	'POST /api/schedule': async (ctx, next) => {
		let result = await schedule.create({
			schedule: ctx.request.body.schedule,
			isSuccess: false
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
		console.log(schedule)
	    let scheduleList = await schedule.findAll();
	    ctx.rest({list: scheduleList})
	},
}