import spost from "./data/socialPost.js";
import user from "./data/user.js";
//import refer from "./data/referral.js";
import { ObjectId } from "mongodb";

let title = "aefarfasf";
let body = "aefarfasf";
let posterId = "645066e314e24f951f70c23b";
let duedate = "2024-10-05";
let fields = ["medical"];
let companyName = "google";
let companyEmail = "dsg@g.com";

let jobTitle = "sdffsdsf";
let salary = 20000;
let level = "senior";
let jobType = "onsite";
let skills = "java";
let location = "AZ";
let description = "asdfad";
try {
  await user.updateUsersCompany(
    "64569ed7f395241a7a3b6b66",
    "company name last"
  );
} catch (e) {
  console.log(e);
}
try {
  let s = await user.getUserById("64567444e5065780753eddb3");
  console.log(s.companyName);
} catch (e) {
  console.log(e);
}
// await spost.addPost(
//   title,
//   body,
//   posterId,
//   eventdate,
//   fields,
//   company,
//   category
// );
// let res = await spost.getPostsByFieldsTag(["front-end"]);
// console.log(res);
// try {
//   let re = await refer.addPost(
//     title,
//     body,
//     posterId,
//     duedate,
//     fields,
//     companyName,
//     companyEmail,
//     jobTitle,
//     salary,
//     level,
//     jobType,
//     skills,
//     location,
//     description
//   );
//   console.log(re);
// } catch (error) {
//   console.log(error);
// }
// console.log(await user.getUserById("645066e314e24f951f70c23b"));
