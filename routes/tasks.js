const Task = require("../models/task.js").Task;
const getUser = require("../models/user.js").getUser;

module.exports = function (router) {
	var tasksRoute = router.route("/tasks");

	tasksRoute.get(async function (_, res) {
		const tasks = await Task.find().lean();

		const tasksResponse = {
			message: "OK",
			data: tasks,
		};
		res.status(200).json(tasksResponse);
	});

	tasksRoute.post(async function (req, res) {
		const newTask = new Task({
			name: req.body.name,
			description: req.body.description ?? "",
			deadline: req.body.deadline,
			completed: req.body.completed ?? false,
			assignedUser: req.body.assignedUser ?? "",
			assignedUserName: req.body.assignedUser ?? "unassigned",
			dateCreated: new Date(),
		});

		try {
			await newTask.save();
		} catch (error) {
			const taskResponse = {
				message: `Bad request. ${error}`,
				data: "",
			};
			res.status(400).json(taskResponse);
			return;
		}

		if (newTask.assignedUser === "") {
			if (newTask.assignedUserName !== "unassigned") {
				const taskResponse = {
					message:
						"Bad request. Assigned user is empty, but task not set to unassigned.",
					data: "",
				};
				res.status(400).json(taskResponse);
				return;
			}

			const taskResponse = {
				message: "OK",
				data: newTask,
			};
			res.status(201).json(taskResponse);
			return;
		}

		const userToUpdate = await getUser(newTask.assignedUser, res);

		if (userToUpdate === null) return;

		if (!newTask.completed) {
			userToUpdate.pendingTasks.push(newTask._id);
			await userToUpdate.save();
		}

		const taskResponse = {
			message: "OK",
			data: newTask,
		};
		res.status(201).json(taskResponse);
	});

	return router;
};
