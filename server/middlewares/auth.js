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
		request.body.payload = { id: payload.id, company: payload.company, role: payload.role };
		return next();
	} catch (err) {
		return ResponseHandler.unauthorized(response, "Invalid token!");
	}
};

const user = async (request, response, next) => {
	const { id } = request.body.payload;
	const user = await User.findById(id).populate("company");
	if (!user) return ResponseHandler.badRequest(response, "User not found!");
	request.user = user;
	return next();
};

const admin = async (request, response, next) => {
	const { role } = request.body.payload;
	if (role !== "admin") {
		return ResponseHandler.unauthorized(response, "Unauthorized access!");
	}
	return next();
};

const superAdmin = async (request, response, next) => {
	const { role } = request.body.payload;
	if (role !== "super-admin") {
		return ResponseHandler.unauthorized(response, "Unauthorized access!");
	}
	return next();
};

const systemAdmin = async (request, response, next) => {
	const { role } = request.body.payload;
	if (role !== "system-admin") {
		return ResponseHandler.unauthorized(response, "Unauthorized access!");
	}
	return next();
};

module.exports = {
	required,
	user,
	admin,
	superAdmin,
	systemAdmin,
};
