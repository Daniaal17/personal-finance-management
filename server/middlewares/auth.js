const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const config = require("../config");
const { ResponseHandler } = require("../utils");

const getTokenFromHeader = (request) => {
	if (request.headers.authorization && request.headers.authorization.split(" ")[0] === "Bearer") {
		return request.headers.authorization.split(" ")[1];
	}
	return null;
};

const required = async (request, response, next) => {
	const token = getTokenFromHeader(request);

	if (!token) {
		return ResponseHandler.badRequest(response, "No authorization token found!");
	}

	try {
		const payload = jwt.verify(token, config.secret);
		request.body.payload = { id: payload.id };
		return next();
	} catch (err) {
		return ResponseHandler.unauthorized(response, "Invalid token!");
	}
};

const user = async (request, response, next) => {
	const { id } = request.body.payload;
	const user = await User.findById(id)
	if (!user) return ResponseHandler.badRequest(response, "User not found!");
	request.user = user;
	return next();
};



module.exports = {
	required,
	user,
};
