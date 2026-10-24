const User = require("../models/user.js");

module.exports = function (router) {
	var usersRoute = router.route("/users");

	usersRoute.get(async function (_, res) {
		const users = await User.find().lean();
		res.status(200).json(users);
	});

	usersRoute.post(async function (req, res) {
		const newUser = new User({ name: req.body.name });
		await newUser.save();
		res.status(201).json(newUser);
	});

	return router;
};
