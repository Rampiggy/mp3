const Task = require("../models/task.js").Task;
const getUser = require("../models/user.js").getUser;

module.exports = function (router) {
	var tasksRoute = router.route("/tasks");

	tasksRoute.get(async function (req, res) {
		let tasks = null;

		// WHERE
		const where = req.query.where;
		if (where) tasks = tasks.find(JSON.parse(req.query.where));
		else tasks = tasks.find();

		// LIMIT
		const limit = req.query.limit;
		if (limit) tasks = tasks.limit(limit);

		// SORT
		const sort = req.query.sort;
		if (sort) tasks = tasks.sort(JSON.parse(req.query.sort));

		// SKIP
		const skip = req.query.skip;
		if (skip) tasks = tasks.skip(skip);

		// SELECT
		const select = req.query.select;
		if (select) tasks = tasks.select(JSON.parse(req.query.select));

		// COUNT
		const count = req.query.count;
		if (count) tasks = tasks.count(count);

		const tasksResponse = {
			message: "OK",
			data: await tasks,
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
