const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const transport = new DailyRotateFile({
	filename: "../logs/app-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d",
});

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
	return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(winston.format.timestamp(), logFormat),
	transports: [transport],
});

module.exports = { logger };
