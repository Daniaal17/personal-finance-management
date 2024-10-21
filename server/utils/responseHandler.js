// responseHandler.js
class ResponseHandler {
	static send(res, statusCode, success, message = "", data = {}) {
		res.status(statusCode).send({ success, message, data });
	}

	static badRequest(res, message = "Bad Request") {
		this.send(res, 400, false, message);
	}

	static unauthorized(res, message = "Unauthorized") {
		this.send(res, 401, false, message);
	}

	static ok(res, data = {}, message = "Success") {
		this.send(res, 200, true, message, data);
	}

	static notFound(res, message = "Not Found") {
		this.send(res, 404, false, message);
	}

	static serverError(res, message = "Internal Server Error") {
		this.send(res, 500, false, message);
	}
}

module.exports = { ResponseHandler };
