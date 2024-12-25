var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var NotificationSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
	
		sentTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		isRead: {
			type: Boolean,
			default: false,
		},

	},
	{ timestamps: true }
);

NotificationSchema.plugin(mongoosePaginate);


NotificationSchema.methods.toJSON = function () {
	return {
		_id: this._id,
		title: this.title,
		description: this.description,
		sentTo: this.sentTo,
		isRead: this.isRead,
		createdAt: this.createdAt,
	};
};

module.exports = mongoose.model("Notification", NotificationSchema);
