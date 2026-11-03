import axios from "axios";
import baseUrl from "./globals.mjs";

const usersUrl = baseUrl + "/users";
const tasksUrl = baseUrl + "/tasks";

const user = {
	name: "john doe",
	email: "john.doe@test.com",
	pendingTasks: [],
};

const postUserResponse = (await axios.post(usersUrl, user)).data;
console.log("POST user...\n");
console.log(postUserResponse);
console.log();

let task = {
	name: "task 1",
	description: "desc 1",
	deadline: "2027/01/01",
	completed: "false",
	assignedUser: "foo",
	assignedUserName: "bar",
};

try {
	await axios.post(tasksUrl, task);
} catch (error) {
	console.log(error.response.data);
}
console.log();

task.assignedUser = postUserResponse.data._id;

try {
	await axios.post(tasksUrl, task);
} catch (error) {
	console.log(error.response.data);
}
console.log();

task.assignedUserName = postUserResponse.data.name;

const deleteResponse = (await axios.delete(`${usersUrl}/${userPostResponse.data._id}`))
	.data;
console.log("DELETE user...\n");
console.log(deleteResponse);
console.log();

console.log("Test completed.");
