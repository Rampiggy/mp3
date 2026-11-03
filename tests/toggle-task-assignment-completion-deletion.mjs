import axios from "axios";
import baseUrl from "./globals.mjs";

const usersUrl = baseUrl + "/users";
const tasksUrl = baseUrl + "/tasks";

console.log("Test start.\n");

console.log("POST: User with no tasks...\n");
const user = {
	name: "john doe",
	email: "john.doe@test.com",
};
const postUserResponse = (await axios.post(usersUrl, user)).data;
console.log(postUserResponse);
console.log();

console.log("POST: Unassigned task...\n");
let task = {
	name: "task 1",
	deadline: "2027/01/01",
};
const postTaskResponse = (await axios.post(tasksUrl, task)).data;
console.log(postTaskResponse);
console.log();

console.log("GET: User with no tasks...\n");
let getUserResponse = (await axios.get(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(getUserResponse);
console.log();

console.log("PUT: Assign task to user...\n");
task.assignedUser = postUserResponse.data._id;
task.assignedUserName = postUserResponse.data.name;
let putTaskResponse = (await axios.put(`${tasksUrl}/${postTaskResponse.data._id}`))
	.data;
console.log(putTaskResponse);
console.log();

console.log("GET: User with one task...\n");
getUserResponse = (await axios.get(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(getUserResponse);
console.log();

console.log("PUT: Complete task assigned to user...\n");
task.completed = "true";
putTaskResponse = (await axios.put(`${tasksUrl}/${postTaskResponse.data._id}`))
	.data;
console.log(putTaskResponse);
console.log();

console.log("GET: User with no tasks...\n");
getUserResponse = (await axios.get(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(getUserResponse);
console.log();

console.log("PUT: Incomplete task assigned to user...\n");
task.completed = "false";
putTaskResponse = (await axios.put(`${tasksUrl}/${postTaskResponse.data._id}`))
	.data;
console.log(putTaskResponse);
console.log();

console.log("GET: User with one task...\n");
getUserResponse = (await axios.get(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(getUserResponse);
console.log();

console.log("DELETE: Task...\n");
const deleteTaskResponse = (await axios.delete(`${tasksUrl}/${postTaskResponse.data._id}`))
	.data;
console.log(deleteTaskResponse);
console.log();

console.log("GET: User with no tasks...\n");
getUserResponse = (await axios.get(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(getUserResponse);
console.log();

console.log("DELETE: user...\n");
const deleteUserResponse = (await axios.delete(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(deleteUserResponse);
console.log();

console.log("Test completed.");
