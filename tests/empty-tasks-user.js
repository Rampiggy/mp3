import axios from "axios";
import baseUrl from "./globals.js";

const url = baseUrl + "/users";
const joeSchmoEmptyArrayOfTasks = {
	name: "joe schmo",
	email: "joe.schmo@test.com",
	pendingTasks: [],
};

const postResponse = (await axios.post(url, joeSchmoEmptyArrayOfTasks)).data;

console.log("Result of post request:");
console.log(postResponse);
console.log();

const deleteResponse = (await axios.delete(`${url}/${postResponse.data._id}`))
	.data;

console.log("Result of delete request:");
console.log(deleteResponse);
console.log();

console.log("Test completed.");
