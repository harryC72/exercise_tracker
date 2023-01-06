const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let userSchema = new Schema({
	username: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
