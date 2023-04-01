import express from "express";
import * as userData from "./data/user.js";
import * as signUpData from "./data/signUp.js";
import signUpFunctions from "./data/signUp.js";

const app = express();

import configRoutes from "./routes/index.js";
configRoutes(app);

app.listen(3000, () => {
  console.log("Server Created");
  console.log("Your routes will be running on http://localhost:3000");
});

// Used for testing new user fucntions
// let newUser = await signUpFunctions.create(
//   "Joseph",
//   "Marks",
//   37,
//   "jmarks@stevens.edu",
//   "Pa55word"
// );

// let updatedUser = await userData.updateUniversity(
//   "64250150f2b4c8421ef908c7",
//   "Stevens"
// );
// console.log(updatedUser);
