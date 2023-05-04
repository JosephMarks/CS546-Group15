import spost from "./data/socialPost.js";
import user from "./data/user.js";
import refer from "./data/referral.js";
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
try {
  let re = await refer.addPost(
    title,
    body,
    posterId,
    duedate,
    fields,
    companyName,
    companyEmail,
    jobTitle,
    salary,
    level,
    jobType,
    skills,
    location,
    description
  );
  console.log(re);
} catch (error) {
  console.log(error);
}
console.log(await user.getUserById("645066e314e24f951f70c23b"));
