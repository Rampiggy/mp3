import axios from "axios";
import baseUrl from "./globals.mjs";

const url = baseUrl + "/users";
const joeSchmoEmptyArrayOfTasks = {
	name: "joe schmo",
	email: "joe.schmo@test.com",
	pendingTasks: [],
};

const postResponse = (await axios.post(url, joeSchmoEmptyArrayOfTasks)).data;
console.log("POST user...\n");
console.log(postResponse);
console.log();

const getUsersResponse = (await axios.get(url)).data;
console.log("GET users...\n");
console.log(getUsersResponse);
console.log();

const getUserResponse = (await axios.get(`${url}/${postResponse.data._id}`))
	.data;
console.log("GET user...\n");
console.log(getUserResponse);
console.log();

const deleteResponse = (await axios.delete(`${url}/${postResponse.data._id}`))
	.data;
console.log("DELETE user...\n");
console.log(deleteResponse);
console.log();

console.log("Test completed.");
