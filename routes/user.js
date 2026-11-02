const mongoose = require("mongoose");
const User = require("../models/user.js");

async function getUser(req, res) {
	const rawId = req.params.id;

	let userId = null;
	try {
		userId = new mongoose.Types.ObjectId(rawId);
	} catch {
		const userResponse = {
			message: `Not found. '${rawId}' is not a valid user ID.`,
		};
		res.status(404).json(userResponse);
		return null;
	}

	const user = await User.findOne({ _id: userId });
	if (user === null) {
		const userResponse = {
			message: `Not found. User ID '${userId}' was not found.`,
		};
		res.status(404).json(userResponse);
		return null;
	}

	return user;
}

module.exports = function (router) {
	const userRoute = router.route("/users/:id");

	userRoute.get(async function (req, res) {
		const currUser = await getUser(req, res);

		if (currUser === null) return;

		const userResponse = {
			message: "OK",
			data: currUser,
		};
		res.status(200).json(userResponse);
	});

	userRoute.put(async function (req, res) {
		const userToUpdate = await getUser(req, res);

		if (userToUpdate === null) return;

		userToUpdate.name = req.body.name;
		userToUpdate.email = req.body.email;
		userToUpdate.pendingTasks = req.body.pendingTasks ?? [];
		await userToUpdate.save();

		const userResponse = {
			message: "OK",
			data: userToUpdate,
		};
		res.status(200).json(userResponse);
	});

	userRoute.delete(async function (req, res) {
		const userToDelete = await getUser(req, res);

		if (userToDelete === null) return;

		await User.deleteOne({ _id: userToDelete._id });

		const userResponse = {
			message: "OK",
		};
		res.status(200).json(userResponse);
	});

	return router;
};
