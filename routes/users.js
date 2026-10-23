const User = require("../models/user.js");

let users = [];
for (let i = 0; i < 3; i++) {
	const user = new User({ name: `User ${i + 1}` });
	users.push(user);
}

module.exports = function (router) {
	var usersRoute = router.route("/users");

	usersRoute.get(function (_, res) {
		res.status(200).json(users);
	});

	usersRoute.post(function (req, res) {
		const newUser = new User({ name: req.body.name });
		users.push(newUser);

		res.status(201).json(newUser);
	});

	return router;
};
