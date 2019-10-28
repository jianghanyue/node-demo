const db = require('../config/db');

module.exports = db.defineModel('childTask', {
	name: db.STRING(50),
	isSuccess: db.BOOLEAN(),
	userId: db.STRING(),
	taskId: db.STRING(),
	endTime: db.BIGINT(),
});