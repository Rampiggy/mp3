const mongoose = require("mongoose");
const Task = require("../models/task.js");
const getUser = require("./user.js").getUser;

async function getTask(rawId, res) {
	let taskId = null;
	try {
		taskId = new mongoose.Types.ObjectId(rawId);
	} catch {
		const taskResponse = {
			message: `Not found. '${rawId}' does not parse to a valid task ID.`,
		};
		res.status(404).json(taskResponse);
		return null;
	}

	const task = await Task.findOne({ _id: taskId });
	if (task === null) {
		const taskResponse = {
			message: `Not found. Task ID '${taskId}' was not found.`,
		};
		res.status(404).json(taskResponse);
		return null;
	}

	return task;
}

function taskRouter(router) {
	const taskRoute = router.route("/tasks/:id");

	taskRoute.get(async function (req, res) {
		const currTask = await getTask(req.params.id, res);

		if (currTask === null) return;

		const taskResponse = {
			message: "OK",
			data: currTask,
		};
		res.status(200).json(taskResponse);
	});

	taskRoute.put(async function (req, res) {
		const taskToUpdate = await getTask(req, res);

		if (taskToUpdate === null) return;

		let isSuccessful = true;
		session.withTransaction(async () => {
			const unassignUser = await getUser(taskToDelete.assignedUser, res);

			if (unassignUser === null) {
				isSuccessful = false;
				throw Error;
			}

			unassignUser.pendingTasks = unassignUser.pendingTasks.filter(
				(taskId) => {
					taskId != taskToUpdate._id;
				},
			);
			await unassignUser.save();

			if (req.body.assignedUser != "") {
				const assignUser = await getUser(
					taskToDelete.assignedUser,
					res,
				);

				if (assignUser === null) {
					isSuccessful = false;
					throw Error;
				}

				assignUser.pendingTasks.push(taskToUpdate._id);
				await assignUser.save();
			}

			taskToUpdate.name = req.body.name;
			taskToUpdate.description = req.body.description;
			taskToUpdate.deadline = req.body.deadline;
			taskToUpdate.completed = req.body.completed;
			taskToUpdate.assignedUser = req.body.assignedUser ?? "";
			taskToUpdate.assignedUserName =
				req.body.assignedUser ?? "unassigned";
			await taskToUpdate.save();
		});

		const taskResponse = {
			message: "OK",
			data: taskToUpdate,
		};
		res.status(200).json(taskResponse);
	});

	taskRoute.delete(async function (req, res) {
		const taskToDelete = await getTask(req.params.id, res);

		if (taskToDelete === null) return;

		const userToUpdate = await getUser(taskToDelete.assignedUser, res);
		userToUpdate.pendingTasks = userToUpdate.pendingTasks.filter(
			(taskId) => {
				taskId != taskToDelete._id;
			},
		);
		userToUpdate.save();

		await Task.deleteOne({ _id: taskToDelete._id });

		const taskResponse = {
			message: "OK",
		};
		res.status(200).json(taskResponse);
	});

	return router;
}

module.exports = { getTask, taskRouter };
