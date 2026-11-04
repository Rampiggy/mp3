const mongoose = require("mongoose");
const User = require("../models/user.js").User;
const getUser = require("../models/user.js").getUser;
const getTask = require("../models/task.js").getTask;

function userRouter(router) {
	const userRoute = router.route("/users/:id");

	userRoute.get(async function (req, res) {
		const currUser = await getUser(req.params.id, res);

		if (currUser === null) return;

		let user = User.findOne({ _id: req.params.id });

		// SELECT
		const select = req.query.select;
		if (select) user = user.select(JSON.parse(req.query.select));

		const userResponse = {
			message: "OK",
			data: await user,
		};
		res.status(200).json(userResponse);
	});

	userRoute.put(async function (req, res) {
		const userToUpdate = await getUser(req.params.id, res);

		if (userToUpdate === null) return;

		const session = await mongoose.startSession();

		try {
			await session.withTransaction(async () => {
				userToUpdate.pendingTasks.forEach(async (taskId) => {
					const taskToUnassign = await getTask(taskId, res);

					if (taskToUnassign === null) throw Error;

					taskToUnassign.assignedUser = "";
					taskToUnassign.assignedUserName = "unassigned";
					await taskToUnassign.save();
				});

				req.body.pendingTasks.forEach(async (taskId) => {
					const taskToUpdate = await getTask(taskId, res);

					if (taskToUpdate === null) throw Error;

					taskToUpdate.assignedUser = userToUpdate._id;
					taskToUpdate.assignedUserName = userToUpdate.name;
					await taskToUpdate.save();
				});

				userToUpdate.name = req.body.name;
				userToUpdate.email = req.body.email;
				userToUpdate.pendingTasks = req.body.pendingTasks ?? [];
				await userToUpdate.save();
			});
		} catch {
			return;
		}

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

		//const userResponse = {
		//	message: "OK",
		//};
		res.status(204).json({});
	});

	return router;
}

module.exports = { getUser, userRouter };
