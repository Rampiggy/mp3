import axios from "axios";
import baseUrl from "./globals.mjs";

const url = baseUrl + "/tasks";

var TaskSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: String,
	deadline: { type: Date, required: true },
	completed: Boolean,
	assignedUser: String,
	assignedUserName: String,
	dateCreated: Date,
});

const taskMissingName = {
	name: "",
	description: "desc 1",
	deadline: "2027/01/01",
	completed: "false",
	assignedUser: "foo",
	assignedUserName: "bar",
};
console.log("POST task missing name...\n");
try {
	await axios.post(url, taskMissingName);
} catch (error) {
	console.log(error.response.data);
}
console.log();

const taskMissingDeadline = {
	name: "deadline missing",
	description: "desc 1",
	deadline: "",
	completed: "false",
	assignedUser: "foo",
	assignedUserName: "bar",
};
console.log("POST task missing deadline...\n");
try {
	await axios.post(url, taskMissingDeadline);
} catch (error) {
	console.log(error.response.data);
}
console.log();

const getTasksResponse = (await axios.get(url)).data;
console.log("GET tasks...\n");
console.log(getTasksResponse);
console.log();

console.log("Test completed.");
