import axios from "axios";
import baseUrl from "./globals.mjs";

const usersUrl = baseUrl + "/users";

const user1 = {
	name: "user 1",
	email: "user1@test.com",
};
const postUserResponse1 = (await axios.post(usersUrl, user1)).data;

console.log("SELECT: Email...");
console.log((await axios.get(`${usersUrl}?select={"name":0}`)).data);
console.log();

console.log("SELECT: Email...");
console.log(
	(await axios.get(`http://localhost:3000/api/users?select={"_id": 0}`)).data,
);
console.log();

await axios.delete(`${usersUrl}/${postUserResponse1.data._id}`);
