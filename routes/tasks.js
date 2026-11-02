const Task = require("../models/task.js");

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
			description: req.body.description,
			deadline: req.body.deadline,
			completed: req.body.completed,
			assignedUser: req.body.assignedUser ?? "",
			assignedUserName: req.body.assignedUser ?? "unassigned",
			dateCreated: new Date(),
		});
		await newTask.save();

		const taskResponse = {
			message: "OK",
			data: newTask,
		};
		res.status(201).json(taskResponse);
	});

	return router;
};
