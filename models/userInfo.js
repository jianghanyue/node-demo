const db = require('../config/db');

module.exports = db.defineModel('user', {
	user_name: db.STRING(50),
	roles: db.STRING(50),
	avatar: db.STRING(50),
	name: db.STRING(50),
});