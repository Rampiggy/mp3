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
