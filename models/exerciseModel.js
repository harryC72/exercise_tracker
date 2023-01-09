const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let exerciseSchema = new Schema({
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	date: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
