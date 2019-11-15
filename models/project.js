const db = require('../config/db');

module.exports = db.defineModel('project', {
	name: db.STRING(50),
	createdUser: db.STRING()
});