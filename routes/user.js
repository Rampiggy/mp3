const mongoose = require("mongoose");
const User = require("../models/user.js");
const getTask = require("./task.js").getTask;

function userRouter(router) {
	const userRoute = router.route("/users/:id");

	userRoute.get(async function (req, res) {
		const currUser = await getUser(req.params.id, res);

		if (currUser === null) return;

		const userResponse = {
			message: "OK",
			data: currUser,
		};
		res.status(200).json(userResponse);
	});

	userRoute.put(async function (req, res) {
		const session = await mongoose.startSession();
		const userToUpdate = await getUser(req.params.id, res);

		if (userToUpdate === null) return;

		let isSuccessful = true;
		session.withTransaction(async () => {
			userToUpdate.pendingTasks.forEach(async (taskId) => {
				const taskToUnassign = await getTask(taskId);

				if (taskToUnassign === null) {
					isSuccessful = false;
					throw Error;
				}

				taskToUnassign.assignedUser = "";
				taskToUnassign.assignedUserName = "unassigned";
				await taskToUnassign.save();
			});

			req.body.pendingTasks.forEach(async (taskId) => {
				const taskToUpdate = await getTask(taskId);

				if (taskToUpdate === null) {
					isSuccessful = false;
					throw Error;
				}

				taskToUpdate.assignedUser = userToUpdate._id;
				taskToUpdate.assignedUserName = userToUpdate.name;
				await taskToUpdate.save();
			});

			userToUpdate.name = req.body.name;
			userToUpdate.email = req.body.email;
			userToUpdate.pendingTasks = req.body.pendingTasks ?? [];
			await userToUpdate.save();
		});

		if (!isSuccessful) return;

		const userResponse = {
			message: "OK",
			data: userToUpdate,
		};
		res.status(200).json(userResponse);
	});

	userRoute.delete(async function (req, res) {
		const userToDelete = await getUser(req.params.id, res);

		if (userToDelete === null) return;

		userToDelete.pendingTasks.forEach(async (task) => {
			const taskToUnassign = await getTask(task._id, res);
			taskToUnassign.assignedUser = "";
			taskToUnassign.assignedUserName = "unassigned";
			await taskToUnassign.save();
		});

		await User.deleteOne({ _id: userToDelete._id });

		const userResponse = {
			message: "OK",
		};
		res.status(200).json(userResponse);
	});

	return router;
}

module.exports = { getUser, userRouter };
