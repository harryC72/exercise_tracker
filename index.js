const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require("body-parser");
const User = require("./models/userModel.js");
const Exercise = require("./models/exerciseModel.js");

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
	const { username } = req.body;

	let query = { username };
	let update = { username };
	let options = { upsert: true, new: true, setDefaultsOnInsert: true };
	let urlData = await User.findOneAndUpdate(query, update, options);

	console.log("URL	data: ", urlData);

	return res.json({ username, _id: urlData._id });
});

app.get("/api/users", async (req, res) => {
	let users = await User.find();
	console.log("USERS: ", users);
	return res.json(users);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
	const id = req.params._id;
	let { description, duration, date } = req.body;

	if (!date) date = new Date();

	let urlData = await Exercise.create({
		description,
		duration,
		userId: id,
		date,
	});

	const user = await User.findById(id);

	return res.json({
		username: user.username,
		description: urlData.description,
		duration: urlData.duration,
		date: urlData.date,
		_id: user._id,
	});
});

app.get("/api/users/:_id/logs", async (req, res) => {
	const { from, to, limit } = req.query;

	console.log("FROM, TO, LIMIT: ", from, to, limit);
	const id = req.params._id;
	const user = await User.findById(id);
	let filter = { userId: id };
	if (from) filter.date = { $gte: from };
	if (to) filter.date = { $lte: to };
	if (from && to) filter.date = { $gte: from, $lte: to };
	const nonNullLimit = limit ?? 500;
	const exerciseLog = await Exercise.find(
		filter,
		"description duration date	-_id"
	).limit(+nonNullLimit);
	return res.json({
		username: user.username,
		count: exerciseLog.length,
		log: exerciseLog,
	});
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
