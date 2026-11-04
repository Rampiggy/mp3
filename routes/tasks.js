const Task = require("../models/task.js").Task;
const getUser = require("../models/user.js").getUser;

module.exports = function (router) {
	var tasksRoute = router.route("/tasks");

	tasksRoute.get(async function (req, res) {
		// WHERE
		let tasks = null;
		try {
			const parsedWhere = JSON.parse(req.query.where);
			tasks = await Task.find(parsedWhere).lean();
		} catch {
			tasks = await Task.find().lean();
		}

		// SORT
		try {
			const parsedSort = JSON.parse(req.query.sort);
			tasks.sort((a, b) => {
				if (parsedSort.name !== undefined) {
					if (parsedSort.name == 1) {
						if (a.name > b.name) return 1;
						if (a.name < b.name) return -1;
					}
					if (a.name > b.name) return -1;
					if (a.name < b.name) return 1;
				}

				if (parsedSort.description !== undefined) {
					if (parsedSort.description == 1) {
						if (a.description > b.description) return 1;
						if (a.description < b.description) return -1;
					}
					if (a.description > b.description) return -1;
					if (a.description < b.description) return 1;
				}

				if (parsedSort.deadline !== undefined) {
					if (parsedSort.deadline == 1) {
						if (a.deadline > b.deadline) return 1;
						if (a.deadline < b.deadline) return -1;
					}
					if (a.deadline > b.deadline) return -1;
					if (a.deadline < b.deadline) return 1;
				}

				if (parsedSort.completed !== undefined) {
					if (parsedSort.completed == 1) {
						if (a.completed > b.completed) return 1;
						if (a.completed < b.completed) return -1;
					}
					if (a.completed > b.completed) return -1;
					if (a.completed < b.completed) return 1;
				}

				if (parsedSort.assignedUser !== undefined) {
					if (parsedSort.assignedUser == 1) {
						if (a.assignedUser > b.assignedUser) return 1;
						if (a.assignedUser < b.assignedUser) return -1;
					}
					if (a.assignedUser > b.assignedUser) return -1;
					if (a.assignedUser < b.assignedUser) return 1;
				}

				if (parsedSort.assignedUserName !== undefined) {
					if (parsedSort.assignedUserName == 1) {
						if (a.assignedUserName > b.assignedUserName) return 1;
						if (a.assignedUserName < b.assignedUserName) return -1;
					}
					if (a.assignedUserName > b.assignedUserName) return -1;
					if (a.assignedUserName < b.assignedUserName) return 1;
				}

				if (parsedSort.dateCreated !== undefined) {
					if (parsedSort.dateCreated == 1) {
						if (a.dateCreated > b.dateCreated) return 1;
						if (a.dateCreated < b.dateCreated) return -1;
					}
					if (a.dateCreated > b.dateCreated) return -1;
					if (a.dateCreated < b.dateCreated) return 1;
				}

				return 0;
			});
		} catch {}

		// SKIP
		try {
			tasks = tasks.slice(req.query.skip);
		} catch {}

		// LIMIT
		try {
			tasks = tasks.slice(0, req.query.limit);
		} catch {}

		// COUNT
		if (req.query.limit === "true") {
			tasks = tasks.length;
		}

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
