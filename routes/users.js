const User = require("../models/user.js");

module.exports = function (router) {
	var usersRoute = router.route("/users");

	usersRoute.get(async function (_, res) {
		const users = await User.find().lean();

		const usersResponse = {
			message: "OK",
			data: users,
		};
		res.status(200).json(usersResponse);
	});

	usersRoute.post(async function (req, res) {
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
