import spost from "./data/socialPost.js";
import user from "./data/user.js";
// let title = "aefarfasf";
// let body = "aefarfasf";
// let posterId = "645067eafa064853b77b6bc4";
// let eventdate = "aefarfasf";
// let fields = ["medical"];
// let company = ["google"];
// let category = ["others"];

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
  let re = await user.getUserById("645066e314e24f951f70c23b");
  console.log(re._id);
  console.log(typeof re._id);
} catch (error) {
  console.log(error);
}
