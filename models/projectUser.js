const db = require('../config/db');

module.exports = db.defineModel('projectUser', {
	projectId: db.STRING(50),
	userId: db.STRING(),
});