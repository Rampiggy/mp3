import axios from "axios";
import baseUrl from "./globals.mjs";

const url = baseUrl + "/users";

console.log("POST user missing name...\n");
const userMissingName = {
	name: "",
	email: "john.doe@test.com",
};
try {
	await axios.post(url, userMissingName);
} catch (error) {
	console.log(error.response.data);
}
console.log();

console.log("POST user missing email...\n");
const userMissingEmail = {
	name: "john doe",
	email: "",
};
try {
	await axios.post(url, userMissingEmail);
} catch (error) {
	console.log(error.response.data);
}
console.log();

const duplicateUserEmail1 = {
	name: "john.doe1",
	email: "john.does@test.com",
};
const duplicateUserEmail2 = {
	name: "john.doe2",
	email: "john.does@test.com",
};
console.log("POST first duplicate email...\n");
const postFirstDuplicate = (await axios.post(url, duplicateUserEmail1)).data;
console.log(postFirstDuplicate);
console.log();
console.log("POST second duplicate email...\n");
try {
	await axios.post(url, duplicateUserEmail2);
} catch (error) {
	console.log(error.response.data);
}
console.log();

const getUsersResponse = (await axios.get(url)).data;
console.log("GET users...\n");
console.log(getUsersResponse);
console.log();

const deleteResponse = (await axios.delete(`${url}/${postFirstDuplicate.data._id}`))
	.data;
console.log("DELETE first duplicate user...\n");
console.log(deleteResponse);
console.log();

const getUsersResponse = (await axios.get(url)).data;
console.log("GET users...\n");
console.log(getUsersResponse);
console.log();

console.log("Test completed.");
