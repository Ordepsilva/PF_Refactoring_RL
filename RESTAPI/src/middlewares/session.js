const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/auth.json');

const sessionMiddleware = (req, res, next) => {

var session = req.headers['x-access-token'];
	try {
		if (session) {
			const user = jwt.verify(session, jwtConfig.secret);
			req.auth = user;
		} else {
			req.auth = null;
		}
	} catch (e) {
		req.auth = null;
	}
	next();
} 

module.exports = sessionMiddleware
