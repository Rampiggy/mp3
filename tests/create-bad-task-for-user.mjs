import axios from "axios";
import baseUrl from "./globals.mjs";

const usersUrl = baseUrl + "/users";
const tasksUrl = baseUrl + "/tasks";

console.log("Test start.\n");

console.log("POST: User with no tasks...\n");
const user = {
	name: "john doe",
	email: "john.doe@test.com",
	pendingTasks: [],
};
const postUserResponse = (await axios.post(usersUrl, user)).data;
console.log(postUserResponse);
console.log();

console.log("POST: Task assigned to nonexistent user error...\n");
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

console.log("POST: Task with nonmatching user and username error...\n");
task.assignedUser = postUserResponse.data._id;
try {
	await axios.post(tasksUrl, task);
} catch (error) {
	console.log(error.response.data);
}
console.log();

console.log("DELETE user with empty tasks...\n");
const deleteUserResponse = (await axios.delete(`${usersUrl}/${userPostResponse.data._id}`))
	.data;
console.log(deleteUserResponse);
console.log();

console.log("Test completed.");
