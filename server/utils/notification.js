const Notification = require("../models/Notification");

exports.sendNotification = async (title, description,sentTo) => {
	
	try {
		await new Notification({
			title: title,
			description: description,
			sentTo: sentTo,
		}).save();
     
		global.appSocketService.broadcast(`notify-${sentTo}`);


	} catch (error) {
		console.log("Error in sendNotification", error);
	}
};
