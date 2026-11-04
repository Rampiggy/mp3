import axios from "axios";
import baseUrl from "./globals.mjs";

const usersUrl = baseUrl + "/users";

console.log("Test start.\n");

console.log("POST: 3 users.\n");
const user1 = {
	name: "user 1",
	email: "user1@test.com",
};
const postUserResponse1 = (await axios.post(usersUrl, user1)).data;
const user2 = {
	name: "user 2",
	email: "user2@test.com",
};
const postUserResponse2 = (await axios.post(usersUrl, user2)).data;
const user3 = {
	name: "user 3",
	email: "user3@test.com",
};
const postUserResponse3 = (await axios.post(usersUrl, user3)).data;

console.log("WHERE: All the users...");
console.log((await axios.get(`${usersUrl}?`)).data);
console.log();

console.log("WHERE: Second user...");
console.log((await axios.get(`${usersUrl}?where={"name":"user 2"}`)).data);
console.log();

console.log("WHERE: No users...");
console.log((await axios.get(`${usersUrl}?where={"name":"none"}`)).data);
console.log();

console.log("SORT: Name descending...");
console.log((await axios.get(`${usersUrl}?sort={"name":-1}`)).data);
console.log();

console.log("SKIP: First two users...");
console.log((await axios.get(`${usersUrl}?skip=2`)).data);
console.log();

await axios.delete(`${usersUrl}/${postUserResponse1.data._id}`);
await axios.delete(`${usersUrl}/${postUserResponse2.data._id}`);
await axios.delete(`${usersUrl}/${postUserResponse3.data._id}`);
console.log("DELETE: 3 users.\n");

console.log("Test completed.");
