const getToken = require('jsonwebtoken')

exports.deCode = function(token){
	return new Promise((resolve,rejece) => {
		if (!token) {
			return false
		}
		const info = getToken.verify(token.split(' ')[1],"koa-login");
		resolve(info);
	})
}

exports.todayStartTime = new Date(new Date().toLocaleDateString()).getTime()
exports.todayEndTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()