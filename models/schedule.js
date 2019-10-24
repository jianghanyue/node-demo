const db = require('../config/db');

module.exports = db.defineModel('schedule', {
	schedule: db.STRING(50),
	isSuccess: db.BOOLEAN(),
});