const mongoose = require("mongoose");
const Task = require("../models/task.js").Task;
const getUser = require("../models/user.js").getUser;
const getTask = require("../models/task.js").getTask;

function taskRouter(router) {
	const taskRoute = router.route("/tasks/:id");

	taskRoute.get(async function (req, res) {
		const currTask = await getTask(req.params.id, res);

		if (currTask === null) return;

		let task = Task.findOne({ _id: req.params.id });

		// SELECT
		const select = req.query.select;
		if (select) task = task.select(JSON.parse(req.query.select));

		const taskResponse = {
			message: "OK",
			data: await task,
		};
		res.status(200).json(taskResponse);
	});

	taskRoute.put(async function (req, res) {
		const taskToUpdate = await getTask(req.params.id, res);

		if (taskToUpdate === null) return;

		const session = await mongoose.startSession();

		try {
			await session.withTransaction(async () => {
				if (taskToUpdate.assignedUser) {
					const unassignUser = await getUser(
						taskToUpdate.assignedUser,
						res,
					);

					if (unassignUser === null) throw Error;

					unassignUser.pendingTasks =
						unassignUser.pendingTasks.filter((taskId) => {
							taskId != taskToUpdate._id;
						});
					await unassignUser.save();
				}

				if (req.body.assignedUser) {
					const assignUser = await getUser(
						req.body.assignedUser,
						res,
					);

					if (assignUser === null) throw Error;

					if (req.body.assignedUserName != assignUser.name) {
						const taskResponse = {
							message:
								"Bad request. Assigned user id does not match to name.",
							data: "",
						};
						res.status(400).json(taskResponse);
					}

					if (
						!req.body.completed ||
						!req.body.completed == false ||
						!req.body.completed == "false"
					) {
						assignUser.pendingTasks.push(taskToUpdate._id);
						await assignUser.save();
					}
				}

				taskToUpdate.name = req.body.name;
				taskToUpdate.description = req.body.description ?? "";
				taskToUpdate.deadline = req.body.deadline;
				taskToUpdate.completed = req.body.completed ?? false;
				taskToUpdate.assignedUser = req.body.assignedUser ?? "";
				taskToUpdate.assignedUserName =
					req.body.assignedUserName ?? "unassigned";
				await taskToUpdate.save();
			});
		} catch {
			return;
		}

		const taskResponse = {
			message: "OK",
			data: taskToUpdate,
		};
		res.status(200).json(taskResponse);
	});

	taskRoute.delete(async function (req, res) {
		const taskToDelete = await getTask(req.params.id, res);

		if (taskToDelete === null) return;

		const userToUpdate = await getUsery(taskToDelete.assignedUser);
		if (userToUpdate !== null) {
			userToUpdate.pendingTasks = userToUpdate.pendingTasks.filter(
				(taskId) => {
					taskId != taskToDelete._id;
				},
			);
			userToUpdate.save();
		}

		await Task.deleteOne({ _id: taskToDelete._id });

		const taskResponse = {
			message: "OK",
		};
		res.status(200).json(taskResponse);
	});

	return router;
}

module.exports = { getTask, taskRouter };

async function getUsery(rawId) {
	let userId = null;
	try {
		userId = new mongoose.Types.ObjectId(rawId);
	} catch {
		return null;
	}

	return await User.findOne({ _id: userId });
}
