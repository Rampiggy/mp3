const User = require("../models/user.js").User;
const getTask = require("../models/task.js").getTask;

module.exports = function (router) {
	var usersRoute = router.route("/users");

	usersRoute.get(async function (req, res) {
		let users = User;

		// WHERE
		const where = req.query.where;
		if (where) users = users.find(JSON.parse(req.query.where));
		else users = users.find();

		// LIMIT
		const limit = req.query.limit;
		if (limit) users = users.limit(limit);

		// SORT
		const sort = req.query.sort;
		if (sort) users = users.sort(JSON.parse(req.query.sort));

		// SKIP
		const skip = req.query.skip;
		if (skip) users = users.skip(skip);

		// SELECT
		const select = req.query.select;
		if (select) users = users.select(JSON.parse(req.query.select));

		// COUNT
		const count = req.query.count;
		if (count && req.query.count == "true") users = users.countDocuments();

		const usersResponse = {
			message: "OK",
			data: await users,
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

		try {
			await newUser.save();
		} catch (error) {
			const userResponse = {
				message: `Bad request. ${error}`,
				data: "",
			};
			res.status(400).json(userResponse);
			return;
		}

		newUser.pendingTasks.forEach(async (taskId) => {
			const taskToUpdate = await getTask(taskId, res);
			taskToUpdate.assignedUser = userToUpdate._id;
			taskToUpdate.assignedUserName = userToUpdate.name;
			await taskToUpdate.save();
		});

		const userResponse = {
			message: "OK",
			data: newUser,
		};
		res.status(201).json(userResponse);
	});

	return router;
};
