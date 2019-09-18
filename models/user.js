const db = require('../config/db');

module.exports = db.defineModel('user', {
    user_name: db.STRING(50),
    password: db.STRING(32),
    name: db.STRING(50),
    roles: db.STRING(50),
});