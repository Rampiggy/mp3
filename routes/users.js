const User = require("../models/user.js").User;
const getTask = require("../models/task.js").getTask;

module.exports = function (router) {
	var usersRoute = router.route("/users");

	usersRoute.get(async function (req, res) {
		let users = null;
		try {
			const parsedWhere = JSON.parse(req.query.where);
			users = await User.find(parsedWhere).lean();
		} catch {
			users = await User.find().lean();
		}

		try {
			const parsedSort = JSON.parse(req.query.sort);
			users.sort((a, b) => {
				if (parsedSort.name !== undefined) {
					if (parsedSort.name == 1) {
						if (a.name > b.name) return 1;
						if (a.name < b.name) return -1;
					}
					if (a.name > b.name) return -1;
					if (a.name < b.name) return 1;
				}

				if (parsedSort.email !== undefined) {
					if (parsedSort.email == 1) {
						if (a.email > b.email) return 1;
						if (a.email < b.email) return -1;
					}
					if (a.email > b.email) return -1;
					if (a.email < b.email) return 1;
				}

				if (parsedSort.pendingTasks !== undefined) {
					if (parsedSort.pendingTasks == 1) {
						if (a.pendingTasks > b.pendingTasks) return 1;
						if (a.pendingTasks < b.pendingTasks) return -1;
					}
					if (a.pendingTasks > b.pendingTasks) return -1;
					if (a.pendingTasks < b.pendingTasks) return 1;
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

		try {
			users = users.slice(req.query.skip);
		} catch {}

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
