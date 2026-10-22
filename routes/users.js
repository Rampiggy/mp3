const User = require("../models/user.js");

let users = [];
for (let i = 0; i < 20; i++) {
	const user = new User({ name: `User ${i + 1}` });
	users.push(user);
}

module.exports = function (router) {
	var usersRoute = router.route("/users");

	usersRoute.get(function (_, res) {
		res.json(users);
	});

	return router;
};
