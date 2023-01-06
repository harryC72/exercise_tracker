const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const User = require("./models/userModel.js");

app.use(cors());
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

	return res.json({ username, short_url: urlData._id });
});

app.get("/api/users", async (req, res) => {
	let users = await User.find();
	return res.json(users);
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
