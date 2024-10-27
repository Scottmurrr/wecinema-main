const mongoose = require("mongoose");

const { Schema } = mongoose;

const scriptSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		genre: {
			type: Schema.Types.Mixed,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		script: {
			type: String,
			required: true,
		},
		isForSale:{ type: Boolean, default: false },
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
	}
);

const scriptModel = mongoose.model("Script", scriptSchema);
module.exports = scriptModel;
