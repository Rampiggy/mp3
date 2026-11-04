import axios from "axios";
import baseUrl from "./globals.mjs";

const usersUrl = baseUrl + "/users";
const tasksUrl = baseUrl + "/tasks";

console.log("Test start.\n");

console.log("POST: User with no tasks...");
const user = {
	name: "john doe",
	email: "john.doe@test.com",
};
const postUserResponse = (await axios.post(usersUrl, user)).data;
console.log(postUserResponse);
console.log();

console.log("POST: Unassigned task...");
let task = {
	name: "task 1",
	deadline: "2027/01/01",
};
const postTaskResponse = (await axios.post(tasksUrl, task)).data;
console.log(postTaskResponse);
console.log();

console.log("GET: User with no tasks...");
let getUserResponse = (
	await axios.get(`${usersUrl}/${postUserResponse.data._id}`)
).data;
console.log(getUserResponse);
console.log();

console.log("PUT: Assign task to user...");
task.assignedUser = postUserResponse.data._id;
task.assignedUserName = postUserResponse.data.name;
let putTaskResponse = (
	await axios.put(`${tasksUrl}/${postTaskResponse.data._id}`, task)
).data;
console.log(putTaskResponse);
console.log();

console.log("GET: User with one task...");
getUserResponse = (await axios.get(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(getUserResponse);
console.log();

console.log("PUT: Complete task assigned to user...");
task.completed = "true";
putTaskResponse = (
	await axios.put(`${tasksUrl}/${postTaskResponse.data._id}`, task)
).data;
console.log(putTaskResponse);
console.log();

console.log("GET: User with no tasks...");
getUserResponse = (await axios.get(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(getUserResponse);
console.log();

console.log("PUT: Incomplete task assigned to user...");
task.completed = "false";
putTaskResponse = (
	await axios.put(`${tasksUrl}/${postTaskResponse.data._id}`, task)
).data;
console.log(putTaskResponse);
console.log();

console.log("GET: User with one task...");
getUserResponse = (await axios.get(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(getUserResponse);
console.log();

console.log("DELETE: Task...");
const deleteTaskResponse = (
	await axios.delete(`${tasksUrl}/${postTaskResponse.data._id}`)
).data;
console.log(deleteTaskResponse);
console.log();

console.log("GET: User with no tasks...");
getUserResponse = (await axios.get(`${usersUrl}/${postUserResponse.data._id}`))
	.data;
console.log(getUserResponse);
console.log();

console.log("DELETE: user...");
const deleteUserResponse = (
	await axios.delete(`${usersUrl}/${postUserResponse.data._id}`)
).data;
console.log(deleteUserResponse);
console.log();

console.log("Test completed.");
