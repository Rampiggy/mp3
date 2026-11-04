import axios from "axios";
import baseUrl from "./globals.mjs";

const tasksUrl = baseUrl + "/tasks";

console.log("Test start.\n");

console.log("POST: 3 tasks.\n");
const task1 = {
	name: "task 1",
	email: "task1@test.com",
};
const posttaskResponse1 = (await axios.post(tasksUrl, task1)).data;
const task2 = {
	name: "task 2",
	email: "task2@test.com",
};
const posttaskResponse2 = (await axios.post(tasksUrl, task2)).data;
const task3 = {
	name: "task 3",
	email: "task3@test.com",
};
const posttaskResponse3 = (await axios.post(tasksUrl, task3)).data;

console.log("WHERE: All the tasks...");
console.log((await axios.get(`${tasksUrl}?`)).data);
console.log();

console.log("WHERE: Second task...");
console.log((await axios.get(`${tasksUrl}?where={"name":"task 2"}`)).data);
console.log();

console.log("WHERE: No tasks...");
console.log((await axios.get(`${tasksUrl}?where={"name":"none"}`)).data);
console.log();

console.log("SORT: Name descending...");
console.log((await axios.get(`${tasksUrl}?sort={"name":-1}`)).data);
console.log();

console.log("SKIP: First two tasks...");
console.log((await axios.get(`${tasksUrl}?skip=2`)).data);
console.log();

console.log("LIMIT: Two tasks...");
console.log((await axios.get(`${tasksUrl}?limit=2`)).data);
console.log();

await axios.delete(`${tasksUrl}/${posttaskResponse1.data._id}`);
await axios.delete(`${tasksUrl}/${posttaskResponse2.data._id}`);
await axios.delete(`${tasksUrl}/${posttaskResponse3.data._id}`);
console.log("DELETE: 3 tasks.\n");

console.log("Test completed.");
