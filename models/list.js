const db = require('../config/db');

module.exports = db.defineModel('list', {
    user_id: db.INTEGER(11),
    content: db.STRING(32),
    status: db.INTEGER(1),
});