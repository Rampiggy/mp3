import axios from "axios";
import baseUrl from "./globals.mjs";

const url = baseUrl + "/users";
const userMissingEmail = {
	name: "john doe",
	email: "",
};

console.log("POST user...\n");
try {
	await axios.post(url, userMissingEmail);
} catch (error) {
	console.log(error.response.data);
}
console.log();

const getUsersResponse = (await axios.get(url)).data;
console.log("GET users...\n");
console.log(getUsersResponse);
console.log();

console.log("Test completed.");
