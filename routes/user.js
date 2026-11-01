const User = require("../models/user.js");

module.exports = function (router) {
	const usersRoute = router.route("/users/:id");

	usersRoute.get(async function (req, res) {
		const userId = req.params.id;
		const user = await User.findOne({ _id: userId }).lean();

		const userResponse = {
			message: "OK",
			data: user,
		};
		res.status(200).json(userResponse);
	});

	//usersRoute.put(async function (req, res) {
	//	const newUser = new User({
	//		name: req.body.name,
	//		email: req.body.email,
	//		pendingTasks: req.body.pendingTasks ?? [],
	//		dateCreated: new Date(),
	//	});
	//	await newUser.save();

	//	const userResponse = {
	//		message: "OK",
	//		data: newUser,
	//	};
	//	res.status(201).json(userResponse);
	//});

	return router;
};
