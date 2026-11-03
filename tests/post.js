import axios from "axios";
import baseUrl from "./globals.js";

const url = baseUrl + "/users";
const joeSchmoEmptyArrayOfTasks = {
	name: "joe schmo",
	email: "joe.schmo@test.com",
	pendingTasks: [],
};

axios
	.post(url, joeSchmoEmptyArrayOfTasks)
	.then((response) => {
		console.log(response.data);
	})
	.catch((error) => {
		console.error(error);
	})
	.finally(() => {
		console.log("\nRequest completed");
	});
