import axios from "axios";
import baseUrl from "./globals.mjs";

const url = baseUrl + "/tasks";

console.log("Test start.\n");

console.log("POST: Task missing name error...\n");
const taskMissingName = {
	name: "",
	description: "desc 1",
	deadline: "2027/01/01",
	completed: "false",
	assignedUser: "foo",
	assignedUserName: "bar",
};
try {
	await axios.post(url, taskMissingName);
} catch (error) {
	console.log(error.response.data);
}
console.log();

console.log("POST: Task missing deadline error...\n");
const taskMissingDeadline = {
	name: "deadline missing",
	description: "desc 1",
	deadline: "",
	completed: "false",
	assignedUser: "foo",
	assignedUserName: "bar",
};
try {
	await axios.post(url, taskMissingDeadline);
} catch (error) {
	console.log(error.response.data);
}
console.log();

const getTasksResponse = (await axios.get(url)).data;
console.log("GET: No tasks returned...\n");
console.log(getTasksResponse);
console.log();

console.log("Test completed.");
