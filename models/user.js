// Load required packages
var mongoose = require("mongoose");

// Define our user schema
var UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	pendingTasks: [String],
	dateCreated: Date,
});

const User = mongoose.model("User", UserSchema);

async function getUser(rawId, res) {
	let userId = null;
	try {
		userId = new mongoose.Types.ObjectId(rawId);
	} catch {
		const userResponse = {
			message: `Not found. '${rawId}' does not parse to a valid user ID.`,
			data: "",
		};
		res.status(404).json(userResponse);
		return null;
	}

	const user = await User.findOne({ _id: userId });
	if (user === null) {
		const userResponse = {
			message: `Not found. User ID '${userId}' was not found.`,
			data: "",
		};
		res.status(404).json(userResponse);
		return null;
	}

	return user;
}

// Export the Mongoose model
module.exports = { User, getUser };
