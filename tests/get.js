import axios from "axios";
import baseUrl from "./globals.js";

const response = await axios.get(baseUrl + "/users/6ae7e13e25ad0561170c6fdc");

console.log(response.data);
