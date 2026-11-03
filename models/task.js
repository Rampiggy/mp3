// Load required packages
var mongoose = require("mongoose");

// Define our user schema
var TaskSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: String,
	deadline: { type: Date, required: true },
	completed: Boolean,
	assignedUser: String,
	assignedUserName: String,
	dateCreated: Date,
});

const Task = mongoose.model("Task", TaskSchema);

async function getTask(rawId, res) {
	let taskId = null;
	try {
		taskId = new mongoose.Types.ObjectId(rawId);
	} catch {
		const taskResponse = {
			message: `Not found. '${rawId}' does not parse to a valid task ID.`,
			data: "",
		};
		res.status(404).json(taskResponse);
		return null;
	}

	const task = await Task.findOne({ _id: taskId });
	if (task === null) {
		const taskResponse = {
			message: `Not found. Task ID '${taskId}' was not found.`,
			data: "",
		};
		res.status(404).json(taskResponse);
		return null;
	}

	return task;
}

// Export the Mongoose model
module.exports = { Task, getTask };
