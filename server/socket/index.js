
const { Server } = require("socket.io");
const { allowedOrigins } = require("../config");

class AppSocketService {
	constructor() {
		this.appSocket = null;
	}

	// Start method to initialize the socket connection
	start(server) {
		this.appSocket = new Server(server, {
			cors: {
				credentials: true,
				origin: (origin, callback) => {
					if (!origin) return callback(null, true);
					if (allowedOrigins.indexOf(origin) === -1) {
						const msg = "The CORS policy for this site does not allow access from the specified Origin.";
						return callback(new Error(msg), false);
					}
					return callback(null, true);
				},
			},
		});
		console.log("AppSocketService started.");
	}

	// Send message to all connected clients
	broadcast(event, message) {
		
		this.appSocket.emit(event, message);
	}

}

module.exports = AppSocketService;
