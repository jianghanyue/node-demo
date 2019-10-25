const getToken = require('jsonwebtoken')

exports.deCode = function(token){
	return new Promise((resolve,rejece) => {
		const info = getToken.verify(token.split(' ')[1],"koa-login");
		resolve(info);
	})
}
