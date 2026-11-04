import axios from "axios";
import baseUrl from "./globals.mjs";

const usersUrl = baseUrl + "/users";

console.log("Test start.\n");

console.log("POST: User 1...");
const user1 = {
	name: "user 1",
	email: "user1@test.com",
};
const postUserResponse1 = (await axios.post(usersUrl, user1)).data;
console.log(postUserResponse1);
console.log();

console.log("POST: User 2...");
const user2 = {
	name: "user 2",
	email: "user2@test.com",
};
const postUserResponse2 = (await axios.post(usersUrl, user2)).data;
console.log(postUserResponse2);

console.log("POST: User 3...");
const user3 = {
	name: "user 3",
	email: "user3@test.com",
};
const postUserResponse3 = (await axios.post(usersUrl, user3)).data;
console.log(postUserResponse3);

console.log("DELETE: User 1...");
const deleteUserResponse1 = (
	await axios.delete(`${usersUrl}/${postUserResponse1.data._id}`)
).data;
console.log(deleteUserResponse1);
console.log();

console.log("DELETE: User 2...");
const deleteUserResponse2 = (
	await axios.delete(`${usersUrl}/${postUserResponse2.data._id}`)
).data;
console.log(deleteUserResponse2);
console.log();

console.log("DELETE: User 3...");
const deleteUserResponse3 = (
	await axios.delete(`${usersUrl}/${postUserResponse3.data._id}`)
).data;
console.log(deleteUserResponse3);
console.log();

console.log("Test completed.");
