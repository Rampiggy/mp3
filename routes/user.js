const mongoose = require("mongoose");
const User = require("../models/user.js");

module.exports = function (router) {
	const userRoute = router.route("/users/:id");

	userRoute.get(async function (req, res) {
		const rawId = req.params.id;

		let userId = null;
		try {
			userId = new mongoose.Types.ObjectId(rawId);
		} catch {
			const userResponse = {
				message: `Not found. '${rawId}' is not a valid user ID.`,
			};
			res.status(404).json(userResponse);
			return;
		}

		const user = await User.findOne({ _id: userId });
		if (user === null) {
			const userResponse = {
				message: `Not found. User ID '${rawId}' was not found.`,
			};
			res.status(404).json(userResponse);
			return;
		}

		const userResponse = {
			message: "OK",
			data: user,
		};
		res.status(200).json(userResponse);
	});

	userRoute.put(async function (req, res) {
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			pendingTasks: req.body.pendingTasks ?? [],
			dateCreated: new Date(),
		});
		await newUser.save();

		const userResponse = {
			message: "OK",
			data: newUser,
		};
		res.status(201).json(userResponse);
	});

	return router;
};
