const User = require("../models/user.js").User;
const getTask = require("../models/task.js").getTask;

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
		if (!isValidRequiredFields(req, res)) return;

		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			pendingTasks: req.body.pendingTasks ?? [],
			dateCreated: new Date(),
		});
		await newUser.save();

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

function isValidRequiredFields(req, res) {
	if (!req.body.name) {
		const userResponse = {
			message: "Bad request. Property 'name' is missing.",
			data: "",
		};
		res.status(400).json(userResponse);
		return false;
	}

	if (!req.body.email) {
		const userResponse = {
			message: "Bad request. Property 'email' is missing.",
			data: "",
		};
		res.status(400).json(userResponse);
		return false;
	}

	return true;
}
